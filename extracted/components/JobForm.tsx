import React, { useState } from 'react';
import { JobParams } from '../types';

interface JobFormProps {
  onSubmit: (params: JobParams) => void;
  isSubmitting: boolean;
}

const PRESETS = [
  { label: '12', value: '12', desc: '2² × 3' },
  { label: '360', value: '360', desc: '2³ × 3² × 5' },
  { label: '2,310', value: '2310', desc: '2 × 3 × 5 × 7 × 11' },
  { label: '104,729', value: '104729', desc: 'Prime' },
  { label: '1,234,567', value: '1234567', desc: '127 × 9721' },
  { label: '982,451,653', value: '982451653', desc: 'Large prime' },
  { label: '123,456,789,012', value: '123456789012', desc: '2² × 3 × 13 × 23 × 3433367' },
];

const JobForm: React.FC<JobFormProps> = ({ onSubmit, isSubmitting }) => {
  const [numberInput, setNumberInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = numberInput.replace(/,/g, '').trim();
    if (!clean) {
      setError('Please enter a number.');
      return;
    }

    try {
      const bn = BigInt(clean);
      if (bn <= 1n) {
        setError('Please enter an integer greater than 1.');
        return;
      }
    } catch {
      setError('Please enter a valid integer.');
      return;
    }

    setError(null);
    onSubmit({ n_to_factor: clean });
    setNumberInput('');
  };

  const handleSelectPreset = (val: string) => {
    setNumberInput(val);
    setError(null);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-2">Prime Factorization</h2>
      <p className="text-xs text-slate-400 mb-5">
        Computes the complete prime factorization of any positive integer with millisecond-precision timing.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="number-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Integer to Factor ($N$)
          </label>
          <input
            id="number-input"
            type="text"
            value={numberInput}
            onChange={(e) => setNumberInput(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 text-white font-mono text-lg rounded-lg p-3 focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan focus:outline-none transition placeholder:text-slate-600"
            placeholder="e.g. 360, 2310, 123456789012"
            autoComplete="off"
            required
          />
          {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Quick Test Presets
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => handleSelectPreset(p.value)}
                className="text-xs bg-slate-900/80 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-md border border-slate-700 font-mono transition flex items-center gap-1.5"
              >
                <span>{p.label}</span>
                <span className="text-[10px] text-slate-500 font-sans">({p.desc})</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-3 px-4 rounded-lg transition duration-200 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed shadow-md shadow-cyan-950/40"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Factoring...</span>
            </span>
          ) : (
            'Calculate Prime Factors'
          )}
        </button>
      </form>
    </div>
  );
};

export default JobForm;
