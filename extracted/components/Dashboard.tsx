import React from 'react';
import { Job, JobStatus } from '../types';

interface DashboardProps {
  jobs: Job[];
  onViewResults: (jobId: string) => void;
  onClearHistory?: () => void;
}

const StatusBadge: React.FC<{ status: JobStatus }> = ({ status }) => {
  switch (status) {
    case JobStatus.SUCCESS:
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Completed
        </span>
      );
    case JobStatus.FAILURE:
      return (
        <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-red-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
          Failed
        </span>
      );
    case JobStatus.RUNNING:
      return (
        <span className="inline-flex items-center gap-1 bg-cyan-500/20 text-cyan-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-cyan-500/30 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          Computing...
        </span>
      );
    default:
      return null;
  }
};

const Dashboard: React.FC<DashboardProps> = ({ jobs, onViewResults, onClearHistory }) => {
  const sortedJobs = [...jobs].reverse();

  if (jobs.length === 0) {
    return (
      <div className="bg-slate-800 p-8 rounded-xl shadow-xl border border-slate-700 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-700/60 flex items-center justify-center mx-auto mb-3 text-cyan-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">No Factorizations Yet</h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Enter an integer on the left or select a quick test preset to calculate its prime factors and benchmark execution time.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Factorization History</h2>
          <p className="text-xs text-slate-400">{jobs.length} calculation{jobs.length === 1 ? '' : 's'} recorded</p>
        </div>
        {onClearHistory && (
          <button
            onClick={onClearHistory}
            className="text-xs text-slate-400 hover:text-red-400 transition"
          >
            Clear History
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700 text-[11px] uppercase tracking-wider text-slate-400">
              <th scope="col" className="px-3.5 py-3">Number ($N$)</th>
              <th scope="col" className="px-3.5 py-3">Prime Factors</th>
              <th scope="col" className="px-3.5 py-3">Execution Time</th>
              <th scope="col" className="px-3.5 py-3">Status</th>
              <th scope="col" className="px-3.5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/60 font-mono text-sm">
            {sortedJobs.map((job) => {
              const res = job.result;
              const timeDisplay = res?.execution_time != null
                ? res.execution_time < 1
                  ? `${(res.execution_time * 1000).toFixed(0)} μs`
                  : `${res.execution_time.toFixed(2)} ms`
                : '--';

              return (
                <tr key={job.id} className="hover:bg-slate-700/40 transition">
                  <td className="px-3.5 py-3.5 font-bold text-white break-all max-w-[140px]">
                    {job.params.n_to_factor}
                  </td>
                  <td className="px-3.5 py-3.5 text-cyan-300 break-all max-w-[200px]">
                    {res?.canonicalForm || res?.productForm || (job.status === JobStatus.RUNNING ? '...' : '--')}
                  </td>
                  <td className="px-3.5 py-3.5 text-emerald-400 font-semibold whitespace-nowrap">
                    {timeDisplay}
                  </td>
                  <td className="px-3.5 py-3.5 whitespace-nowrap font-sans">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="px-3.5 py-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => onViewResults(job.id)}
                      className="text-xs bg-slate-700 hover:bg-slate-600 text-cyan-300 font-sans font-semibold px-3 py-1.5 rounded transition"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
