from __future__ import annotations

from factoring.math.gcd import gcd
from factoring.math.modular import mod_pow, modular_distance


def score_base(a: int, N: int) -> tuple[float, dict[str, float | int]]:
    if N <= 0 or a <= 0:
        raise ValueError('base and N must be positive')

    metrics: dict[str, float | int] = {}
    metrics['gcd_a_n'] = gcd(a, N)
    metrics['a_mod_2'] = a % 2
    metrics['a_mod_3'] = a % 3
    metrics['a_mod_5'] = a % 5
    metrics['a_mod_7'] = a % 7

    small = [2, 3, 5, 7, 11, 13]
    residue_score = 0.0
    for p in small:
        if N % p == 0:
            continue
        residue_score += abs((a % p) - (1 % p))
    metrics['mod_residue_score'] = residue_score

    early_cycle = 0
    mod_items = []
    for k in range(1, 8):
        val = mod_pow(a, k, N)
        mod_items.append(val)
        if val == 1:
            early_cycle += 1
    metrics['early_cycle_hits'] = early_cycle
    metrics['max_early_residue'] = max(mod_items)
    metrics['min_early_residue'] = min(mod_items)

    target = 1
    dist = sum(modular_distance(v, target, N) for v in mod_items)
    metrics['modular_distance_sum'] = dist

    heuristic = 0.0
    heuristic += 1.0 if metrics['gcd_a_n'] == 1 else 0.2
    heuristic += max(0.0, 1.0 - ((dist / max(1, len(mod_items) * N)) ** 0.5))
    heuristic += (7 - early_cycle) * 0.05
    heuristic += max(0.0, 1.0 - (residue_score / max(1.0, sum(1 for _ in small))))

    return heuristic, metrics
