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
} from 'lucide-react';
import { ExecutionSpeed } from '../../agents/orchestrator';
import { Worker, WorkerAction, WorkerRun } from '../../types';

interface WorkerWorkspaceViewProps {
  worker: Worker;
  activeTool: { name: string; input: unknown; output?: unknown } | null;
  actions: WorkerAction[];
  lastRun: WorkerRun | null;
  onRunWorker: () => void;
  onSkipDemo: () => void;
  onResetWorker: () => void;
  onOpenProspects: () => void;
  speed: ExecutionSpeed;
  onSpeedChange: (speed: ExecutionSpeed) => void;
  simulateErrorAndRetry: boolean;
  onToggleSimulateError: (val: boolean) => void;
  isLiveAi: boolean;
  onToggleLiveAi: (val: boolean) => void;
}

export const WorkerWorkspaceView: React.FC<WorkerWorkspaceViewProps> = ({
  worker,
  activeTool,
  actions,
  lastRun,
  onRunWorker,
  onSkipDemo,
  onResetWorker,
  onOpenProspects,
  speed,
  onSpeedChange,
  simulateErrorAndRetry,
  onToggleSimulateError,
  isLiveAi,
  onToggleLiveAi,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'research' | 'actions' | 'approvals'>('all');

  const isRunning = [
    'PLANNING',
    'RESEARCHING',
    'QUALIFYING',
    'CONTACT_RESEARCH',
    'PERSONALIZING',
  ].includes(worker.status);

  // Define the current work checklist per the specification
  const currentWorkList = [
    {
      id: 'goal',
      label: 'Goal received',
      completedAfter: ['PLANNING', 'RESEARCHING', 'QUALIFYING', 'CONTACT_RESEARCH', 'PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'],
      inProgressWhen: [],
    },
    {
      id: 'plan',
      label: 'Work plan created',
      completedAfter: ['RESEARCHING', 'QUALIFYING', 'CONTACT_RESEARCH', 'PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'],
      inProgressWhen: ['PLANNING'],
    },
    {
      id: 'research',
      label: 'Companies researched',
      completedAfter: ['QUALIFYING', 'CONTACT_RESEARCH', 'PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'],
      inProgressWhen: ['RESEARCHING'],
    },
    {
      id: 'qualify',
      label: 'Companies qualified',
      completedAfter: ['CONTACT_RESEARCH', 'PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'],
      inProgressWhen: ['QUALIFYING'],
    },
    {
      id: 'decision_makers',
      label: 'Researching decision makers',
      completedAfter: ['PERSONALIZING', 'AWAITING_APPROVAL', 'COMPLETED'],
      inProgressWhen: ['CONTACT_RESEARCH'],
    },
    {
      id: 'outreach',
      label: 'Prepare outreach',
      completedAfter: ['AWAITING_APPROVAL', 'COMPLETED'],
      inProgressWhen: ['PERSONALIZING'],
    },
    {
      id: 'approval',
      label: 'Await approval',
      completedAfter: ['COMPLETED'],
      inProgressWhen: ['AWAITING_APPROVAL'],
    },
  ];

  const getWorkItemState = (item: typeof currentWorkList[0]) => {
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
        return { label: 'Working', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'AWAITING_APPROVAL':
        return { label: 'Needs approval', color: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'COMPLETED':
        return { label: 'Completed', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'FAILED':
        return { label: 'Failed', color: 'bg-rose-50 text-rose-800 border-rose-200' };
      default:
        return { label: 'Waiting', color: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const statusBadge = getStatusBadge();

  // Progress percentage matching execution
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
      {/* Console Top Header: Team Member Identity & Assignment */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            {/* Staff Member Initials Avatar */}
            <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 text-slate-900 font-bold text-sm flex items-center justify-center shrink-0">
              SR
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  Sales Research Staff
                </h1>
                <span className="text-xs text-slate-500">
                  (B2B Outbound Research)
                </span>
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded border ${statusBadge.color}`}
                >
                  {statusBadge.label}
                </span>
              </div>

              {/* Current Assignment Callout */}
              <div className="mt-2 text-xs">
                <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] mr-1.5">
                  Current assignment:
                </span>
                <span className="text-slate-900 font-medium">
                  "{worker.goal}"
                </span>
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
                <span>Run Staff Member</span>
              </button>
            ) : (
              <button
                onClick={onSkipDemo}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                title="Fast-forward straight to awaiting approval"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>Skip to Approval</span>
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
                  {s === 'realtime' ? 'Real-time' : s === 'accelerated' ? 'Fast' : 'Instant'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Operational Scope & Simulation Settings */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-600">Target Criteria:</span>
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
              Buyer: {worker.targetCriteria.targetTitle}
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
              <span>Simulate Flake & Retry</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] text-slate-600">
              <input
                type="checkbox"
                checked={isLiveAi}
                onChange={(e) => onToggleLiveAi(e.target.checked)}
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span>Live Engine ({isLiveAi ? 'Active' : 'Deterministic'})</span>
            </label>
          </div>
        </div>
      </div>

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
                  Awaiting Approval
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  6 Drafts Ready
                </span>
              </div>
              <p className="text-xs text-blue-800 mt-1">
                Sales Research Staff has finished company research and prepared personalized outreach. Review the findings and sign off to proceed.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenProspects}
            className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span>Review Outreach Drafts</span>
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
                  PROGRESS
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
                CURRENT WORK
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
                          In Progress
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
                Current Results
              </span>
              <button
                onClick={onOpenProspects}
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                <span>View CRM</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs text-center pt-1">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-500 uppercase">Researched</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">32</div>
                <div className="text-[10px] text-slate-400">candidates</div>
              </div>

              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-500 uppercase">Qualified</div>
                <div className="text-lg font-bold text-emerald-700 mt-0.5">14</div>
                <div className="text-[10px] text-slate-400">target fit</div>
              </div>

              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-500 uppercase">Prepared</div>
                <div className="text-lg font-bold text-blue-700 mt-0.5">6</div>
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
                  Tool Execution
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
                  <span className="text-amber-700 text-[11px]">executing</span>
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
                <span>Standby. No active tool invocation.</span>
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
                  Observable Activity
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chronological record of verified actions (reasoning private)
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
                        <span className="text-slate-500 font-normal">Sales Research Staff:</span>
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
              onClick={onOpenProspects}
              className="text-slate-900 font-semibold hover:underline cursor-pointer"
            >
              Open Approvals Table →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
