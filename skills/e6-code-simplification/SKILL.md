---
name: e6-code-simplification
description: Use when refactoring or simplifying working code for clarity without changing behavior, reducing complexity in a module, or cleaning up code that is hard to read, maintain, or extend.
---

# Code Simplification

## Overview

Reduce the concepts a reader must hold while preserving the complete observable contract. Fewer lines is not the goal. A new team member should understand the result faster.

## When to Use

- Working code has deep nesting, unclear names, duplication, or unnecessary layers.
- Review finds a concrete clarity or structural problem.
- Recently changed code needs a scoped simplification pass.

Not for already-clear code, unfamiliar code, a planned rewrite, or an unmeasured performance tradeoff. Understand first; use `e6-performance-optimization` when hot-path cost matters.

## Workflow handoff

For standalone engineering work with no active workflow, load `using-e6-agent-skills`; otherwise keep the current coordinator. Return baseline, acceptance, runtime, and review evidence to that coordinator and continue its next phase. Use `e6-caveman` for concise output and bounded delegation. Delegate only independent scoped inspection; provide exact paths and contracts, and do not nest agents.

## Process

### 1. Load the contract and relevant context

Read applicable instructions, acceptance criteria, the affected implementation, callers/exports, neighboring conventions, and relevant history. Use `e6-context-engineering` when context is missing. Identify inputs, result shape, errors, side effects, ordering, async behavior, serialization, and compatibility obligations. Understand why an abstraction or branch exists before deleting it.

Scope to the requested/recently changed paths. Existing authorization covers proven cleanup in that scope; ask only for a missing product decision or scope change. Avoid adjacent renovation.

### 2. Execute a baseline

Find project test/build/lint commands and runtime entry point. Run the focused existing tests before editing. If they already fail, identify and report the baseline failure; use `e6-debugging-and-error-recovery` where relevant, and do not attribute it to the refactor.

For an uncovered affected contract, add meaningful characterization tests before changing code. Use `e6-test-driven-development` for any discovered bug fix and keep it separate from behavior-preserving refactoring. Tests should assert outputs, errors, side effects, and boundaries visible to callers. Do not encode the old implementation's private structure.

For UI/integration code, record the existing local behavior needed for comparison. A passing unit suite does not prove a mounted component, HTTP handler, or job still works.

### 3. Choose a smaller design

| Signal | Candidate move |
|---|---|
| Deep nesting | Guard clauses or a named helper that preserves evaluation order. |
| Repeated conditionals | Explicit state/model or dispatcher; predicate extraction only if it removes repetition. |
| Multiple responsibilities | Separate orchestration from business logic; split focused modules. |
| Duplicate behavior | Reuse the canonical helper; share only when ownership and contracts match. |
| Generic/misleading names | Name the data or action using project vocabulary. |
| Pass-through wrapper/speculative layer | Remove when callers, errors, identity, and extension contracts permit. |
| Proven dead code | Remove after checking dynamic entry points, configuration, exports, and tests. |

Keep comments explaining why. Remove obvious narration. Preserve useful abstractions that name a concept or support an actual constraint; do not generalize for hypothetical future use.

Check semantic hazards: object vs Map and value shape; truthiness vs nullish values; getters and evaluation count; short-circuit order; sparse arrays and iteration; async rejection vs synchronous throw; mutation and identity. Removing `async` or changing a collection representation is not automatically a refactor.

Load [references/language-patterns.md](references/language-patterns.md) only for the relevant language. The examples are candidates with preconditions, not permission to change a contract.

### 4. Change one thing, check it

Make one reviewable simplification. Run focused behavior checks after it. If a new failure appears, revert that change and reconsider. Preserve existing tests unchanged; added characterization coverage is allowed. Do not weaken assertions, delete tests, or remove error handling to make the change green.

Run required broader gates once the affected changes are stable. Automate large mechanical transformations when that makes the result safer and easier to review; do not use an arbitrary line count as permission for a broad rewrite. Keep refactoring separate from new features or bug fixes.

### 5. Run the affected behavior and review the result

Execute the affected local CLI/API/job/integration path. For rendered UI, start the app and use `e6-browser-testing-with-devtools` to compare the interaction, error states, console/network, and relevant visual behavior. Use the available browser/computer path appropriate to the product; report a real environment blocker if it cannot run.

Confirm the new structure reduces concepts and follows project conventions. Use `e6-code-review-and-quality` for the authorized change, address concrete findings, and verify any follow-up edits. Revert attempts that merely relocate complexity or make the contract less clear.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "Fewer lines is simpler" | Dense expressions can hide evaluation and error behavior. |
| "The suite is green, so behavior is identical" | Check uncovered caller contracts and actual runtime behavior. |
| "I'll simplify this unrelated module too" | Extra scope adds noise and risk. |
| "This wrapper does nothing" | Async errors, identity, and extension hooks may be its contract. |
| "The original author had a reason" | Read callers/history and test whether that reason still applies. |

## Red Flags

- Changed return type/shape, error timing, side-effect order, or collection semantics.
- Modified tests to accept new behavior during a refactor.
- New features, unrelated cleanup, or weaker error handling.
- No executed baseline; speculative "a teammate would approve" used as evidence.

## Verification

- [ ] Focused baseline and relevant characterization checks ran before editing.
- [ ] Existing tests pass unchanged; affected acceptance behavior is covered.
- [ ] Required build/lint checks pass with no new warnings.
- [ ] The affected local runtime path was exercised, including browser interaction when relevant.
- [ ] The diff is scoped, reduces complexity, and passed review.
- [ ] Actual commands/results, runtime evidence, and any blocker were returned to the coordinator.
