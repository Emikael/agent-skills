---
name: e6-interview-me
description: Use when an ask is underspecified, requirements are fuzzy, or the underlying intent is unclear before a plan, spec, or code exists. Use when the user says "interview me", "grill me", "ask me one question at a time", "are we sure?", or "stress-test my thinking", or when conflicting goals would change the requested feature.
---

# Interview Me

## Overview

Find the user's actual outcome before selecting a solution. Ask one focused question at a time when a material unknown remains. Existing answers and delegated choices count.

## When to Use

- The actor, desired outcome, observable success, or binding constraint is unclear.
- Two plausible interpretations would produce different behavior or scope.
- The user explicitly requests an interview or intent check.

Skip pure information requests and mechanical edits. A missing field alone is not a reason to interview when the task or project already answers it.

## Process

### 1. Read before asking

Follow `e6-context-engineering`. Read the current request, prior decisions in this task, the active intent/spec, and relevant project rules or code pointers. Search only the area needed to resolve the ask. Do not read the entire repo or sibling conversations.

State a tentative hypothesis in one sentence. Name what is known and the material uncertainty. A confidence estimate can help, but predicting three hypothetical answers is not evidence of agreement.

```text
HYPOTHESIS: You need a personal list of running experiments.
UNCERTAIN: Which source owns experiment status and what makes a result useful?
```

### 2. Ask the next useful question

Ask one question whose answer changes the outcome, acceptance, or constraint. Attach an honest tentative guess or concrete options when they make answering easier. Wait for the answer before choosing the next question. Never invent a wrong guess to provoke a reaction.

Probe vague goals such as "scalable" or "modern": what observable result matters? If the user describes convention rather than a need, ask what they would want without having to justify it.

Accept explicit delegation such as "choose the simplest option". Make a reversible choice within that authority and record it. Ask again only if the remaining choice changes material product behavior, money, permissions, or stored data.

### 3. Restate the intent

Use the user's language. Keep the statement short:

```text
Outcome: <result>
User: <actor or beneficiary>
Why now: <known reason, or not relevant>
Success: <observable evidence>
Constraint: <binding limit>
Out of scope: <specific non-goals>
Open decision: <material unknown, or none>
```

Clear confirmation includes "yes", "sounds good", or "sure, build it" when it refers to this concrete statement. Prior authorization and clear delegation also count. Silence does not settle a material unknown. Fold corrections into the intent; do not demand a specific word.

Stop interviewing once the intent is sufficient to define acceptance and unresolved decisions are explicit. If answers keep changing the frame, explain the contradiction in one sentence and ask the question that resolves it. Do not grind through an arbitrary confidence target.

### 4. Persist and hand off

Use the project's existing intent location; otherwise `docs/intent/[topic].md` for engineering work that needs a durable record. Save within the authorized task. For an interview-only request, return the statement and stop. For a request to build, continue through the coordinator with `e6-idea-refine` when options remain or `e6-spec-driven-development` when scope is concrete.

In non-interactive work, use existing facts and authorized defaults. Record unresolved material decisions as blockers; continue independent authorized work. Do not simulate a user's confirmation.

## Common Rationalizations

| Excuse | Reality |
|---|---|
| "I can infer the missing policy" | A material product decision needs evidence or user direction. |
| "They must literally say yes" | Clear confirmation and delegated authority settle routine choices. |
| "An interview means no tools" | Read project facts before spending a question. |
| "Now I should offer to continue" | A build request already authorizes downstream work. |

## Red Flags

- Asking for facts present in the active spec or project.
- Batching dependent questions or knowingly leading with a false guess.
- Treating arbitrary confidence as a completion gate.
- Starting a spec while a material product decision remains unresolved.
- Stopping an authorized build because the interview finished.

## Verification

- [ ] Relevant existing intent and project facts were read first.
- [ ] Only unresolved material questions were asked, one at a time.
- [ ] Outcome, user, observable success, constraints, and non-goals are recorded.
- [ ] Confirmation or delegated authority is clear; remaining uncertainty is explicit.
- [ ] Interview-only scope stayed bounded; authorized engineering work advanced.

## Workflow Handoff

For a standalone engineering task with no active workflow, use `using-e6-agent-skills`. Otherwise update the current phase evidence and return to its coordinator without recursively reloading the router. Follow [the workflow contract](../../references/workflow-contract.md). Use `e6-caveman` for concise user updates and delegation.
