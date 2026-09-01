
export enum JobStatus {
  RUNNING = 'RUNNING',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  RESULTS = 'RESULTS',
}

export interface PrimeFactorTerm {
  prime: number | string;
  power: number;
}

export interface JobParams {
  n_to_factor: string; // support string/bigint input to handle large numbers seamlessly
}

export interface HefResult {
  success: boolean;
  inputNumber: string;
  factors: (number | string)[];
  factorPowers: PrimeFactorTerm[];
  canonicalForm: string; // e.g. "2^3 × 3^2 × 5"
  productForm: string;   // e.g. "2 × 2 × 2 × 3 × 3 × 5"
  isPrime: boolean;
  isSemiprime: boolean;
  totalPrimeFactors: number;
  distinctPrimeFactors: number;
  divisorsCount: number;
  iterations: number;
  execution_time: number; // in milliseconds with high precision
  error: string | null;
}

export interface Job {
  id: string;
  params: JobParams;
  status: JobStatus;
  result: HefResult | null;
}


