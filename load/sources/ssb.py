"""SSB source — give it a table ID, it fetches all the data."""

import requests
import pandas as pd
from pyjstat import pyjstat
from loader import DataLoader

BASE = "https://data.ssb.no/api/pxwebapi/v2/tables"


class SSBLoader(DataLoader):
    def __init__(self, table_id: str, codelists: dict[str, str]):
        self.source = "ssb"
        self.table = table_id
        self.codelists = codelists

    def _build_query(self) -> dict:
        meta = requests.get(f"{BASE}/{self.table}/metadata?lang=en").json()
        selection = []
        for var_code in meta["id"]:
            entry = {"variableCode": var_code, "valueCodes": ["*"]}
            if var_code in self.codelists:
                entry["codeList"] = self.codelists[var_code]
            selection.append(entry)
        return {"selection": selection, "outputFormat": "json_stat2"}

    def fetch(self) -> pd.DataFrame:
        url = f"{BASE}/{self.table}/data?lang=en"
        query = self._build_query()
        resp = requests.post(url, json=query)
        resp.raise_for_status()
        return pyjstat.Dataset.read(resp.text).write("dataframe")

