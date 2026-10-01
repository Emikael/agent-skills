---
name: e6-spec-driven-development
description: Use when starting a new project, feature, service, or significant change without a specification, even when no spec was requested by name. Use when drafting a PRD or requirements document with objectives and boundaries, when requirements are vague or ambiguous, or when identity, billing, notifications, reporting, or other independently testable capabilities need a capability map and dependency order before specifying.
---

# Spec-Driven Development

## Overview

Write observable requirements before production code. Stable requirement IDs connect intent, tasks, acceptance tests, runtime evidence, and review.

## When to Use

- A feature or significant change has no clear written requirements.
- Product behavior or scope is ambiguous.
- One initiative contains independently testable capabilities.

Skip mechanical fixes and already-specified changes. Use `e6-planning-and-task-breakdown` for task breakdown from settled requirements.

## Process

### 1. Load the relevant contract

Follow `e6-context-engineering`. Read the request, active intent/spec sections, rules, constraints, relevant interfaces, and tests. Use bounded searches. Commands, layout, style, and agent rules belong in project rules, not the feature spec.

If user or observable success remains unclear, use `e6-interview-me`. Reuse existing answers and delegated authority.

Separate facts and assumptions with evidence. Ask unresolved material decisions: pricing, permissions, persistence, user-visible policy, or competing scope. Keep them in Blocking questions; continue independent authorized work.

### 2. Check capability scope

When the request bundles capabilities that can ship and be verified independently, propose a capability map before module specs:

```markdown
# Capability Map: Customer portal
| Module id | Responsibility | Depends on |
|---|---|---|
| identity | Accounts and sessions | — |
| billing | Plans and invoices | identity |
| notifications | Email and webhook events | identity, billing |
| reporting | Usage dashboard | billing, notifications |
Build order: identity → billing → notifications → reporting
```

Use stable kebab-case module IDs. Require one-way dependencies; merge inseparable modules or repair the boundary. Provider specs own interface contracts; use `e6-api-and-interface-design` for their design.

Validate boundaries against the request and architecture. Ask only for material scope/ownership changes. Save `CAPABILITY-MAP.md` within task authority, then `SPEC-<module-id>.md` in dependency order.

### 3. Specify behavior and proof

Keep the project's established specification system, including OpenSpec. Otherwise use `SPEC.md` at the repo root (`docs/SPEC.md` is accepted).

```markdown
# Spec: [Feature]
Status: draft | approved | implementing | verified
## Outcome and actors
[What changes, for whom, and why]
## In scope
[This capability]
## Out of scope
[Specific exclusions and reasons]
## Requirements
### BILL-3 Deduplicate billing events
Statement: One logical event affects usage once.
Acceptance: Given a recorded event, when its ID is submitted again,
then usage and invoice totals remain unchanged.
Proves: Retries cannot charge twice.
Proof method: Duplicate-event integration test; local API retry flow.
## Data and invariants
[Identity, uniqueness, ordering, state transitions]
## Interfaces
[Boundary commands, events, or types; otherwise none]
## Error and edge behavior
[Empty, invalid, duplicate, unauthorized, partial failure, retry]
## Non-functional
[Feature-specific latency, accessibility, audit, compatibility targets]
## Blocking questions
[Unresolved material product decisions; otherwise none]
## Trace
[Requirement IDs; approval/authority; later proof references]
```

One requirement describes one observable behavior. Use a stable module prefix and number (`BILL-3`); never silently renumber approved IDs. Given/When/Then names concrete state, action, and outcome. "Works correctly" is not acceptance.

Include negative/edge scenarios. Proof tests user outcomes or invariants. UI/native/CLI/API behavior also needs actual local interaction; builds alone are insufficient. Planning supplies commands; tests cite IDs.

Use `e6-constraint-driven-development` for standing quality gates. Feature-specific budgets belong here; shared standards remain in `CONSTRAINTS.md`.

### 4. Challenge the draft

For auth, billing, payments, migrations, deletion, or uncertain architecture, use `e6-doubt-driven-development`. For other specs, check:

- Every requirement has an observable result and proof method.
- Relevant errors, invariants, and state transitions are explicit.
- Each spec stays inside its capability boundary.
- Assumptions remain distinguishable from facts.
- Material unanswered questions remain visible.

Fix identified gaps before treating the affected requirement as settled. A draft may be saved with open questions; unresolved behavior cannot become approved by silence.

### 5. Record authority and advance

Clear confirmation, approved existing requirements, or delegated implementation authority can settle routine requirements. Do not require a literal "yes" or another approval of each artifact when the user authorized the whole task.

For spec-only requests, return the saved spec and open decisions. For an authorized build, the coordinator continues to `e6-planning-and-task-breakdown`, then `e6-incremental-implementation` and `e6-test-driven-development`. Tasks and failing tests cite the requirements they prove. Load only active requirement sections and touched files.

For contradictions, record a delta: IDs, old/new behavior, reason, authority. Ask for unresolved material decisions or scope expansion; otherwise update spec/tasks before proceeding. Preserve history, reference IDs in the PR, and commit spec with code when authorized.

## Common Rationalizations

| Excuse | Reality |
|---|---|
| "I'll document it after coding" | The spec prevents wrong behavior before code exists. |
| "I'll choose a sensible price" | Pricing is a material product decision, not an implementation default. |
| "The build passes, so acceptance is covered" | Acceptance requires observable behavior and its proof. |
| "Every phase needs another yes" | Existing authorization persists; only unresolved decisions need input. |

## Red Flags

- Requirements invented from unresolved prices or policies.
- Acceptance that mirrors functions instead of user outcomes.
- Independently testable capabilities sharing one spec.
- Untraced code or stale requirements after a behavior change.
- Repeated approval pauses inside an authorized build.

## Verification

- [ ] Relevant project facts and existing authority were read first.
- [ ] Outcome, actors, scope, non-goals, invariants, and errors are explicit.
- [ ] Stable IDs have observable scenarios and proof methods.
- [ ] Material unresolved decisions remain visible and block only affected work.
- [ ] Capability boundaries and adversarial findings are resolved or recorded.
- [ ] The spec is saved and traces authority and later evidence.
- [ ] Spec-only scope stayed bounded; authorized work advanced to planning.

## Workflow Handoff

For a standalone engineering task with no active workflow, use `using-e6-agent-skills`. Otherwise update the current phase evidence and return to its coordinator without recursively reloading the router. Follow [the workflow contract](../../references/workflow-contract.md). Use `e6-caveman` for concise user updates and delegation.
