from __future__ import annotations

from random import Random

from factoring.hef.genome import Genome


def mutate_genome(genome: Genome, N: int, rng: Random, mutation_rate: float = 0.2) -> Genome:
    child = Genome(
        base_a=genome.base_a,
        period_r=genome.period_r,
        generation=genome.generation + 1,
        lineage=genome.lineage + 1,
        metadata=dict(genome.metadata),
    )

    if rng.random() < mutation_rate:
        child.base_a = max(2, (genome.base_a + rng.randint(-5, 5)) % max(2, N - 1))
    if rng.random() < mutation_rate:
        child.period_r = max(2, genome.period_r + rng.choice([-3, -2, -1, 1, 2, 3, 5, 8]))
    if rng.random() < mutation_rate:
        child.base_a = max(2, child.base_a * rng.choice([2, 3, 5, 7]) % max(2, N - 1))
    if rng.random() < mutation_rate and child.period_r > 2:
        child.period_r = max(2, child.period_r // rng.choice([2, 3, 5]))
    return child
