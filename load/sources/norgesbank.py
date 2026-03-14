"""Norges Bank source — give it a dataflow + key, it fetches all the data.

The API returns SDMX-JSON where observation values are stored under
positional indices. We resolve the indices to their IDs (the bare
minimum to make the data usable) and dump to staging. No renaming,
no derived columns — that belongs in dbt.
"""

import requests
import pandas as pd
from loader import DataLoader

BASE = "https://data.norges-bank.no/api/data"


class NorgesBankLoader(DataLoader):
    def __init__(self, table: str, flow: str, key: str, last_n: int = 5000):
        self.source = "nb"
        self.table = table
        self.flow = flow
        self.key = key
        self.last_n = last_n

    def _build_url(self) -> str:
        return (
            f"{BASE}/{self.flow}/{self.key}"
            f"?format=sdmx-json&lastNObservations={self.last_n}&locale=no"
        )

    @staticmethod
    def _parse(payload: dict) -> pd.DataFrame:
        """Flatten SDMX-JSON into a row-per-observation DataFrame.

        Resolves positional indices to their IDs — nothing more.
        """
        ds = payload["data"]["dataSets"][0]
        structure = payload["data"]["structure"]

        series_dims = structure["dimensions"]["series"]
        obs_dims = structure["dimensions"]["observation"]

        rows: list[dict] = []
        for series_key, series_obj in ds["series"].items():
            key_indices = [int(k) for k in series_key.split(":")]

            dim_vals: dict[str, str] = {}
            for i, idx in enumerate(key_indices):
                dim = series_dims[i]
                dim_vals[dim["id"]] = dim["values"][idx]["id"]

            for obs_key, obs_val in series_obj["observations"].items():
                row = {**dim_vals}
                obs_idx = int(obs_key)
                for dim in obs_dims:
                    if obs_idx < len(dim["values"]):
                        row[dim["id"]] = dim["values"][obs_idx]["id"]
                row["OBS_VALUE"] = obs_val[0] if obs_val else None
                rows.append(row)

        return pd.DataFrame(rows)

    def fetch(self) -> pd.DataFrame:
        resp = requests.get(self._build_url())
        resp.raise_for_status()
        return self._parse(resp.json())
