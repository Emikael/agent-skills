# Project Rules

Dependency-free Node.js service. CommonJS modules; Node's built-in test runner.
Run commands from this directory. Tests: `node --test`. Local app: `node server.js`.
Use `PORT=0` for an available local port; startup prints its URL.
Keep API error shape `{ "error": { "code": "...", "message": "..." } }`.
Preserve record order. Do not add dependencies. No commits, pushes, or deployment.
