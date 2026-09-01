from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class Telemetry:
    modular_exponentiations: int = 0
    gcd_calls: int = 0
    rho_iterations: int = 0
    hef_evaluations: int = 0
    generations: int = 0
    crossovers: int = 0
    mutations: int = 0
    successful_mutations: int = 0
    restarts: int = 0
    base_evaluations: int = 0
    worker_starts: int = 0
    worker_cancellations: int = 0
    preprocessing_ms: float = 0.0
    base_selection_ms: float = 0.0
    hef_search_ms: float = 0.0
    rho_ms: float = 0.0
    guided_rho_ms: float = 0.0
    verification_ms: float = 0.0
    total_ms: float = 0.0
    metadata: dict = field(default_factory=dict)

    def as_dict(self) -> dict:
        return {
            'modular_exponentiations': self.modular_exponentiations,
            'gcd_calls': self.gcd_calls,
            'rho_iterations': self.rho_iterations,
            'hef_evaluations': self.hef_evaluations,
            'generations': self.generations,
            'crossovers': self.crossovers,
            'mutations': self.mutations,
            'successful_mutations': self.successful_mutations,
            'restarts': self.restarts,
            'base_evaluations': self.base_evaluations,
            'worker_starts': self.worker_starts,
            'worker_cancellations': self.worker_cancellations,
            'preprocessing_ms': self.preprocessing_ms,
            'base_selection_ms': self.base_selection_ms,
            'hef_search_ms': self.hef_search_ms,
            'rho_ms': self.rho_ms,
            'guided_rho_ms': self.guided_rho_ms,
            'verification_ms': self.verification_ms,
            'total_ms': self.total_ms,
            'metadata': self.metadata,
        }
