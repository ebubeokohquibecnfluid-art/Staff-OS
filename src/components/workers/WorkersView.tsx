import React from 'react';
import {
  Plus,
  ArrowRight,
  Users,
  CheckCircle2,
  Clock,
  Headphones,
  FileSearch,
  ShoppingCart,
  Lock,
  Play,
} from 'lucide-react';
import { ViewScreen, Worker } from '../../types';

interface WorkersViewProps {
  worker: Worker;
  onNavigate: (view: ViewScreen) => void;
  onCreateWorkerClick: () => void;
}

export const WorkersView: React.FC<WorkersViewProps> = ({
  worker,
  onNavigate,
  onCreateWorkerClick,
}) => {
  const futureWorkers = [
    {
      id: 'support-worker',
      name: 'Customer Support Staff',
      role: 'Support Operations',
      initials: 'CS',
      description: 'Autonomous tier-1 inquiry qualification, specification lookup, and verified resolution drafts.',
      badge: 'Planned',
    },
    {
      id: 'market-research-worker',
      name: 'Competitive Intelligence Staff',
      role: 'Market Research',
      initials: 'CI',
      description: 'Monitors competitor pricing updates, public filings, and product release logs on an operational schedule.',
      badge: 'Planned',
    },
    {
      id: 'procurement-worker',
      name: 'Vendor RFP Staff',
      role: 'Procurement',
      initials: 'VR',
      description: 'Evaluates vendor bids against technical requirements and produces comparative assessment scorecards.',
      badge: 'Planned',
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Staff Members
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Directory of active and available workforce roles in Staff OS
          </p>
        </div>

        <button
          onClick={onCreateWorkerClick}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Staff Assignment</span>
        </button>
      </div>

      {/* Active Worker Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Active Staff Member
          </span>
          <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            1 Active Assignment
          </span>
        </div>

        {/* Primary Active Worker Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0">
                SR
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900">
                    {worker.name}
                  </h2>
                  <span className="text-xs text-slate-500 font-normal">
                    • {worker.role}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {worker.status === 'PLANNING' || worker.status === 'RESEARCHING' || worker.status === 'QUALIFYING' || worker.status === 'CONTACT_RESEARCH' || worker.status === 'PERSONALIZING' ? 'IN PROGRESS' : worker.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 max-w-xl">
                  {worker.goal}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('workspace')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Open Tasks Console</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="p-3 rounded-md bg-slate-50 border border-slate-100">
              <div className="text-[11px] font-medium text-slate-500">Researched</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                {worker.stats.prospectsResearched || 32} companies
              </div>
            </div>
            <div className="p-3 rounded-md bg-slate-50 border border-slate-100">
              <div className="text-[11px] font-medium text-slate-500">Qualified</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                {worker.stats.qualifiedProspects || 14} accounts
              </div>
            </div>
            <div className="p-3 rounded-md bg-slate-50 border border-slate-100">
              <div className="text-[11px] font-medium text-slate-500">Awaiting Approval</div>
              <div className="text-base font-bold text-blue-700 mt-0.5">
                {worker.stats.approvalsRequired || 6} drafts
              </div>
            </div>
            <div className="p-3 rounded-md bg-slate-50 border border-slate-100">
              <div className="text-[11px] font-medium text-slate-500">Tasks Completed</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                {worker.stats.tasksCompleted || 7} steps
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Planned Future Staff Roles */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Staff Roster Roles
          </span>
          <span className="text-[11px] text-slate-400">
            Standard role definitions for automated business workflows
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {futureWorkers.map((fw) => (
            <div
              key={fw.id}
              className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center">
                    {fw.initials}
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {fw.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{fw.name}</h3>
                <div className="text-[11px] text-slate-500 mb-1">{fw.role}</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {fw.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                Scheduled for platform expansion
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
