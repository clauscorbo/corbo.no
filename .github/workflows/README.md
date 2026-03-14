# CI/CD Workflows

Overview of all GitHub Actions workflows for **corbo.no**.

## Workflows

### [`ci-gateway.yml`](ci-gateway.yml) — CI Gateway

| | |
|---|---|
| **Trigger** | Pull request → `prod` |
| **Purpose** | Entry point for all CI checks on PRs |

Runs common checks on every PR, then conditionally triggers specialized CI based on what changed:

- **Common checks** (always): YAML lint, secret detection (TruffleHog)
- **Path detection**: uses `dorny/paths-filter` to determine which areas changed
- **dbt CI**: triggered only if `dbt/**` or `load/**` files changed (calls `dbt-ci.yml`)

### [`dbt-ci.yml`](dbt-ci.yml) — dbt CI (slim)

| | |
|---|---|
| **Trigger** | Called by `ci-gateway.yml` (`workflow_call`) |
| **Purpose** | Validate dbt model changes against prod baseline |

Runs a slim dbt build on the CI database:

1. Loads data into the `ci` database
2. Compiles the `prod` branch as baseline state
3. Runs `dbt build --select state:modified+` to test only changed models

### [`dbt-cd.yml`](dbt-cd.yml) — dbt CD (slim)

| | |
|---|---|
| **Trigger** | Push to `prod` (paths: `dbt/**`, `load/**`) |
| **Purpose** | Deploy changed dbt models to production |

Runs after a PR is merged to `prod` — only if dbt or load files changed:

1. Loads data into the `prod` database
2. Compiles the previous prod commit as baseline state
3. Runs `dbt build --select state:modified+` to deploy only changed models

### [`daily-load.yml`](daily-load.yml) — Daily Data Load

| | |
|---|---|
| **Trigger** | Scheduled daily at 06:00 UTC / manual dispatch |
| **Purpose** | Full daily ELT pipeline + dbt docs update |

Runs the complete extract-load-transform pipeline on production:

1. Runs all load scripts (extract & load from SSB)
2. Runs `dbt build` (full, not slim)
3. Generates dbt docs
4. Opens a PR to `prod` with updated docs via [`peter-evans/create-pull-request`](https://github.com/peter-evans/create-pull-request)

> The PR reuses the branch `chore/update-dbt-docs` — subsequent runs update the same PR if unmerged.

## Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│                   daily-load.yml                    │
│              (schedule / manual trigger)            │
│                                                     │
│   Extract → Load → dbt build → dbt docs generate   │
│                        │                            │
│                   Creates PR to prod                │
└────────────────────────┬────────────────────────────┘
                         │ PR opened
                         ▼
              ┌─────────────────────┐
              │   ci-gateway.yml    │
              │  (PR → prod)        │
              │                     │
              │  • YAML lint        │
              │  • Secret detection │
              │  • Path filter      │
              │      │              │
              │      ▼ (if dbt/**)  │
              │  dbt-ci.yml         │
              └─────────┬──────────┘
                        │ PR merged
                        ▼
              ┌─────────────────────┐
              │    dbt-cd.yml       │
              │ (push to prod,      │
              │  paths: dbt/**)     │
              │                     │
              │  Slim dbt deploy    │
              └─────────────────────┘
```

## Secrets

| Secret | Used by | Description |
|---|---|---|
| `DBT_PASSWORD` | All workflows | Neon PostgreSQL password |

## Branch Protection

The `prod` branch requires changes via pull request. The daily load workflow
creates a PR automatically instead of pushing directly.
