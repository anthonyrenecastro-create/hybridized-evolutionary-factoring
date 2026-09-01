from dataclasses import dataclass, field
from typing import Any


@dataclass
class Genome:
    base_a: int
    period_r: int
    fitness: float = 0.0
    residue: int = 0
    gcd_minus: int = 1
    gcd_plus: int = 1
    residue_distance: float = 0.0
    cycle_score: float = 0.0
    novelty_score: float = 0.0
    stability_score: float = 0.0
    generation: int = 0
    lineage: int = 0
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return {
            'base_a': self.base_a,
            'period_r': self.period_r,
            'fitness': self.fitness,
            'residue': self.residue,
            'gcd_minus': self.gcd_minus,
            'gcd_plus': self.gcd_plus,
            'residue_distance': self.residue_distance,
            'cycle_score': self.cycle_score,
            'novelty_score': self.novelty_score,
            'stability_score': self.stability_score,
            'generation': self.generation,
            'lineage': self.lineage,
            'metadata': self.metadata,
        }
