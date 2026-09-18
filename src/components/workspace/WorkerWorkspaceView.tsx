import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  FastForward,
  CheckCircle2,
  Terminal,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Code2,
  CheckSquare,
  Users,
} from 'lucide-react';
import { ExecutionSpeed } from '../../agents/orchestrator';
import { Worker, WorkerAction, WorkerRun } from '../../types';

interface WorkerWorkspaceViewProps {
  worker: Worker;
  allWorkers: Worker[];
  onSelectWorker: (worker: Worker) => void;
  activeTool: { name: string; input: unknown; output?: unknown } | null;
  actions: WorkerAction[];
  lastRun: WorkerRun | null;
  onRunWorker: () => void;
  onSkipDemo: () => void;
  onResetWorker: () => void;
  onOpenProspects: () => void;
  onOpenApprovals: () => void;
  speed: ExecutionSpeed;
  onSpeedChange: (speed: ExecutionSpeed) => void;
  simulateErrorAndRetry: boolean;
  onToggleSimulateError: (val: boolean) => void;
  isLiveAi: boolean;
  onToggleLiveAi: (val: boolean) => void;
  onNavigate?: (view: any) => void;
  onNewAssignment?: () => void;
}

export const WorkerWorkspaceView: React.FC<WorkerWorkspaceViewProps> = ({
  worker,
  allWorkers,
  onSelectWorker,
  activeTool,
  actions,
  lastRun,
  onRunWorker,
  onSkipDemo,
  onResetWorker,
  onOpenProspects,
  onOpenApprovals,
  speed,
  onSpeedChange,
  simulateErrorAndRetry,
  onToggleSimulateError,
  isLiveAi,
  onToggleLiveAi,
  onNavigate,
  onNewAssignment,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'research' | 'actions' | 'approvals'>('all');

  const isRunning = [
    'PLANNING',
    'RESEARCHING',
    'QUALIFYING',
    'CONTACT_RESEARCH',
    'PERSONALIZING',
  ].includes(worker.status);

  // Dynamic Work Checklist customized by Worker Domain
  const getWorkListForWorker = () => {
    if (worker.id.includes('jordan') || worker.role.toLowerCase().includes('freight')) {
      return [
        { id: 'goal', label: 'Freight goal received', completedAfter: ['PLANNING', 'RESEARCHING', 'QUALIFYING', 'CONTACT_RESEARCH', 'PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: [] },
        { id: 'plan', label: 'Procurement plan created', completedAfter: ['RESEARCHING', 'QUALIFYING', 'CONTACT_RESEARCH', 'PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: ['PLANNING'] },
        { id: 'research', label: 'Regional carriers searched', completedAfter: ['QUALIFYING', 'CONTACT_RESEARCH', 'PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: ['RESEARCHING'] },
        { id: 'qualify', label: 'Safety & authority verified', completedAfter: ['CONTACT_RESEARCH', 'PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: ['QUALIFYING'] },
        { id: 'decision_makers', label: 'Dispatch capacity matched', completedAfter: ['PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: ['CONTACT_RESEARCH'] },
        { id: 'outreach', label: 'Spot booking drafts prepared', completedAfter: ['AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: ['PERSONALIZING'] },
        { id: 'approval', label: 'Await supervisor sign-off', completedAfter: ['COMPLETED'], inProgressWhen: ['AWAITING_APPROVAL'] },
      ];
    }
    if (worker.id.includes('logistics') || worker.role.toLowerCase().includes('hub')) {
      return [
        { id: 'goal', label: 'Corridor telemetry ingested', completedAfter: ['PLANNING', 'RESEARCHING', 'QUALIFYING', 'CONTACT_RESEARCH', 'PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: [] },
        { id: 'plan', label: 'Hub optimization plan formulated', completedAfter: ['RESEARCHING', 'QUALIFYING', 'CONTACT_RESEARCH', 'PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: ['PLANNING'] },
        { id: 'research', label: 'Cross-dock turnaround monitored', completedAfter: ['QUALIFYING', 'CONTACT_RESEARCH', 'PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: ['RESEARCHING'] },
        { id: 'qualify', label: 'Turnaround bottlenecks diagnosed', completedAfter: ['CONTACT_RESEARCH', 'PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: ['QUALIFYING'] },
        { id: 'decision_makers', label: 'Fleet rebalancing modeled', completedAfter: ['PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: ['CONTACT_RESEARCH'] },
        { id: 'outreach', label: 'Corridor directives drafted', completedAfter: ['AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: ['PERSONALIZING'] },
        { id: 'approval', label: 'Await supervisor sign-off', completedAfter: ['COMPLETED'], inProgressWhen: ['AWAITING_APPROVAL'] },
      ];
    }
    if (worker.id.includes('morgan') || worker.role.toLowerCase().includes('compliance')) {
      return [
        { id: 'goal', label: 'Compliance mandate received', completedAfter: ['PLANNING', 'RESEARCHING', 'QUALIFYING', 'CONTACT_RESEARCH', 'PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: [] },
        { id: 'plan', label: 'Regulatory audit plan created', completedAfter: ['RESEARCHING', 'QUALIFYING', 'CONTACT_RESEARCH', 'PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: ['PLANNING'] },
        { id: 'research', label: 'ELD driver logs inspected', completedAfter: ['QUALIFYING', 'CONTACT_RESEARCH', 'PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: ['RESEARCHING'] },
        { id: 'qualify', label: 'HOS threshold breaches scored', completedAfter: ['CONTACT_RESEARCH', 'PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: ['QUALIFYING'] },
        { id: 'decision_makers', label: 'Safety risk categorized', completedAfter: ['PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: ['CONTACT_RESEARCH'] },
        { id: 'outreach', label: 'Compliance audit notices drafted', completedAfter: ['AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: ['PERSONALIZING'] },
        { id: 'approval', label: 'Await supervisor sign-off', completedAfter: ['COMPLETED'], inProgressWhen: ['AWAITING_APPROVAL'] },
      ];
    }
    if (worker.id.includes('elena') || worker.role.toLowerCase().includes('support')) {
      return [
        { id: 'goal', label: 'Customer ticket queue ingested', completedAfter: ['PLANNING', 'RESEARCHING', 'QUALIFYING', 'CONTACT_RESEARCH', 'PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: [] },
        { id: 'plan', label: 'Resolution protocol initiated', completedAfter: ['RESEARCHING', 'QUALIFYING', 'CONTACT_RESEARCH', 'PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: ['PLANNING'] },
        { id: 'research', label: 'Telematics & GPS cross-referenced', completedAfter: ['QUALIFYING', 'CONTACT_RESEARCH', 'PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: ['RESEARCHING'] },
        { id: 'qualify', label: 'Contract SLA breach risk analyzed', completedAfter: ['CONTACT_RESEARCH', 'PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: ['QUALIFYING'] },
        { id: 'decision_makers', label: 'Root cause verified', completedAfter: ['PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: ['CONTACT_RESEARCH'] },
        { id: 'outreach', label: 'Resolution responses prepared', completedAfter: ['AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: ['PERSONALIZING'] },
        { id: 'approval', label: 'Await supervisor sign-off', completedAfter: ['COMPLETED'], inProgressWhen: ['AWAITING_APPROVAL'] },
      ];
    }
    // Default / Alex Mercer
    return [
      { id: 'goal', label: 'Goal received', completedAfter: ['PLANNING', 'RESEARCHING', 'QUALIFYING', 'CONTACT_RESEARCH', 'PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: [] },
      { id: 'plan', label: 'Research plan created', completedAfter: ['RESEARCHING', 'QUALIFYING', 'CONTACT_RESEARCH', 'PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: ['PLANNING'] },
      { id: 'research', label: 'Companies researched', completedAfter: ['QUALIFYING', 'CONTACT_RESEARCH', 'PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: ['RESEARCHING'] },
      { id: 'qualify', label: 'Companies qualified', completedAfter: ['CONTACT_RESEARCH', 'PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: ['QUALIFYING'] },
      { id: 'decision_makers', label: 'Decision makers identified', completedAfter: ['PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: ['CONTACT_RESEARCH'] },
      { id: 'outreach', label: 'Personalized outreach prepared', completedAfter: ['AWAITING_APPROVAL', 'COMPLETED'], inProgressWhen: ['PERSONALIZING'] },
      { id: 'approval', label: 'Await supervisor approval', completedAfter: ['COMPLETED'], inProgressWhen: ['AWAITING_APPROVAL'] },
    ];
  };

  const currentWorkList = getWorkListForWorker();

  const getWorkItemState = (item: (typeof currentWorkList)[0]) => {
    if (item.completedAfter.includes(worker.status)) return 'completed';
    if (item.inProgressWhen.includes(worker.status)) return 'in_progress';
    return 'pending';
  };

  const getStatusBadge = () => {
    switch (worker.status) {
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
        return { label: 'Ready', color: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const statusBadge = getStatusBadge();

  const getProgressPercentage = () => {
    switch (worker.status) {
      case 'IDLE':
        return 0;
      case 'PLANNING':
        return 18;
      case 'RESEARCHING':
        return 38;
      case 'QUALIFYING':
        return 68;
      case 'CONTACT_RESEARCH':
        return 78;
      case 'PERSONALIZING':
        return 90;
      case 'AWAITING_APPROVAL':
        return 95;
      case 'COMPLETED':
        return 100;
      default:
        return 68;
    }
  };

  const progressPercent = getProgressPercentage();

  const filteredActions = actions.filter((a) => {
    if (filterType === 'research') return a.actionType === 'research';
    if (filterType === 'actions') return a.actionType === 'worker_action';
    if (filterType === 'approvals') return a.actionType === 'approval';
    return true;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Top Staff Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1 shrink-0">
          Staff Console:
        </span>
        {allWorkers.map((w, idx) => {
          const isSelected = w.id === worker.id;
          return (
            <button
              key={w.id}
              onClick={() => onSelectWorker(w)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span
                className={`w-4 h-4 rounded text-[9px] flex items-center justify-center font-bold ${
                  isSelected ? 'bg-slate-800 text-slate-100' : 'bg-slate-200 text-slate-700'
                }`}
              >
                0{idx + 1}
              </span>
              <span>{w.name}</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  w.status === 'AWAITING_APPROVAL'
                    ? 'bg-blue-400'
                    : w.status === 'COMPLETED'
                    ? 'bg-emerald-400'
                    : isRunning
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-slate-300'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Console Top Header: Team Member Identity & Assignment */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            {/* Staff Member Initials Avatar */}
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
              {worker.initials || worker.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  {worker.name}
                </h1>
                <span className="text-xs text-slate-500 font-medium">({worker.role})</span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusBadge.color}`}
                >
                  {statusBadge.label}
                </span>
              </div>

              {/* Current Assignment Callout */}
              <div className="mt-2 text-xs">
                <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] mr-1.5">
                  Assigned Directive:
                </span>
                <span className="text-slate-900 font-medium">"{worker.goal}"</span>
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {!isRunning ? (
              <button
                onClick={onRunWorker}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Execute Directive</span>
              </button>
            ) : (
              <button
                onClick={onSkipDemo}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                title="Immediately move worker to awaiting approval"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>Skip Demo</span>
              </button>
            )}

            <button
              onClick={onResetWorker}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
              title="Reset state to initial"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset</span>
            </button>

            {/* Speed Selector */}
            <div className="hidden sm:flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium text-slate-600">
              {(['realtime', 'accelerated', 'instant'] as ExecutionSpeed[]).map((s) => (
                <button
                  key={s}
                  onClick={() => onSpeedChange(s)}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer capitalize text-[11px] ${
                    speed === s
                      ? 'bg-white text-slate-900 font-semibold shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {s === 'realtime' ? '1x Realtime' : s === 'accelerated' ? '4x Fast' : 'Instant'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Operational Scope & Simulation Settings */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-600">Operational Target:</span>
            <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-700 text-[11px]">
              {worker.targetCriteria.industry}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-700 text-[11px]">
              {worker.targetCriteria.companySize}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-700 text-[11px]">
              {worker.targetCriteria.location}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-700 text-[11px]">
              Sign-off: {worker.targetCriteria.targetTitle}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] text-slate-600">
              <input
                type="checkbox"
                checked={simulateErrorAndRetry}
                onChange={(e) => onToggleSimulateError(e.target.checked)}
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span>Simulate Flake & Auto-Retry</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] text-slate-600">
              <input
                type="checkbox"
                checked={isLiveAi}
                onChange={(e) => onToggleLiveAi(e.target.checked)}
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span>Engine Mode ({isLiveAi ? 'Autonomous LLM' : 'Deterministic Simulation'})</span>
            </label>
          </div>
        </div>
      </div>

      {/* Active Running Progress Indicator Banner */}
      {isRunning && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-pulse shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
            </span>
            <div>
              <div className="text-xs font-bold text-amber-950 flex items-center gap-2">
                <span>{worker.name}</span>
                <span className="text-amber-800 font-normal">({worker.role})</span>
              </div>
              <div className="text-xs text-amber-800 mt-0.5">
                Working on your assignment... Running automated research, qualification, and draft synthesis.
              </div>
            </div>
          </div>
          <button
            onClick={onSkipDemo}
            className="px-3.5 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 text-xs font-semibold hover:bg-amber-100 transition-colors cursor-pointer shrink-0 self-start sm:self-auto shadow-2xs"
          >
            Skip Demo
          </button>
        </div>
      )}

      {/* Assignment Complete Summary Card */}
      {(worker.status === 'AWAITING_APPROVAL' || worker.status === 'COMPLETED') && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">Assignment complete</h2>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {worker.name} researched {worker.stats.prospectsResearched || 8} entities and identified {worker.stats.qualifiedProspects || 3} potential prospects.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenApprovals}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <span>Review Results</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="font-bold text-slate-900 text-base">{worker.stats.qualifiedProspects || 3}</div>
              <div className="text-slate-500 text-[11px] mt-0.5">prospects found</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="font-bold text-slate-900 text-base">{worker.stats.decisionMakersIdentified || 2}</div>
              <div className="text-slate-500 text-[11px] mt-0.5">decision makers identified</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="font-bold text-slate-900 text-base">{worker.stats.outreachPrepared || 2}</div>
              <div className="text-slate-500 text-[11px] mt-0.5">outreach drafts prepared</div>
            </div>
            <div className="p-3 rounded-lg bg-blue-50/80 border border-blue-100">
              <div className="font-bold text-blue-900 text-base">{worker.stats.approvalsRequired || 2}</div>
              <div className="text-blue-700 text-[11px] mt-0.5">waiting for your approval</div>
            </div>
          </div>

          {/* Platform introduction prompt after assignment completion */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70 p-3.5 rounded-lg border border-slate-100">
            <div>
              <div className="text-xs font-bold text-slate-900">Your staff is ready.</div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Now that you've seen how Staff OS works, you can manage all of your staff, tasks, and results from the platform.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {onNewAssignment && (
                <button
                  onClick={onNewAssignment}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Run another assignment
                </button>
              )}
              {onNavigate && (
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Go to Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Human Approval Alert Banner */}
      {worker.status === 'AWAITING_APPROVAL' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                  Human Supervisor Approval Required
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {worker.stats.approvalsRequired || 6} Outputs Staged
                </span>
              </div>
              <p className="text-xs text-blue-800 mt-1">
                {worker.name} has completed research, qualification, and draft synthesis. System execution is paused until a human supervisor authorizes dispatch.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenApprovals}
            className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span>Open Approvals Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Workspace 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: PROGRESS & CURRENT WORK CHECKLIST (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Progress & Current Work Console Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
            {/* Progress Section */}
            <div className="space-y-2 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  TASK PROGRESSION
                </span>
                <span className="text-sm font-bold text-slate-900 font-mono">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-slate-900 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Current Work Checklist */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                SEQUENTIAL EXECUTION PLAN
              </div>

              <div className="space-y-2 font-mono text-xs">
                {currentWorkList.map((item) => {
                  const state = getWorkItemState(item);
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between py-1.5 px-2.5 rounded transition-colors ${
                        state === 'in_progress'
                          ? 'bg-amber-50 text-amber-900 font-medium'
                          : state === 'completed'
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-4 text-center font-bold">
                          {state === 'completed' ? '✓' : state === 'in_progress' ? '→' : '○'}
                        </span>
                        <span>{item.label}</span>
                      </div>

                      {state === 'in_progress' && (
                        <span className="text-[10px] uppercase font-sans font-semibold text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded">
                          Executing
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Useful Results Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Staff Deliverables
              </span>
              <button
                onClick={onOpenProspects}
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                <span>Inspect Records</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs text-center pt-1">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-500 uppercase">Researched</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">
                  {worker.stats.prospectsResearched || 32}
                </div>
                <div className="text-[10px] text-slate-400">entities</div>
              </div>

              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-500 uppercase">Qualified</div>
                <div className="text-lg font-bold text-emerald-700 mt-0.5">
                  {worker.stats.qualifiedProspects || 14}
                </div>
                <div className="text-[10px] text-slate-400">target fit</div>
              </div>

              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-500 uppercase">Sign-offs</div>
                <div className="text-lg font-bold text-blue-700 mt-0.5">
                  {worker.stats.approvalsRequired || 6}
                </div>
                <div className="text-[10px] text-slate-400">drafts</div>
              </div>
            </div>
          </div>

          {/* Tool Execution Inspection Panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Sandboxed Tool Execution
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                Structured Payload
              </span>
            </div>

            {activeTool ? (
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center text-slate-800">
                  <span className="font-semibold">Tool: {activeTool.name}</span>
                  <span className="text-amber-700 text-[11px] animate-pulse">executing</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 text-slate-100 text-[11px] overflow-x-auto max-h-40">
                  <div className="text-slate-400 mb-1">// Tool Arguments:</div>
                  <pre className="text-slate-200">
                    {JSON.stringify(activeTool.input, null, 2)}
                  </pre>
                  {Boolean(activeTool.output) && (
                    <>
                      <div className="text-slate-400 mt-2 mb-1">// Output Payload:</div>
                      <pre className="text-emerald-300">
                        {JSON.stringify(activeTool.output, null, 2)}
                      </pre>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-3 rounded bg-slate-50 border border-slate-100 text-xs text-slate-500 text-center">
                <span>Standby. Worker awaiting execution command or user prompt.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: OBSERVABLE ACTIVITY FEED (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Observable Activity Stream
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chronological record of verified operational actions
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-1 text-[11px]">
                {(['all', 'research', 'actions', 'approvals'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilterType(tab)}
                    className={`px-2 py-1 rounded capitalize transition-colors cursor-pointer ${
                      filterType === tab
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Structured Operational Log */}
            <div className="divide-y divide-slate-100 max-h-[580px] overflow-y-auto pr-1">
              {filteredActions.map((action) => (
                <div key={action.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="text-xs font-mono text-slate-400 shrink-0 mt-0.5">
                      {action.timestamp}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 flex flex-wrap items-center gap-1.5">
                        <span className="text-slate-500 font-normal">{worker.name}:</span>
                        <span>{action.summary}</span>
                        {action.status === 'retrying' && (
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                            Auto-Retrying
                          </span>
                        )}
                      </div>

                      {action.resultSummary && (
                        <div className="text-xs text-slate-600 mt-1 leading-relaxed">
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

          {/* Footer note */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Observable operational log • Chain-of-thought suppressed</span>
            <button
              onClick={onOpenApprovals}
              className="text-slate-900 font-semibold hover:underline cursor-pointer"
            >
              Open Approvals Queue →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
