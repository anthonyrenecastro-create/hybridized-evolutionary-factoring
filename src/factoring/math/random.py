import random


def make_rng(seed: int | None = None) -> random.Random:
    if seed is None:
        return random.Random()
    return random.Random(seed)
