from __future__ import annotations

from factoring.math.gcd import gcd
from factoring.math.modular import modular_distance


def evaluate_genome(genome: object, N: int) -> float:
    residue = genome.residue
    r = genome.period_r
    a = genome.base_a

    if N <= 0:
        return 0.0

    residue_target = modular_distance(residue, 1, N)
    residue_val = 1.0 / (1.0 + residue_target)

    cycle_score = 0.0
    if r > 0:
        half = r // 2
        x = pow(a, half, N)
        g_minus = gcd(x - 1, N)
        g_plus = gcd(x + 1, N)
        genome.gcd_minus = g_minus
        genome.gcd_plus = g_plus
        if 1 < g_minus < N:
            cycle_score += 4.0
        if 1 < g_plus < N:
            cycle_score += 4.0
        cycle_score += min(2.0, max(0.0, (max(g_minus, g_plus) / max(1, N)) * 10.0))

    novelty = 1.0
    genome.novelty_score = novelty

    stability = 0.5
    if genome.metadata.get('stability') is not None:
        stability = float(genome.metadata['stability'])
    genome.stability_score = stability

    genome.residue_distance = float(residue_target)
    genome.cycle_score = float(cycle_score)

    fitness = 0.5 * residue_val + 0.35 * cycle_score + 0.15 * stability
    genome.fitness = fitness
    return fitness
