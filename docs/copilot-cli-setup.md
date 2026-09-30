# Using e6-agent-skills with GitHub Copilot CLI

The standalone `copilot` command-line tool installs this repository as a plugin and discovers every skill in `skills/`. For Copilot inside VS Code, see [copilot-setup.md](copilot-setup.md) instead — the setup and the invocation model are different.

## Install

**From this repository's marketplace** — register it, then install from it. `e6-agent-skills` is the marketplace name this repository declares, not a GitHub-wide registry, and the name only resolves after the `marketplace add`:

```bash
copilot plugin marketplace add Emikael/e6-agent-skills
copilot plugin install e6-agent-skills@e6-agent-skills
```

**Directly from the repository**, without registering a marketplace:

```bash
copilot plugin install Emikael/e6-agent-skills
```

**From a local clone**, for a session-scoped development install:

```bash
git clone https://github.com/Emikael/e6-agent-skills.git
copilot --plugin-dir /path/to/e6-agent-skills
```

`--plugin-dir` loads the plugin for that session only and installs nothing persistently — use it while editing skills.

## Verify

```bash
copilot plugin list   # e6-agent-skills@e6-agent-skills
copilot skill list    # the plugin's skills, alongside the built-in ones
```

In an interactive session, `/skills list` shows the same catalog.

## What you get, and what you don't

The root `plugin.json` is the manifest Copilot CLI reads — it takes precedence over `.claude-plugin/plugin.json`, which belongs to Claude Code. That root manifest declares only a name, version and description, so component paths fall back to their defaults:

- **Skills — available.** With no explicit path, the CLI uses the conventional `skills/` directory, and the skills are discovered there.
- **Lifecycle commands — not available.** The root manifest has no `commands` field, so nothing registers `/spec`, `/plan`, `/build`, `/test`, `/review` or `/ship`. Those files live in `.claude/commands/` and are Claude Code commands.

For manifest precedence and the per-component path defaults, see the [CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference) and [Creating plugins](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-creating).

## Usage

Name the skill you want, or describe the task and let the agent route to it:

> Use the e6-spec-driven-development skill to write a spec for [the feature].

> Use the e6-test-driven-development skill: write a failing test for this bug first, then fix it.

> Use the e6-code-review-and-quality skill to review my staged changes.

## Troubleshooting

| Symptom | What to check |
|---------|---------------|
| `plugin install` can't resolve `e6-agent-skills@e6-agent-skills` | Run `copilot plugin marketplace add Emikael/e6-agent-skills` first — that name only resolves once the marketplace is registered. Or install the repository directly. |
| Plugin installed but no skills | `copilot plugin list` to confirm the plugin, then `copilot skill list` (or `/skills list` in session) to see what was discovered. |
| `/spec`, `/build` and friends are not found | Expected, not a broken install: the root manifest registers no commands. Ask for the skill by name instead. |
| Skills changed locally but the CLI shows the old copy | Start a fresh session, or run with `--plugin-dir` pointing at your clone. |
