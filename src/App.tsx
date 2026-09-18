import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Bot, Users, Activity, Menu, CheckSquare, CheckCircle2 } from 'lucide-react';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { DashboardView } from './components/dashboard/DashboardView';
import { WorkerWorkspaceView } from './components/workspace/WorkerWorkspaceView';
import { TasksView } from './components/tasks/TasksView';
import { ApprovalsView } from './components/approvals/ApprovalsView';
import { ProspectsView } from './components/prospects/ProspectsView';
import { ResultsView } from './components/results/ResultsView';
import { ActivityView } from './components/activity/ActivityView';
import { WorkersView } from './components/workers/WorkersView';
import { SettingsView } from './components/settings/SettingsView';
import { CreateWorkerWizard } from './components/wizard/CreateWorkerWizard';
import { LandingView } from './components/landing/LandingView';
import { QuickStartView } from './components/quickstart/QuickStartView';
import {
  INITIAL_ACTIONS,
  INITIAL_COMPLETED_RUN,
  INITIAL_TASKS,
  INITIAL_WORKERS,
  SEEDED_PROSPECTS,
  SEEDED_RUNS,
} from './data/seedData';
import {
  Prospect,
  ViewScreen,
  Worker,
  WorkerAction,
  WorkerRun,
  WorkerTask,
} from './types';
import { ExecutionSpeed, orchestrator } from './agents/orchestrator';
import { aiService, AIConfig } from './services/aiService';

export default function App() {
  const [hasCompletedFirstRun, setHasCompletedFirstRun] = useState<boolean>(() => {
    return localStorage.getItem('staffos_has_completed_first_run') === 'true';
  });

  const [currentView, setCurrentView] = useState<ViewScreen>(() => {
    const firstRunDone = localStorage.getItem('staffos_has_completed_first_run') === 'true';
    return firstRunDone ? 'dashboard' : 'quickstart';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Workforce state (all 5 initial workers)
  const [workers, setWorkers] = useState<Worker[]>(() => {
    const saved = localStorage.getItem('staffos_workers');
    return saved ? JSON.parse(saved) : INITIAL_WORKERS;
  });

  const [activeWorkerId, setActiveWorkerId] = useState<string>(() => {
    return workers[0]?.id || 'worker-alex-mercer';
  });

  const activeWorker = workers.find((w) => w.id === activeWorkerId) || workers[0];

  const [prospects, setProspects] = useState<Prospect[]>(() => {
    const saved = localStorage.getItem('staffos_prospects');
    return saved ? JSON.parse(saved) : SEEDED_PROSPECTS;
  });

  const [actions, setActions] = useState<WorkerAction[]>(() => {
    const saved = localStorage.getItem('staffos_actions');
    return saved ? JSON.parse(saved) : INITIAL_ACTIONS;
  });

  const [tasks, setTasks] = useState<WorkerTask[]>(() => {
    const saved = localStorage.getItem('staffos_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [runs, setRuns] = useState<WorkerRun[]>(() => {
    const saved = localStorage.getItem('staffos_runs');
    return saved ? JSON.parse(saved) : SEEDED_RUNS;
  });

  const [activeTool, setActiveTool] = useState<{ name: string; input: unknown; output?: unknown } | null>(null);

  // Engine Settings
  const [speed, setSpeed] = useState<ExecutionSpeed>('realtime');
  const [simulateErrorAndRetry, setSimulateErrorAndRetry] = useState<boolean>(false);
  const [isLiveAi, setIsLiveAi] = useState<boolean>(true);
  const [aiConfig, setAiConfig] = useState<AIConfig | null>(null);

  // Synchronize localStorage
  useEffect(() => {
    localStorage.setItem('staffos_workers', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('staffos_prospects', JSON.stringify(prospects));
  }, [prospects]);

  useEffect(() => {
    localStorage.setItem('staffos_actions', JSON.stringify(actions));
  }, [actions]);

  useEffect(() => {
    localStorage.setItem('staffos_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('staffos_runs', JSON.stringify(runs));
  }, [runs]);

  // Initial AI config check
  useEffect(() => {
    aiService.getConfig().then((cfg) => {
      setAiConfig(cfg);
      if (!cfg.liveAiAvailable) {
        setIsLiveAi(false);
      }
    });
  }, []);

  // Update a specific worker in the roster
  const updateWorkerInRoster = (updated: Worker) => {
    setWorkers((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
  };

  // Orchestrator callbacks setup
  const getOrchestratorCallbacks = (targetWorker: Worker) => ({
    onWorkerUpdate: (updatedWorker: Worker) => updateWorkerInRoster(updatedWorker),
    onTasksUpdate: (updatedTasks: WorkerTask[]) => setTasks(updatedTasks),
    onActionLogged: (newAction: WorkerAction) => setActions((prev) => [newAction, ...prev]),
    onProspectsUpdate: (updatedProspects: Prospect[]) => setProspects(updatedProspects),
    onRunFinished: (run: WorkerRun) => {
      setRuns((prev) => [run, ...prev]);
      // Mark matching prospects as prepared
      setProspects((prev) =>
        prev.map((p, idx) => {
          if ((!p.workerId || p.workerId === targetWorker.id) && idx < 6 && p.personalizedOutreach) {
            return { ...p, outreachStatus: 'prepared' as const };
          }
          return p;
        })
      );
    },
    onActiveToolChange: (toolInfo: { name: string; input: unknown; output?: unknown } | null) =>
      setActiveTool(toolInfo),
  });

  const handleRunWorker = (targetWorker: Worker = activeWorker) => {
    orchestrator.speed = speed;
    orchestrator.simulateErrorAndRetry = simulateErrorAndRetry;
    orchestrator.forceDemoMode = !isLiveAi;

    orchestrator.runWorker(targetWorker, prospects, getOrchestratorCallbacks(targetWorker));
  };

  const handleSkipDemo = (targetWorker: Worker = activeWorker) => {
    orchestrator.fastForwardToApproval(targetWorker, getOrchestratorCallbacks(targetWorker));
  };

  const handleResetWorker = (targetWorker: Worker = activeWorker) => {
    orchestrator.resetWorker(targetWorker, getOrchestratorCallbacks(targetWorker));
  };

  const handleApproveProspect = (id: string) => {
    setProspects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, outreachStatus: 'approved' as const } : p))
    );

    const approvedItem = prospects.find((p) => p.id === id);

    const approvalAct: WorkerAction = {
      id: `act-appr-${Date.now()}`,
      workerId: approvedItem?.workerId || activeWorker.id,
      actionType: 'approval',
      status: 'completed',
      summary: 'Action authorized by supervisor',
      resultSummary: `Approved operational draft for ${approvedItem?.relevantPerson || 'Recipient'} at ${approvedItem?.company}. Ready for dispatch.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setActions((prev) => [approvalAct, ...prev]);

    // Recalculate remaining approvals on workers
    setWorkers((prev) =>
      prev.map((w) => {
        const remainingForWorker = prospects.filter(
          (p) => (!p.workerId || p.workerId === w.id) && p.id !== id && p.outreachStatus === 'prepared'
        ).length;
        return {
          ...w,
          status: remainingForWorker === 0 ? 'COMPLETED' : w.status,
          stats: {
            ...w.stats,
            approvalsRequired: remainingForWorker,
          },
        };
      })
    );
  };

  const handleRejectProspect = (id: string) => {
    setProspects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, outreachStatus: 'rejected' as const } : p))
    );

    const target = prospects.find((p) => p.id === id);
    const rejectAct: WorkerAction = {
      id: `act-rej-${Date.now()}`,
      workerId: target?.workerId || activeWorker.id,
      actionType: 'approval',
      status: 'completed',
      summary: 'Action draft rejected by supervisor',
      resultSummary: `Supervisor rejected draft for ${target?.company}. Message withheld from external dispatch.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setActions((prev) => [rejectAct, ...prev]);
  };

  const handleSaveOutreach = (id: string, subject: string, body: string) => {
    setProspects((prev) =>
      prev.map((p) => {
        if (p.id === id && p.personalizedOutreach) {
          return {
            ...p,
            personalizedOutreach: {
              ...p.personalizedOutreach,
              subject,
              body,
              version: (p.personalizedOutreach.version || 1) + 1,
            },
          };
        }
        return p;
      })
    );

    const editAct: WorkerAction = {
      id: `act-edit-${Date.now()}`,
      workerId: activeWorker.id,
      actionType: 'approval',
      status: 'completed',
      summary: 'Action draft edited by supervisor',
      resultSummary: `Supervisor customized draft parameters for ${prospects.find((p) => p.id === id)?.company}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setActions((prev) => [editAct, ...prev]);
  };

  const handleBulkApproveAll = () => {
    setProspects((prev) =>
      prev.map((p) =>
        p.outreachStatus === 'prepared' ? { ...p, outreachStatus: 'approved' as const } : p
      )
    );

    const bulkAct: WorkerAction = {
      id: `act-bulk-${Date.now()}`,
      workerId: activeWorker.id,
      actionType: 'approval',
      status: 'completed',
      summary: 'Bulk approval granted across workforce staging queue',
      resultSummary: 'All drafted actions authorized for dispatch by human supervisor.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setActions((prev) => [bulkAct, ...prev]);

    setWorkers((prev) =>
      prev.map((w) => ({
        ...w,
        status: 'COMPLETED',
        currentActionSummary: 'All operational outputs approved and authorized',
        stats: { ...w.stats, approvalsRequired: 0 },
      }))
    );
  };

  const handleWorkerCreated = (newWorker: Worker) => {
    setWorkers((prev) => [newWorker, ...prev]);
    setActiveWorkerId(newWorker.id);
    setCurrentView('workspace');

    setTimeout(() => {
      handleRunWorker(newWorker);
    }, 400);
  };

  const handleResetDemo = () => {
    localStorage.removeItem('staffos_workers');
    localStorage.removeItem('staffos_prospects');
    localStorage.removeItem('staffos_actions');
    localStorage.removeItem('staffos_tasks');
    localStorage.removeItem('staffos_runs');
    localStorage.removeItem('staffos_has_completed_first_run');
    localStorage.removeItem('workeros_worker');
    localStorage.removeItem('workeros_prospects');
    localStorage.removeItem('workeros_actions');

    setWorkers(INITIAL_WORKERS);
    setActiveWorkerId(INITIAL_WORKERS[0].id);
    setProspects(SEEDED_PROSPECTS);
    setActions(INITIAL_ACTIONS);
    setTasks(INITIAL_TASKS);
    setRuns(SEEDED_RUNS);
    setActiveTool(null);
    setHasCompletedFirstRun(false);
    setCurrentView('quickstart');
  };

  const handleStartAssignmentFromQuickStart = (worker: Worker, customGoal: string) => {
    setHasCompletedFirstRun(true);
    localStorage.setItem('staffos_has_completed_first_run', 'true');

    const updatedWorker: Worker = {
      ...worker,
      goal: customGoal.trim() || worker.goal,
      status: 'IDLE',
      currentActionSummary: 'Assignment initialized. Commencing automated execution.',
    };

    setWorkers((prev) =>
      prev.map((w) => (w.id === updatedWorker.id ? updatedWorker : w))
    );
    setActiveWorkerId(updatedWorker.id);
    setCurrentView('workspace');

    setTimeout(() => {
      handleRunWorker(updatedWorker);
    }, 200);
  };

  const handleExplorePlatformFromQuickStart = () => {
    setHasCompletedFirstRun(true);
    localStorage.setItem('staffos_has_completed_first_run', 'true');
    setCurrentView('dashboard');
  };

  // If on landing view, render editorial experience
  if (currentView === 'landing') {
    return (
      <LandingView
        worker={activeWorker}
        onNavigate={(v) => setCurrentView(v)}
        onRunWorker={() => {
          setCurrentView('workspace');
          handleRunWorker(activeWorker);
        }}
        isLiveAi={isLiveAi}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans select-none antialiased">
      {/* Left Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={(v) => {
          setCurrentView(v);
          setIsMobileMenuOpen(false);
        }}
        worker={activeWorker}
        onCreateWorkerClick={() => {
          setCurrentView('create_worker');
          setIsMobileMenuOpen(false);
        }}
        onNewAssignmentClick={() => {
          setCurrentView('quickstart');
          setIsMobileMenuOpen(false);
        }}
        isLiveAi={isLiveAi}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopHeader
          currentView={currentView}
          worker={activeWorker}
          onNavigate={(v) => setCurrentView(v)}
          onRunWorker={() => {
            setCurrentView('workspace');
            handleRunWorker(activeWorker);
          }}
          onNewAssignment={() => setCurrentView('quickstart')}
          onResetDemo={handleResetDemo}
          isLiveAi={isLiveAi}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* View Routing */}
        <main className="flex-1 overflow-y-auto bg-slate-50/70 pb-16 md:pb-0">
          {currentView === 'quickstart' && (
            <QuickStartView
              workers={workers}
              onStartAssignment={handleStartAssignmentFromQuickStart}
              onExplorePlatform={handleExplorePlatformFromQuickStart}
            />
          )}

          {currentView === 'dashboard' && (
            <DashboardView
              workers={workers}
              activeWorker={activeWorker}
              recentActions={actions}
              tasks={tasks}
              onNavigate={(v) => setCurrentView(v)}
              onNewAssignment={() => setCurrentView('quickstart')}
              onSelectWorker={(w) => setActiveWorkerId(w.id)}
              onRunWorker={() => handleRunWorker(activeWorker)}
              onResetDemo={handleResetDemo}
            />
          )}

          {currentView === 'workers' && (
            <WorkersView
              workers={workers}
              activeWorker={activeWorker}
              onSelectWorker={(w) => setActiveWorkerId(w.id)}
              onNavigate={(v) => setCurrentView(v)}
              onCreateWorkerClick={() => setCurrentView('create_worker')}
              onRunWorker={(w) => {
                setActiveWorkerId(w.id);
                setCurrentView('workspace');
                handleRunWorker(w);
              }}
            />
          )}

          {currentView === 'workspace' && (
            <WorkerWorkspaceView
              worker={activeWorker}
              allWorkers={workers}
              onSelectWorker={(w) => setActiveWorkerId(w.id)}
              activeTool={activeTool}
              actions={actions}
              lastRun={runs[0] || INITIAL_COMPLETED_RUN}
              onRunWorker={() => handleRunWorker(activeWorker)}
              onSkipDemo={() => handleSkipDemo(activeWorker)}
              onResetWorker={() => handleResetWorker(activeWorker)}
              onOpenProspects={() => setCurrentView('prospects')}
              onOpenApprovals={() => setCurrentView('approvals')}
              speed={speed}
              onSpeedChange={(s) => setSpeed(s)}
              simulateErrorAndRetry={simulateErrorAndRetry}
              onToggleSimulateError={(val) => setSimulateErrorAndRetry(val)}
              isLiveAi={isLiveAi}
              onToggleLiveAi={(val) => setIsLiveAi(val)}
              onNavigate={(v) => setCurrentView(v)}
              onNewAssignment={() => setCurrentView('quickstart')}
            />
          )}

          {currentView === 'tasks' && (
            <TasksView
              tasks={tasks}
              workers={workers}
              selectedWorkerId={activeWorker.id}
              onSelectWorker={(id) => setActiveWorkerId(id)}
              onNavigateToApprovals={() => setCurrentView('approvals')}
            />
          )}

          {currentView === 'approvals' && (
            <ApprovalsView
              prospects={prospects}
              onApproveProspect={handleApproveProspect}
              onRejectProspect={handleRejectProspect}
              onSaveOutreach={handleSaveOutreach}
              onBulkApproveAll={handleBulkApproveAll}
            />
          )}

          {currentView === 'prospects' && (
            <ProspectsView
              prospects={prospects}
              onApproveProspect={handleApproveProspect}
              onRejectProspect={handleRejectProspect}
              onSaveOutreach={handleSaveOutreach}
              onBulkApproveAll={handleBulkApproveAll}
            />
          )}

          {currentView === 'results' && (
            <ResultsView
              runs={runs}
              prospects={prospects}
              workers={workers}
              onNavigateToWorker={(id) => {
                setActiveWorkerId(id);
                setCurrentView('workspace');
              }}
            />
          )}

          {currentView === 'activity' && (
            <ActivityView actions={actions} />
          )}

          {currentView === 'settings' && (
            <SettingsView
              isLiveAi={isLiveAi}
              onToggleLiveAi={(val) => setIsLiveAi(val)}
              onResetAllData={handleResetDemo}
              aiConfig={aiConfig}
            />
          )}

          {currentView === 'create_worker' && (
            <CreateWorkerWizard
              onWorkerCreated={handleWorkerCreated}
              onCancel={() => setCurrentView('dashboard')}
            />
          )}
        </main>

        {/* Mobile Quick Bottom Navigation Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-around z-30 px-2 shadow-xs">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center justify-center py-1 px-2 text-[10px] font-medium transition-colors cursor-pointer ${
              currentView === 'dashboard' ? 'text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mb-0.5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setCurrentView('workers')}
            className={`flex flex-col items-center justify-center py-1 px-2 text-[10px] font-medium transition-colors cursor-pointer ${
              currentView === 'workers' ? 'text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4 mb-0.5" />
            <span>Workforce</span>
          </button>
          <button
            onClick={() => setCurrentView('workspace')}
            className={`flex flex-col items-center justify-center py-1 px-2 text-[10px] font-medium transition-colors cursor-pointer ${
              currentView === 'workspace' ? 'text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bot className="w-4 h-4 mb-0.5" />
            <span>Console</span>
          </button>
          <button
            onClick={() => setCurrentView('approvals')}
            className={`flex flex-col items-center justify-center py-1 px-2 text-[10px] font-medium transition-colors cursor-pointer ${
              currentView === 'approvals' ? 'text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 mb-0.5" />
            <span>Approvals</span>
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2 text-[10px] font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <Menu className="w-4 h-4 mb-0.5" />
            <span>Menu</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
