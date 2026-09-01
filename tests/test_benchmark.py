from factoring.engine.factorEngine import FactorEngine
from factoring.benchmark.benchmarkRunner import benchmark_numbers


def test_small_benchmark_summary():
    numbers = [15, 21, 35, 77, 91]
    engine = FactorEngine(seed=13)
    summary = benchmark_numbers(numbers, engine=engine, runs_per_number=2, methods=['rho_baseline', 'hef_only'])
    assert summary['sample_size'] == len(numbers) * 2
    assert 'results' in summary
    assert 'summary' in summary
    assert summary['summary']['success_rate'] >= 0.0
