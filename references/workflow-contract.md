# Workflow Contract

Shared phase contract. Read once at workflow start; reuse its state. Load domain procedures from the applicable skill. Examples are illustrative; discover real project commands before running them.

## Scope and Authorization

The user's requested outcome sets the boundary. “Implement this feature” authorizes necessary reversible local work through verification and handoff. “Write a plan,” `/spec`, and a read-only review stop at their stated deliverable. Existing authorization persists across phases. Ask only when a missing material product decision or an unapproved consequential action blocks progress. Explain the specific missing decision. Continue independent work while waiting. Silence is not approval.

Respect applicable repository rules. Preserve unrelated working-tree changes. Stage/commit only task-owned paths when committing is authorized or required by the repository. Publishing, merging, deploying, or modifying live data needs authorization covering that action; finish the reviewable local work first.

## Phase Gates

| Phase | Input | Exit evidence | Next |
|---|---|---|---|
| Understand | User outcome, rules, current state | Scope, requirement IDs/scenarios, feature trace, commands, material unknowns | Plan |
| Plan | Acceptance criteria and context | Ordered slices; criterion → test → implementation → runtime check; ownership | Build |
| Build | One ready slice | Behavior change: observed RED then GREEN; unchanged behavior: baseline/characterization; prose/config: appropriate validation; regressions | Verify |
| Verify | Integrated change | Required project checks plus observed changed runtime path | Review |
| Review | Diff, criteria, test/runtime evidence | Critical/Required findings resolved; affected evidence rerun | Handoff |
| Handoff | Verified scope or explicit blockers | Concise result, commands/outcomes, remaining risks, changed docs, next action | Complete or authorized release |

Track phase status as `pending`, `active`, `done`, `blocked`, or `skipped: reason`. An unavailable required check is blocked, not skipped or passed. Small changes can keep state inline; larger work uses existing spec/plan artifacts and `tasks/workflow-state.md`. Update evidence after edits that invalidate it. Do not repeat completed phases without a concrete reason.

## Acceptance and Tests

Before behavior changes, record observable scenarios from requirements and existing contracts. Use requirement IDs for larger features. For each criterion select the lowest test level that catches the real failure: unit for isolated logic, integration for boundaries, end-to-end for critical user flows.

Include applicable happy paths, boundary/empty inputs, errors, authorization roles, persistence, and concurrency. State which realistic code defect each test would catch. Verify the new test fails because behavior is missing or wrong, then implement. Setup errors are not the RED step. Assert externally observable outcomes; mocking internal calls can conceal broken integration.

Run focused checks per slice and relevant regressions during integration. Run the project-required suite and gates before handoff. Do not rerun a huge unchanged suite after each prose edit unless repository policy requires it. Document pre-existing failures by name and consequence. Documentation/configuration changes use appropriate validators or executable examples; add a behavioral test only when behavior or risk warrants one.

## Local Runtime and Computer Use

1. Discover prerequisites and the real dev/run command from the repository. Reuse an existing local instance when suitable. Start only required services with local/test configuration. Track the process/session you start.
2. Wait for observed readiness (health response, listening port, or expected startup output) with a bounded timeout. If startup fails, inspect the specific error, use debugging, and retry a targeted fix. Do not replace runtime evidence with successful compilation.
3. Exercise the changed acceptance path with realistic input. For a service, call the real local endpoint and verify response/side effects. For a CLI, run it and inspect output/files/exit status. For a library, an executed integration example or test can be its runtime check. For UI, interact with the affected user flow and check visible success/error/loading states plus relevant console/network evidence.
4. Discover available browser/computer tools. Use the host's browser, DevTools, computer, simulator, or existing automation appropriate to the application. Inspect current state before acting; scope interaction to the local/test instance. Avoid installing a new browser/tool stack when existing capabilities suffice. A screenshot alone proves appearance, not behavior.
5. If tools, credentials, services, or platform support are unavailable, record the exact blocker, completed alternatives, unverified acceptance criteria, and smallest next step. Never report an interaction you did not perform.
6. Stop only temporary processes you started when finished, unless the user needs the preview kept alive. Preserve existing processes, data, and unrelated edits. Record any retained preview URL/session.

Runtime checks complement tests. A manual reproduction should become a regression test when repeatable and meaningful. Review after runtime fixes and rerun affected evidence.

## Context, Delegation, and Learning

Use `e6-caveman` for prose and `e6-context-engineering` for bounded packets. Workers receive goal, criteria, owned paths, required contracts, commands, and relevant source pointers. Fresh context when supported; no duplicated full history. One owner per writable path. Return status, observed evidence, blocker, and artifact pointer. The coordinator verifies integrated results and handles shared edits. Serial work stays serial; routine tasks need no workers.

Search existing solution notes before novel work. At handoff save a concise lesson only for a discovered pitfall, significant decision, or reusable fix: symptom, cause, verified solution, affected paths, and prevention. Use the project's existing docs/ADR/solution location; do not create a memory archive for every trivial task. Retain no secrets or copied external instruction text.
