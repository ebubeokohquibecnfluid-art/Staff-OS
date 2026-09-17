import React from 'react';
import {
  LayoutGrid,
  Users,
  CheckSquare,
  Activity,
  CheckCircle2,
  Settings,
  Plus,
  Layers,
  X,
} from 'lucide-react';
import { ViewScreen, Worker } from '../../types';

interface SidebarProps {
  currentView: ViewScreen;
  onNavigate: (view: ViewScreen) => void;
  worker: Worker;
  onCreateWorkerClick: () => void;
  isLiveAi: boolean;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface SidebarContentProps {
  currentView: ViewScreen;
  onNavigate: (view: ViewScreen) => void;
  worker: Worker;
  onCreateWorkerClick: () => void;
  isLiveAi: boolean;
  onCloseMobile?: () => void;
  isMobile?: boolean;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  currentView,
  onNavigate,
  worker,
  onCreateWorkerClick,
  isLiveAi,
  onCloseMobile,
  isMobile,
}) => {
  const navItems = [
    { id: 'landing' as ViewScreen, label: 'Overview', icon: LayoutGrid },
    { id: 'dashboard' as ViewScreen, label: 'Dashboard', icon: Layers },
    { id: 'workers' as ViewScreen, label: 'Staff', icon: Users, count: 1 },
    { id: 'workspace' as ViewScreen, label: 'Tasks', icon: CheckSquare },
    { id: 'activity' as ViewScreen, label: 'Activity', icon: Activity },
    { id: 'prospects' as ViewScreen, label: 'Approvals', icon: CheckCircle2, count: worker.stats.approvalsRequired || 6 },
    { id: 'settings' as ViewScreen, label: 'Settings', icon: Settings },
  ];

  const getStatusBadge = () => {
    switch (worker.status) {
      case 'PLANNING':
      case 'RESEARCHING':
      case 'QUALIFYING':
      case 'CONTACT_RESEARCH':
      case 'PERSONALIZING':
        return { label: 'Working', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'AWAITING_APPROVAL':
        return { label: 'Needs approval', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'COMPLETED':
        return { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'FAILED':
        return { label: 'Failed', color: 'bg-rose-50 text-rose-700 border-rose-200' };
      default:
        return { label: 'Ready', color: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const status = getStatusBadge();

  const handleNavClick = (id: ViewScreen) => {
    onNavigate(id);
    if (onCloseMobile) onCloseMobile();
  };

  const handleCreateClick = () => {
    onCreateWorkerClick();
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Top Brand & Navigation */}
      <div>
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200">
          <div
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center">
              <Layers className="w-4 h-4 text-slate-100" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 tracking-tight text-sm leading-none">
                Staff OS
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                Business Operations
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              OPERATIONAL
            </span>
            {isMobile && (
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close navigation"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Primary CTA */}
        <div className="p-3">
          <button
            onClick={handleCreateClick}
            className="w-full flex items-center justify-center gap-2 py-2 px-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Staff Member</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 space-y-0.5 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-slate-200 text-slate-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Staff Team Member Status Card */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50">
        <button
          onClick={() => handleNavClick('workspace')}
          className="w-full text-left p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center shrink-0">
              SR
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-900 truncate">
                Sales Research Staff
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                Active Staff Member
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-100">
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded border ${status.color}`}
            >
              {status.label}
            </span>
            <span className="text-slate-500 group-hover:text-slate-900 font-medium">
              Console →
            </span>
          </div>
        </button>

        {/* Engine Status */}
        <div className="mt-2.5 px-1 flex items-center justify-between text-[10px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isLiveAi ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
            <span>{isLiveAi ? 'Autonomous Engine' : 'Deterministic Engine'}</span>
          </div>
          <span className="text-slate-400 font-mono">v1.2</span>
        </div>
      </div>
    </>
  );
};

export const Sidebar: React.FC<SidebarProps> = (props) => {
  return (
    <>
      {/* Desktop Persistent Sidebar (hidden on mobile, visible on md+) */}
      <aside className="hidden md:flex w-64 h-screen bg-white border-r border-slate-200 flex-col justify-between shrink-0 select-none z-20">
        <SidebarContent {...props} />
      </aside>

      {/* Mobile Slide-in Drawer Modal */}
      {props.isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={props.onCloseMobile}
          />
          {/* Drawer Panel */}
          <aside className="relative w-72 max-w-[85vw] h-full bg-white border-r border-slate-200 flex flex-col justify-between shadow-2xl z-10 select-none">
            <SidebarContent {...props} isMobile />
          </aside>
        </div>
      )}
    </>
  );
};
