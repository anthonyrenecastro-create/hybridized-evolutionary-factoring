from __future__ import annotations

import statistics
from collections import defaultdict

from factoring.engine.factorEngine import FactorEngine, validate_factor_pair


def benchmark_numbers(numbers: list[int], engine: FactorEngine | None = None, runs_per_number: int = 20, methods: list[str] | None = None) -> dict:
    engine = engine or FactorEngine(seed=42)
    methods = methods or ['rho_baseline', 'hef_only', 'hybrid', 'hef_guided_rho']
    results = []

    for N in numbers:
        for method in methods:
            for run in range(runs_per_number):
                seed = (N * 1000) + run + engine.seed
                result = engine.factorize(N, mode=method, seed=seed)
                results.append({
                    'N': N,
                    'method': method,
                    'seed': seed,
                    'success': bool(result['success']),
                    'elapsed_ms': float(result.get('elapsed_ms', 0.0)),
                    'factor1': result.get('factor1'),
                    'factor2': result.get('factor2'),
                })

    sample_size = len(numbers) * runs_per_number
    total_success = sum(1 for r in results if r['success'])
    summary = {
        'sample_size': sample_size,
        'success_rate': total_success / max(1, len(results)),
        'results': results,
    }
    method_stats = {}
    for method in methods:
        method_results = [r for r in results if r['method'] == method]
        method_successes = [r for r in method_results if r['success']]
        if not method_results:
            method_stats[method] = {'success_rate': 0.0, 'median_ms': None, 'p90_ms': None}
            continue
        times = [r['elapsed_ms'] for r in method_successes]
        method_stats[method] = {
            'success_rate': len(method_successes) / len(method_results),
            'median_ms': statistics.median(times) if times else None,
            'p90_ms': statistics.quantiles(times, n=10)[8] if len(times) >= 10 else (max(times) if times else None),
            'min_ms': min(times) if times else None,
            'max_ms': max(times) if times else None,
            'wins': len(method_successes),
        }

    summary['summary'] = {
        'success_rate': summary['success_rate'],
        'by_method': method_stats,
    }
    return summary
