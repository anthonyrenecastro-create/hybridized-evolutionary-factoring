from __future__ import annotations

import statistics


def summarize_times(values: list[float]) -> dict:
    if not values:
        return {'median': 0.0, 'mean': 0.0, 'stdev': 0.0, 'p50': 0.0, 'p90': 0.0, 'p95': 0.0, 'min': 0.0, 'max': 0.0}

    values = sorted(values)
    n = len(values)

    def percentile(p):
        idx = max(0, min(n - 1, int(round(p * (n - 1)))))
        return values[idx]

    return {
        'median': statistics.median(values),
        'mean': statistics.fmean(values),
        'stdev': statistics.pstdev(values) if n > 1 else 0.0,
        'p50': percentile(0.50),
        'p90': percentile(0.90),
        'p95': percentile(0.95),
        'min': min(values),
        'max': max(values),
    }
