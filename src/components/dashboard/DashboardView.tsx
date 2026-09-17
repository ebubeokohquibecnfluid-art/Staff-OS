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
} from 'lucide-react';
import { ViewScreen, Worker, WorkerAction } from '../../types';

interface DashboardViewProps {
  worker: Worker;
  recentActions: WorkerAction[];
  onNavigate: (view: ViewScreen) => void;
  onRunWorker: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  worker,
  recentActions,
  onNavigate,
  onRunWorker,
}) => {
  const isRunning = [
    'PLANNING',
    'RESEARCHING',
    'QUALIFYING',
    'CONTACT_RESEARCH',
    'PERSONALIZING',
  ].includes(worker.status);

  const getStatusBadge = () => {
    switch (worker.status) {
      case 'PLANNING':
      case 'RESEARCHING':
      case 'QUALIFYING':
      case 'CONTACT_RESEARCH':
      case 'PERSONALIZING':
        return { label: 'Working', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'AWAITING_APPROVAL':
        return { label: 'Needs approval', color: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'COMPLETED':
        return { label: 'Completed', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'FAILED':
        return { label: 'Failed', color: 'bg-rose-50 text-rose-800 border-rose-200' };
      default:
        return { label: 'Ready', color: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const status = getStatusBadge();

  // Determine progress percentage
  const getProgress = () => {
    switch (worker.status) {
      case 'IDLE':
        return 0;
      case 'PLANNING':
        return 18;
      case 'RESEARCHING':
        return 40;
      case 'QUALIFYING':
        return 68;
      case 'CONTACT_RESEARCH':
        return 82;
      case 'PERSONALIZING':
        return 92;
      case 'AWAITING_APPROVAL':
        return 95;
      case 'COMPLETED':
        return 100;
      default:
        return 68;
    }
  };

  const progressPercent = getProgress();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Page Title & Operational Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Active staff status, tasks in progress, and work awaiting sign-off
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('workspace')}
            className="px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            Tasks Console
          </button>
          <button
            onClick={() => {
              if (worker.status === 'AWAITING_APPROVAL') {
                onNavigate('prospects');
              } else {
                onNavigate('workspace');
                if (!isRunning) onRunWorker();
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            {worker.status === 'AWAITING_APPROVAL' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-300" />
                <span>Review Approvals (6)</span>
              </>
            ) : isRunning ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Working Console</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Run Staff Member</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4 Core Operations Metrics (Prioritized per spec) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-lg bg-white border border-slate-200">
          <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            Active Staff
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            1 <span className="text-xs font-normal text-slate-500">of 1 Assigned</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Sales Research Staff
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200">
          <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            Tasks in Progress
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {isRunning ? 2 : 0} <span className="text-xs font-normal text-slate-500">Sequential</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {isRunning ? 'Autonomous state machine active' : 'Standing by'}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200">
          <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            Awaiting Approval
          </div>
          <div className="text-2xl font-bold text-blue-700 mt-1">
            6 <span className="text-xs font-normal text-slate-500">Outreach Drafts</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Human supervisor sign-off required
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200">
          <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            Completed Today
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            27 <span className="text-xs font-normal text-slate-500">Actions</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            14 companies qualified
          </div>
        </div>
      </div>

      {/* Staff Member Team Card (Conceptually like an employee on a business team) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-start gap-3.5">
            {/* Initials identity badge */}
            <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 text-slate-900 font-bold text-sm flex items-center justify-center shrink-0">
              SR
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-base font-bold text-slate-900">
                  Sales Research Staff
                </h2>
                <span className="text-xs text-slate-500">
                  (B2B Outbound Research)
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${status.color}`}
                >
                  {status.label}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Autonomous prospecting, qualification scoring, decision maker discovery, and outreach drafting.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('workspace')}
              className="px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
            >
              Open Workspace
            </button>
            <button
              onClick={() => {
                onNavigate('workspace');
                if (!isRunning) onRunWorker();
              }}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Run Staff</span>
            </button>
          </div>
        </div>

        {/* Current Assignment, Progress & Last Activity Block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
          {/* Assignment */}
          <div className="space-y-1">
            <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
              Current Assignment
            </div>
            <div className="text-xs font-semibold text-slate-900 leading-relaxed">
              "{worker.goal}"
            </div>
            <div className="text-[11px] text-slate-500">
              Target: {worker.targetCriteria.industry} ({worker.targetCriteria.location})
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-medium uppercase tracking-wider text-slate-500">
                Progress
              </span>
              <span className="font-bold text-slate-900">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-slate-900 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500">
              Stage: {worker.status.replace(/_/g, ' ')}
            </div>
          </div>

          {/* Last Activity */}
          <div className="space-y-1">
            <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
              Last Activity
            </div>
            <div className="text-xs font-semibold text-slate-900 leading-relaxed">
              {worker.currentActionSummary || 'Evaluated 14 companies matching fleet size criteria.'}
            </div>
            <div className="text-[11px] text-slate-500">
              Tool: analyzeFit()
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Operational Work & Target Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Work Activity (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Recent Work Completed
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Observable decisions, tool invocations, and qualification milestones
              </p>
            </div>
            <button
              onClick={() => onNavigate('activity')}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <span>Full Log</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Structured Operational Activity Feed */}
          <div className="divide-y divide-slate-100">
            {recentActions.slice(0, 5).map((action) => (
              <div key={action.id} className="py-3 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="text-xs font-mono text-slate-400 shrink-0 mt-0.5">
                    {action.timestamp}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                      <span className="text-slate-500 font-normal">Sales Research Staff:</span>
                      <span className="truncate">{action.summary}</span>
                    </div>
                    {action.resultSummary && (
                      <div className="text-xs text-slate-600 mt-0.5">
                        {action.resultSummary}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {action.toolName && (
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
                      {action.toolName}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Awaiting Approval & Criteria (1 col) */}
        <div className="space-y-6">
          {/* Awaiting Approval Notice */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-slate-700" />
                <span>Awaiting Supervisor Approval</span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                6 Pending
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Sales Research Staff has prepared 6 personalized outreach drafts for Canadian logistics software targets. Human sign-off is required prior to sending.
            </p>

            <button
              onClick={() => onNavigate('prospects')}
              className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Review Prepared Outreach →
            </button>
          </div>

          {/* Active Target Criteria Profile */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Assignment Target Parameters
            </h4>

            <div className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="flex justify-between pt-1.5">
                <span className="text-slate-500">Industry</span>
                <span className="font-semibold text-slate-900">{worker.targetCriteria.industry}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-500">Scale / Fleet</span>
                <span className="font-semibold text-slate-900">{worker.targetCriteria.companySize}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-500">Geography</span>
                <span className="font-semibold text-slate-900">{worker.targetCriteria.location}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-500">Target Persona</span>
                <span className="font-semibold text-slate-900">{worker.targetCriteria.targetTitle}</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('prospects')}
              className="w-full pt-2 text-center text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              View 14 Qualified Prospects →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
