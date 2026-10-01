---
name: using-e6-agent-skills
description: Use when starting an engineering task or session, deciding which skill or workflow applies, routing a request through this pack, or implementing a feature from request to verified handoff without naming each skill.
---

# Using E6 Agent Skills

## Overview

Own the workflow until the user's goal is satisfied. Selecting one skill starts a phase; it does not complete the task. Load specialists when needed. Keep one coordinator.

## When to Use

Engineering requests: build, fix, refactor, test, review, plan, migrate, release. Respect narrower requests: a review produces findings; a plan produces a plan; `/spec` produces a spec. Ordinary conversation needs no SDLC workflow.

## Process

1. **Start.** Use `e6-caveman` for concise communication and delegation. Read applicable project rules and `git status`. Identify the requested outcome, scope, existing authorization, and any active workflow. Read [the workflow contract](../../references/workflow-contract.md) once. Reuse its evidence; do not restart completed phases.
2. **Understand.** Use `e6-context-engineering` to find relevant code, tests, callers, project commands, and prior decisions. Use `e6-spec-driven-development` to record observable acceptance criteria before a behavior change. A small fix can use a few inline criteria; a larger feature needs the project's spec artifact. Ask only about material decisions the evidence cannot resolve. Reuse the user's stated requirements.
3. **Plan.** Use `e6-planning-and-task-breakdown` for multiple slices. Map requirement IDs to tests, implementation paths, and runtime checks. State assumptions and proceed within the user's authorization. Record dependencies and conditional specialist needs.
4. **Build.** Use `e6-incremental-implementation` with `e6-test-driven-development`: for behavior changes, failing behavior test → minimal implementation → passing test → relevant regressions. For unchanged behavior, use passing baseline/characterization checks; for prose/configuration, use appropriate validators. Use `e6-debugging-and-error-recovery` for failures, then resume the interrupted phase. Verify each slice before expanding.
5. **Verify.** Run discovered project checks and exercise the changed behavior locally. Web UI work requires `e6-browser-testing-with-devtools`: start the app, interact with the affected flow, inspect console/network and visible states. Use available browser or computer capabilities; report a precise blocker if unavailable. Compilation alone cannot prove runtime behavior. Fix failures and recheck affected evidence.
6. **Review.** Use `e6-code-review-and-quality` against acceptance criteria, tests, and the actual diff. Address Critical/Required findings; use `e6-code-simplification` where complexity warrants it. After fixes, rerun affected checks and review again. Confirm [Definition of Done](../../references/definition-of-done.md).
7. **Handoff.** Update changed documentation through `e6-documentation-and-adrs`. Report delivered behavior, actual checks, and unresolved blockers. Record a reusable lesson only when new evidence warrants it. Use `e6-git-workflow-and-versioning` and `e6-shipping-and-launch` when committing or releasing is in scope. A reviewable local result completes an implementation request that does not authorize release.

Advance automatically through applicable phases. Never ask the user to invoke the next skill. Continue independent work while a material question is pending. A blocked required check remains blocked; record its consequence instead of claiming completion.

## Conditional Skills

Load only a skill whose trigger applies; record a reason when skipping a relevant phase.

| Trigger | Required specialist |
|---|---|
| Goal/actors/success unclear | `e6-interview-me` |
| User wants alternatives for a rough idea | `e6-idea-refine` |
| Quality floor missing or disputed | `e6-constraint-driven-development` |
| Unfamiliar dependency/version/API | `e6-source-driven-development` |
| Material uncertainty or high consequence | `e6-doubt-driven-development` |
| UI change | `e6-frontend-ui-engineering` |
| Public interface/API change | `e6-api-and-interface-design` |
| Untrusted input, authorization, sensitive data | `e6-security-and-hardening` |
| Measured performance problem/budget | `e6-performance-optimization` |
| New critical path or telemetry change | `e6-observability-and-instrumentation` |
| Pipeline/build automation change | `e6-ci-cd-and-automation` |
| Compatibility transition/data migration | `e6-deprecation-and-migration` |

## State and Delegation

Track phase, acceptance IDs, evidence, blockers, and next action. For longer work persist a compact `tasks/workflow-state.md` beside the existing plan; for a small task keep this inline. Resume by inspecting artifacts and the current tree.

Delegate only independent work that benefits from another worker. Follow the context skill's bounded task packet and `e6-caveman`. Each writable path has one owner. Workers return evidence to this coordinator; they do not start another lifecycle. Other plugins can provide specialist capabilities. Honor an explicitly requested alternative workflow; otherwise retain the selected coordinator and reconcile its gates once.

## Common Rationalizations

| Excuse | Required response |
|---|---|
| "I invoked a skill, so workflow done." | Follow its handoff; satisfy the remaining phases. |
| "Tests pass; app must work." | Exercise the changed runtime path. |
| "The user must approve each phase." | Reuse existing authorization; ask only for missing decisions/actions. |
| "Load all 26 skills for certainty." | Read only the current phase and triggered specialists. |

## Red Flags

- Stopping at a spec when implementation was requested.
- Changing behavior before acceptance criteria or a failing behavior test.
- Declaring browser verification from code inspection.
- Full conversation copied to each worker; conflicting file ownership.
- Repeated routers, approval loops, or unsupported tool requirements.

## Verification

- [ ] Requested scope satisfied; every applicable phase has evidence or an explicit blocker.
- [ ] Acceptance criteria map to observed tests and runtime checks.
- [ ] Critical/Required findings resolved and affected checks rerun.
- [ ] Output concise; exact commands, uncertainty, and limitations preserved.
- [ ] Handoff honors project rules and existing authorization.
