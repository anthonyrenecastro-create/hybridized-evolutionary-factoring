import React, { useState, useCallback } from 'react';
import { Job, JobStatus, AppView, JobParams } from './types';
import { runHefAlgorithm } from './services/hef';
import JobForm from './components/JobForm';
import Dashboard from './components/Dashboard';
import ResultsView from './components/ResultsView';

const App: React.FC = () => {
  const [jobs, setJobs] = useState<Record<string, Job>>({});
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const handleJobSubmit = useCallback(async (params: JobParams) => {
    const taskId = crypto.randomUUID();
    const newJob: Job = {
      id: taskId,
      params,
      status: JobStatus.RUNNING,
      result: null,
    };
    
    setJobs(prevJobs => ({ ...prevJobs, [taskId]: newJob }));
    setSelectedJobId(taskId);
    setCurrentView(AppView.RESULTS);

    const result = await runHefAlgorithm(params);
    const finalStatus = result.error ? JobStatus.FAILURE : JobStatus.SUCCESS;

    setJobs(prevJobs => ({
      ...prevJobs,
      [taskId]: {
        ...prevJobs[taskId],
        status: finalStatus,
        result,
      },
    }));
  }, []);

  const handleViewResults = useCallback((taskId: string) => {
    setSelectedJobId(taskId);
    setCurrentView(AppView.RESULTS);
  }, []);

  const handleBackToDashboard = useCallback(() => {
    setSelectedJobId(null);
    setCurrentView(AppView.DASHBOARD);
  }, []);

  const handleClearHistory = useCallback(() => {
    setJobs({});
    setSelectedJobId(null);
    setCurrentView(AppView.DASHBOARD);
  }, []);

  const selectedJob = selectedJobId ? jobs[selectedJobId] : null;

  return (
    <div className="min-h-screen text-slate-100 p-4 md:p-8 bg-slate-950">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700 text-cyan-400 text-xs font-mono px-3 py-1 rounded-full mb-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Integer Factorization & Benchmarking Engine
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Prime Factorization & Performance
          </h1>
          <p className="text-base text-slate-400 mt-2 max-w-2xl mx-auto">
            Accurately computes complete prime factors with exponential representations and sub-millisecond execution benchmarks.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 lg:sticky lg:top-8">
            <JobForm
              onSubmit={handleJobSubmit}
              isSubmitting={Object.values(jobs).some(j => j.status === JobStatus.RUNNING)}
            />
          </div>
          <div className="lg:col-span-2">
            {currentView === AppView.DASHBOARD && (
              <Dashboard
                jobs={Object.values(jobs)}
                onViewResults={handleViewResults}
                onClearHistory={Object.keys(jobs).length > 0 ? handleClearHistory : undefined}
              />
            )}
            {currentView === AppView.RESULTS && selectedJob && (
              <ResultsView job={selectedJob} onBack={handleBackToDashboard} />
            )}
          </div>
        </main>

        <footer className="text-center text-slate-500 text-xs mt-12 pb-4">
          <p>Deterministic high-precision integer factorization with real-time execution timing.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
