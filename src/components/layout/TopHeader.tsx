import React from 'react';
import { Play, CheckCircle2, ArrowRight, Menu, RotateCcw } from 'lucide-react';
import { ViewScreen, Worker } from '../../types';

interface TopHeaderProps {
  currentView: ViewScreen;
  worker: Worker;
  onNavigate: (view: ViewScreen) => void;
  onRunWorker: () => void;
  onNewAssignment?: () => void;
  onResetDemo?: () => void;
  isLiveAi: boolean;
  onOpenMobileMenu?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentView,
  worker,
  onNavigate,
  onRunWorker,
  onNewAssignment,
  onResetDemo,
  isLiveAi,
  onOpenMobileMenu,
}) => {
  const getScreenTitle = () => {
    switch (currentView) {
      case 'landing':
        return { title: 'Staff OS', desc: 'Operating system for autonomous business work' };
      case 'quickstart':
        return { title: 'Quick Start', desc: 'Tell Staff OS what you need done' };
      case 'dashboard':
        return { title: 'Command Center', desc: 'Workforce operations, active assignments, and approvals' };
      case 'workspace':
        return { title: 'Staff Console', desc: 'Execution console, sequential work plan, and live outputs' };
      case 'tasks':
        return { title: 'Task Console', desc: 'Sequential multi-step task decomposition and tool states' };
      case 'approvals':
        return { title: 'Supervision & Approvals', desc: 'Human-in-the-loop review queue for staged actions' };
      case 'workers':
        return { title: 'Workforce Roster', desc: 'Active staff members and specialized operational capabilities' };
      case 'prospects':
        return { title: 'Records & Intelligence', desc: 'Qualified accounts, carriers, and operational CRM entities' };
      case 'results':
        return { title: 'Deliverables & Runs', desc: 'Structured outputs, audit records, and exportable artifacts' };
      case 'activity':
        return { title: 'Activity Telemetry', desc: 'Auditable chronological operational action log' };
      case 'settings':
        return { title: 'Platform Settings', desc: 'Simulation execution parameters and engine configurations' };
      case 'create_worker':
        return { title: 'Add Staff Member', desc: 'Define assignment goal and target criteria' };
      default:
        return { title: 'Staff OS', desc: 'Operating system for autonomous business work' };
    }
  };

  const info = getScreenTitle();
  const isRunning = [
    'PLANNING',
    'RESEARCHING',
    'QUALIFYING',
    'CONTACT_RESEARCH',
    'PERSONALIZING',
  ].includes(worker.status);

  return (
    <header className="h-16 px-4 sm:px-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 gap-3">
      {/* Screen Title & Mobile Menu Toggle */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 -ml-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-1.5 truncate">
            <span className="truncate">{info.title}</span>
            {currentView === 'workspace' && (
              <span className="text-slate-400 font-normal text-xs truncate">/ {worker.name}</span>
            )}
          </h1>
          <p className="text-xs text-slate-500 truncate hidden sm:block">{info.desc}</p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Systems Runtime & Demo State - visible on md+ where header width is spacious to prevent blocking screen title on mobile */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-100/90 border border-slate-200 text-[11px] font-medium text-slate-700">
          <span className="relative flex h-2 w-2 shrink-0">
            {isLiveAi && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isLiveAi ? 'bg-emerald-600' : 'bg-slate-400'
              }`}
            />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-semibold hidden sm:inline">
            ENGINE:
          </span>
          <span className="font-semibold text-slate-800 font-mono text-[11px]">
            {isLiveAi ? 'Autonomous' : 'Deterministic'}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-semibold tracking-wide">
            DEMO
          </span>
        </div>

        {/* Reset Demo button */}
        {onResetDemo && (
          <button
            onClick={onResetDemo}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs text-slate-600 transition-colors cursor-pointer"
            title="Reset platform demo to clean initial state"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span>Reset Demo</span>
          </button>
        )}

        {/* + New Assignment Quick Action */}
        {onNewAssignment && currentView !== 'quickstart' && currentView !== 'landing' && (
          <button
            onClick={onNewAssignment}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer shrink-0"
          >
            <span className="text-emerald-600 font-bold">+</span>
            <span>New Assignment</span>
          </button>
        )}

        {/* Dynamic CTA depending on current view */}
        {currentView !== 'workspace' ? (
          <button
            onClick={() => {
              if (currentView === 'landing') {
                onNavigate('dashboard');
              } else {
                onNavigate('workspace');
                if (!isRunning && worker.status === 'IDLE') {
                  onRunWorker();
                }
              }
            }}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
          >
            {currentView === 'landing' ? (
              <>
                <span className="hidden sm:inline">Explore Platform</span>
                <span className="sm:hidden">Explore</span>
                <ArrowRight className="w-3 h-3 text-slate-400 ml-0.5 shrink-0" />
              </>
            ) : isRunning ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                <span className="hidden sm:inline">Working Console</span>
                <span className="sm:hidden">Working</span>
                <ArrowRight className="w-3 h-3 text-slate-400 ml-0.5 shrink-0" />
              </>
            ) : worker.status === 'AWAITING_APPROVAL' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                <span className="hidden sm:inline">Review Approvals</span>
                <span className="sm:hidden">Approvals</span>
                <ArrowRight className="w-3 h-3 text-slate-400 ml-0.5 shrink-0" />
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white shrink-0" />
                <span className="hidden sm:inline">Run Demo</span>
                <span className="sm:hidden">Run</span>
                <ArrowRight className="w-3 h-3 text-slate-400 ml-0.5 shrink-0" />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            Dashboard
          </button>
        )}
      </div>
    </header>
  );
};
