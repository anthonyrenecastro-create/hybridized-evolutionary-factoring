from __future__ import annotations

from dataclasses import dataclass, field
from random import Random

from factoring.hef.genome import Genome


@dataclass
class Population:
    size: int
    rng: Random
    genomes: list[Genome] = field(default_factory=list)
    generation: int = 0

    def initialize(self, N: int, seed: int | None = None) -> None:
        self.genomes = []
        for idx in range(self.size):
            a = self.rng.randint(2, max(3, N - 1))
            r = self.rng.randint(2, 256)
            self.genomes.append(Genome(base_a=a, period_r=r, generation=0, lineage=idx, metadata={'stability': 0.5}))

    def sort_by_fitness(self) -> list[Genome]:
        return sorted(self.genomes, key=lambda g: g.fitness, reverse=True)

    def best(self) -> Genome | None:
        if not self.genomes:
            return None
        return max(self.genomes, key=lambda g: g.fitness)
