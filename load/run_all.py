"""Load all tables."""

import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from sources.ssb import SSBLoader


# What to load
LOADS = [
    SSBLoader("08092", codelists={"Region": "vs_ValgdistrikterMedBergen"}),
    SSBLoader("08219"),
    SSBLoader("09624"),
    SSBLoader("13555"),
    SSBLoader("10211"),
    SSBLoader("05813"),
    SSBLoader("05803"),
    SSBLoader("10467"),
    SSBLoader("10501"),

]


def main() -> None:
    target = os.environ.get("LOAD_TARGET")
    if not target:
        print("Error: LOAD_TARGET env var is required (e.g. dev, ci, prod).")
        sys.exit(1)
    print(f"Target: {target}\n")

    for loader in LOADS:
        loader.load(target)

    print("\nDone.")


if __name__ == "__main__":
    main()
