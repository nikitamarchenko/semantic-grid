# Templating System: How-To Guide

This document explains how the **prompt templating system** in this monorepo is organized, how files are resolved, and how client-specific overrides are applied.

---

###  Repository Layout

```
.
├── apps/
│   ├── fm-app/              # Flow Manager (FastAPI + Python, managed with uv)
│   ├── db-meta/             # MCP server for database metadata
│   └── web/                 # Frontend (Next.js)
│
├── packages/
│   ├── resources/           # system packs (prompt files, schemas, etc)
│   ├── client-configs/      # client-specific configs (overlays, overrides)
│   ├── eslint-config/       
│   └── typescript-config/   
│
├── turbo.json
├── package.json
└── README.md
```

---

###  System Packs

Located in `packages/resources`, system packs are **baseline prompt definitions** that apply to all clients.

Example structure:

```
packages/resources/system-pack/v1.0.0/
  ├── slots/
  │   ├── planner/
  │   │   ├── prompt.md
  │   │   └── domain.md
  │   ├── validator/
  │   │   └── prompt.md
  │   └── __default/
  │       └── domain.md
  └── schema_descriptions.yaml
```

* **slots/** → logical components (planner, validator, executor, etc).
* **\_\_default/** → fallback definitions (used when slot-specific file is missing).
* **YAML files** → structured resources like query examples, schema descriptions, and prompt instructions.

---

###  Client Configs

Located in `packages/client-configs`, these provide **overlays** that customize or override system packs for a given client and environment.

Example:

```
packages/client-configs/acme/common/db-meta/overlays/
  ├── prompt_instructions.yaml
  ├── query_examples.yaml
  └── slots/
      └── planner/
          └── domain.md
```

* **common/** → baseline overlays for this client.
* **env/** (optional) → environment-specific overlays (e.g., staging, prod).
* **overlays/** → files that are merged into the system pack.

---

### Merging Strategy

We use an RFC 7386–style **JSON Merge Patch** when combining system packs with client overlays:

* **Dictionaries** → merged recursively.
* **Scalars / non-dicts** → replaced.
* **Arrays** → merged by default (`append`).

  * Can be overridden with `strategy: replace` inside the overlay file.
* **Null values** → remove a key.

Example:

```yaml
# system-pack
prompt_instructions:
  - "Use standard SQL dialects"
  - "Be concise"

# client overlay
prompt_instructions:
  strategy: replace
  value:
    - "Use BigQuery SQL"
```

➡ Result:

```yaml
prompt_instructions:
  - "Use BigQuery SQL"
```

---

###  Template Includes

Templates (e.g. `prompt.md`) use **Jinja2** with fallback resolution:

```jinja2
{% set domain_candidates = ["slots/" ~ slot ~ "/domain.md", "slots/__default/domain.md"] %}
{% include domain_candidates ignore missing %}
```

* If `slots/[slot]/domain.md` exists in overlays → it is used.
* Otherwise → fallback to `slots/__default/domain.md`.

This allows shared defaults while still letting clients override specific slots.

---

###  Assembly Function

Effective tree resolution is handled by:

```python
def assemble_effective_tree(profile: str, client: str|None, env: str|None) -> Dict[str, bytes]:
    base = REPO_ROOT / "packages/resources/system-pack/v1.0.0"
    overlays = [
        REPO_ROOT / "packages/client-configs" / client / "common" / "db-meta" / "overlays",
        REPO_ROOT / "packages/client-configs" / client / env / "db-meta" / "overlays",
    ]
    # merge base + overlays with json_merge_patch()
```

---

###  Best Practices

* Put **baseline logic** in `packages/resources/system-pack`.
* Put **client-specific overrides** in `packages/client-configs/[client]/`.
* Use `__default/` to share slot fragments across all slots.
* Use `strategy` inside overlays to control array merging.
* Keep schemas (`schema_descriptions.yaml`) and examples (`query_examples.yaml`) modular.

---

#### With this setup:

* **System pack = foundation** (universal rules, defaults).
* **Client overlays = specialization** (business logic, per-environment tweaks).
* **Jinja + merge patch = flexibility** (fallbacks, custom overrides, strategies).
