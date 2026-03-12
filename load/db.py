import os
import psycopg2

# Each environment connects to its own database.
# The staging schema prefix matches the dbt profile's `schema` value.
# For CI/CD targets the prefix is known. For dev, it comes from
# the SCHEMA_PREFIX env var (matching your dbt profile's `schema` field).
DEFAULT_PREFIX_MAP = {
    "ci": "ci",
    "prod": "prod",
}

DB_CONFIG = {
    "host": "ep-falling-hall-a90j0106-pooler.gwc.azure.neon.tech",
    "user": "neondb_owner",
    "port": 5432,
    "sslmode": "require",
}

TARGET_DB_MAP = {
    "dev": "dev",
    "ci": "ci",
    "prod": "prod",
}


def get_schema(target: str = "prod") -> str:
    """Get the staging schema name for the given target.

    For dev, uses SCHEMA_PREFIX env var (should match your dbt profile schema).
    For ci/prod, uses the known prefix.

    Returns e.g. cla_staging, ci_staging, prod_staging.
    """
    if target == "dev":
        prefix = os.environ.get("SCHEMA_PREFIX")
        if not prefix:
            raise ValueError(
                "Set SCHEMA_PREFIX env var to match your dbt profile's schema "
                "(e.g. export SCHEMA_PREFIX=cla)"
            )
    else:
        prefix = DEFAULT_PREFIX_MAP.get(target, target)
    return f"{prefix}_staging"


def get_connection(target: str = "prod") -> psycopg2.extensions.connection:
    """Get a connection to the Neon Postgres database.

    Args:
        target: Which environment to connect to (dev, ci, prod).
    """
    return psycopg2.connect(
        **DB_CONFIG,
        dbname=TARGET_DB_MAP.get(target, "prod"),
        password=os.environ["DBT_PASSWORD"],
    )


def ensure_staging_schema(conn: psycopg2.extensions.connection, target: str = "prod") -> None:
    """Create the staging schema if it doesn't exist."""
    schema = get_schema(target)
    with conn.cursor() as cur:
        cur.execute(f"CREATE SCHEMA IF NOT EXISTS {schema}")
    conn.commit()

