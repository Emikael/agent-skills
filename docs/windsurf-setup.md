# Using e6-agent-skills with Windsurf

Keep a complete clone accessible so the coordinator can read skills, shared
references, and helpers. Native skill discovery and rule locations depend on
your Windsurf version; use its supported project or global instruction surface.

## Project Rule

Add a compact rule, adjusting the installed path:

```markdown
For engineering work, read
/path/to/e6-agent-skills/skills/using-e6-agent-skills/SKILL.md.
Use e6-caveman for concise communication. Load specialists and references
from the complete pack only when needed. Follow applicable phases through
acceptance tests, actual local runtime, review, and handoff within existing
authorization. Respect narrow requests and host/user instructions.
Assigned workers return scoped evidence to the active coordinator.
```

Preserve existing rules. Legacy configurations may use `.windsurfrules`; newer
versions can provide another rule surface. Keep full skill bodies out of
always-loaded rules. The reusable
[workflow bootstrap](../references/workflow-bootstrap.md) supplies the policy;
see [activation](workflow-activation.md) for supported installer hosts.

## Verify

Use an ordinary implementation request. Confirm the agent reads the coordinator,
discovers project commands, maps acceptance to tests, exercises changed local
behavior, and reviews before handoff. Browser/computer checks require available
host tools or existing automation. Report unavailable required checks as
blocked. Skill discovery alone does not prove lifecycle execution.
