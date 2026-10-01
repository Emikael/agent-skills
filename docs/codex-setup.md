# Using e6-agent-skills with Codex

This repository is also a [Codex plugin](https://developers.openai.com/codex/plugins/build). The same root-level `skills/` directory used by Claude Code is consumed by Codex, so no files are copied or duplicated.

## Install

```bash
codex plugin marketplace add Emikael/e6-agent-skills
codex plugin add e6-agent-skills@e6-agent-skills
```

> Use a Codex CLI version that supports `codex plugin`; inspect `codex plugin --help` for the installed version. See the [Codex CLI docs](https://developers.openai.com/codex/cli).

The first command registers this repository as the `e6-agent-skills` marketplace. The second command installs and enables the `e6-agent-skills` plugin from that marketplace. Start a new Codex session after installation so the skills are discovered.

Local clones work too:

```bash
codex plugin marketplace add /path/to/your/clone
codex plugin add e6-agent-skills@e6-agent-skills
```

## Usage

After installation, start a new session and select a discovered skill from the host's picker, or describe the task for implicit selection. In the CLI, explicit skill mentions use `$`; plugin skills include the plugin namespace, for example `$e6-agent-skills:using-e6-agent-skills` or `$e6-agent-skills:e6-spec-driven-development`. A standalone skill uses `$<skill-name>`. All 26 skills under `skills/` are available. See the [Codex skills documentation](https://developers.openai.com/codex/skills).

[Codex uses progressive disclosure](https://developers.openai.com/codex/skills): descriptions select skills; bodies load on demand. For the whole lifecycle, install a compact project rule with the [workflow bootstrap installer](workflow-activation.md#codex-opencode-and-gemini). It selects one e6 coordinator and loads specialists only as needed. Keep full skill bodies out of always-on rules.

## How it works

- `.codex-plugin/plugin.json` — Codex plugin manifest at the repo root. Points `skills` at `./skills/` and provides the metadata required by Codex.
- `.agents/plugins/marketplace.json` — marketplace entry declaring the repo root (`./`) as the plugin source.
- `skills/<name>/SKILL.md` — unchanged. Codex and Claude Code share the same `name` + `description` frontmatter format, so one file serves both platforms.

Slash commands in `.claude/commands/` and personas in `agents/` stay Claude Code-specific. Claude Code loads `hooks/hooks.json`; Codex setup uses the project-rule bootstrap instead of assuming Claude hook compatibility. Invoke an underlying skill or describe the desired outcome; the coordinator handles applicable handoffs.
