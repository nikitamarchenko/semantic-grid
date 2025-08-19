# Semantic Grid Monorepo

This repo is organized as a [Turborepo](https://turbo.build/) powered monorepo using [Bun](https://bun.sh/) as the package manager/runtime.  
It contains multiple applications and shared packages.

---

## 📂 Structure

```
.
├── apps/
│   ├── fm-app/              # Flow Manager (FastAPI + Python, managed with uv)
│   ├── db-meta/            # MCP server for database metadata (FastAPI + Python, managed with uv)
│   └── web/                # Frontend (Next.js)
│
├── packages/
│   ├── resources/          # system packs (prompt files, schemas, etc)
│   ├── client-configs/     # client-specific configs (overlays, overrides)
│   ├── eslint-config/      # Shared linting config
│   └── typescript-config/  # Shared TS config
│
├── turbo.json              # Turborepo pipeline configuration
├── package.json            # Root scripts & workspaces
└── README.md
```

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
bun install
```

### 2. Bootstrap apps
Each app defines its own `setup` task. To run setup across the repo:
```bash
bun run setup:fm      # Setup Flow Manager
bun run setup:dbm     # Setup DB-Meta MCP server
```

Or directly:
```bash
cd apps/fm-app && bun run setup
```

### 3. Development
Run all dev servers in parallel:
```bash
bun run dev
```

Run a single app:
```bash
bun run dev --filter fm-app
bun run dev --filter db-meta
bun run dev --filter web
```

### 4. Build
```bash
bun run build
```

---

## 📦 Workflow with Turbo

- **`setup`** → environment setup (sync dependencies, install, migrations, etc)
- **`dev`** → start dev servers (FastAPI, MCP, Next.js)
- **`build`** → build artifacts for all apps
- **`lint`** → run shared linting
- **`test`** → run unit tests
- **`check-types`** → type-check all TS/pyright targets

Turbo pipelines are defined in `turbo.json` at the root,  
and workspaces extend from it via `"extends": ["//"]`.

---

## 🧩 Packs

- **System Pack**: reusable defaults (`resources/:component/system-pack/v1.0.0/...`)
- **Client Configs**: overlays and overrides (`client-configs/:client_id/...`)

These packs provide prompt files, schemas, and overrides for the flow-manager and MCP servers.

---

## 🛠 Requirements

- [Bun v1.2+](https://bun.sh/)
- [Turbo v2.5+](https://turbo.build/)
- [uv](https://docs.astral.sh/uv/) for Python projects

---

## 📖 Notes

- Python projects (e.g., `fm-app`) use [uv](https://docs.astral.sh/uv/) for dependency management.
- MCP servers live under `apps/` like any other app.
- Use **overlays** in `client-configs` to override system packs without modifying defaults.

---

## 🤝 Contributing

1. Fork & clone the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes
4. Push & open a PR

---

## 📜 License

MIT
