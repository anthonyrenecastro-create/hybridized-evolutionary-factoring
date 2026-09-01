import math

from factoring.math.gcd import gcd
from factoring.math.modular import mod_pow
from factoring.math.primality import is_probable_prime
from factoring.engine.factorEngine import FactorEngine, validate_factor_pair


def test_gcd_and_powmod():
    assert gcd(48, 18) == 6
    assert mod_pow(2, 10, 17) == 4


def test_miller_rabin_known_primes_and_composites():
    assert is_probable_prime(2)
    assert is_probable_prime(3)
    assert is_probable_prime(104729)
    assert not is_probable_prime(1)
    assert not is_probable_prime(4)
    assert not is_probable_prime(25)


def test_known_factorizations():
    engine = FactorEngine(seed=7)
    for n, expected in [(15, (3, 5)), (21, (3, 7)), (35, (5, 7)), (77, (7, 11)), (91, (7, 13)), (8051, (83, 97)), (10403, (101, 103))]:
        result = engine.factorize(n, mode='rho_baseline')
        assert result['success']
        assert validate_factor_pair(n, result['factor1'], result['factor2'])
        assert result['factor1'] * result['factor2'] == n


def test_regression_semiprime():
    N = 18947473363165912511291139617
    engine = FactorEngine(seed=42)
    result = engine.factorize(N, mode='hybrid')
    assert result['success']
    assert result['factor1'] == 23174682910487
    assert result['factor2'] == 817593640281991


def test_invalid_factor_examples_are_rejected():
    assert not validate_factor_pair(21, 1, 21)
    assert not validate_factor_pair(21, 21, 1)
    assert not validate_factor_pair(21, 2, 11)
    assert not validate_factor_pair(21, 7, 4)
    assert not validate_factor_pair(14, 3, 5)
