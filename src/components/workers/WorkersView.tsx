import React from 'react';
import {
  Plus,
  Play,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldCheck,
  Building2,
  Truck,
  Layers,
  FileCheck,
  Headphones,
  CheckSquare,
} from 'lucide-react';
import { ViewScreen, Worker } from '../../types';

interface WorkersViewProps {
  workers: Worker[];
  activeWorker: Worker;
  onSelectWorker: (worker: Worker) => void;
  onNavigate: (view: ViewScreen) => void;
  onCreateWorkerClick: () => void;
  onRunWorker: (worker: Worker) => void;
}

export const WorkersView: React.FC<WorkersViewProps> = ({
  workers,
  activeWorker,
  onSelectWorker,
  onNavigate,
  onCreateWorkerClick,
  onRunWorker,
}) => {
  const getStatusBadge = (status: Worker['status']) => {
    switch (status) {
      case 'PLANNING':
      case 'RESEARCHING':
      case 'QUALIFYING':
      case 'CONTACT_RESEARCH':
      case 'PERSONALIZING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Executing Assignment</span>
          </span>
        );
      case 'AWAITING_APPROVAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <CheckCircle2 className="w-3 h-3 text-blue-600" />
            <span>Awaiting Approval</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Completed</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <span>Failed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span>Ready / Standby</span>
          </span>
        );
    }
  };

  const getWorkerIcon = (role: string) => {
    if (role.toLowerCase().includes('freight') || role.toLowerCase().includes('carrier')) {
      return <Truck className="w-4 h-4 text-slate-300" />;
    }
    if (role.toLowerCase().includes('logistics') || role.toLowerCase().includes('hub')) {
      return <Layers className="w-4 h-4 text-slate-300" />;
    }
    if (role.toLowerCase().includes('compliance') || role.toLowerCase().includes('safety')) {
      return <ShieldCheck className="w-4 h-4 text-slate-300" />;
    }
    if (role.toLowerCase().includes('support') || role.toLowerCase().includes('customer')) {
      return <Headphones className="w-4 h-4 text-slate-300" />;
    }
    return <Building2 className="w-4 h-4 text-slate-300" />;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Workforce Roster
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Directory of active, autonomous AI staff members currently deployed across operations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCreateWorkerClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Custom Staff</span>
          </button>
        </div>
      </div>

      {/* Workforce Roster Cards */}
      <div className="grid grid-cols-1 gap-5">
        {workers.map((w, index) => {
          const isActiveSelected = w.id === activeWorker.id;
          return (
            <div
              key={w.id}
              className={`bg-white rounded-xl border p-5 sm:p-6 transition-all shadow-xs ${
                isActiveSelected
                  ? 'border-slate-900 ring-1 ring-slate-900'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Top Row: Worker Bio & Status */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center font-mono font-bold text-xs shrink-0 shadow-xs">
                    <div className="text-[9px] text-slate-400 font-sans">0{index + 1}</div>
                    <div>{w.initials || w.name.substring(0, 2).toUpperCase()}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="text-base font-bold text-slate-900 tracking-tight">
                        {w.name}
                      </h2>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {w.role}
                      </span>
                      {getStatusBadge(w.status)}
                    </div>

                    <p className="text-xs text-slate-600 font-medium max-w-2xl leading-relaxed">
                      <span className="font-semibold text-slate-800">Current Assignment:</span> {w.goal}
                    </p>

                    {/* Capabilities Tags */}
                    {w.capabilities && w.capabilities.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                        {w.capabilities.map((cap) => (
                          <span
                            key={cap}
                            className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200/80"
                          >
                            {cap}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                  <button
                    onClick={() => {
                      onSelectWorker(w);
                      onNavigate('tasks');
                    }}
                    className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-slate-500" />
                    <span>Tasks</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectWorker(w);
                      onNavigate('workspace');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Open Workspace</span>
                  </button>
                </div>
              </div>

              {/* Bottom Operational Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-100">
                  <span className="text-[11px] font-medium text-slate-500 block">Entities Scanned</span>
                  <span className="text-sm font-bold text-slate-900 block mt-0.5">
                    {w.stats.prospectsResearched || 0} records
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-100">
                  <span className="text-[11px] font-medium text-slate-500 block">Qualified Targets</span>
                  <span className="text-sm font-bold text-slate-900 block mt-0.5">
                    {w.stats.qualifiedProspects || 0} accounts
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-100">
                  <span className="text-[11px] font-medium text-slate-500 block">Tasks Executed</span>
                  <span className="text-sm font-bold text-slate-900 block mt-0.5">
                    {w.stats.tasksCompleted || 0} steps completed
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-100">
                  <span className="text-[11px] font-medium text-slate-500 block">Supervisor Sign-offs</span>
                  <span
                    className={`text-sm font-bold block mt-0.5 ${
                      w.stats.approvalsRequired > 0 ? 'text-blue-700' : 'text-slate-900'
                    }`}
                  >
                    {w.stats.approvalsRequired || 0} awaiting review
                  </span>
                </div>
              </div>

              {/* Status footer banner */}
              {w.currentActionSummary && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="truncate max-w-[85%]">
                    <span className="font-semibold text-slate-700">Latest step:</span>{' '}
                    {w.currentActionSummary}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono shrink-0">
                    {w.updatedAt ? new Date(w.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ready'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
