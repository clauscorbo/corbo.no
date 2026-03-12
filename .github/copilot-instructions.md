# Copilot Instructions — corbo.no

## Architecture

ELT data platform on **Neon Postgres** with two independent components:

1. **`load/`** — Python extract-load scripts. Fetch data from external APIs (currently SSB / Statistics Norway) and write raw tables into a `{prefix}_staging` schema.
2. **`dbt/dbtproject_corbo/`** — dbt-core (dbt-postgres) transforms through three layers: **bronze → silver → gold**.

Data flow: `SSB API → load/ → staging schema → dbt bronze (views) → silver (views) → gold (tables)`.

## Schema & Environment Convention

Every environment uses a **schema prefix** that scopes all schemas:

| Target | Prefix | DB name | Schemas created |
|--------|--------|---------|-----------------|
| dev | `$SCHEMA_PREFIX` (e.g. `cla`) | `dev` | `cla_staging`, `cla_bronze`, `cla_silver`, `cla_gold` |
| ci | `ci` | `ci` | `ci_staging`, `ci_bronze`, … |
| prod | `prod` | `prod` | `prod_staging`, `prod_bronze`, … |

The staging schema is derived as `{{ target.schema }}_staging` (see `macros/get_staging_schema.sql` and `models/sources/stg_ssb.yml`). The `load/db.py` module mirrors this logic.

## Adding a New SSB Data Source (end-to-end)

1. **Load** — add `SSBLoader("<table_id>")` to `LOADS` in `load/run_all.py`. Optional: pass `codelists={"VarCode": "codelist_id"}` for custom classifications.
2. **Source** — register the staging table in `models/sources/stg_ssb.yml` as `stg_ssb_<table_id>` with a description.
3. **Bronze model** — create `models/bronze/bro_ssb/bro_ssb_<table_id>.sql`. Follow the existing pattern: CTE from `{{ source('stg_ssb', 'stg_ssb_<id>') }}`, explicitly list columns (quoted lowercase), `SELECT *` at end.
4. **Silver model** — create in `models/silver/sil_ssb_<name>.sql`. Use `{{ ref('bro_ssb_<id>') }}`, add casting, pivoting, and business logic.
5. **Gold model** — create in `models/gold/` when the table is ready for consumption.

## dbt Conventions

- **Naming**: `bro_` prefix for bronze, `sil_` for silver, `gol_` for gold. SSB sources always include the numeric table ID: `bro_ssb_05803`.
- **Materialization**: bronze/silver = `view`, gold = `table` (configured in `dbt_project.yml`).
- **Bronze models** are thin pass-throughs: select explicit columns from the staging source, no transformations.
- **Silver models** do casting, pivoting (wide format via `CASE WHEN` + `GROUP BY`), and renaming to English snake_case.
- **Sources** reference the staging schema dynamically: `{{ target.schema ~ '_staging' }}`.
- Column names from SSB arrive as quoted lowercase English strings (e.g. `"political parties"`, `"every 4th year"`).

## Load Scripts (`load/`)

- `loader.py` — abstract `DataLoader` base class. Subclass it, set `source` and `table`, implement `fetch() → DataFrame`.
- `sources/ssb.py` — `SSBLoader` uses SSB PxWeb API v2. Fetches metadata, builds a query selecting all values (`"*"`), returns a pandas DataFrame via `pyjstat`.
- `db.py` — SQLAlchemy engine factory. Reads `DBT_PASSWORD` env var. Staging schema created automatically.
- Each load does a **full replace** (`DROP TABLE … CASCADE` then `to_sql`).

## CI/CD (GitHub Actions)

- **`ci-gateway.yml`** — PR gateway: YAML lint, secret detection, conditionally triggers dbt CI if `dbt/` or `load/` changed.
- **`dbt-ci.yml`** — slim CI: loads data into `ci` DB, runs `dbt build --select state:modified+` against prod baseline.
- **`dbt-cd.yml`** — on push to `prod`: slim deploy with `state:modified+` against previous prod state.
- **`daily-load.yml`** — scheduled daily at 06:00 UTC: runs full load + `dbt build` on prod.

## Local Development

```bash
# Load scripts
cd load
export DBT_PASSWORD="..." SCHEMA_PREFIX="cla" LOAD_TARGET="dev"
python run_all.py

# dbt
cd dbt/dbtproject_corbo
dbt build          # seed + run + test
dbt run -s <model> # run single model
```

Requires `~/.dbt/profiles.yml` with a `dbtproject_corbo` profile pointing at Neon Postgres (see CI workflows for structure).

## Key Dependencies

- **dbt**: `dbt-postgres` adapter on Python 3.12
- **Load**: `pandas`, `sqlalchemy`, `psycopg2-binary`, `pyjstat`, `requests`
