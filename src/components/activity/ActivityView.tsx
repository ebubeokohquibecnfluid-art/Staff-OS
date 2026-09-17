import React, { useState } from 'react';
import {
  Activity,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  Terminal,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import { WorkerAction } from '../../types';

interface ActivityViewProps {
  actions: WorkerAction[];
  onClearLog?: () => void;
}

export const ActivityView: React.FC<ActivityViewProps> = ({ actions }) => {
  const [filter, setFilter] = useState<'all' | 'worker_action' | 'research' | 'approval' | 'error'>('all');
  const [copied, setCopied] = useState(false);

  const filteredActions = actions.filter((act) => {
    if (filter === 'all') return true;
    if (filter === 'error') return act.actionType === 'error' || act.status === 'retrying';
    return act.actionType === filter;
  });

  const handleCopy = () => {
    const text = JSON.stringify(filteredActions, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Execution Activity Log
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable audit log of staff operations, research queries, and supervisor authorizations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied JSON' : 'Export Log'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg w-fit text-xs font-medium text-slate-600">
        {[
          { id: 'all', label: 'All Events' },
          { id: 'worker_action', label: 'Staff Operations' },
          { id: 'research', label: 'Account Research' },
          { id: 'approval', label: 'Supervisor Approvals' },
          { id: 'error', label: 'Errors & Retries' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              filter === tab.id
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Timeline Stream */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-2 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {filteredActions.map((action) => (
            <div key={action.id} className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-6 top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-2xs flex items-center justify-center -translate-x-1/2">
                {action.actionType === 'approval' ? (
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                ) : action.actionType === 'error' || action.status === 'retrying' ? (
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                )}
              </div>

              {/* Action Body */}
              <div className="p-3.5 rounded-md border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900">
                      {action.summary}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                        action.actionType === 'approval'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : action.actionType === 'error'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : action.actionType === 'research'
                          ? 'bg-slate-100 text-slate-800 border border-slate-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {action.actionType.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                    {action.toolName && (
                      <span className="text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                        {action.toolName}
                      </span>
                    )}
                    <span>{action.timestamp}</span>
                  </div>
                </div>

                {action.resultSummary && (
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    {action.resultSummary}
                  </p>
                )}

                {action.durationMs && (
                  <div className="text-[10px] text-slate-400 font-mono mt-2">
                    Execution time: {action.durationMs}ms
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
