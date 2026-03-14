# Load

Fetch data from sources, dump into staging. Minimal.

## Structure

```
load/
├── db.py             # Database connection
├── loader.py         # Base DataLoader class
├── run_all.py        # What to load (the orchestrator)
├── requirements.txt
└── sources/          # One file per source type
    └── ssb.py        # SSB (Statistics Norway)
```

## Usage

### Standalone (load all or specific tables)

```bash
export DBT_PASSWORD="your_password"

# Load everything
python load/run_all.py

# Load only specific staging tables
python load/run_all.py stg_ssb_08092 stg_ssb_08219
```

### Orchestrated (recommended — load only what dbt needs)

Use `run.py` from the repo root. It uses `dbt ls` to resolve which
sources a model selection depends on, loads only those, then runs dbt.

```bash
# Run everything (loads all, builds all)
python run.py

# Only load + build election models
python run.py --select "gol_fact_election"

# Include upstream models too
python run.py --select "+gol_fact_name"

# Skip load (staging tables already populated)
python run.py --select "gol_fact_election" --skip-load

# Skip dbt (just load the staging tables these models need)
python run.py --select "gol_fact_election" --skip-dbt
```

## Adding a new table

Add an entry to `LOADER_REGISTRY` in `run_all.py`:

```python
LOADER_REGISTRY = {
    ...
    "stg_ssb_12345": SSBLoader("12345"),  # new
}
```

Tables land in staging as `stg_{source}_{table}`, e.g. `stg_ssb_08092`.

## Adding a new source type

1. Create a file in `sources/` (e.g. `sources/my_api.py`)
2. Subclass `DataLoader`, implement `fetch()` → returns a DataFrame
3. Use it in `run_all.py`
