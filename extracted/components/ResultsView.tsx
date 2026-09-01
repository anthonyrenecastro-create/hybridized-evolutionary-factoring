import React, { useState } from 'react';
import { Job, JobStatus } from '../types';

interface ResultsViewProps {
  job: Job;
  onBack: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ job, onBack }) => {
  const { result, params } = job;
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedTime = result?.execution_time != null
    ? result.execution_time < 1
      ? `${(result.execution_time * 1000).toFixed(0)} μs (${result.execution_time.toFixed(4)} ms)`
      : `${result.execution_time.toFixed(3)} ms`
    : '--';

  return (
    <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-2xl border border-slate-700 relative">
      {/* Top Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 mb-2 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span>Factorization Result</span>
            {result?.success && (
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                result.isPrime 
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : result.isSemiprime
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {result.isPrime ? 'Prime Number' : result.isSemiprime ? 'Semiprime (2 primes)' : 'Composite Number'}
              </span>
            )}
          </h2>
        </div>
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition"
          title="Close results"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Target Number & Timing Hero */}
      <div className="bg-slate-950 p-5 rounded-xl border border-slate-700/80 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block mb-1">Target Integer ($N$)</span>
          <span className="text-3xl md:text-4xl font-extrabold text-cyan-400 font-mono break-all">
            {params.n_to_factor}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900 px-4 py-2.5 rounded-lg border border-slate-800 text-right">
            <span className="text-[11px] uppercase font-mono tracking-wider text-slate-400 block mb-0.5">Execution Time</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">{formattedTime}</span>
          </div>
        </div>
      </div>

      {/* Success State */}
      {job.status === JobStatus.SUCCESS && result && (
        <div className="space-y-6">
          {/* Main Canonical Equation */}
          <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Canonical Prime Factorization</span>
              <button
                onClick={() => handleCopy(`${params.n_to_factor} = ${result.canonicalForm}`)}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-600 transition flex items-center gap-1.5"
              >
                {copied ? (
                  <span className="text-emerald-400 font-medium">Copied!</span>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy Equation</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-2xl md:text-3xl font-mono font-bold text-white mb-3 break-all flex flex-wrap items-baseline gap-2">
              <span className="text-cyan-400">{params.n_to_factor}</span>
              <span className="text-slate-500">=</span>
              {result.factorPowers.map((term, idx) => (
                <React.Fragment key={idx}>
                  <span className="inline-flex items-baseline">
                    <span className="text-white">{term.prime}</span>
                    {term.power > 1 && (
                      <sup className="text-cyan-300 text-base ml-0.5 font-bold">{term.power}</sup>
                    )}
                  </span>
                  {idx < result.factorPowers.length - 1 && (
                    <span className="text-slate-500 mx-1">×</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="text-xs text-slate-400 font-mono border-t border-slate-800 pt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-slate-500">Expanded product:</span>
              <span className="text-slate-300 break-all">{params.n_to_factor} = {result.productForm}</span>
            </div>
          </div>

          {/* Prime Factor Chips */}
          <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-700">
            <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block mb-3">
              Prime Factors Breakdown ({result.factors.length} total, {result.distinctPrimeFactors} distinct)
            </span>

            <div className="flex flex-wrap gap-2.5">
              {result.factorPowers.map((term, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800 border border-slate-700 px-3.5 py-2 rounded-lg flex items-center gap-2"
                >
                  <span className="font-mono text-lg font-bold text-cyan-300">{term.prime}</span>
                  {term.power > 1 && (
                    <span className="bg-cyan-950 text-cyan-300 border border-cyan-800/80 text-xs px-2 py-0.5 rounded font-mono font-medium">
                      multiplicity: {term.power}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mathematical Properties Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
              <p className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">Total Factors $\Omega(N)$</p>
              <p className="text-xl font-bold font-mono text-white">{result.totalPrimeFactors}</p>
            </div>
            <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
              <p className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">Distinct Primes $\omega(N)$</p>
              <p className="text-xl font-bold font-mono text-white">{result.distinctPrimeFactors}</p>
            </div>
            <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
              <p className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">Total Divisors $d(N)$</p>
              <p className="text-xl font-bold font-mono text-white">{result.divisorsCount}</p>
            </div>
            <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
              <p className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">Iterations</p>
              <p className="text-xl font-bold font-mono text-white">{result.iterations.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {job.status === JobStatus.FAILURE && (
        <div className="mt-4">
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
            <p className="text-red-300 font-mono text-sm">{result?.error || 'An error occurred during factorization.'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsView;
