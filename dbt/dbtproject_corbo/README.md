# dbtproject_corbo

dbt project for corbo.no data transforms.

## Layers

| Layer | Schema | Materialization | Purpose |
|-------|--------|-----------------|---------|
| Bronze | `cla_bronze` | view | Raw data, minimal transformation |
| Silver | `cla_silver` | view | Business logic, cleaning, enrichment |
| Gold | `cla_gold` | table | Final tables for consumption |

## Commands

```bash
dbt seed        # load seed CSVs
dbt run         # run all models
dbt test        # run tests
dbt build       # seed + run + test
dbt docs generate && dbt docs serve  # local docs
```
