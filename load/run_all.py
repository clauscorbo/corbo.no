"""Load all tables."""

import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from sources.ssb import SSBLoader


# What to load
LOADS = [
    SSBLoader("08092"),
    SSBLoader("08219"),
]


def main() -> None:
    target = os.environ.get("LOAD_TARGET", "prod")
    print(f"Target: {target}\n")

    for loader in LOADS:
        loader.load(target)

    print("\nDone.")


if __name__ == "__main__":
    main()
