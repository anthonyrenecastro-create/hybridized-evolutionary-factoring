def mod_pow(base: int, exp: int, mod: int) -> int:
    if mod <= 0:
        raise ValueError('mod must be positive')
    result = 1 % mod
    base %= mod
    while exp > 0:
        if exp & 1:
            result = (result * base) % mod
        base = (base * base) % mod
        exp >>= 1
    return result


def modular_distance(value: int, target: int, modulus: int) -> int:
    delta = abs(value - target) % modulus
    return min(delta, modulus - delta)
