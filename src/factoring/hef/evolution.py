from __future__ import annotations

from random import Random

from factoring.hef.baseSelection import score_base
from factoring.hef.crossover import crossover_pair
from factoring.hef.fitness import evaluate_genome
from factoring.hef.genome import Genome
from factoring.hef.mutation import mutate_genome
from factoring.hef.population import Population
from factoring.math.gcd import gcd
from factoring.math.modular import mod_pow


def evolve_population(N: int, population: Population, max_generations: int = 50, mutation_rate: float = 0.25, seed: int | None = None) -> dict:
    rng = population.rng
    history = []
    best = None

    for generation in range(max_generations):
        scored = []
        for genome in population.genomes:
            residue = mod_pow(genome.base_a, genome.period_r, N)
            genome.residue = residue
            base_score, base_metrics = score_base(genome.base_a, N)
            genome.metadata['base_score'] = base_score
            genome.metadata['base_metrics'] = base_metrics
            genome.metadata['stability'] = 0.5 + (base_score / max(1.0, 2.0 + base_score))
            evaluate_genome(genome, N)
            if genome.gcd_minus or genome.gcd_plus:
                pass
            scored.append(genome)

        scored.sort(key=lambda g: g.fitness, reverse=True)
        best = scored[0]
        history.append({'generation': generation, 'best_fitness': best.fitness, 'best_base': best.base_a, 'best_period': best.period_r})

        parents = scored[: max(2, min(6, len(scored)))]
        children = []
        while len(children) < max(1, population.size - len(parents)):
            parent_a = rng.choice(parents)
            parent_b = rng.choice(parents)
            child = crossover_pair(parent_a, parent_b, rng)
            child = mutate_genome(child, N, rng, mutation_rate=mutation_rate)
            children.append(child)

        population.genomes = parents + children[: max(1, population.size - len(parents))]
        population.generation = generation + 1

    final_best = max(population.genomes, key=lambda g: g.fitness, default=None)
    factor_candidates = []
    if final_best is not None:
        half = final_best.period_r // 2
        x = pow(final_best.base_a, half, N)
        g_minus = gcd(x - 1, N)
        g_plus = gcd(x + 1, N)
        for candidate in [g_minus, g_plus]:
            if 1 < candidate < N:
                factor_candidates.append(candidate)

    return {
        'best_genome': final_best,
        'factor_candidates': sorted(set(factor_candidates)),
        'history': history,
        'generations': population.generation,
    }
