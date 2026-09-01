from __future__ import annotations

import json
from typing import Any


class RunRecorder:
    def __init__(self):
        self.records: list[dict[str, Any]] = []

    def add(self, record: dict[str, Any]) -> None:
        self.records.append(record)

    def export_json(self, path: str) -> str:
        with open(path, 'w', encoding='utf-8') as fh:
            json.dump(self.records, fh, indent=2)
        return path

    def export_csv(self, path: str) -> str:
        import csv

        if not self.records:
            return path
        fieldnames = sorted({k for record in self.records for k in record.keys()})
        with open(path, 'w', newline='', encoding='utf-8') as fh:
            writer = csv.DictWriter(fh, fieldnames=fieldnames)
            writer.writeheader()
            for record in self.records:
                writer.writerow(record)
        return path
