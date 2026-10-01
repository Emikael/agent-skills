#!/usr/bin/env node

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const { materializeWorkspace, parseGrading, clearGradingSlot, persistGradingOutcome, extractExecutorModel } = require('./run-evals');

const RUNNER = path.join(__dirname, 'run-evals.js');

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeSkill(root, name, description) {
  const dir = path.join(root, 'skills', name);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'SKILL.md'),
    `---\nname: ${name}\ndescription: ${description}\n---\n\n# ${name}\n`,
  );
}

function behavioralEval(files = ['project/context.txt']) {
  return {
    id: 1,
    prompt: 'Inspect the attached project and complete the requested work.',
    expected_output: 'A verified result grounded in the attached project',
    files,
    expectations: ['The attached project is inspected before reporting a result'],
  };
}

function completeCase(skillName, positivePrompt, topK = 1, files) {
  return {
    skill_name: skillName,
    trigger: {
      positive: [1, 2, 3].map(() => ({ prompt: positivePrompt, top_k: topK })),
      negative: [
        { prompt: 'unrelated banana request' },
        { prompt: 'unrelated orange request' },
      ],
    },
    evals: [behavioralEval(files)],
  };
}

function makeSandbox() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-skills-run-evals-test-'));
  fs.mkdirSync(path.join(root, 'scripts'), { recursive: true });
  fs.mkdirSync(path.join(root, 'evals', 'cases'), { recursive: true });
  fs.mkdirSync(path.join(root, 'evals', 'fixtures', 'project'), { recursive: true });
  fs.copyFileSync(RUNNER, path.join(root, 'scripts', 'run-evals.js'));
  fs.writeFileSync(path.join(root, 'evals', 'fixtures', 'project', 'context.txt'), 'fixture\n');
  return root;
}

function run(root, args = []) {
  return spawnSync(process.execPath, [path.join(root, 'scripts', 'run-evals.js'), ...args], {
    cwd: root,
    encoding: 'utf8',
  });
}

test('accepts a complete and consistent grader result', () => {
  const raw = JSON.stringify({
    expectations: [
      { id: 1, text: 'first expectation', passed: true, evidence: 'observed in the trace' },
      { id: 2, text: 'second expectation', passed: false, evidence: 'not observed in the trace' },
    ],
    summary: { passed: 1, failed: 1, total: 2, pass_rate: 0.5 },
  });

  assert.deepEqual(parseGrading(raw, ['first expectation', 'second expectation']), JSON.parse(raw));
});

test('rejects grader results that omit expectations', () => {
  const raw = JSON.stringify({
    expectations: [
      { id: 1, text: 'first expectation', passed: true, evidence: 'observed in the trace' },
    ],
    summary: { passed: 1, failed: 0, total: 1, pass_rate: 1 },
  });

  assert.equal(parseGrading(raw, ['first expectation', 'second expectation']), null);
});

test('rejects null expectation entries without throwing', () => {
  const cases = [
    { results: [null], declared: ['first expectation'] },
    { results: [{ id: 1, text: 'first expectation', passed: true, evidence: 'observed' }, null], declared: ['first expectation', 'second expectation'] },
  ];
  for (const { results, declared } of cases) {
    const raw = JSON.stringify({
      expectations: results,
      summary: {
        passed: results.length - 1,
        failed: 1,
        total: results.length,
        pass_rate: (results.length - 1) / results.length,
      },
    });

    assert.equal(parseGrading(raw, declared), null);
  }
});

test('rejects incomplete or inconsistent grader summaries', () => {
  const declared = ['expected behavior'];
  const expectation = { id: 1, text: 'expected behavior', passed: false, evidence: 'not observed' };
  const cases = [
    {
      expectations: [],
      summary: { passed: 0, failed: 0, total: 0, pass_rate: 0 },
      declared: [],
    },
    {
      expectations: [{ id: 1, text: 'expected behavior', passed: false }],
      summary: { passed: 0, failed: 1, total: 1, pass_rate: 0 },
      declared,
    },
    {
      expectations: [expectation],
      summary: { passed: 1, failed: 0, total: 1, pass_rate: 1 },
      declared,
    },
    {
      expectations: [expectation],
      summary: { passed: 0, total: 1, pass_rate: 0 },
      declared,
    },
    {
      expectations: [expectation],
      summary: { passed: 0, failed: 1, total: 1 },
      declared,
    },
  ];

  for (const { declared: d, ...grading } of cases) {
    assert.equal(parseGrading(JSON.stringify(grading), d), null);
  }
});

test('fails when a skill has no eval case file', () => {
  const root = makeSandbox();
  writeSkill(root, 'alpha-skill', 'Handles alpha widgets. Use when changing alpha widgets.');

  const result = run(root);

  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /no eval case file/);
});

test('fails when an eval case is below the required minimums', () => {
  const root = makeSandbox();
  writeSkill(root, 'alpha-skill', 'Handles alpha widgets. Use when changing alpha widgets.');
  writeJson(path.join(root, 'evals', 'cases', 'alpha-skill.json'), {
    skill_name: 'alpha-skill',
    trigger: {
      positive: [{ prompt: 'change alpha widget', top_k: 1 }],
      negative: [],
    },
    evals: [behavioralEval()],
  });

  const result = run(root);

  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /below required minimums/);
});

test('fails when a behavioral eval references a missing fixture', () => {
  const root = makeSandbox();
  writeSkill(root, 'alpha-skill', 'Handles alpha widgets. Use when changing alpha widgets.');
  writeJson(
    path.join(root, 'evals', 'cases', 'alpha-skill.json'),
    completeCase('alpha-skill', 'change alpha widget', 1, ['missing/project.txt']),
  );

  const result = run(root);

  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /fixture not found/);
});

test('requires fixtures for execution evals', () => {
  const root = makeSandbox();
  writeSkill(root, 'alpha-skill', 'Handles alpha widgets. Use when changing alpha widgets.');
  writeJson(
    path.join(root, 'evals', 'cases', 'alpha-skill.json'),
    completeCase('alpha-skill', 'change alpha widget', 1, []),
  );

  const result = run(root);

  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /needs a non-empty files\[\] fixture list/);
});

test('allows dialogue evals without fixtures', () => {
  const root = makeSandbox();
  writeSkill(root, 'alpha-skill', 'Handles alpha widgets. Use when changing alpha widgets.');
  const evalCase = completeCase('alpha-skill', 'change alpha widget');
  evalCase.evals = [{ ...behavioralEval([]), kind: 'dialogue' }];
  writeJson(path.join(root, 'evals', 'cases', 'alpha-skill.json'), evalCase);

  const result = run(root);

  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test('rejects provisional execution evals', () => {
  const root = makeSandbox();
  writeSkill(root, 'alpha-skill', 'Handles alpha widgets. Use when changing alpha widgets.');
  const evalCase = completeCase('alpha-skill', 'change alpha widget');
  evalCase.evals[0].trust_level = 'provisional';
  writeJson(path.join(root, 'evals', 'cases', 'alpha-skill.json'), evalCase);

  const result = run(root);

  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /is still provisional/);
});

test('allows dialogue evals with a legacy provisional marker', () => {
  const root = makeSandbox();
  writeSkill(root, 'alpha-skill', 'Handles alpha widgets. Use when changing alpha widgets.');
  const evalCase = completeCase('alpha-skill', 'change alpha widget');
  evalCase.evals = [{ ...behavioralEval([]), kind: 'dialogue', trust_level: 'provisional' }];
  writeJson(path.join(root, 'evals', 'cases', 'alpha-skill.json'), evalCase);

  const result = run(root);

  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test('rejects unknown behavioral eval kinds', () => {
  const root = makeSandbox();
  writeSkill(root, 'alpha-skill', 'Handles alpha widgets. Use when changing alpha widgets.');
  const evalCase = completeCase('alpha-skill', 'change alpha widget');
  evalCase.evals[0].kind = 'conversation';
  writeJson(path.join(root, 'evals', 'cases', 'alpha-skill.json'), evalCase);

  const result = run(root);

  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /unknown kind "conversation"/);
});

test('dry-runs a fixtureless dialogue eval', () => {
  const root = makeSandbox();
  writeSkill(root, 'alpha-skill', 'Handles alpha widgets. Use when changing alpha widgets.');
  const evalCase = completeCase('alpha-skill', 'change alpha widget');
  evalCase.evals = [{ ...behavioralEval([]), kind: 'dialogue' }];
  writeJson(path.join(root, 'evals', 'cases', 'alpha-skill.json'), evalCase);

  const result = run(root, ['--behavioral', 'alpha-skill', '--dry-run']);

  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /dialogue transcript/);
});

test('enforces the configured rank-1 floor', () => {
  const root = makeSandbox();
  writeSkill(root, 'alpha-skill', 'Handles widget work. Use when implementing widget changes.');
  writeSkill(
    root,
    'beta-skill',
    'Diagnoses urgent widget failures in production. Use when repairing urgent widget failures.',
  );
  writeJson(
    path.join(root, 'evals', 'cases', 'alpha-skill.json'),
    completeCase('alpha-skill', 'urgent widget failure production', 2),
  );
  writeJson(
    path.join(root, 'evals', 'cases', 'beta-skill.json'),
    completeCase('beta-skill', 'repair urgent widget failure', 1),
  );

  const passing = run(root, ['--min-rank1', '50']);
  const failing = run(root, ['--min-rank1', '60']);

  assert.equal(passing.status, 0, passing.stdout + passing.stderr);
  assert.equal(failing.status, 1, failing.stdout + failing.stderr);
  assert.match(failing.stdout, /below required 60%/);
});

test('rejects an invalid rank-1 floor', () => {
  const root = makeSandbox();

  const result = run(root, ['--min-rank1', '101']);

  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stderr, /--min-rank1 must be a number from 0 to 100/);
});

// ---------- parseGrading expectation-binding tests ----------

test('accepts reordered-but-complete grader results', () => {
  const expectations = ['first expectation', 'second expectation'];
  const raw = JSON.stringify({
    expectations: [
      { id: 2, text: 'second expectation', passed: false, evidence: 'not observed' },
      { id: 1, text: 'first expectation', passed: true, evidence: 'observed in the trace' },
    ],
    summary: { passed: 1, failed: 1, total: 2, pass_rate: 0.5 },
  });
  const result = parseGrading(raw, expectations);
  assert.notEqual(result, null);
  assert.equal(result.summary.passed, 1);
  assert.equal(result.summary.failed, 1);
});

test('rejects duplicate grader results for the same expectation', () => {
  const expectations = ['first expectation', 'second expectation'];
  // Valid baseline: each id appears exactly once
  const validRaw = JSON.stringify({
    expectations: [
      { id: 1, text: 'first expectation', passed: true, evidence: 'observed' },
      { id: 2, text: 'second expectation', passed: false, evidence: 'not observed' },
    ],
    summary: { passed: 1, failed: 1, total: 2, pass_rate: 0.5 },
  });
  assert.notEqual(parseGrading(validRaw, expectations), null);

  // Duplicate: id 1 appears twice, id 2 is missing
  const dupRaw = JSON.stringify({
    expectations: [
      { id: 1, text: 'first expectation', passed: true, evidence: 'observed' },
      { id: 1, text: 'first expectation', passed: true, evidence: 'observed again' },
    ],
    summary: { passed: 2, failed: 0, total: 2, pass_rate: 1 },
  });
  assert.equal(parseGrading(dupRaw, expectations), null);
});

test('rejects grader results whose ids are not in the declared set', () => {
  const expectations = ['first expectation', 'second expectation'];
  // Valid baseline
  const validRaw = JSON.stringify({
    expectations: [
      { id: 1, text: 'first expectation', passed: true, evidence: 'observed' },
      { id: 2, text: 'second expectation', passed: false, evidence: 'not observed' },
    ],
    summary: { passed: 1, failed: 1, total: 2, pass_rate: 0.5 },
  });
  assert.notEqual(parseGrading(validRaw, expectations), null);

  // id 3 is out of range 1..2
  const badIdRaw = JSON.stringify({
    expectations: [
      { id: 1, text: 'first expectation', passed: true, evidence: 'observed' },
      { id: 3, text: 'unknown expectation', passed: false, evidence: 'not found' },
    ],
    summary: { passed: 1, failed: 1, total: 2, pass_rate: 0.5 },
  });
  assert.equal(parseGrading(badIdRaw, expectations), null);
});

test('rejects a result set that omits a declared expectation', () => {
  const expectations = ['first expectation', 'second expectation', 'third expectation'];
  // Valid baseline
  const validRaw = JSON.stringify({
    expectations: [
      { id: 1, text: 'first expectation', passed: true, evidence: 'observed' },
      { id: 2, text: 'second expectation', passed: true, evidence: 'observed' },
      { id: 3, text: 'third expectation', passed: false, evidence: 'not observed' },
    ],
    summary: { passed: 2, failed: 1, total: 3, pass_rate: 2 / 3 },
  });
  assert.notEqual(parseGrading(validRaw, expectations), null);

  // Only 2 results for 3 expectations (id 3 omitted)
  const partialRaw = JSON.stringify({
    expectations: [
      { id: 1, text: 'first expectation', passed: true, evidence: 'observed' },
      { id: 2, text: 'second expectation', passed: true, evidence: 'observed' },
    ],
    summary: { passed: 2, failed: 0, total: 2, pass_rate: 1 },
  });
  assert.equal(parseGrading(partialRaw, expectations), null);
});

test('derives pass_rate from counters rather than trusting the grader value', () => {
  const expectations = ['first expectation', 'second expectation'];
  // Correct pass_rate should be accepted
  const validRaw = JSON.stringify({
    expectations: [
      { id: 1, text: 'first expectation', passed: true, evidence: 'observed' },
      { id: 2, text: 'second expectation', passed: false, evidence: 'not observed' },
    ],
    summary: { passed: 1, failed: 1, total: 2, pass_rate: 0.5 },
  });
  const valid = parseGrading(validRaw, expectations);
  assert.notEqual(valid, null);
  assert.equal(valid.summary.pass_rate, 0.5);

  // Wrong pass_rate with correct counters: accepted, but recomputed
  const wrongRaw = JSON.stringify({
    expectations: [
      { id: 1, text: 'first expectation', passed: true, evidence: 'observed' },
      { id: 2, text: 'second expectation', passed: false, evidence: 'not observed' },
    ],
    summary: { passed: 1, failed: 1, total: 2, pass_rate: 0.999 },
  });
  const corrected = parseGrading(wrongRaw, expectations);
  assert.notEqual(corrected, null);
  assert.equal(corrected.summary.pass_rate, 0.5);
  // The integer counters stay exact checks
  assert.equal(corrected.summary.passed, 1);
  assert.equal(corrected.summary.failed, 1);
});

test('replaces paraphrased grader text with the declared expectation', () => {
  const expectations = ['first expectation', 'second expectation'];
  const raw = JSON.stringify({
    expectations: [
      { id: 2, text: 'the agent did the second thing', passed: false, evidence: 'not observed' },
      { id: 1, text: 'roughly the first one', passed: true, evidence: 'observed' },
    ],
    summary: { passed: 1, failed: 1, total: 2, pass_rate: 0.5 },
  });

  const result = parseGrading(raw, expectations);
  assert.notEqual(result, null);
  assert.equal(result.expectations.find((r) => r.id === 1).text, 'first expectation');
  assert.equal(result.expectations.find((r) => r.id === 2).text, 'second expectation');
});

// ---------- persistGradingOutcome stale-cleanup tests ----------

test('rejected grading writes raw output', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'grading-cleanup-'));
  try {
    const base = path.join(dir, 'my-skill.eval-1');

    const result = persistGradingOutcome(base, null, 'unparseable grader output');

    assert.equal(result, false);
    assert.equal(fs.existsSync(`${base}.grading.raw.txt`), true, 'raw output must be written');
    assert.equal(fs.readFileSync(`${base}.grading.raw.txt`, 'utf8'), 'unparseable grader output');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('rejected grading succeeds even when no prior grading.json exists', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'grading-cleanup-'));
  try {
    const base = path.join(dir, 'my-skill.eval-1');

    const result = persistGradingOutcome(base, null, 'bad output');

    assert.equal(result, false);
    assert.equal(fs.existsSync(`${base}.grading.raw.txt`), true);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('accepted grading writes grading.json', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'grading-cleanup-'));
  try {
    const base = path.join(dir, 'my-skill.eval-1');
    const grading = {
      expectations: [{ id: 1, text: 'x', passed: true, evidence: 'y' }],
      summary: { passed: 1, failed: 0, total: 1, pass_rate: 1 },
    };

    const result = persistGradingOutcome(base, grading, 'unused');

    assert.equal(result, true);
    const written = JSON.parse(fs.readFileSync(`${base}.grading.json`, 'utf8'));
    assert.deepEqual(written, grading);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// ---------- upfront slot-clearing tests ----------

test('a grader that throws leaves no result file behind', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'grading-crash-'));
  try {
    const base = path.join(dir, 'my-skill.eval-1');
    // Stale files from a prior run
    fs.writeFileSync(`${base}.grading.json`, '{"previous":"run"}\n');
    fs.writeFileSync(`${base}.grading.raw.txt`, 'previous raw output');

    clearGradingSlot(base);

    // Executor or grader crashes — persistGradingOutcome is never called

    assert.equal(fs.existsSync(`${base}.grading.json`), false, 'stale grading.json must not survive a crash');
    assert.equal(fs.existsSync(`${base}.grading.raw.txt`), false, 'stale grading.raw.txt must not survive a crash');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('successful grading leaves no stale raw file behind', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'grading-success-'));
  try {
    const base = path.join(dir, 'my-skill.eval-1');
    // Stale raw from a prior rejected run
    fs.writeFileSync(`${base}.grading.raw.txt`, 'previous raw output');

    clearGradingSlot(base);

    // Successful grading
    const grading = {
      expectations: [{ id: 1, text: 'x', passed: true, evidence: 'y' }],
      summary: { passed: 1, failed: 0, total: 1, pass_rate: 1 },
    };
    persistGradingOutcome(base, grading, 'unused');

    assert.equal(fs.existsSync(`${base}.grading.json`), true, 'grading.json must be written');
    assert.equal(fs.existsSync(`${base}.grading.raw.txt`), false, 'stale grading.raw.txt must not survive');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// ---------- extractExecutorModel tests ----------

test('extracts model from the stream-json init event', () => {
  const trace = [
    '{"type":"system","subtype":"init","model":"claude-sonnet-4-6-20250514","session_id":"abc"}',
    '{"type":"assistant","message":{"id":"msg_1","content":[{"type":"text","text":"Hi"}]}}',
    '{"type":"result","subtype":"success","result":"Hi"}',
  ].join('\n');

  assert.equal(extractExecutorModel(trace), 'claude-sonnet-4-6-20250514');
});

test('returns null when the trace has no init event', () => {
  const trace = [
    '{"type":"assistant","message":{"id":"msg_1","content":[]}}',
    '{"type":"result","subtype":"success","result":"done"}',
  ].join('\n');

  assert.equal(extractExecutorModel(trace), null);
});

test('returns null when the init event has no model field', () => {
  const trace = '{"type":"system","subtype":"init","session_id":"abc"}\n';

  assert.equal(extractExecutorModel(trace), null);
});

test('tolerates non-JSON lines in the trace', () => {
  const trace = [
    'not json',
    '{"type":"system","subtype":"init","model":"claude-opus-4-6","session_id":"abc"}',
  ].join('\n');

  assert.equal(extractExecutorModel(trace), 'claude-opus-4-6');
});

// ---------- persistGradingOutcome run identity tests ----------

test('accepted grading includes run metadata when provided', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'grading-run-meta-'));
  try {
    const base = path.join(dir, 'my-skill.eval-1');
    const grading = {
      expectations: [{ id: 1, text: 'x', passed: true, evidence: 'y' }],
      summary: { passed: 1, failed: 0, total: 1, pass_rate: 1 },
    };
    const runMeta = {
      executor_model: 'claude-sonnet-4-6-20250514',
      grader_model: 'unknown',
      timestamp: '2026-09-21T00:00:00.000Z',
    };

    persistGradingOutcome(base, grading, 'unused', runMeta);

    const written = JSON.parse(fs.readFileSync(`${base}.grading.json`, 'utf8'));
    assert.deepEqual(written.run, runMeta);
    assert.deepEqual(written.expectations, grading.expectations);
    assert.deepEqual(written.summary, grading.summary);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('accepted grading omits run key when no metadata is provided', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'grading-no-meta-'));
  try {
    const base = path.join(dir, 'my-skill.eval-1');
    const grading = {
      expectations: [{ id: 1, text: 'x', passed: true, evidence: 'y' }],
      summary: { passed: 1, failed: 0, total: 1, pass_rate: 1 },
    };

    persistGradingOutcome(base, grading, 'unused');

    const written = JSON.parse(fs.readFileSync(`${base}.grading.json`, 'utf8'));
    assert.equal('run' in written, false);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('materializes a git baseline and applies a working-tree patch', () => {
  const workspace = materializeWorkspace({ files: ['e6-git-workflow-and-versioning'] });
  try {
    const status = spawnSync('git', ['status', '--short'], { cwd: workspace, encoding: 'utf8' });
    const commits = spawnSync('git', ['rev-list', '--count', 'HEAD'], { cwd: workspace, encoding: 'utf8' });

    assert.equal(status.status, 0, status.stdout + status.stderr);
    assert.match(status.stdout, / M e6-git-workflow-and-versioning\/app\.js/);
    assert.equal(commits.stdout.trim(), '1');
    assert.equal(fs.existsSync(path.join(workspace, '.eval')), false);
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});

// ---------- engine adapters and CLI options ----------

test('behavioral options default to Claude and resolve an explicit pack root', () => {
  const { parseCliOptions } = require('./run-evals');
  assert.equal(typeof parseCliOptions, 'function', 'engine options must be parsed explicitly');
  const options = parseCliOptions(['--behavioral', 'alpha-skill', '--pack-root', 'installed pack', '--dry-run']);
  assert.equal(options.engine, 'claude');
  assert.equal(options.packRoot, path.resolve('installed pack'));
  assert.equal(options.model, null);
  assert.equal(options.dryRun, true);
});

test('accepts Codex, explicit model, and a single eval id', () => {
  const { parseCliOptions } = require('./run-evals');
  assert.equal(typeof parseCliOptions, 'function');
  const options = parseCliOptions(['--behavioral', 'alpha-skill', '--engine', 'codex', '--model', 'chosen-model', '--eval-id', '2']);
  assert.equal(options.engine, 'codex');
  assert.equal(options.model, 'chosen-model');
  assert.equal(options.evalId, 2);
});

test('rejects unknown engines, missing values, invalid ids, and behavioral-only flags on lexical runs', () => {
  const { parseCliOptions } = require('./run-evals');
  assert.equal(typeof parseCliOptions, 'function');
  for (const args of [
    ['--behavioral', 'alpha-skill', '--engine', 'invented'],
    ['--behavioral'],
    ['--behavioral', 'alpha-skill', '--pack-root'],
    ['--behavioral', 'alpha-skill', '--model', '--dry-run'],
    ['--behavioral', 'alpha-skill', '--eval-id', 'not-an-id'],
    ['--behavioral', 'alpha-skill', '--eval-id', '0'],
    ['--engine', 'codex'],
    ['--model', 'chosen-model'],
    ['--unknown'],
  ]) assert.throws(() => parseCliOptions(args));
});

function packFixture(t) {
  const pack = fs.mkdtempSync(path.join(os.tmpdir(), 'eval installed pack '));
  t.after(() => fs.rmSync(pack, { recursive: true, force: true }));
  const skillFile = path.join(pack, 'skills', 'alpha-skill', 'SKILL.md');
  fs.mkdirSync(path.dirname(skillFile), { recursive: true });
  fs.writeFileSync(skillFile, 'SELECTED_BODY_SENTINEL');
  const sibling = path.join(pack, 'skills', 'beta-skill', 'SKILL.md');
  fs.mkdirSync(path.dirname(sibling), { recursive: true });
  fs.writeFileSync(sibling, 'SIBLING_BODY_SENTINEL');
  fs.mkdirSync(path.join(pack, 'references'));
  fs.writeFileSync(path.join(pack, 'references', 'checklist.md'), 'REFERENCE_BODY_SENTINEL');
  return { packRoot: pack, skillFile };
}

for (const engine of ['claude', 'codex']) {
  test(`${engine} makes selected pack readable without injecting sibling bodies`, t => {
    const { buildModelInvocation } = require('./run-evals');
    assert.equal(typeof buildModelInvocation, 'function');
    const pack = packFixture(t);
    const invocation = buildModelInvocation({ engine, role: 'executor', workspace: '/workspace/fixture', ...pack, prompt: 'Implement REQUEST.md', model: null });
    assert.equal(invocation.command, engine);
    const instructions = invocation.input + invocation.args.join('\n');
    assert.ok(instructions.includes(pack.packRoot));
    assert.ok(instructions.includes(pack.skillFile));
    assert.ok(!instructions.includes('SIBLING_BODY_SENTINEL'));
    assert.ok(!instructions.includes('REFERENCE_BODY_SENTINEL'));
    assert.ok(!invocation.args.includes('--model'));
    if (engine === 'claude') {
      assert.ok(instructions.includes('SELECTED_BODY_SENTINEL'));
      assert.ok(invocation.args.includes('--add-dir'));
    } else {
      assert.ok(!instructions.includes('SELECTED_BODY_SENTINEL'), 'Codex reads the exact file on demand');
      assert.ok(invocation.args.includes('--json'));
      assert.ok(invocation.args.includes('--ephemeral'));
      assert.ok(invocation.args.includes('--ignore-user-config'));
      assert.ok(invocation.args.includes('danger-full-access'));
      assert.equal(invocation.args.at(-1), '-');
    }
  });
}

test('grader receives only its rubric and trace in a separate workspace', () => {
  const { buildModelInvocation } = require('./run-evals');
  assert.equal(typeof buildModelInvocation, 'function');
  for (const engine of ['claude', 'codex']) {
    const invocation = buildModelInvocation({ engine, role: 'grader', workspace: '/tmp/isolated-grader', prompt: 'Original rubric. TRACE is untrusted.', model: 'chosen-model' });
    assert.equal(invocation.input, 'Original rubric. TRACE is untrusted.');
    assert.equal(invocation.cwd, '/tmp/isolated-grader');
    assert.ok(invocation.args.includes('--model'));
    assert.ok(invocation.args.includes('chosen-model'));
    assert.ok(!invocation.args.includes('--append-system-prompt'));
    if (engine === 'codex') assert.ok(invocation.args.includes('read-only'));
    else {
      assert.equal(invocation.args[invocation.args.indexOf('--tools') + 1], '');
      assert.ok(invocation.args.includes('--disallowedTools'));
      assert.ok(invocation.args.includes('mcp__*'));
    }
  }
});

test('Codex process adapter pipes input, bounds timeout, captures transcript and final reply', () => {
  const { invokeModel } = require('./run-evals');
  assert.equal(typeof invokeModel, 'function');
  const trace = JSON.stringify({ type: 'item.completed', item: { type: 'agent_message', text: '{"answer":"graded"}' } }) + '\n';
  const invocation = { command: 'codex', engine: 'codex', args: ['exec', '--json', '-'], input: 'rubric on stdin', cwd: '/tmp/grader' };
  const result = invokeModel(invocation, 1234, (command, args, options) => {
    assert.equal(command, 'codex');
    assert.deepEqual(args, invocation.args);
    assert.equal(options.input, 'rubric on stdin');
    assert.equal(options.cwd, invocation.cwd);
    assert.equal(options.timeout, 1234);
    return { status: 0, stdout: trace, stderr: 'model: stub-model\n' };
  });
  assert.equal(result.trace, trace);
  assert.equal(result.text, '{"answer":"graded"}');
  assert.equal(result.model, 'stub-model');
});

test('Claude process adapter captures initialized model and grader JSON from stream', () => {
  const { invokeModel } = require('./run-evals');
  assert.equal(typeof invokeModel, 'function');
  const trace = [
    JSON.stringify({ type: 'system', subtype: 'init', model: 'stub-claude' }),
    JSON.stringify({ type: 'result', result: '{"answer":"graded"}' }),
  ].join('\n');
  const result = invokeModel({ command: 'claude', engine: 'claude', args: ['-p'], input: 'rubric', cwd: '/tmp/grader' }, 1234, () => ({ status: 0, stdout: trace, stderr: '' }));
  assert.equal(result.trace, trace);
  assert.equal(result.text, '{"answer":"graded"}');
  assert.equal(result.model, 'stub-claude');
});

test('failed adapters preserve partial trace and error output for inspection', () => {
  const { invokeModel } = require('./run-evals');
  assert.equal(typeof invokeModel, 'function');
  assert.throws(() => invokeModel({ command: 'codex', engine: 'codex', args: [], input: 'prompt', cwd: '/tmp' }, 1234, () => ({ status: 1, stdout: 'partial trace', stderr: 'Network unavailable' })), error => {
    assert.equal(error.trace, 'partial trace');
    assert.equal(error.stderr, 'Network unavailable');
    return true;
  });
});

test('slot clearing removes prior executor, grader, run metadata, and errors', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eval-trace-cleanup-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const base = path.join(dir, 'skill.eval-1');
  const suffixes = ['.trace.jsonl', '.grader.trace.jsonl', '.run.json', '.error.txt', '.stderr.txt', '.grader.stderr.txt', '.case.json'];
  for (const suffix of suffixes) fs.writeFileSync(base + suffix, 'prior run');
  clearGradingSlot(base);
  for (const suffix of suffixes) assert.ok(!fs.existsSync(base + suffix), `${suffix} must not survive`);
});

test('artifact snapshot includes committed changes since baseline and untracked contents', t => {
  const { captureWorkspaceArtifacts } = require('./run-evals');
  assert.equal(typeof captureWorkspaceArtifacts, 'function');
  const workspace = materializeWorkspace({ files: ['e6-git-workflow-and-versioning'] });
  t.after(() => fs.rmSync(workspace, { recursive: true, force: true }));
  const baseline = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: workspace, encoding: 'utf8' }).stdout.trim();
  const tracked = path.join(workspace, 'e6-git-workflow-and-versioning', 'app.js');
  fs.appendFileSync(tracked, '\n// committed feature evidence\n');
  assert.equal(spawnSync('git', ['add', '--all'], { cwd: workspace }).status, 0);
  assert.equal(spawnSync('git', ['commit', '--quiet', '-m', 'authorized fixture commit'], { cwd: workspace }).status, 0);
  fs.writeFileSync(path.join(workspace, 'handoff.md'), 'untracked acceptance and runtime evidence\n');
  const artifacts = captureWorkspaceArtifacts(workspace, baseline);
  assert.ok(artifacts.diff.includes('committed feature evidence'));
  assert.ok(artifacts.commits.includes('authorized fixture commit'));
  assert.equal(artifacts.baseline_sha, baseline);
  assert.equal(artifacts.untracked.find(file => file.path === 'handoff.md').contents, 'untracked acceptance and runtime evidence\n');
});

test('artifact snapshot bounds untracked text and excludes binary content', t => {
  const { captureWorkspaceArtifacts } = require('./run-evals');
  assert.equal(typeof captureWorkspaceArtifacts, 'function');
  const workspace = materializeWorkspace({ files: ['e6-git-workflow-and-versioning'] });
  t.after(() => fs.rmSync(workspace, { recursive: true, force: true }));
  const baseline = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: workspace, encoding: 'utf8' }).stdout.trim();
  fs.writeFileSync(path.join(workspace, 'a.txt'), 'abcdefghijklmnop');
  fs.writeFileSync(path.join(workspace, 'b.bin'), Buffer.from([0, 1, 2]));
  const artifacts = captureWorkspaceArtifacts(workspace, baseline, { maxFileBytes: 8, maxTotalBytes: 16, maxFiles: 3 });
  const text = artifacts.untracked.find(file => file.path === 'a.txt');
  assert.equal(text.contents, 'abcdefgh');
  assert.equal(text.truncated, true);
  const binary = artifacts.untracked.find(file => file.path === 'b.bin');
  assert.equal(binary.skipped, 'binary');
  assert.equal(binary.contents, undefined);
});

test('pack snapshot includes skill helpers and references, excludes git/dependencies, and protects source bytes', t => {
  const { snapshotPack, hashPack, cleanupPackSnapshot } = require('./run-evals');
  assert.equal(typeof snapshotPack, 'function');
  assert.equal(typeof hashPack, 'function');
  assert.equal(typeof cleanupPackSnapshot, 'function');
  const pack = packFixture(t);
  const helper = path.join(pack.packRoot, 'skills', 'alpha-skill', 'scripts', 'helper.sh');
  fs.mkdirSync(path.dirname(helper));
  fs.writeFileSync(helper, '#!/bin/bash\necho helper\n', { mode: 0o755 });
  for (const excluded of ['.git', 'node_modules']) {
    const dir = path.join(pack.packRoot, 'skills', 'alpha-skill', excluded);
    fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, 'do-not-copy'), 'excluded payload');
  }
  const sourceHash = hashPack(pack.packRoot);
  const snapshot = snapshotPack(pack.packRoot);
  t.after(() => cleanupPackSnapshot(snapshot.snapshotRoot));
  assert.equal(snapshot.sourceRoot, pack.packRoot);
  assert.equal(snapshot.sourceHash, sourceHash);
  assert.notEqual(snapshot.snapshotRoot, pack.packRoot);
  assert.ok(fs.existsSync(path.join(snapshot.snapshotRoot, 'references', 'checklist.md')));
  const copiedHelper = path.join(snapshot.snapshotRoot, 'skills', 'alpha-skill', 'scripts', 'helper.sh');
  assert.equal(fs.readFileSync(copiedHelper, 'utf8'), '#!/bin/bash\necho helper\n');
  if (process.platform !== 'win32') assert.ok(fs.statSync(copiedHelper).mode & 0o111);
  for (const excluded of ['.git', 'node_modules']) assert.ok(!fs.existsSync(path.join(snapshot.snapshotRoot, 'skills', 'alpha-skill', excluded)));
  const copiedSkill = path.join(snapshot.snapshotRoot, 'skills', 'alpha-skill', 'SKILL.md');
  fs.chmodSync(copiedSkill, 0o644); // Simulate a misbehaving executor; the source must remain isolated.
  fs.writeFileSync(copiedSkill, 'changed snapshot');
  assert.equal(fs.readFileSync(pack.skillFile, 'utf8'), 'SELECTED_BODY_SENTINEL');
  assert.equal(hashPack(pack.packRoot), sourceHash);
  cleanupPackSnapshot(snapshot.snapshotRoot);
  assert.ok(!fs.existsSync(snapshot.snapshotRoot));
});
