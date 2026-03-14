"""Load staging tables.

Usage:
    python run_all.py                              # load all
    python run_all.py stg_ssb_08092 stg_ssb_08219  # load specific
"""

import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from loader import DataLoader
from sources.ssb import SSBLoader
from sources.norgesbank import NorgesBankLoader


LOADER_REGISTRY: dict[str, DataLoader] = {
    # SSB
    "stg_ssb_08092": SSBLoader("08092", codelists={"Region": "vs_ValgdistrikterMedBergen"}),
    "stg_ssb_08219": SSBLoader("08219"),
    "stg_ssb_09624": SSBLoader("09624"),
    "stg_ssb_13555": SSBLoader("13555"),
    "stg_ssb_10211": SSBLoader("10211"),
    "stg_ssb_05813": SSBLoader("05813"),
    "stg_ssb_05803": SSBLoader("05803"),
    "stg_ssb_10467": SSBLoader("10467"),
    "stg_ssb_10501": SSBLoader("10501"),
    # Norges Bank
    "stg_nb_exr": NorgesBankLoader(
        table="exr",
        flow="EXR",
        key="B.USD+EUR+GBP+SEK+DKK+RUB+JPY.NOK.SP",
    ),
    "stg_nb_ir": NorgesBankLoader(
        table="ir",
        flow="IR",
        key="B.KPRA.OL+RR+SD.",
    ),
    "stg_nb_govt_keyfigures": NorgesBankLoader(
        table="govt_keyfigures",
        flow="GOVT_KEYFIGURES",
        key="V_O+N_V+V_I+V_IRS+ATRE+ATRI..B.TBIL+_X+GBON+IRS",
    ),
}


def load_tables(table_names: list[str],target: str = "prod") -> None:
    if table_names is None:
        loaders = list(LOADER_REGISTRY.values())
    else:
        unknown = [t for t in table_names if t not in LOADER_REGISTRY]
        if unknown:
            print(f"Unknown staging tables (skipped): {unknown}")
        loaders = [LOADER_REGISTRY[t] for t in table_names if t in LOADER_REGISTRY]
        print(f"Loading {len(loaders)} of {len(LOADER_REGISTRY)} staging tables.\n")

    for loader in loaders:
        loader.load(target)

    print("\nDone.")


def main() -> None:
    target = os.environ.get("LOAD_TARGET", "prod")
    print(f"Target: {target}")

    # If table names are passed as CLI args, load only those.
    table_names = sys.argv[1:] if len(sys.argv) > 1 else None
    load_tables(table_names=table_names, target=target)


if __name__ == "__main__":
    main()
