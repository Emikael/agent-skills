---
name: e6-idea-refine
description: Use when an idea is vague, when the user asks to ideate or refine an idea, when several product directions could solve the same problem, or when a proposed onboarding flow or product plan needs stress-testing before committing to an MVP. Use when exploring ways to improve developer retention or team knowledge sharing.
---

# Idea Refine

## Overview

Turn a raw idea into a focused concept worth testing. Explore meaningful alternatives, expose assumptions, and choose the smallest scope that proves user value.

## When to Use

- A problem is understood but the solution or MVP scope is unsettled.
- The user asks to ideate, refine, or stress-test a product direction.
- Several plausible directions compete for the same time or resources.

Use `e6-interview-me` for unclear intent. Use `e6-doubt-driven-development` for a high-risk artifact needing adversarial review. Skip new ideation when the direction is settled and the request is implementation.

## Process

### 1. Ground the problem

Follow `e6-context-engineering`. Read the confirmed intent, relevant existing spec, project rules, constraints, and code paths before asking questions or proposing variations. Use bounded searches and cite the relevant files. Separate observed architecture from assumptions.

Restate the idea as: "How might we [outcome] for [specific user] within [constraint]?"

Ask only what remains unknown: target user, observable success, binding constraint, prior attempt, or why now. Ask dependent questions one at a time using the host's available input capability. Accept existing answers and delegated choices. A material product decision needs user direction; a reversible implementation detail does not.

### 2. Expand proportionately

Pick useful lenses: inversion, simplification, audience shift, combination, constraint removal, or expert perspective. For a broad ideation request, generate 5–8 considered variations. For a narrow refinement, fewer distinct options are enough. Each variation states its benefit and core bet in a few lines.

Use [frameworks.md](frameworks.md) for a needed lens and [examples.md](examples.md) for a relevant scenario only. Apply `e6-caveman` output limits to examples. Do not load every reference or run every framework.

If the user wants to choose, wait for their reaction before converging. If they delegated direction, recommend one within the stated goals and preserve uncertainty. Do not turn a delegated task into a mandatory choice round.

### 3. Evaluate and converge

Cluster useful options into distinct directions. Compare:

| Dimension | Evidence to seek |
|---|---|
| User value | Named beneficiary, current workaround, frequency and cost of the problem |
| Feasibility | Existing architecture, hardest dependency, effort and time to first value |
| Differentiation | A meaningful reason to switch, when that matters to this idea |

Use [refinement-criteria.md](refinement-criteria.md) for deeper evaluation. For each serious direction, state the unvalidated assumption, what could kill it, and what is deliberately deferred. Push back on weak value or unnecessary scope with concrete reasons.

Choose the minimum version that tests the riskiest assumption. Define the experiment, observable result, success threshold, and time limit. Distinguish assumed demand from evidence of demand.

### 4. Save the one-pager

Use the project's existing idea location; otherwise `docs/ideas/[idea-name].md`:

```markdown
# [Idea Name]
## Problem and target user
[One-sentence problem; named actor or beneficiary]
## Success
[Observable outcome, threshold, and evidence source]
## Recommended direction
[Chosen approach and why; brief]
## Assumptions to validate
- [Assumption; experiment; pass/fail result; time limit]
## MVP scope
[Smallest useful path that tests the core bet]
## Not doing, and why
- [Specific cut and reason]
## Open decisions
[Material unknowns, or none]
```

Saving a scoped working artifact is part of an authorized refinement task. Preserve existing work. For optional directory setup, keep cwd at the target project root and invoke `bash /absolute/installed-pack/skills/e6-idea-refine/scripts/idea-refine.sh`, resolving the installed path first. The helper writes the current project's `docs/ideas/`; ordinary file tools also suffice.

For ideation-only or non-engineering work, return the one-pager and experiment. For an authorized build, hand the chosen direction to the coordinator for `e6-spec-driven-development`; do not ask whether to continue.

## Common Rationalizations

| Excuse | Reality |
|---|---|
| "More ideas mean better ideation" | Distinct alternatives matter; shallow volume wastes attention. |
| "The architecture can wait" | Existing boundaries change which options are feasible. |
| "The user nodded, so demand is proven" | A named experiment and observable result validate the bet. |
| "I need permission to save the idea" | A working artifact belongs to the authorized task. |

## Red Flags

- Variations produced before reading relevant project context.
- Missing target user or success measure.
- Untested assumptions presented as facts.
- Expanding a settled implementation request into new ideation.
- A one-pager with no MVP, non-goals, or experiment result threshold.

## Verification

- [ ] Relevant intent and project facts grounded the session.
- [ ] Distinct directions were explored when uncertainty warranted them.
- [ ] The chosen direction names user value, scope, non-goals, and observable success.
- [ ] Risky assumptions have a bounded validation method and pass/fail result.
- [ ] The one-pager is saved or returned in the requested form.
- [ ] Explicit ideation scope stayed bounded; an authorized build advanced.

## Workflow Handoff

For a standalone engineering task with no active workflow, use `using-e6-agent-skills`. Otherwise update the current phase evidence and return to its coordinator without recursively reloading the router. Follow [the workflow contract](../../references/workflow-contract.md). Use `e6-caveman` for concise user updates and delegation.
