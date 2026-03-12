"""Example load script — replace with your actual data source.

Usage:
    python load/sources/example_api.py

Requires DBT_PASSWORD environment variable.
"""

import requests
from db import get_connection, ensure_staging_schema, get_schema


def load_example_data(target: str = "prod") -> None:
    conn = get_connection(target)
    ensure_staging_schema(conn, target)
    schema = get_schema(target)

    with conn.cursor() as cur:
        # Create staging table
        cur.execute(f"""
            CREATE TABLE IF NOT EXISTS {schema}.orders (
                order_id TEXT PRIMARY KEY,
                customer_name TEXT,
                product TEXT,
                quantity INTEGER,
                unit_price NUMERIC,
                order_date DATE,
                status TEXT,
                loaded_at TIMESTAMP DEFAULT NOW()
            )
        """)

        # Fetch data from API
        response = requests.get("https://jsonplaceholder.typicode.com/posts")
        response.raise_for_status()
        data = response.json()

        # Upsert rows (example mapping — replace with real data)
        for row in data:
            cur.execute(f"""
                INSERT INTO {schema}.orders (order_id, customer_name, product, quantity, unit_price, order_date, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (order_id) DO UPDATE SET
                    customer_name = EXCLUDED.customer_name,
                    product = EXCLUDED.product,
                    quantity = EXCLUDED.quantity,
                    unit_price = EXCLUDED.unit_price,
                    order_date = EXCLUDED.order_date,
                    status = EXCLUDED.status,
                    loaded_at = NOW()
            """, (str(row["id"]), f"User {row['userId']}", f"Post {row['id']}", 1, 10.00, "2026-01-01", "completed"))

    conn.commit()
    conn.close()
    print(f"Loaded {len(data)} rows into {schema}.orders")


if __name__ == "__main__":
    load_example_data()
