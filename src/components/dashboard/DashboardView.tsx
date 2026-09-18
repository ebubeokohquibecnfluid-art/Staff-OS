import React from 'react';
import {
  Play,
  ArrowRight,
  CheckCircle2,
  Users,
  CheckSquare,
  ChevronRight,
  ShieldCheck,
  Building2,
  Clock,
  RotateCcw,
  AlertTriangle,
  FileText,
  Plus,
  Compass,
} from 'lucide-react';
import { ViewScreen, Worker, WorkerAction, WorkerTask } from '../../types';

interface DashboardViewProps {
  workers: Worker[];
  activeWorker: Worker;
  recentActions: WorkerAction[];
  tasks: WorkerTask[];
  onNavigate: (view: ViewScreen) => void;
  onSelectWorker: (worker: Worker) => void;
  onRunWorker: () => void;
  onResetDemo: () => void;
  onNewAssignment?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  workers,
  activeWorker,
  recentActions,
  tasks,
  onNavigate,
  onSelectWorker,
  onRunWorker,
  onResetDemo,
  onNewAssignment,
}) => {
  const isRunning = [
    'PLANNING',
    'RESEARCHING',
    'QUALIFYING',
    'CONTACT_RESEARCH',
    'PERSONALIZING',
  ].includes(activeWorker.status);

  // Workforce stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const pendingApprovalsCount = workers.reduce(
    (acc, w) => acc + (w.stats.approvalsRequired || 0),
    0
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'GOOD MORNING';
    if (hour < 18) return 'GOOD AFTERNOON';
    return 'GOOD EVENING';
  };

  const getStatusBadge = (status: Worker['status']) => {
    switch (status) {
      case 'PLANNING':
      case 'RESEARCHING':
      case 'QUALIFYING':
      case 'CONTACT_RESEARCH':
      case 'PERSONALIZING':
        return { label: 'Executing', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'AWAITING_APPROVAL':
        return { label: 'Needs Approval', color: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'COMPLETED':
        return { label: 'Completed', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'FAILED':
        return { label: 'Failed', color: 'bg-rose-50 text-rose-800 border-rose-200' };
      default:
        return { label: 'Standby', color: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const handleStartNewAssignment = () => {
    if (onNewAssignment) {
      onNewAssignment();
    } else {
      onNavigate('quickstart');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Priority 1: Greeting & Primary "+ New Assignment" Action */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase">
              {getGreeting()}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 font-editorial">
              What would you like your staff to work on?
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed max-w-xl">
              Tell Staff OS what you need done. We'll assign the right specialized AI staff and deliver verified outputs for your approval.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleStartNewAssignment}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-md transition-all cursor-pointer active:scale-98 group"
            >
              <Plus className="w-4 h-4 text-emerald-400 group-hover:rotate-90 transition-transform duration-200" />
              <span>+ New Assignment</span>
            </button>

            {pendingApprovalsCount > 0 ? (
              <button
                onClick={() => onNavigate('approvals')}
                className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Review Approvals ({pendingApprovalsCount})</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('tasks')}
                className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>Tasks Console</span>
              </button>
            )}

            <button
              onClick={onResetDemo}
              className="flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
              title="Restore simulation to initial state"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Compact Operational Summary: Active Staff | Active Tasks | Needs Approval | Completed */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Active Staff */}
        <div
          onClick={() => onNavigate('workers')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold text-slate-600">Active Staff</span>
            <Users className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {workers.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="font-semibold text-emerald-700">5 specialized staff</span>
            <span>ready</span>
          </div>
        </div>

        {/* Metric 2: Active Tasks */}
        <div
          onClick={() => onNavigate('tasks')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold text-slate-600">Active Tasks</span>
            <CheckSquare className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {inProgressTasks > 0 ? inProgressTasks : completedTasks}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="font-semibold text-slate-700">{completedTasks} completed</span>
            <span>of {totalTasks} total</span>
          </div>
        </div>

        {/* Metric 3: Needs Approval */}
        <div
          onClick={() => onNavigate('approvals')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold text-slate-600">Needs Approval</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-blue-700 tracking-tight">
            {pendingApprovalsCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="font-semibold text-blue-700">Human sign-off</span>
            <span>required</span>
          </div>
        </div>

        {/* Metric 4: Completed Deliverables */}
        <div
          onClick={() => onNavigate('results')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold text-slate-600">Completed</span>
            <FileText className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            18
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="font-semibold text-emerald-700">Deliverables</span>
            <span>verified & archived</span>
          </div>
        </div>
      </div>

      {/* Your Staff Section (5 specialized staff members) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Your Staff
            </h2>
            <p className="text-xs text-slate-500">
              Select any staff member to view active tasks, assign directives, or inspect workspace outputs
            </p>
          </div>

          <button
            onClick={() => onNavigate('workers')}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Staff</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {workers.map((w, index) => {
            const badge = getStatusBadge(w.status);
            const isCurrent = w.id === activeWorker.id;
            return (
              <div
                key={w.id}
                onClick={() => {
                  onSelectWorker(w);
                  onNavigate('workspace');
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                  isCurrent
                    ? 'border-slate-900 ring-1 ring-slate-900 bg-slate-50/50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                      0{index + 1}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 leading-tight">{w.name}</h3>
                      <span className="text-[10px] text-slate-500 block">{w.role}</span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.color}`}
                  >
                    {badge.label}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                  {w.goal}
                </p>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{w.stats.tasksCompleted || 0} tasks finished</span>
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Split: Current Active Worker Focus & Live Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Active Focus Card */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Primary Worker Focus
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-medium">
                {activeWorker.name} ({activeWorker.role})
              </span>
            </div>

            <button
              onClick={() => onNavigate('workspace')}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <span>Full Workspace</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
              Operational Objective
            </span>
            <p className="text-sm font-semibold text-slate-900 mt-1 leading-relaxed">
              {activeWorker.goal}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Target Industry:</span>
              <span className="font-medium text-slate-900">{activeWorker.targetCriteria.industry}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Target Region:</span>
              <span className="font-medium text-slate-900">{activeWorker.targetCriteria.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Decision Maker Title:</span>
              <span className="font-medium text-slate-900">{activeWorker.targetCriteria.targetTitle}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Latest Step:{' '}
              <span className="font-medium text-slate-800">
                {activeWorker.currentActionSummary || 'Ready to execute'}
              </span>
            </div>

            <button
              onClick={() => {
                onNavigate('workspace');
                if (!isRunning) onRunWorker();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Launch Execution</span>
            </button>
          </div>
        </div>

        {/* Right Column (5 cols): Chronological Activity Feed */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Live Activity Telemetry
                </h3>
              </div>

              <button
                onClick={() => onNavigate('activity')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {recentActions.slice(0, 5).map((action) => (
                <div
                  key={action.id}
                  className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{action.summary}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{action.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-1">{action.resultSummary}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigate('activity')}
              className="w-full text-center py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Open Full Audit Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
