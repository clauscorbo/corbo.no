"""SSB source — give it a table ID, it fetches the data."""

import pandas as pd
from pyjstat import pyjstat
from loader import DataLoader


class SSBLoader(DataLoader):
    """Loads any SSB table. Just pass the table ID."""

    def __init__(self, table_id: str):
        self.source = "ssb"
        self.table = table_id
        self.url = f"https://data.ssb.no/api/pxwebapi/v2/tables/{table_id}/data"

    def fetch(self) -> pd.DataFrame:
        return pyjstat.Dataset.read(self.url).write("dataframe")

