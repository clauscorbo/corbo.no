"""Main entrypoint — runs all load scripts."""

import sys
import os

# Allow imports from load/ directory
sys.path.insert(0, os.path.dirname(__file__))

from sources.example_api import load_example_data


def main() -> None:
    target = os.environ.get("LOAD_TARGET", "prod")
    print(f"Running loads against target: {target}")

    load_example_data(target)

    print("All loads completed.")


if __name__ == "__main__":
    main()
