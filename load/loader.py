"""Fetch data, dump it into staging. That's it."""

import pandas as pd
from sqlalchemy import text
from db import get_engine, get_schema, ensure_staging_schema


class DataLoader:
    """Base loader. Subclasses set table and implement fetch()."""

    source: str = ""
    table: str = ""

    def fetch(self) -> pd.DataFrame:
        raise NotImplementedError

    def load(self, target: str = "prod") -> None:
        stg_table = f"stg_{self.source}_{self.table}"
        print(f"[{stg_table}] Fetching...")
        df = self.fetch()
        print(f"[{stg_table}] {len(df)} rows.")

        engine = get_engine(target)
        schema = get_schema(target)
        ensure_staging_schema(engine, target)

        with engine.connect() as conn:
            conn.execute(text(f"DROP TABLE IF EXISTS {schema}.{stg_table} CASCADE"))
            conn.commit()

        df.to_sql(stg_table, engine, schema=schema, if_exists="append", index=False)
        print(f"[{stg_table}] Done.")
