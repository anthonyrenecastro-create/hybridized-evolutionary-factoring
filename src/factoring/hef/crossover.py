from __future__ import annotations

from random import Random

from factoring.hef.genome import Genome


def arithmetic_crossover(parent_a: Genome, parent_b: Genome, rng: Random) -> Genome:
    mix = rng.random()
    child = Genome(
        base_a=int(round((1 - mix) * parent_a.base_a + mix * parent_b.base_a)),
        period_r=int(round((1 - mix) * parent_a.period_r + mix * parent_b.period_r)),
        generation=max(parent_a.generation, parent_b.generation) + 1,
        lineage=max(parent_a.lineage, parent_b.lineage) + 1,
        metadata={'stability': 0.5},
    )
    return child


def bitwise_crossover(parent_a: Genome, parent_b: Genome, rng: Random) -> Genome:
    base = rng.choice([parent_a.base_a, parent_b.base_a])
    period = rng.choice([parent_a.period_r, parent_b.period_r])
    return Genome(base_a=base, period_r=period, generation=max(parent_a.generation, parent_b.generation) + 1, lineage=max(parent_a.lineage, parent_b.lineage) + 1, metadata={'stability': 0.5})


def crossover_pair(parent_a: Genome, parent_b: Genome, rng: Random) -> Genome:
    method = rng.choice(['arithmetic', 'bitwise'])
    if method == 'arithmetic':
        return arithmetic_crossover(parent_a, parent_b, rng)
    return bitwise_crossover(parent_a, parent_b, rng)
