def gcd(a: int, b: int) -> int:
    a = abs(int(a))
    b = abs(int(b))
    while b:
        a, b = b, a % b
    return a
