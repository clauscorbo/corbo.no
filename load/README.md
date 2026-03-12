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

```bash
export DBT_PASSWORD="your_password"
python load/run_all.py
```

## Adding a new table

Add a line to `LOADS` in `run_all.py`:

```python
LOADS = [
    SSBLoader("08092"),
    SSBLoader("12345"),  # new
]
```

Tables land in staging as `stg_{source}_{table}`, e.g. `stg_ssb_08092`.

## Adding a new source type

1. Create a file in `sources/` (e.g. `sources/my_api.py`)
2. Subclass `DataLoader`, implement `fetch()` → returns a DataFrame
3. Use it in `run_all.py`
