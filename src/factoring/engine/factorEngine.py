from __future__ import annotations

import json
import math
import time
from dataclasses import dataclass, field
from random import Random

from factoring.hef.evolution import evolve_population
from factoring.hef.population import Population
from factoring.math.gcd import gcd
from factoring.math.modular import mod_pow
from factoring.math.primality import is_probable_prime
from factoring.rho.pollardRho import rho_baseline, rho_hef_guided


@dataclass
class RunResult:
    N: int
    method: str
    seed: int | None
    success: bool
    factor1: int | None = None
    factor2: int | None = None
    elapsed_ms: float = 0.0
    rho_iterations: int = 0
    hef_evaluations: int = 0
    hef_generations: int = 0
    gcd_calls: int = 0
    modular_exponentiations: int = 0
    restarts: int = 0
    winner: str | None = None
    config: dict = field(default_factory=dict)
    error: str | None = None

    def as_json(self) -> dict:
        return {
            'N': str(self.N),
            'method': self.method,
            'seed': self.seed,
            'success': self.success,
            'factor1': str(self.factor1) if self.factor1 is not None else None,
            'factor2': str(self.factor2) if self.factor2 is not None else None,
            'elapsedMs': self.elapsed_ms,
            'rhoIterations': self.rho_iterations,
            'hefEvaluations': self.hef_evaluations,
            'hefGenerations': self.hef_generations,
            'gcdCalls': self.gcd_calls,
            'modularExponentiations': self.modular_exponentiations,
            'restarts': self.restarts,
            'winner': self.winner,
            'config': self.config,
            'error': self.error,
        }


def validate_factor_pair(N: int, p: int | None, q: int | None) -> bool:
    if N <= 1 or p is None or q is None:
        return False
    if p <= 1 or q <= 1:
        return False
    if p >= N or q >= N:
        return False
    if N % p != 0 or N % q != 0:
        return False
    if p * q != N:
        return False
    return True


class FactorEngine:
    def __init__(self, seed: int = 0, population_size: int = 24, parent_count: int = 6, offspring_count: int = 18):
        self.seed = seed
        self.population_size = population_size
        self.parent_count = parent_count
        self.offspring_count = offspring_count
        self.rng = Random(seed)

    def _run_hef_only(self, N: int, seed: int | None = None) -> tuple[int | None, dict]:
        rng = Random(seed if seed is not None else self.seed)
        population = Population(size=self.population_size, rng=rng)
        population.initialize(N)
        result = evolve_population(N, population, max_generations=30, mutation_rate=0.25, seed=seed)
        best = result['best_genome']
        candidates = result['factor_candidates']
        if not candidates:
            return None, {'iterations': result['generations'], 'method': 'hef_only', 'best': best.to_dict() if best else None, 'evaluations': self.population_size * 30}
        factor = candidates[0]
        return factor, {'iterations': result['generations'], 'method': 'hef_only', 'best': best.to_dict() if best else None, 'evaluations': self.population_size * 30}

    def _run_baseline_rho(self, N: int, seed: int | None = None) -> tuple[int | None, dict]:
        factor, meta = rho_baseline(N, seed=seed if seed is not None else self.seed, max_iterations=1_000_000)
        return factor, meta

    def _run_hef_guided_rho(self, N: int, seed: int | None = None) -> tuple[int | None, dict]:
        rng = Random(seed if seed is not None else self.seed)
        population = Population(size=self.population_size, rng=rng)
        population.initialize(N)
        evolved = evolve_population(N, population, max_generations=10, mutation_rate=0.2, seed=seed)
        best = evolved['best_genome']
        guidance = {'base_a': best.base_a if best else rng.randint(2, N - 2), 'period_r': best.period_r if best else 2, 'c': (best.base_a + best.period_r) % max(2, N - 1)}
        factor, meta = rho_hef_guided(N, seed=seed if seed is not None else self.seed, guidance=guidance, max_iterations=1_000_000)
        meta['best'] = best.to_dict() if best else None
        return factor, meta

    def factorize(self, N: int, mode: str = 'hybrid', seed: int | None = None) -> dict:
        if N <= 1:
            raise ValueError('N must be greater than 1')

        start = time.perf_counter()
        result = None
        method = mode

        if mode == 'hef_only':
            factor, meta = self._run_hef_only(N, seed)
            result = {'success': factor is not None and validate_factor_pair(N, factor, N // factor), 'factor1': factor, 'factor2': N // factor if factor else None, 'method': 'hef_only', 'meta': meta}
        elif mode == 'rho_baseline':
            factor, meta = self._run_baseline_rho(N, seed)
            result = {'success': factor is not None and validate_factor_pair(N, factor, N // factor), 'factor1': factor, 'factor2': N // factor if factor else None, 'method': 'rho_baseline', 'meta': meta}
        elif mode == 'hef_guided_rho':
            factor, meta = self._run_hef_guided_rho(N, seed)
            result = {'success': factor is not None and validate_factor_pair(N, factor, N // factor), 'factor1': factor, 'factor2': N // factor if factor else None, 'method': 'hef_guided_rho', 'meta': meta}
        elif mode == 'hybrid':
            candidates = [
                ('rho_baseline', self._run_baseline_rho),
                ('hef_only', self._run_hef_only),
                ('hef_guided_rho', self._run_hef_guided_rho),
            ]
            winner = None
            winner_meta = {}
            best_factor = None
            for name, fn in candidates:
                factor, meta = fn(N, seed=seed if seed is not None else self.seed)
                if factor is not None and validate_factor_pair(N, factor, N // factor):
                    winner = name
                    winner_meta = meta
                    best_factor = factor
                    break
            if winner is None:
                result = {'success': False, 'factor1': None, 'factor2': None, 'method': 'hybrid', 'meta': {'winner': None, 'candidates': {k: v for k, _ in candidates}}}
            else:
                result = {'success': True, 'factor1': best_factor, 'factor2': N // best_factor, 'method': 'hybrid', 'meta': {'winner': winner, **winner_meta}}
        else:
            raise ValueError(f'Unknown mode: {mode}')

        elapsed_ms = (time.perf_counter() - start) * 1000
        result['elapsed_ms'] = elapsed_ms
        result['seed'] = seed if seed is not None else self.seed
        result['N'] = N
        return result

    def export_json(self, result: dict) -> str:
        return json.dumps({'N': str(result['N']), 'method': result['method'], 'seed': result.get('seed'), 'success': result['success'], 'factor1': result.get('factor1'), 'factor2': result.get('factor2'), 'elapsedMs': result.get('elapsed_ms'), 'meta': result.get('meta', {})}, indent=2)
