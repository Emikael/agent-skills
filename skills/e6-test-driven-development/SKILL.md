---
name: e6-test-driven-development
description: Use when writing or running tests for new logic, fixing a bug, changing behavior, proving code works, or refactoring existing functionality with regression risk. Use when a failing reproduction, red-green-refactor cycle, test-only deliverable, or preserved contract needs evidence.
---

# Test-Driven Development

## Overview

Prove the required behavior before changing code. RED → GREEN → REFACTOR.
Use a failing reproduction for bugs. Passing tests must establish accepted
outcomes, not mirror the implementation.

## When to Use

- New logic, changed behavior, bug fixes, refactoring with regression risk.
- Browser behavior needs runtime checks as well as automated tests.
- Exclude documentation, static content, and configuration with no behavior impact.

## Workflow handoff

Use `e6-caveman` for prose and delegation. If this is a standalone engineering
request with no active workflow, load `using-e6-agent-skills` once. Otherwise,
update the current phase evidence and return to its coordinator. Consult
`../../references/workflow-contract.md` as needed; do not reload the workflow
recursively. A test-only request stays test-only.

## Process

### 1. Load behavior and tooling

Read applicable project instructions, the task/bug/spec and acceptance IDs,
nearby implementation and tests, and relevant public contracts. Read README
invariants, not only its test command. Preserve existing behavior unless the
accepted task changes it.

Discover language, test framework/configuration, test placement, focused and
full-suite commands, and CI gates. Prefer checked-in wrappers and repo scripts:
`./gradlew`, `./mvnw`, `make test`, `python3 -m unittest`, or the project's
actual equivalent. Never assume `npm test`.

Record the current baseline when it affects diagnosis. Separate existing
failures from changes caused by this task.

### 2. Translate acceptance into tests

Map each changed requirement ID or exact criterion to a test with preconditions,
input/action and expected observable outcome. Include relevant failure paths,
boundaries and preserved invariants. Derive expected values from the accepted
contract, not from the code or a stakeholder's guessed patch.

Choose the smallest level that proves it: unit for pure logic; integration for
API/DB/filesystem boundaries; real runtime/E2E for critical user flows. Use real
implementations where practical; mock only uncontrollable boundaries. A mock
return value or internal call sequence alone does not prove the feature.

### 3. RED — run before implementation

For behavior-preserving refactors, run characterization/baseline tests before
edits and afterward; do not manufacture RED for behavior already correct.

For changed behavior, write the focused test and run the discovered command before changing behavior.
Inspect the failure: it must show the missing or incorrect behavior, not an
unrelated syntax, import, dependency, environment, or test-discovery error.
An intentionally absent feature must be distinguished from a broken harness.
Repair the harness when needed, then obtain valid RED evidence.

If a new regression test passes, establish why; it has not reproduced the bug.
Use the reported conditions or find the missing case. Already passing tests for
preserved invariants remain useful; they are not RED proof for changed behavior.
Record command, requirement and decisive assertion/output.

**Test-only exit:** If the request is to write a failing test without fixing
behavior, stop here after valid RED. Return test paths, commands, expected
failures and unchanged implementation status to the coordinator/caller. Report
any suite run as containing the expected target failure, not passing. Do not
advance to GREEN, refactor, commit or deploy without authorization covering it.

### 4. GREEN — only when implementation is authorized

Change only what satisfies the accepted behavior. Run the focused test again.
If it fails, use `e6-debugging-and-error-recovery`; do not disable the test,
weaken assertions or rewrite the expected result just to get green.

### 5. REFACTOR — preserve behavior

Simplify only relevant code after GREEN. Re-run affected tests after edits.
Use state/output assertions, deterministic inputs, isolated setup/teardown,
awaited async operations, and names describing behavior. See
`references/testing-techniques.md` for test sizes, DAMP, mock discipline and
examples. JS/TS framework syntax lives in `../../references/testing-patterns.md`.

### 6. Verify the accepted result

For authorized implementation/refactoring, run the repository's full suite and
applicable build/type/lint gates. Execute
changed behavior locally through its actual entry point. Browser changes use
`e6-browser-testing-with-devtools`; unit tests do not prove layout or interaction.
Other runtimes use their actual CLI, API, app or computer interaction as relevant.

Reuse successful evidence until code, dependencies, configuration, environment
or relevant state changes. Report exact blockers and checks not run; never claim
passing results from static reasoning.

## Delegation

For a substantial independent reproduction task, a subagent may own only the
named test paths. Give acceptance IDs, known inputs/outcomes, relevant context
pointers and exact commands; exclude the proposed fix. Follow the shared
contract's input/result bounds and no-nesting rule. The coordinator observes
RED before editing implementation, then owns integration and final verification.
Do not delegate a tiny test that costs less to write directly.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "Tests next sprint" | Reproduce first; deadlines do not validate a guessed fix. |
| "The reported case passes now" | Also prove surrounding accepted invariants. |
| "Any failure counts as RED" | Harness failures do not prove behavior. |
| "Mocks pass, so the app works" | Verify the real boundary and runtime. |
| "Run it again for reassurance" | Repeat only when relevant inputs changed. |
| "Test-only work must leave CI green" | Expected RED is the deliverable; do not fix behavior outside scope. |

## Red Flags

- Behavior code changed before valid RED evidence.
- Tests read only from the implementation; acceptance/invariants ignored.
- Wrong ecosystem command, zero discovered tests, skipped tests or false passes.
- Browser verification claimed without using a browser.
- Subagent writes both test and fix; coordinator never observes RED.

## Verification

Apply common checks and only the branch matching the authorized deliverable.

- [ ] Requested test-only or implementation scope is explicit; criteria map to behavioral tests.
- [ ] Test-only: valid expected RED observed; implementation unchanged; failures reported accurately; no unauthorized fix, commit or deployment.
- [ ] Implementation: RED preceded the fix and GREEN followed; preserved invariants hold. Refactoring uses characterization evidence.
- [ ] Implementation: focused/full-suite commands and relevant gates pass; actual changed runtime scenario exercised.
- [ ] No tests weakened, skipped or disabled to hide failures.
- [ ] Evidence, blockers and omissions returned; test-only work exits at its deliverable, remaining phases require matching scope.
