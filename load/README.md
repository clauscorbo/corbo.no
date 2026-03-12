# Load

Extract & Load scripts for the corbo.no data platform.

## Structure

```
load/
├── db.py                 # Shared database connection helper
├── run_all.py            # Entrypoint — runs all load scripts
├── requirements.txt      # Python dependencies
└── sources/              # One script per data source
    └── example_api.py    # Example: loads from JSONPlaceholder API
```

## Usage

```bash
# Set your database password
export DBT_PASSWORD="your_password"

# Run all loads
python load/run_all.py

# Or run a single source
python load/sources/example_api.py
```

## Adding a new source

1. Create a new file in `sources/` (e.g. `sources/weather_api.py`)
2. Use `db.get_connection()` from `db.py` for the database connection
3. Load data into `raw.*` tables
4. Import and call it from `run_all.py`
5. Create a corresponding dbt source + bronze model in `dbt/`
