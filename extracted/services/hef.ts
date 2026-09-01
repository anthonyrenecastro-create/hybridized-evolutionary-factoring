import { HefResult, JobParams, PrimeFactorTerm } from '../types';

/**
 * Computes the Greatest Common Divisor using Euclidean algorithm with BigInt
 */
function gcd(a: bigint, b: bigint): bigint {
  while (b !== 0n) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a < 0n ? -a : a;
}

/**
 * Modular exponentiation: (base^exp) % mod
 */
function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  let res = 1n;
  base = base % mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) {
      res = (res * base) % mod;
    }
    base = (base * base) % mod;
    exp = exp / 2n;
  }
  return res;
}

/**
 * Deterministic Miller-Rabin primality test for integers up to 2^64
 */
function isPrimeBigInt(n: bigint): boolean {
  if (n <= 1n) return false;
  if (n <= 3n) return true;
  if (n % 2n === 0n || n % 3n === 0n) return false;

  let d = n - 1n;
  let s = 0n;
  while (d % 2n === 0n) {
    d /= 2n;
    s += 1n;
  }

  // Deterministic bases for numbers < 2^64
  const bases = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];
  for (const a of bases) {
    if (n <= a) break;
    let x = modPow(a, d, n);
    if (x === 1n || x === n - 1n) continue;

    let composite = true;
    for (let r = 1n; r < s; r++) {
      x = (x * x) % n;
      if (x === n - 1n) {
        composite = false;
        break;
      }
    }
    if (composite) return false;
  }
  return true;
}

/**
 * Pollard's Rho integer factorization algorithm with Brent's cycle finding
 */
function pollardsRho(n: bigint, iterationCounter: { count: number }): bigint {
  if (n % 2n === 0n) return 2n;
  if (isPrimeBigInt(n)) return n;

  let c = 1n;
  while (true) {
    let x = 2n;
    let y = 2n;
    let d = 1n;
    let f = (v: bigint) => (modPow(v, 2n, n) + c) % n;

    while (d === 1n) {
      iterationCounter.count++;
      x = f(x);
      y = f(f(y));
      const diff = x > y ? x - y : y - x;
      d = gcd(diff, n);
    }

    if (d !== n) {
      return d;
    }
    c++;
    if (c > 100n) {
      // Fallback to simple trial division if Rho cycles
      for (let i = 3n; i * i <= n; i += 2n) {
        iterationCounter.count++;
        if (n % i === 0n) return i;
      }
      return n;
    }
  }
}

/**
 * Recursively factors a BigInt into prime components
 */
function factorizeRecursive(n: bigint, factors: bigint[], iterationCounter: { count: number }) {
  if (n <= 1n) return;
  if (isPrimeBigInt(n)) {
    factors.push(n);
    return;
  }

  // Small prime trial division for speed
  const smallPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n];
  for (const p of smallPrimes) {
    if (n % p === 0n) {
      while (n % p === 0n) {
        factors.push(p);
        n /= p;
        iterationCounter.count++;
      }
      if (n === 1n) return;
      if (isPrimeBigInt(n)) {
        factors.push(n);
        return;
      }
    }
  }

  const divisor = pollardsRho(n, iterationCounter);
  factorizeRecursive(divisor, factors, iterationCounter);
  factorizeRecursive(n / divisor, factors, iterationCounter);
}

/**
 * Executes high-precision full prime factorization and records exact execution time.
 */
export const runHefAlgorithm = async (jobParams: JobParams | string | number): Promise<HefResult> => {
  const rawInput = typeof jobParams === 'object' && jobParams !== null 
    ? String(jobParams.n_to_factor) 
    : String(jobParams);

  const cleanInput = rawInput.replace(/,/g, '').trim();

  // Validate integer input
  let nBig: bigint;
  try {
    nBig = BigInt(cleanInput);
  } catch {
    return {
      success: false,
      inputNumber: rawInput,
      factors: [],
      factorPowers: [],
      canonicalForm: '',
      productForm: '',
      isPrime: false,
      isSemiprime: false,
      totalPrimeFactors: 0,
      distinctPrimeFactors: 0,
      divisorsCount: 0,
      iterations: 0,
      execution_time: 0,
      error: 'Invalid input. Please provide a positive integer greater than 1.',
    };
  }

  if (nBig <= 1n) {
    return {
      success: false,
      inputNumber: cleanInput,
      factors: [],
      factorPowers: [],
      canonicalForm: '',
      productForm: '',
      isPrime: false,
      isSemiprime: false,
      totalPrimeFactors: 0,
      distinctPrimeFactors: 0,
      divisorsCount: 0,
      iterations: 0,
      execution_time: 0,
      error: 'Invalid input. Integer must be greater than or equal to 2.',
    };
  }

  // Measure exact execution time with high resolution performance timer
  const startTime = performance.now();
  const iterationCounter = { count: 0 };
  const primeFactorsBig: bigint[] = [];

  try {
    factorizeRecursive(nBig, primeFactorsBig, iterationCounter);
    const endTime = performance.now();
    const elapsedMs = Math.max(0.001, Number((endTime - startTime).toFixed(4)));

    // Sort prime factors in ascending order
    primeFactorsBig.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

    // Convert to readable format
    const factorsFormatted = primeFactorsBig.map((p) => (p <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(p) : p.toString()));

    // Group prime factors into powers (e.g. 2^3 * 3^2)
    const factorPowersMap = new Map<string, number>();
    for (const f of primeFactorsBig) {
      const key = f.toString();
      factorPowersMap.set(key, (factorPowersMap.get(key) || 0) + 1);
    }

    const factorPowers: PrimeFactorTerm[] = [];
    let divisorsCount = 1;

    factorPowersMap.forEach((power, primeStr) => {
      const primeVal = BigInt(primeStr) <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(primeStr) : primeStr;
      factorPowers.push({
        prime: primeVal,
        power,
      });
      divisorsCount *= (power + 1);
    });

    const isPrime = primeFactorsBig.length === 1;
    const isSemiprime = primeFactorsBig.length === 2;

    const productForm = factorsFormatted.join(' × ');
    const canonicalForm = factorPowers
      .map((term) => (term.power > 1 ? `${term.prime}^${term.power}` : `${term.prime}`))
      .join(' × ');

    return {
      success: true,
      inputNumber: cleanInput,
      factors: factorsFormatted,
      factorPowers,
      canonicalForm,
      productForm,
      isPrime,
      isSemiprime,
      totalPrimeFactors: primeFactorsBig.length,
      distinctPrimeFactors: factorPowers.length,
      divisorsCount,
      iterations: Math.max(1, iterationCounter.count),
      execution_time: elapsedMs,
      error: null,
    };
  } catch (err) {
    const endTime = performance.now();
    const elapsedMs = Math.max(0.001, Number((endTime - startTime).toFixed(4)));
    const errorMessage = err instanceof Error ? err.message : 'Unknown error during factorization';

    return {
      success: false,
      inputNumber: cleanInput,
      factors: [],
      factorPowers: [],
      canonicalForm: '',
      productForm: '',
      isPrime: false,
      isSemiprime: false,
      totalPrimeFactors: 0,
      distinctPrimeFactors: 0,
      divisorsCount: 0,
      iterations: iterationCounter.count,
      execution_time: elapsedMs,
      error: `Factorization error: ${errorMessage}`,
    };
  }
};
