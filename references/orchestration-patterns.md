# Orchestration Patterns

Use one workflow coordinator. `using-e6-agent-skills` advances applicable phases in the current session; commands specify scope, personas supply viewpoints, and workers return evidence. Existing authorization persists. See [workflow contract](workflow-contract.md).

## Choose a Pattern

| Work | Pattern | Evidence returned |
|---|---|---|
| Small or dependent task | Coordinator performs steps directly | Acceptance/check/runtime outcomes |
| Independent read-heavy investigations | Scoped parallel workers | Decisive findings and source pointers |
| Independent edits with settled contracts | Disjoint worker paths; coordinator integrates | Changed paths, criteria, checks, blockers |
| Material uncertain decision | Bounded independent review via doubt skill | Violated contract and counter-evidence |
| Release readiness with distinct risks | Targeted specialist passes; parallel only when independent | Candidate-bound findings and readiness evidence |

A sequential lifecycle is valid inside the coordinator. It does not need a separate agent for every phase or a user command at each handoff. Plan/spec/review-only requests remain bounded. The coordinator continues implementation requests through actual verification and review.

## Worker Contract

Use `e6-caveman` and `e6-context-engineering`. Target 500 words of input and 200 words of output. Preserve correctness-critical contracts; explain overruns rather than silently dropping them.

Input: goal, acceptance IDs/scenarios, owned writable paths, read-only source/diff/reference pointers, constraints, dependencies, real commands/cwd, deliverable. Prefer fresh context if supported. Do not repeat full history or copy full specs.

Output: status, path:line evidence, commands actually run/outcomes, blockers, artifact pointer. A worker reports results; the coordinator decides next steps and verifies integrated behavior. Detailed logs belong in artifacts.

One owner per writable path. Shared contracts, fixtures, migrations, and integrated verification need coordination before parallel writes. Workers do not spawn other workers by default. Bound retries and review loops by concrete unresolved issues; routine tasks need no fan-out.

## Host Adaptation

Use the harness's actual delegation tools. If workers are unavailable, perform appropriate passes sequentially and say so. Do not narrate fictitious parallel execution. Host restrictions on nested agents, teams, tools, and permissions still apply.

Claude Code can expose plugin personas through its Agent tool. Agent Teams may support peer discussion for competing hypotheses where available. Neither mechanism is a prerequisite for the portable skills. Use teams only when interaction changes the result; independent reports usually need only workers plus one synthesis step.

## Avoid

- A router worker that only paraphrases another worker.
- Full-history forks for small scoped tasks.
- One implementation worker per trivial edit or a forced three-reviewer audit.
- Overlapping writes or unowned integration work.
- Persona chains, nested coordinator trees, or repeated approval gates.
- Declaring success from worker claims without checking the diff/runtime.
- Treating disagreement as resolved by a vote rather than evidence.
- Inventing model choices, cost savings, parallel execution, or unavailable tools.
