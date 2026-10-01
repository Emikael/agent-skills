---
name: e6-incremental-implementation
description: Use when implementing the next task from a plan as a small verifiable slice, building a feature across multiple files, integrating a change incrementally, rolling out behind a feature flag, or reducing work that feels too big to land in one step.
---

# Incremental Implementation

## Overview

Build thin, verifiable slices. Read the task, prove behavior with a failing test,
implement it, run it, and checkpoint before expanding. Each slice leaves a
working system.

## When to Use

- Multi-file changes, features from a plan, scoped refactoring.
- Feature flags or work too large to land safely in one step.
- A minimal single-function change can use the same test/verify loop without
  inventing a multi-slice plan.

## Workflow handoff

Use `e6-caveman` for prose and delegation. If this is a standalone engineering
request with no active workflow, load `using-e6-agent-skills` once. Otherwise,
update phase evidence and return to the coordinator. Consult
`../../references/workflow-contract.md` as needed; do not reload recursively.
Continue the authorized task through remaining slices and review; do not stop
at the first passing increment.

## Process

### 1. Load the active task

Read applicable project rules, spec, plan/task status, acceptance IDs, touched
implementation/tests, relevant contracts and repository verification commands.
Use `e6-context-engineering` when context is missing or stale. Inspect actual
working-tree state; preserve existing edits and baseline failures.

If no adequate task/acceptance exists, return to the workflow's understanding
or planning phase. Resolve routine choices from evidence. Ask only for a
material decision that existing scope and context cannot settle.

### 2. Choose a working slice

Name one logical outcome, its acceptance criteria, owned paths, dependencies
and verification. Prefer vertical slices: one useful user action across the
needed layers. Contract-first work may use a typed contract, backend + boundary
tests, frontend matching that contract, then integration. Mark mocks as mocks;
they are not end-to-end evidence. Prove uncertain dependencies early.

Keep slices small enough to diagnose. A rough 100-line signal is useful, not a
reason to split tightly coupled changes into broken intermediate states.

### 3. RED → GREEN → verify

1. Follow `e6-test-driven-development`: for changed behavior, derive an acceptance
   test and observe its intended failure before implementation. For preserved
   behavior/refactoring, run baseline or characterization checks before edits;
   do not invent a failure.
2. Implement the smallest complete behavior. Reuse existing patterns; no generic
   abstraction for hypothetical requirements or adjacent cleanup.
3. Run focused tests and applicable repository build/type/lint gates.
4. Execute the slice through its actual local entry point. For UI, use
   `e6-frontend-ui-engineering` and `e6-browser-testing-with-devtools`. For API
   boundaries, use `e6-api-and-interface-design` and real request checks.
5. If an unexpected failure appears, stop adding slices. Use
   `e6-debugging-and-error-recovery`, preserve evidence, fix the cause and reverify.

Each verification command runs after a change that can affect it. Do not rerun
an unchanged successful check for reassurance. Code, dependencies, configuration,
environment and relevant state can invalidate evidence.

### 4. Checkpoint and continue

Record acceptance IDs satisfied, paths changed, test/runtime evidence, blockers
and the next slice in the active task/status artifact. Commit a focused slice
only when authorized by the user or required by the repository workflow; follow
`e6-git-workflow-and-versioning`. Otherwise leave a reviewable uncommitted diff.
Do not stage, erase or tidy unrelated user changes to make the tree clean.

Carry the current context and verified state forward. Continue automatically
within the accepted scope; a working first slice does not complete a multi-slice
feature.

### 5. Finish the task

Verify all accepted outcomes together, including the real integrated flow.
Apply `../../references/definition-of-done.md`, then return evidence for review,
fixes, documentation and authorized handoff/shipping. Deployment or merge needs
its own authorization; successful local slices do not grant it.

## Rollout and rollback rules

- Each intermediate state builds and existing behavior remains usable.
- Hide incomplete user-facing work behind the project's established feature
  flag, disabled by default. Verify both enabled and disabled behavior.
- Use conservative defaults; new side effects are explicit.
- Make rollback practical. For schema/data changes, use the project's migration
  procedure and verify data compatibility; a nominal down migration alone is
  not a proven recovery path.
- Replace used code by adding the replacement, migrating callers, then removing
  old code in working slices. Keep replacement atomic when separation would
  break the system.
- Scope each slice to the task. Record unrelated findings briefly; do not turn
  them into unrequested work or routine permission questions.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "Implement everything, test later" | RED and runtime checks happen per slice. |
| "The two-day draft is nearly done" | Sunk effort does not validate an untested batch. |
| "A build proves the feature works" | Execute the accepted behavior through the real entry point. |
| "Every slice must be committed" | Checkpoint always; commit only within authorization/workflow. |
| "Delete first, replace next" | Every intermediate state must work. |

## Red Flags

- New behavior written before acceptance tests; big unverified batches.
- Completing only the first slice then handing the task back.
- Broken intermediate builds or exposed incomplete features.
- Unrelated refactors, broad staging, or user edits erased for a clean tree.
- End-to-end claims based on mock data or compilation.

## Verification

- [ ] Every slice maps to accepted criteria: RED/GREEN for changed behavior,
  baseline/characterization for preserved behavior.
- [ ] Each intermediate state works; relevant tests and gates pass.
- [ ] Integrated local/runtime acceptance flow actually executed.
- [ ] Flags and recovery paths verified when applicable.
- [ ] Slice status recorded; commits follow authorization and preserve user edits.
- [ ] All task criteria and Definition of Done checked; evidence returned for review.
