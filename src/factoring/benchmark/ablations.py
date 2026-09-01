from __future__ import annotations

ABLATIONS = {
    'Full HEF': {'base_selection': True, 'novelty': True, 'adaptive_mutation': True, 'stability': True, 'evolution': True},
    'HEF without base-selection heuristic': {'base_selection': False, 'novelty': True, 'adaptive_mutation': True, 'stability': True, 'evolution': True},
    'HEF without novelty': {'base_selection': True, 'novelty': False, 'adaptive_mutation': True, 'stability': True, 'evolution': True},
    'HEF without adaptive mutation': {'base_selection': True, 'novelty': True, 'adaptive_mutation': False, 'stability': True, 'evolution': True},
    'HEF without stability score': {'base_selection': True, 'novelty': True, 'adaptive_mutation': True, 'stability': False, 'evolution': True},
    'HEF without evolutionary search': {'base_selection': True, 'novelty': True, 'adaptive_mutation': True, 'stability': True, 'evolution': False},
    'HEF-guided rho versus random rho': {'guided_rho': True},
}


def get_ablations() -> dict[str, dict[str, bool]]:
    return ABLATIONS.copy()
