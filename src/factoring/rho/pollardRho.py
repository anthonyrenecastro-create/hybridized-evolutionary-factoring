from __future__ import annotations

import math
import random

from factoring.math.gcd import gcd
from factoring.math.modular import mod_pow


def rho_baseline(N: int, seed: int | None = None, max_iterations: int = 1_000_000) -> tuple[int | None, dict]:
    if N % 2 == 0:
        return 2, {'iterations': 0, 'restarts': 0, 'method': 'rho_baseline'}
    rng = random.Random(seed)
    for restart in range(200):
        x = rng.randint(2, N - 2)
        y = x
        c = rng.randint(1, N - 1)
        d = 1
        iterations = 0
        while d == 1 and iterations < max_iterations:
            x = (pow(x, 2, N) + c) % N
            y = (pow(y, 2, N) + c) % N
            y = (pow(y, 2, N) + c) % N
            d = gcd(abs(x - y), N)
            iterations += 1
        if 1 < d < N:
            return d, {'iterations': iterations, 'restarts': restart + 1, 'method': 'rho_baseline'}
    return None, {'iterations': max_iterations, 'restarts': 200, 'method': 'rho_baseline'}


def rho_hef_guided(N: int, seed: int | None = None, guidance: dict | None = None, max_iterations: int = 1_000_000) -> tuple[int | None, dict]:
    rng = random.Random(seed)
    guidance = guidance or {}
    x0 = guidance.get('base_a', rng.randint(2, max(3, N - 2)))
    y0 = guidance.get('period_r', rng.randint(2, max(3, N - 2)))
    c = guidance.get('c', rng.randint(1, N - 1))
    x = x0 % N
    y = y0 % N
    d = 1
    iterations = 0
    while d == 1 and iterations < max_iterations:
        x = (pow(x, 2, N) + c) % N
        y = (pow(y, 2, N) + c) % N
        y = (pow(y, 2, N) + c) % N
        d = gcd(abs(x - y), N)
        iterations += 1
    if 1 < d < N:
        return d, {'iterations': iterations, 'restarts': 1, 'method': 'rho_hef_guided', 'seed': seed}
    return None, {'iterations': iterations, 'restarts': 1, 'method': 'rho_hef_guided', 'seed': seed}
