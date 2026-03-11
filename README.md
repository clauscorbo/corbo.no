# corbo.no

Monorepo for data infrastructure.

## Stack

- **Database:** Neon Postgres
- **Transforms:** dbt Core (`dbt-postgres`)
- **Orchestration:** GitHub Actions
- **Layers:** bronze → silver → gold

## Structure

```
corbo.no/
├── dbt/                    # dbt project + venv
│   ├── dbtproject_corbo/   # dbt models, seeds, tests
│   └── requirements.txt
└── .github/workflows/      # CI/CD (coming soon)
```

## Getting started

```bash
cd dbt
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd dbtproject_corbo
dbt debug
```
