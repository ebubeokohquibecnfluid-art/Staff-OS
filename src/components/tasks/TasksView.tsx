import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Search,
  Filter,
  User,
  Layers,
  ChevronRight,
  Code2,
} from 'lucide-react';
import { Worker, WorkerTask } from '../../types';

interface TasksViewProps {
  tasks: WorkerTask[];
  workers: Worker[];
  selectedWorkerId?: string;
  onSelectWorker?: (workerId: string) => void;
  onRunTask?: (taskId: string) => void;
  onNavigateToApprovals?: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  workers,
  selectedWorkerId,
  onSelectWorker,
  onRunTask,
  onNavigateToApprovals,
}) => {
  const [filterWorker, setFilterWorker] = useState<string>(selectedWorkerId || 'all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in_progress' | 'pending' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<WorkerTask | null>(null);

  const filteredTasks = tasks.filter((t) => {
    if (filterWorker !== 'all' && t.workerId !== filterWorker) return false;
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.toolUsed && t.toolUsed.toLowerCase().includes(q)) ||
        (t.workerName && t.workerName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getStatusBadge = (status: WorkerTask['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Completed</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>In Progress</span>
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>Failed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Queued</span>
          </span>
        );
    }
  };

  const getWorkerBadge = (workerId: string, workerName?: string) => {
    const w = workers.find((item) => item.id === workerId);
    const name = workerName || w?.name || 'Staff Member';
    const initials = w?.initials || name.substring(0, 2).toUpperCase();
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
        <span className="w-3.5 h-3.5 rounded-full bg-slate-800 text-white text-[8px] flex items-center justify-center font-bold">
          {initials}
        </span>
        <span className="truncate max-w-[120px]">{name}</span>
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-slate-700" />
            <span>Task Console</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time multi-step task decomposition and tool execution states across staff members
          </p>
        </div>

        {onNavigateToApprovals && (
          <button
            onClick={onNavigateToApprovals}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Approvals Queue</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, tools, outputs..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-slate-50/50"
            />
          </div>

          {/* Worker Filter */}
          <div className="sm:col-span-4">
            <select
              value={filterWorker}
              onChange={(e) => {
                setFilterWorker(e.target.value);
                if (onSelectWorker && e.target.value !== 'all') onSelectWorker(e.target.value);
              }}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">All Staff Members ({tasks.length} tasks)</option>
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.role})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="pending">Queued</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Quick Stats Pill Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Quick counts:</span>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
            Total: {tasks.length}
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">
            Completed: {tasks.filter((t) => t.status === 'completed').length}
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-medium">
            In Progress: {tasks.filter((t) => t.status === 'in_progress').length}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
            Queued: {tasks.filter((t) => t.status === 'pending').length}
          </span>
        </div>
      </div>

      {/* Task List and Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tasks List */}
        <div className={selectedTask ? 'lg:col-span-7 space-y-2.5' : 'lg:col-span-12 space-y-2.5'}>
          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
              <CheckSquare className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-medium text-slate-700">No tasks found matching criteria</p>
              <p className="text-xs text-slate-400 mt-1">Try selecting another filter or clear search</p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isSelected = selectedTask?.id === task.id;
              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className={`bg-white rounded-xl border p-4 transition-all cursor-pointer hover:border-slate-400 shadow-xs ${
                    isSelected ? 'border-slate-900 ring-1 ring-slate-900 bg-slate-50/40' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getWorkerBadge(task.workerId, task.workerName)}
                        {getStatusBadge(task.status)}
                        {task.toolUsed && (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            <Code2 className="w-2.5 h-2.5 text-slate-500" />
                            {task.toolUsed}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900 tracking-tight pt-1">
                        {task.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{task.description}</p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-2" />
                  </div>

                  {/* Summary / Result snippet */}
                  {task.result && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 truncate max-w-[80%]">
                        <span className="font-semibold text-slate-700">Output:</span>{' '}
                        {typeof task.result === 'object'
                          ? Object.entries(task.result)
                              .map(([k, v]) => `${k}: ${v}`)
                              .slice(0, 3)
                              .join(' • ')
                          : String(task.result)}
                      </span>
                      {task.completedAt && (
                        <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                          {new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Task Detail Inspector */}
        {selectedTask && (
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 h-fit sticky top-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Task Inspector
                </span>
                <span className="font-mono text-[11px] text-slate-400">#{selectedTask.id}</span>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-xs text-slate-400 hover:text-slate-700 font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                {selectedTask.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1">{selectedTask.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Assigned Staff</span>
                <span className="font-semibold text-slate-900 truncate block mt-0.5">
                  {selectedTask.workerName || 'Sales Research Staff'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Status</span>
                <div className="mt-0.5">{getStatusBadge(selectedTask.status)}</div>
              </div>
            </div>

            {selectedTask.toolUsed && (
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Bounded Tool Invoked
                </span>
                <div className="p-2.5 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs flex items-center justify-between">
                  <span>{selectedTask.toolUsed}</span>
                  <span className="text-[10px] text-slate-400">Sandboxed</span>
                </div>
              </div>
            )}

            {selectedTask.input && (
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Task Input Parameters
                </span>
                <pre className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-800 overflow-x-auto">
                  {JSON.stringify(selectedTask.input, null, 2)}
                </pre>
              </div>
            )}

            {selectedTask.result && (
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Verified Result Summary
                </span>
                <pre className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200 text-[11px] font-mono text-emerald-900 overflow-x-auto">
                  {JSON.stringify(selectedTask.result, null, 2)}
                </pre>
              </div>
            )}

            {selectedTask.type === 'human_approval' && onNavigateToApprovals && (
              <button
                onClick={onNavigateToApprovals}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Open Approval Queue for this Task</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
