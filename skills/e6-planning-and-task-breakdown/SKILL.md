---
name: e6-planning-and-task-breakdown
description: Use when a spec, PRD, or clear requirements need an ordered implementation plan and small verifiable tasks with acceptance criteria and dependencies. Use when work is too large to start, scope needs estimating, implementation order is unclear, or independent work could run in parallel.
---

# Planning and Task Breakdown

## Overview

Turn settled requirements into small vertical slices. Each task names the acceptance it proves, the paths it owns, and the tests and local runtime evidence needed to finish.

## When to Use

- A spec needs executable tasks or dependency order.
- Work is too large for one focused implementation session.
- Independent work needs coordination.

Skip a separate plan artifact for obvious mechanical work or an already executable task list. Unresolved product behavior returns to `e6-spec-driven-development`; planning does not invent it.

## Process

### 1. Inspect before planning

Follow `e6-context-engineering`. Read active requirements, rules, constraints, relevant code/interfaces, test patterns, and test/build/local launch scripts. Reuse decisions. Search relevant paths only; exclude whole-repo and sibling-conversation loading.

Inspect code without production edits. Record dependencies, risks, and material unknowns. Discover commands; do not guess npm scripts.

### 2. Map dependencies and slice vertically

Order foundations/contracts before consumers. Slice working behavior through storage, API, and UI rather than completing entire layers separately.

The capability map fixes module boundaries. One task cites requirements from one module. Split a cross-module task or record a boundary delta through the spec coordinator. Define shared interface contracts before parallel consumers.

Each slice leaves the system runnable. Put uncertain or high-risk work early. Treat migrations, shared state, and dependency chains as sequential.

### 3. Write acceptance-backed tasks

Use the project's task target and format. Otherwise save the plan at `tasks/plan.md` and checklist at `tasks/todo.md`.

```markdown
## Task 2: Assigned user receives one email
Requirements: NOTIFY-2, NOTIFY-3
Acceptance: Given opted-in user and assignment event, when the event is
retried, then one email is delivered and one status record exists.
Proof:
- RED/GREEN: duplicate-event integration test asserts email/status count.
- Command: [discovered focused-test command]
- Local runtime: [launch command]; assign task, retry event, inspect result.
- Regression/build/constraints: [applicable discovered commands]
Dependencies: Task 1 preference contract
Owned paths: [implementation and test paths]
Context pointers: [requirement section, adapter, test pattern, rules]
Status/evidence: [pending; later commands, exits, observed outcome]
```

When requirements lack IDs, cite their text; do not invent behavior to create an ID. Copy the scenario faithfully. Add relevant failure and boundary inputs from the spec. Tests must distinguish correct behavior from a plausible broken implementation, not assert that functions happen to be called.

Select local proof: browser for web UI, computer/simulator for native UI, requests for APIs, invocation/output for CLI, caller behavior for libraries. Builds supplement runtime. Record missing runtime capability and incomplete acceptance.

### 4. Size, order, and checkpoint

Prefer roughly 1–5 files and a few acceptance outcomes per task. Split multi-session or independent work; file counts guide sizing.

At dependency boundaries or after roughly 2–3 tasks, checkpoint:

- Acceptance tests and applicable regression/constraint checks pass.
- The increment builds and runs through its representative local flow.
- Evidence and remaining uncertainty are recorded.
- Review findings are fixed or explicitly resolved.

Passing evidence advances the coordinator within task authority. Ask only unresolved material decisions or unauthorized actions.

### 5. Save without destroying active work

Check existing plan/task artifacts first. For the same work, update in place. For different unfinished work, preserve it and use a distinct task-specific location, recording the active paths with the coordinator. Ask when project policy requires one active plan or the conflict cannot be resolved without discarding work.

For an authorized designated external tracker, record one item per task plus dependency links and checkpoints. Keep `tasks/plan.md` as rationale and an ordered index of tracker IDs, not a second status checklist. If tracker writes are outside authorization, use a local draft and name the pending action. Do not close another plan's items.

Plan: outcome, spec/constraint pointers, architecture decisions, ordered tasks, checkpoints, risks, open decisions. Do not duplicate the spec.

### 6. Delegate only useful independent work

Use `e6-caveman`. Delegate when independent owned paths and acceptance are clear and a separate context saves work. Otherwise keep the task local.

The input packet is at most 500 words: goal, acceptance IDs/scenarios, owned paths, dependencies, commands, and minimal context pointers. Use fresh context when supported; workers read those pointers, not the entire repo or sibling conversations. No nested agents. Resolve shared contracts first and prevent overlapping writes.

Result, at most 200 words: changed paths, acceptance commands/exits, unresolved findings/decisions, next step. The coordinator inspects diff/evidence and verifies the integrated flow.

For a plan-only request, return the saved plan. For a build request, continue with `e6-incremental-implementation` and `e6-test-driven-development` through the coordinator.

## Common Rationalizations

| Excuse | Reality |
|---|---|
| "Tests pass is enough for the task" | Name the acceptance scenario and prove its local behavior. |
| "I'll build all layers, then connect them" | Vertical slices expose integration problems earlier. |
| "Parallel agents are always faster" | Shared paths and dependency chains require sequencing. |
| "Every checkpoint needs another yes" | Evidence advances authorized work; material choices need input. |

## Red Flags

- Generic tasks without requirement references or proof.
- Guessed commands or build-only verification of user behavior.
- Overwritten incomplete plans or duplicate task status sources.
- Full-repo delegation, overlapping ownership, or nested agents.
- Unresolved product decisions silently turned into implementation tasks.

## Verification

- [ ] Active rules, requirements, constraints, and real commands were read.
- [ ] Small vertical tasks cite one module's acceptance and meaningful proof.
- [ ] Dependencies, owned paths, local runtime, and checkpoints are explicit.
- [ ] Existing work is preserved; active artifact/tracker pointers are recorded.
- [ ] Delegation is bounded and independent when used.
- [ ] Plan-only scope stayed bounded; authorized builds advanced.

Apply the standing [Definition of Done](../../references/definition-of-done.md) alongside task acceptance.

## Workflow Handoff

For a standalone engineering task with no active workflow, use `using-e6-agent-skills`. Otherwise update the current phase evidence and return to its coordinator without recursively reloading the router. Follow [the workflow contract](../../references/workflow-contract.md). Use `e6-caveman` for concise user updates and delegation.
