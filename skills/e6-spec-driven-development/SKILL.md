---
name: e6-spec-driven-development
description: Writes a feature spec before any code. Use when starting a new project, feature, or significant change and no specification exists yet, even if the user did not ask for a spec by name. Use when drafting a PRD or requirements document with objectives and scope, or when requirements are unclear, ambiguous, or only exist as a vague idea. Use when a single requirement spans several independently testable capabilities and needs decomposing into a capability map of modules before specifying.
---

# Spec-Driven Development

## Overview

Write a feature specification before writing any code. The spec states what we are building, for whom, what is out of scope, and which observable behaviors prove it is done. Commands, directory layout, code style, and agent operating rules belong in the project's rules file. This skill produces requirements a later task and test can cite.

## When to Use

- Starting a new project, feature, or significant change and no specification exists yet
- Requirements are ambiguous, incomplete, or only a vague idea
- The change touches multiple modules or an architectural decision
- One request bundles several capabilities that could ship and be verified separately

**When NOT to use:** Single-line fixes, typo corrections, or changes whose requirements are already written and unambiguous. Follow `e6-planning-and-task-breakdown` when an approved spec needs tasks. Follow `e6-context-engineering` when the repo needs commands, layout, or style recorded.

## The Gated Workflow

Spec-driven development has four phases, preceded by a scope check (Phase 0) that activates only when one request bundles several independently testable capabilities. Do not advance until the current phase is validated. This skill owns Phases 0 and 1. Phases 2–4 are owned by the skills named there.

```
SPECIFY ──→ PLAN ──→ TASKS ──→ IMPLEMENT
   │          │        │          │
   ▼          ▼        ▼          ▼
 Human      Human    Human      Human
 reviews    reviews  reviews    reviews
```

### Phase 0: Scope Check

Most requests describe one capability. If this one does, skip this phase and go straight to Specify.

**Detection.** Decompose before specifying when a single requirement bundles several independently testable capabilities:

- The requirement names distinct capabilities with their own consumers or data (identity, billing, notifications, reporting)
- Acceptance criteria cluster into groups that could ship and be verified separately
- One capability could be cut or replaced without rewriting the others' requirements

**Propose a capability map before writing any spec.** A module table plus a build order:

```markdown
# Capability Map: [Initiative Name]

| Module id | Responsibility | Depends on |
|---|---|---|
| identity | Accounts, sessions, SSO | — |
| billing | Plans, invoices, payments | identity |
| notifications | Email and webhook fan-out | identity |
| reporting | Usage dashboards | billing, notifications |

Build order: identity → billing, notifications → reporting
```

- **Stable module ids.** Kebab-case, chosen once, never renamed mid-initiative. Specs, plans, and tasks select work by these ids.
- **Dependency direction, no cycles.** If two modules each need the other, they are one module.
- **Interfaces live at the boundary.** The map records that `billing` depends on `identity`. The contract belongs in the provider module's spec. Follow `e6-api-and-interface-design` when writing it.

The human reviews module boundaries, dependency direction, and build order before any module spec is written.

Save the approved map at the project root as `CAPABILITY-MAP.md`. Then run Specify for each module in dependency order. Each module spec is `SPEC-<module-id>.md` and covers only that module. The map is the index.

### Phase 1: Specify

**Start from a confirmed intent.** If you cannot yet state who it is for, why now, what success looks like, and what is out of scope, follow `e6-interview-me` and stop until that intent is explicitly confirmed. One question at a time. Do not batch a questionnaire and write the spec anyway.

**Surface assumptions immediately.** Before writing spec content, list what you are assuming:

```
ASSUMPTIONS I'M MAKING:
1. This is a web application (not native mobile)
2. Authentication uses session-based cookies (not JWT)
3. The database is PostgreSQL (based on existing Prisma schema)
4. We're targeting modern browsers only (no IE11)
→ Correct me now or I'll proceed with these.
```

An assumption that changes behavior, money, permissions, or stored data is a blocking question. It does not become a requirement until the user gives an explicit yes.

**Where project conventions go.** Commands, directory layout, code style, and Always / Ask first / Never rules are a project constitution. If the repo has no rules file yet, follow `e6-context-engineering` and write them there (`AGENTS.md`, `CLAUDE.md`, or the host's equivalent). Do not copy them into the feature spec. The quality bar (coverage, performance, accessibility) is `e6-constraint-driven-development` and lives in `CONSTRAINTS.md`.

**Write the feature spec with these sections:**

```markdown
# Spec: [Feature Name]
Status: draft

## Outcome
[What we are building, for whom, and why.]

## Actors
[Who acts, and who only consumes the result.]

## In scope
- [Capability this spec covers]

## Out of scope
- [Capability this spec will not cover, and why]

## Requirements

### [MOD]-1 [Short title]
Statement: [One behavior.]
Acceptance: Given [state], when [action], then [observable outcome].
Proves: [The invariant or success condition this scenario locks.]

## Data and invariants
[Entities, identities, uniqueness, ordering, and what must always be true.]

## Interfaces
[Commands, events, or types that cross a module or process boundary. Otherwise "none".]

## Error and edge behavior
[Empty, duplicate, unauthorized, partial failure, and retry behavior.]

## Non-functional
[Latency, audit, accessibility, or compatibility only when this feature needs a number.]

## Blocking questions
[Decisions that would change behavior, money, permissions, or stored data. Empty only when none remain.]

## Trace
[Requirement ids in this spec. Plans and tests cite these ids.]
```

Rules for the requirements section:

- One requirement, one behavior, one way to observe it.
- Ids are stable: a short module prefix plus a number (`BILL-3`). Never renumber an approved id. Add a new id to change behavior.
- Given / When / Then names an observable outcome. "Works correctly" and "handles edge cases" are not acceptance.
- Out of scope is mandatory, including for a single-module spec.

**External spec tools.** If the project already uses OpenSpec or another specification system, keep that system's artifact format and storage. This skill owns clarification, requirement content, and approval gates. The external tool owns how the approved spec is represented. A single-capability spec with no external tool is `SPEC.md` at the repo root (`docs/SPEC.md` is the accepted alternate).

**Reframe vague goals as observable targets.**

```
REQUIREMENT: "Make the dashboard faster"

REFRAMED:
- DASH-1 Dashboard LCP < 2.5s on a 4G connection
→ Are these the right targets?
```

### Adversarial pass

Before asking for approval, attack the spec. Follow `e6-doubt-driven-development` when the spec touches auth, billing, payments, migrations, or deletion. For every other spec, walk this checklist yourself and escalate to `e6-doubt-driven-development` if an item fails:

- Vague verbs remain: handle, support, fast, robust, flexible
- Only the happy path is specified
- A state machine is implied and not written
- A requirement has no observable outcome
- Two independently testable capabilities share one spec
- An assumption is written as a fact
- A blocking question was answered inside a requirement

Fix the spec. Do not ask the human to approve a draft that fails this pass.

**Approval.** Ask for an explicit yes. "Sounds good", "looks reasonable", and "I guess" are not approval. A spec with any blocking question that changes behavior, money, permissions, or stored data is not approvable. The user may defer the decision. The requirement stays unwritten until they decide.

### Phase 2: Plan

Follow `e6-planning-and-task-breakdown`. Every task names the requirement ids it satisfies, and those ids come from a single module. Save the plan to `tasks/plan.md` and the task list to the task list target that skill defines (default `tasks/todo.md`).

### Phase 3: Tasks

Task sizing, dependency order, and checkpoints belong to `e6-planning-and-task-breakdown`. A task template that cites requirements:

```markdown
- [ ] Task: [Description]
  - Requirements: [BILL-3]
  - Acceptance: [The scenario copied from that requirement]
  - Verify: [The test command or check that proves the scenario]
  - Files: [Which files will be touched]
```

### Phase 4: Implement

This skill stops at the approved spec. Implementation follows `e6-incremental-implementation` and `e6-test-driven-development`. The failing test proves the requirement ids on the task before production code changes. Follow `e6-context-engineering` to load those requirement sections and the files the task touches, not the whole spec.

If implementation would contradict an approved requirement, stop. Write a spec delta that names the ids, what changed, and why. Wait for an explicit yes. Then update the tasks. Do not patch the code and leave the spec stale.

## Keeping the Spec Alive

Each requirement id moves from proposed, to approved, then implementing, then verified.

- Update the spec when a decision changes, before the code does.
- Features added or cut change Out of scope or add a new id. Do not silently renumber.
- Commit the spec with the code.
- Reference the requirement ids in the PR.

A spec delta is a short note in the spec, or a commit that touches it:

```markdown
## Delta
- BILL-3: late window changed from 7 days to 3 after finance review. Status returned to approved.
```

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "This is simple, I don't need a spec" | Simple tasks still need an observable acceptance scenario. Two lines are enough. |
| "I'll write the spec after I code it" | That is documentation. The spec's value is clarity before code. |
| "The spec will slow us down" | A short spec prevents rework. An untested guess costs more than the spec. |
| "Requirements will change anyway" | The spec is a living document with ids and deltas. An outdated spec can be corrected. A missing spec cannot be cited. |
| "The user knows what they want" | Clear requests still hide assumptions. Blocking questions are how those surface. |
| "It's one big feature; splitting it is overhead" | Independently testable groups need a capability map. Ten lines now, or every later task reasons over the whole contract. |
| "I'll decompose during planning" | Planning slices tasks inside a spec. Module boundaries are decided before the spec is written. |
| "I'll pick a sensible price and keep going" | A decision that changes behavior, money, permissions, or stored data stays in Blocking questions until the user says yes. |
| "The spec should list npm scripts and code style" | Those belong in the rules file. A feature spec that restates them hides the missing behavior. |

## Red Flags

- Writing code with no written requirements
- Asking "should I just start building?" before "done" is observable
- Implementing behavior no requirement id covers
- Filling Blocking questions with invented prices, tiers, or policies
- A spec whose body is commands, directory layout, and formatter rules
- One spec spanning several independently testable capabilities
- Module boundaries decided during implementation because no capability map was approved
- A task or test that cites requirements from two modules
- Code merged while the spec still describes the old behavior

## Verification

Before planning or implementation, confirm:

- [ ] The spec states outcome, actors, in scope, and out of scope
- [ ] Every requirement has a stable id and a Given / When / Then scenario with an observable outcome
- [ ] Data invariants, interface boundaries, and error behavior are present or explicitly "none"
- [ ] Decisions that change behavior, money, permissions, or stored data are in Blocking questions, not in requirements
- [ ] The adversarial pass was run, and high-stakes specs went through `e6-doubt-driven-development`
- [ ] The user gave an explicit yes
- [ ] Project commands, layout, and code style are in the rules file, not copied into the spec
- [ ] The spec is saved (`SPEC.md`, `docs/SPEC.md`, or `SPEC-<module-id>.md` plus `CAPABILITY-MAP.md`)
- [ ] If several independently testable capabilities were bundled, the capability map was approved before any module spec
- [ ] Every module spec traces to a module id in the approved map
