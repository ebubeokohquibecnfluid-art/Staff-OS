import React, { useState } from 'react';
import {
  FileText,
  Download,
  Copy,
  Check,
  Building2,
  CheckCircle2,
  Calendar,
  Clock,
  ExternalLink,
  Layers,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { Prospect, Worker, WorkerRun } from '../../types';

interface ResultsViewProps {
  runs: WorkerRun[];
  prospects: Prospect[];
  workers: Worker[];
  onNavigateToWorker?: (workerId: string) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  runs,
  prospects,
  workers,
  onNavigateToWorker,
}) => {
  const [selectedRunId, setSelectedRunId] = useState<string>(runs[0]?.id || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  const selectedRun = runs.find((r) => r.id === selectedRunId) || runs[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(prospects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `staff-os-deliverables-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredProspects = prospects.filter((p) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      p.company.toLowerCase().includes(q) ||
      p.relevantPerson.toLowerCase().includes(q) ||
      (p.workerName && p.workerName.toLowerCase().includes(q)) ||
      (p.personalizedOutreach && p.personalizedOutreach.subject.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-700" />
            <span>Deliverables & Execution History</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Audit trail of completed assignments, structured outputs, and operational intelligence
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Runs Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {runs.map((run) => {
          const isSelected = run.id === selectedRun?.id;
          const assignedWorker = workers.find((w) => w.id === run.workerId);
          return (
            <div
              key={run.id}
              onClick={() => setSelectedRunId(run.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer shadow-xs ${
                isSelected
                  ? 'border-slate-900 ring-1 ring-slate-900 bg-white'
                  : 'border-slate-200 bg-white/70 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                  {run.status.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {run.durationSeconds}s runtime
                </span>
              </div>
              <h3 className="font-semibold text-xs text-slate-900 line-clamp-1">{run.goal}</h3>
              <p className="text-[11px] text-slate-500 mt-1">
                By {assignedWorker?.name || 'Staff Member'} ({assignedWorker?.role || 'Operations'})
              </p>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                <span>{run.tasksCompleted} tasks completed</span>
                <span>{run.approvalsRequired || 6} deliverables</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Run Details Banner */}
      {selectedRun && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Execution Run Specification
              </span>
              <h2 className="text-sm font-bold text-slate-900">{selectedRun.goal}</h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Started: {new Date(selectedRun.startedAt).toLocaleTimeString()}</span>
              <span>•</span>
              <span>
                Completed:{' '}
                {selectedRun.completedAt
                  ? new Date(selectedRun.completedAt).toLocaleTimeString()
                  : 'In Progress'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Researched</span>
              <span className="text-base font-bold text-slate-900">{selectedRun.companiesResearched}</span>
              <span className="text-[10px] text-slate-500 block">entities inspected</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Qualified</span>
              <span className="text-base font-bold text-emerald-700">{selectedRun.companiesQualified}</span>
              <span className="text-[10px] text-slate-500 block">criteria matched</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Decision Makers</span>
              <span className="text-base font-bold text-slate-900">{selectedRun.decisionMakersIdentified}</span>
              <span className="text-[10px] text-slate-500 block">contacts verified</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Outputs Ready</span>
              <span className="text-base font-bold text-blue-700">{selectedRun.messagesPrepared}</span>
              <span className="text-[10px] text-slate-500 block">drafts staged</span>
            </div>
          </div>
        </div>
      )}

      {/* Deliverables Search & Cards Grid */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Structured Deliverables ({filteredProspects.length})
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search deliverables..."
              className="w-full pl-8 pr-3 py-1 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProspects.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{item.company}</h4>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                        {item.location}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.companySummary}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {item.fitScore}/100 Fit
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Contact:</span>
                    <span className="font-semibold text-slate-900">
                      {item.relevantPerson} • {item.jobTitle}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Staff Creator:</span>
                    <span className="font-medium text-slate-700">{item.workerName || 'Alex Mercer'}</span>
                  </div>
                </div>

                {item.personalizedOutreach && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 text-xs space-y-1.5">
                    <div className="font-semibold text-slate-800 text-[11px] line-clamp-1">
                      {item.personalizedOutreach.subject}
                    </div>
                    <p className="text-slate-600 line-clamp-3 text-[11px] leading-relaxed">
                      {item.personalizedOutreach.body}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span
                  className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                    item.outreachStatus === 'approved'
                      ? 'text-emerald-700'
                      : item.outreachStatus === 'rejected'
                      ? 'text-rose-700'
                      : 'text-blue-700'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {item.outreachStatus === 'approved'
                    ? 'Authorized for sending'
                    : item.outreachStatus === 'rejected'
                    ? 'Withheld by supervisor'
                    : 'Awaiting supervisor approval'}
                </span>

                {item.personalizedOutreach && (
                  <button
                    onClick={() =>
                      handleCopy(
                        `Subject: ${item.personalizedOutreach?.subject}\n\n${item.personalizedOutreach?.body}`,
                        item.id
                      )
                    }
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 text-xs font-semibold cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Output</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
