import React from 'react';
import { Play, CheckCircle2, ArrowRight, Menu } from 'lucide-react';
import { ViewScreen, Worker } from '../../types';

interface TopHeaderProps {
  currentView: ViewScreen;
  worker: Worker;
  onNavigate: (view: ViewScreen) => void;
  onRunWorker: () => void;
  isLiveAi: boolean;
  onOpenMobileMenu?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentView,
  worker,
  onNavigate,
  onRunWorker,
  isLiveAi,
  onOpenMobileMenu,
}) => {
  const getScreenTitle = () => {
    switch (currentView) {
      case 'landing':
        return { title: 'Staff OS', desc: 'Operating system for autonomous business work' };
      case 'dashboard':
        return { title: 'Dashboard', desc: 'Workforce operations, active assignments, and approvals' };
      case 'workspace':
        return { title: 'Tasks Console', desc: 'Execution console, sequential work plan, and live outputs' };
      case 'workers':
        return { title: 'Staff Roster', desc: 'Assigned staff members and operational capabilities' };
      case 'prospects':
        return { title: 'Approvals & Research', desc: 'Qualified accounts and prepared outreach awaiting review' };
      case 'activity':
        return { title: 'Activity Log', desc: 'Auditable chronological operational log' };
      case 'settings':
        return { title: 'Settings', desc: 'Execution parameters and platform configurations' };
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
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 -ml-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-1.5 truncate">
            <span>{info.title}</span>
            {currentView === 'workspace' && (
              <span className="text-slate-400 font-normal text-xs truncate">/ {worker.name}</span>
            )}
          </h1>
          <p className="text-xs text-slate-500 truncate hidden sm:block">{info.desc}</p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* Engine Status Tag */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isLiveAi ? 'bg-emerald-500' : 'bg-slate-400'
            }`}
          />
          <span>{isLiveAi ? 'Autonomous Engine' : 'Deterministic Engine'}</span>
        </div>

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
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            {currentView === 'landing' ? (
              <>
                <span>Explore Platform</span>
                <ArrowRight className="w-3 h-3 text-slate-400 ml-0.5" />
              </>
            ) : isRunning ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Working Console</span>
                <ArrowRight className="w-3 h-3 text-slate-400 ml-0.5" />
              </>
            ) : worker.status === 'AWAITING_APPROVAL' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-300" />
                <span>Review Approvals (6)</span>
                <ArrowRight className="w-3 h-3 text-slate-400 ml-0.5" />
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Run Staff Member</span>
                <ArrowRight className="w-3 h-3 text-slate-400 ml-0.5" />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Dashboard
          </button>
        )}
      </div>
    </header>
  );
};
