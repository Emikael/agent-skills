# Using e6-agent-skills with Cursor

## Whole workflow

Install the complete pack and select `using-e6-agent-skills` as the coordinator for engineering requests. Add the compact [workflow bootstrap](../references/workflow-bootstrap.md) to this host's project instruction surface, with the installed pack path; keep skill bodies on demand. See [activation](workflow-activation.md). Use `e6-caveman` for concise output. The coordinator continues through context, criteria, tests, local runtime, review, and handoff within existing authorization; single-phase requests remain bounded. Native discovery alone does not prove full-workflow execution.


How to wire [e6-agent-skills](../README.md) into **Cursor** using current, supported project context — not legacy monolith files or Kaizen-specific layouts.

---

## What Cursor supports today

Cursor combines **rules** (short policies) and **skills** (full workflows):

| Layer | Path | Role |
|-------|------|------|
| **Project rules** | `.cursor/rules/*.mdc` | Always-on or file-scoped instructions (`alwaysApply`, `globs`) |
| **Project skills** | `.cursor/skills/<skill-name>/SKILL.md` | Agent-discovered workflows; read when the task matches the skill `description` |
| **User rules** | Cursor Settings → Rules | Account-wide policies |
| **User skills** (optional) | `~/.cursor/skills/` | Global skills available in every workspace |

Docs: [Rules](https://docs.cursor.com/context/rules) · [Skills](https://docs.cursor.com/context/skills) (URLs may redirect as Cursor updates docs).

### Rules vs skills

- **Rules** — concise, stable (“use conventional commits”, “type-annotate public Python APIs”). Prefer one concern per file; avoid large pasted guides.
- **Skills** — step-by-step processes from this repo (`e6-test-driven-development`, `e6-code-review-and-quality`, etc.). **Do not** copy entire `SKILL.md` bodies into rules; that duplicates `.cursor/skills/` and wastes context.

### Legacy (avoid for new setups)

| Legacy | Prefer |
|--------|--------|
| Root `.cursorrules` | `.cursor/rules/*.mdc` |
| Copying `SKILL.md` → `.cursor/rules/` | `.cursor/skills/<name>/SKILL.md` |
| “Load 10 skills as always-on rules” | 1–2 thin `alwaysApply` rules + skills on demand |

---

## Recommended project layout

```text
your-project/
├── .cursor/
│   ├── rules/                    # Short .mdc policies (yours)
│   │   └── e6-agent-skills.mdc      # Optional: “use project skills” pointer
│   └── skills/                   # What Cursor Agent loads
│       ├── using-e6-agent-skills/
│       ├── e6-test-driven-development/
│       ├── e6-code-review-and-quality/
│       └── …                     # Synced from e6-agent-skills + your own skills
└── e6-agent-skills/                 # Optional: git submodule or vendor clone
    └── skills/                   # Upstream source only
```

**Source of truth for the agent:** `.cursor/skills/`.  
Treat `e6-agent-skills/skills/` (or a cloned [Emikael/e6-agent-skills](https://github.com/Emikael/e6-agent-skills)) as **upstream** — sync into `.cursor/skills/`, do not edit only upstream and expect Cursor to see it.

---

## Setup (any repository)

### 1. Install skills into `.cursor/skills/`

**From a local clone of e6-agent-skills** (at project root or elsewhere):

```bash
mkdir -p .cursor/skills
rsync -a /path/to/e6-agent-skills/skills/ .cursor/skills/
```

**First-time copy without overwriting your custom skills:**

```bash
rsync -a --ignore-existing /path/to/e6-agent-skills/skills/ .cursor/skills/
```

**After upstream updates:**

```bash
rsync -a /path/to/e6-agent-skills/skills/ .cursor/skills/
```

Each skill folder must contain `SKILL.md` with YAML frontmatter, at minimum:

```yaml
---
name: e6-test-driven-development
description: Drives development with tests. Use when implementing logic, fixing bugs, or changing behavior.
---
```

Cursor uses `description` (and related metadata) to decide when to apply a skill.

### 2. Add minimal project rules (optional but useful)

Create `.cursor/rules/e6-agent-skills.mdc`:

```markdown
---
description: Use e6-agent-skills workflows from .cursor/skills
alwaysApply: true
---

Before non-trivial technical work:

1. Route via `.cursor/skills/using-e6-agent-skills/SKILL.md`.
2. Read and follow the matching skill under `.cursor/skills/<name>/SKILL.md`.
3. Open `reference.md` in that folder when the skill links to it.
4. Prefer project skills over guessing; user does not need to say "read skill" each time.
```

Add **separate** `.mdc` files for repo-specific standards (style, language, stack), keeping each file focused.

**Rule file format:**

```markdown
---
description: Shown in Cursor rule UI
alwaysApply: false
globs: "**/*.{ts,tsx}"
---

# Your rule content
```

| Field | Use |
|-------|-----|
| `alwaysApply: true` | Every chat in this project |
| `globs` | When matching files are in context |
| `alwaysApply: false` + no globs | Agent-request / manual rule (Cursor UI) |

### 3. User-level skills (optional)

Copy or install skills you want everywhere under `~/.cursor/skills/`. Use for stack-wide guides (e.g. language patterns) that are not part of e6-agent-skills.

Project skills in `.cursor/skills/` take precedence for **this** repo’s workflows.

### 4. Verify

1. **Settings → Rules** — project `.mdc` files listed.
2. **Agent chat** — skills from `.cursor/skills/` appear in the skill list (if your Cursor build exposes it).
3. Run a task that maps to a skill (e.g. “add a feature with tests first”) without naming the file — agent should open `e6-test-driven-development` when routing works.

---

## How agents should use skills

1. **Discover** — `using-e6-agent-skills` maps task phase → skill name.
2. **Read** — full process in `.cursor/skills/<name>/SKILL.md`.
3. **Deep dive** — `reference.md`, `references/*.md`, or linked checklists when the skill says so.
4. **Combine** — e.g. `e6-incremental-implementation` + `e6-api-and-interface-design` for an API slice.

Explicit user phrases (“follow TDD”, “use e6-code-review-and-quality”) still help if the agent drifts.

### Phase → skill (quick map)

| You are… | Skill |
|----------|--------|
| Clarifying requirements | `e6-interview-me`, `e6-idea-refine`, `e6-spec-driven-development` |
| Planning tasks | `e6-planning-and-task-breakdown` |
| Implementing | `e6-incremental-implementation`, `e6-frontend-ui-engineering`, `e6-api-and-interface-design` |
| Testing | `e6-test-driven-development`, `e6-browser-testing-with-devtools` |
| Debugging | `e6-debugging-and-error-recovery` |
| Reviewing | `e6-code-review-and-quality`, `e6-code-simplification` |
| Security / performance | `e6-security-and-hardening`, `e6-performance-optimization` |
| Git / CI / ship | `e6-git-workflow-and-versioning`, `e6-ci-cd-and-automation`, `e6-shipping-and-launch` |

Full tree: `skills/using-e6-agent-skills/SKILL.md` in the repo.

---

## What not to do

| Avoid | Do instead |
|-------|------------|
| Paste all skills into one rule | Sync to `.cursor/skills/` |
| Maintain two diverging copies | `rsync` from upstream; commit `.cursor/skills/` |
| Many `alwaysApply: true` rules | One routing rule + focused globs rules |
| Rely on `.cursorrules` only | Migrate to `.mdc` + skills |
| Expect `e6-agent-skills/agents/*.md` to auto-load | Paste in chat, or distill a short rule |

---

## Context tips

- Keep **always-on** rules small (routing + 1–2 non-negotiables).
- Let **skills** carry long checklists and rationalization tables.
- Add phase-specific **globs** rules only when needed (e.g. `**/*.py`, `**/components/**`).
- Nudge by skill name if verification steps are skipped.

---

## `agents/` directory

Files under `e6-agent-skills/agents/` (e.g. code reviewer persona) are **not** loaded automatically by Cursor. Options:

- Reference the skill equivalent (`e6-code-review-and-quality`).
- Paste agent markdown into the chat for one review.
- Extract a **short** checklist into a `.mdc` rule.

---

## Troubleshooting

| Symptom | Check |
|---------|--------|
| Skill never used | `SKILL.md` under `.cursor/skills/<name>/`? Valid frontmatter `description`? |
| Rules ignored | Extension `.mdc`? Correct `alwaysApply` / `globs`? |
| Stale workflow | Re-`rsync` from `e6-agent-skills/skills/` |
| Duplicate instructions | Remove skill content from rules; keep one source |
| Wrong skill picked | Narrow `description` in custom skills; nudge in chat |

---

## Checklist (new project)

- [ ] `mkdir -p .cursor/skills` and sync from `e6-agent-skills/skills/`
- [ ] Optional: `.cursor/rules/e6-agent-skills.mdc` with routing hint
- [ ] Add repo-specific rules as separate small `.mdc` files
- [ ] Commit `.cursor/skills/` and `.cursor/rules/` (team shares behavior)
- [ ] Skip giant `.cursorrules` unless required by legacy tooling

---

## See also

- [getting-started.md](getting-started.md)
- [../README.md](../README.md) — Cursor quick blurb
- Upstream: [github.com/Emikael/e6-agent-skills](https://github.com/Emikael/e6-agent-skills)
