---
name: e6-constraint-driven-development
description: Use when a project has no written quality standards, when setting up constraints or quality gates for coverage, security, accessibility, performance, or architecture, or when choosing enforcement thresholds. Use when agents add @ts-ignore, silence checks, skip tests, weaken assertions, or lower budgets to get green, or when agent-written code exceeds review capacity.
---

# Constraint-Driven Development

## Overview

Record the project's quality bar and prove its checks enforce it. A report command is measurement; a gate also needs a threshold, failure policy, and verified failure exit.

## When to Use

- Quality standards or merge-blocking checks are missing or ambiguous.
- Agents weaken checks to finish work.
- Coverage, performance, or accessibility budgets need a durable policy.

Read and follow existing `CONSTRAINTS.md` rather than re-running setup. For a throwaway spike, apply the floor proportionately. Use `e6-ci-cd-and-automation` for pipeline construction.

## Process

### 1. Detect before asking

Follow `e6-context-engineering`. Inspect rules, manifests/lockfiles, test/coverage/lint/type config, CI, and launch commands. Measure baselines from existing output or one focused run. Do not ask for repo facts.

Resolve missing dimensions, modes, targets, and latency. Ask at most four questions, one at a time, with defaults. Accept delegation. Non-interactive work uses existing policy/floor and marks unconfigured dimensions pending.

### 2. Write the contract

Use root `CONSTRAINTS.md`: baseline source/date, target rationale, owner, mode. Link it from existing agent rules.

The floor:

- New suppressions require a justified, tracked exception.
- No unfinished stubs or silently swallowed failures in completed work.
- Test deletions, skips, and assertion changes must preserve acceptance coverage.
- No secrets in source or check output.
- Checks and thresholds are not weakened merely to pass the current change.

```markdown
| Dimension | Baseline / target and reason | Mode | Verdict command | Scope / phase |
|---|---|---|---|---|
| Changed coverage | ≥80%; selected coverage policy | block | project diff-coverage check | changed executable lines / task, CI |
| Page performance | LCP ≤2500ms; CWV good boundary | block | project performance gate | local representative route / verify |
```

Blocking rows name verdict commands. Unavailable checks record reason/next action. Exceptions name rule, path, reason, owner, authority, and expiry; default 90 days.

### 3. Wire real verdicts

Reuse established tools/config. Verify versions/flags; install selected missing tools through project setup. Save repeatable verdicts in project scripts.

| Dimension | Measurement/tool | What makes it a gate |
|---|---|---|
| Types/lint | Existing compiler/linter | Its configured errors return nonzero; preserve compiler project graph |
| Changed coverage | Existing lcov plus diff-cover or equivalent | Intersect executable changed lines with coverage; selected threshold returns nonzero |
| Secrets | gitleaks with redaction | Finding returns nonzero; never print secret values |
| Code security | Semgrep/project rules | Selected findings return nonzero; use supported failure flags or parse JSON |
| Dependency security | osv-scanner | Filter actual report severity/CVSS by policy and return nonzero |
| Web performance | Lighthouse JSON | Compare LCP `numericValue` to budget, CLS to budget, and fail on excess |
| Web accessibility | axe JSON | Fail for selected impacts, e.g. critical/serious; report generation alone is insufficient |
| Bundle/architecture/mutations | size-limit, dependency-cruiser, Stryker | Configure selected budget/rules/score and verify failure exits |

`vitest run --coverage` alone does not enforce changed-line coverage. Lighthouse alone does not fail for an exceeded LCP budget. Scanner exit defaults may not implement the selected severity policy. Verify, do not claim enforcement from a successful report command.

Prove each blocking check: clean baseline, deliberate breach failing for the intended reason, restoration, clean result. Record command/exit/value/policy. Checker errors or missing data are unavailable evidence.

### 4. Place checks by measured cost

- Edit: cheap applicable checks; scope where tools support it.
- Task/verify: focused tests, changed coverage, and actual local runtime.
- Review/CI: slower security, mutation, architecture, and regression checks.

Reuse coverage output. Measure latency; move slow checks outside the edit loop. Preserve whole-project compiler semantics. Scripts own commands; constraints reference them and record policy.

Start the local app before Lighthouse/axe; select representative routes/state/viewport/input. Scores supplement acceptance flows. For native/CLI/library surfaces, mark web metrics N/A and select relevant runtime/accessibility/performance evidence. Preserve requested quality dimensions.

### 5. Guard the bar and ratchet

Compare constraints, checker configuration/scripts, schedules, suppressions, exceptions, and tests with the task baseline. Review assertion replacements against acceptance: replacing an assertion is not automatically weakening it.

[floor-guard.md](references/floor-guard.md) is a shallow diff guard. Checker-change findings require policy review; paired assertion syntax does not prove equal strength. Inspect checker scripts/config/schedules and acceptance coverage separately. Adapt stack patterns; prove rule/path/line-only output with a harmless marker. Include staged, unstaged, untracked changes. Exit `2` is unavailable, not clean. Test violations and justified exceptions.

For unknown targets, record today's value and hold it. If a selected target fails today, state the gap, remediation, and ratchet option; do not claim a clean baseline. Wire comparison/policy before calling it enforced. Defaults: changed coverage 80%, no high dependency findings, LCP 2500ms, CLS 0.1, no critical/serious axe findings. Tolerance needs units, e.g. 0.5 percentage points. Record reasons; never invent baselines.

Floor-only bootstrapping is allowed. Track external gates pending; add independent checks for relevant dimensions.

## Common Rationalizations

| Excuse | Reality |
|---|---|
| "The report ran, so the budget is enforced" | Prove an exceeded budget fails. |
| "I can lower the threshold" | Fix behavior or record an authorized exception. |
| "Every assertion edit weakens tests" | Check the actual acceptance coverage and replacement. |
| "No URL means no accessibility" | Select runtime evidence appropriate to the platform. |

## Red Flags

- A blocking row without a tested failure exit.
- Invented measurements, noisy guard findings accepted blindly, or source text in reports.
- Slow checks in the edit loop or unavailable checks labeled passed.
- Quality standards lowered to finish one feature.

## Verification

- [ ] Existing policy and measured baselines were read first.
- [ ] Each configured gate has rationale, mode, scope, phase, and working verdict.
- [ ] Deliberate breaches fail; restored checks pass.
- [ ] Local runtime dimensions use representative real inputs.
- [ ] Floor adaptations, exceptions, redaction, and unavailable states are explicit.
- [ ] Rules point to constraints; selected pending work returns to the coordinator.

## Workflow Handoff

For a standalone engineering task with no active workflow, use `using-e6-agent-skills`. Otherwise update the current phase evidence and return to its coordinator without recursively reloading the router. Follow [the workflow contract](../../references/workflow-contract.md). Use `e6-caveman` for concise user updates and delegation.
