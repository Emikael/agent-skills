# AGENTS.md

Instructions for contributors working on this repository. Do not copy this file into other projects; use the reusable [workflow bootstrap](references/workflow-bootstrap.md) and [installer](docs/workflow-activation.md).

## Workflow

For engineering work use `using-e6-agent-skills` as coordinator and `e6-caveman` for concise communication. Load skills from `skills/<name>/SKILL.md` using the host's skill mechanism or file tools. Follow applicable steps and evidence gates. Existing user authorization persists. Respect plan-only, review-only, and other narrow requests. Read [the workflow contract](references/workflow-contract.md) once; specialists return to the current coordinator instead of stopping the wider task or restarting routing.

The lifecycle is Understand → Plan → Build → Verify → Review → Handoff. Behavior changes use observed failing tests before implementation. Unchanged behavior uses baseline/characterization checks; documentation/configuration uses relevant validators. Run actual local behavior when applicable, record unavailable required checks honestly, resolve Critical/Required findings, and rerun affected evidence.

## Structure

- `skills/`: 24 lifecycle specialists, one coordinator, one concise communication skill.
- `references/`: shared phase contract, checklists, and bootstrap.
- `agents/`: specialist perspectives; workers receive bounded task packets.
- `.claude/commands/`, `.gemini/commands/`, `commands/`: matched user entry points.
- `hooks/`: Claude SessionStart bootstrap and optional cache/simplification helpers.
- `scripts/`: dependency-free validators, installer, and eval runner.
- `evals/`: trigger cases, behavioral fixtures, optional plugin cases; results ignored.

## Context and Workers

Follow `e6-context-engineering`: trace relevant source/callers/tests, discover real project commands, reuse accepted requirements and existing decisions. Prefer path pointers and short excerpts. Do not load the catalog or full history into each worker.

Delegate independent substantial work only. Target 500-word input and 200-word evidence return; preserve correctness-critical detail and explain necessary overruns. One owner per writable path; coordinator owns shared integration and final checks. Workers use `e6-caveman`, follow their assigned scope, and do not spawn additional workers by default. The host/user authorization still governs delegation.

Personas are viewpoints, not workflow routers. A worker may use a relevant skill; it returns findings and evidence to the coordinator. The main agent can perform sequential phases directly and parallelize independent investigations. Claude subagents/teams have host-specific restrictions; do not assume nested teams or private tools exist on every host.

## Contribution Rules

Before a new skill, follow [CONTRIBUTING.md](CONTRIBUTING.md#before-proposing-a-new-skill): search catalog, PRs, and the rejection ledger; justify the gap. Prefer improving an existing skill. Skills are Markdown-first with valid frontmatter, concrete trigger descriptions, inputs/process, rationalizations, red flags, verification, and workflow handoff. See [skill anatomy](docs/skill-anatomy.md). Shared references stay at root; skill-specific examples load through direct supporting links.

Add/extend realistic trigger and execution cases for behavioral changes. Do not equate lexical routing or dry-run success with actual LLM compliance. Examples and precise tool names must match current host capability; preserve existing published skill identifiers.

## Verification

From repository root:

```bash
node --test scripts/*test.js scripts/lib/*test.js
node scripts/validate-skills.js
node scripts/validate-reference-links.js
node scripts/validate-commands.js
node scripts/validate-artifact-paths.js
node scripts/validate-versions.js
node scripts/run-evals.js --min-rank1 95
bash hooks/session-start-test.sh
bash hooks/sdd-cache-test.sh
bash hooks/simplify-ignore-test.sh
```

Run changed application fixtures with their own commands. Optional actual model evals use `node scripts/run-evals.js --behavioral <skill> --engine claude|codex`; capture CLI/model, pack identity, traces, and limitations. Run only appropriate checks; broaden verification to resolve remaining concrete risk.

## Boundaries

Preserve unrelated edits and secrets. Commit, push, merge, or deploy only when authorized or repository-required. Do not silence failures by removing tests, lowering gates, or misreporting missing runtime capabilities. Report the completed local result and blockers concisely.
