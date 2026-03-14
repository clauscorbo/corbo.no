"""Orchestrator — selective load + dbt.

Usage:
    python run.py
    python run.py --select "gol_fact_election"
    python run.py --select "+gol_fact_name"
    python run.py --select "gol_fact_election" --full-refresh
    python run.py --select "gol_fact_election" --skip-load
    python run.py --select "gol_fact_election" --skip-dbt
"""

import argparse
import json
import subprocess
import sys
import os

REPO_ROOT = os.path.dirname(os.path.abspath(__file__))
DBT_PROJECT_DIR = os.path.join(REPO_ROOT, "dbt", "dbtproject_corbo")
LOAD_DIR = os.path.join(REPO_ROOT, "load")

sys.path.insert(0, LOAD_DIR)


def resolve_required_sources(select: str | None) -> list[str] | None:
    """Return staging table names needed by the selection, or None for all."""
    if select is None:
        return None

    cmd = [
        "dbt", "ls",
        "--project-dir", DBT_PROJECT_DIR,
        "--resource-types", "source",
        "--select", f"+{select}",
        "--output", "json",
        "--quiet",
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"dbt ls failed:\n{result.stderr}", file=sys.stderr)
        sys.exit(1)

    source_tables: list[str] = []
    for line in result.stdout.strip().splitlines():
        if not line.strip():
            continue
        try:
            node = json.loads(line)
        except json.JSONDecodeError:
            continue
        if node.get("resource_type") == "source":
            source_tables.append(node["unique_id"].rsplit(".", 1)[-1])

    return sorted(set(source_tables)) if source_tables else []


def run_load(table_names: list[str] | None, target: str) -> None:
    from run_all import load_tables
    load_tables(table_names=table_names, target=target)


def run_dbt(select: str | None, extra_args: list[str]) -> None:
    cmd = ["dbt", "run", "--project-dir", DBT_PROJECT_DIR]
    if select:
        cmd += ["--select", select]
    cmd += extra_args
    result = subprocess.run(cmd)
    if result.returncode != 0:
        sys.exit(result.returncode)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Selective load + dbt.",
    )
    parser.add_argument("--select", "-s", default=None)
    parser.add_argument(
        "--target", "-t",
        default=os.environ.get("LOAD_TARGET", "prod"),
    )
    parser.add_argument("--skip-load", action="store_true")
    parser.add_argument("--skip-dbt", action="store_true")

    args, extra_dbt_args = parser.parse_known_args()

    if not args.skip_load:
        required_sources = resolve_required_sources(args.select)
        if required_sources is None or len(required_sources) > 0:
            run_load(required_sources, target=args.target)

    if not args.skip_dbt:
        run_dbt(args.select, extra_dbt_args)


if __name__ == "__main__":
    main()
