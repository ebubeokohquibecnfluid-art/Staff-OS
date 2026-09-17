import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Bot, Users, Activity, Menu } from 'lucide-react';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { DashboardView } from './components/dashboard/DashboardView';
import { WorkerWorkspaceView } from './components/workspace/WorkerWorkspaceView';
import { ProspectsView } from './components/prospects/ProspectsView';
import { ActivityView } from './components/activity/ActivityView';
import { WorkersView } from './components/workers/WorkersView';
import { SettingsView } from './components/settings/SettingsView';
import { CreateWorkerWizard } from './components/wizard/CreateWorkerWizard';
import { LandingView } from './components/landing/LandingView';
import {
  INITIAL_ACTIONS,
  INITIAL_COMPLETED_RUN,
  INITIAL_TASKS,
  INITIAL_WORKER,
  SEEDED_PROSPECTS,
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
  const [currentView, setCurrentView] = useState<ViewScreen>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Core Persistent State
  const [worker, setWorker] = useState<Worker>(() => {
    const saved = localStorage.getItem('workeros_worker');
    return saved ? JSON.parse(saved) : INITIAL_WORKER;
  });

  const [prospects, setProspects] = useState<Prospect[]>(() => {
    const saved = localStorage.getItem('workeros_prospects');
    return saved ? JSON.parse(saved) : SEEDED_PROSPECTS;
  });

  const [actions, setActions] = useState<WorkerAction[]>(() => {
    const saved = localStorage.getItem('workeros_actions');
    return saved ? JSON.parse(saved) : INITIAL_ACTIONS;
  });

  const [tasks, setTasks] = useState<WorkerTask[]>(INITIAL_TASKS);
  const [lastRun, setLastRun] = useState<WorkerRun | null>(INITIAL_COMPLETED_RUN);
  const [activeTool, setActiveTool] = useState<{ name: string; input: unknown; output?: unknown } | null>(null);

  // Engine Settings
  const [speed, setSpeed] = useState<ExecutionSpeed>('realtime');
  const [simulateErrorAndRetry, setSimulateErrorAndRetry] = useState<boolean>(false);
  const [isLiveAi, setIsLiveAi] = useState<boolean>(true);
  const [aiConfig, setAiConfig] = useState<AIConfig | null>(null);

  // Synchronize localStorage
  useEffect(() => {
    localStorage.setItem('workeros_worker', JSON.stringify(worker));
  }, [worker]);

  useEffect(() => {
    localStorage.setItem('workeros_prospects', JSON.stringify(prospects));
  }, [prospects]);

  useEffect(() => {
    localStorage.setItem('workeros_actions', JSON.stringify(actions));
  }, [actions]);

  // Initial config check
  useEffect(() => {
    aiService.getConfig().then((cfg) => {
      setAiConfig(cfg);
      if (!cfg.liveAiAvailable) {
        setIsLiveAi(false);
      }
    });
  }, []);

  // Orchestrator callbacks setup
  const getOrchestratorCallbacks = () => ({
    onWorkerUpdate: (updatedWorker: Worker) => setWorker(updatedWorker),
    onTasksUpdate: (updatedTasks: WorkerTask[]) => setTasks(updatedTasks),
    onActionLogged: (newAction: WorkerAction) => setActions((prev) => [newAction, ...prev]),
    onProspectsUpdate: (updatedProspects: Prospect[]) => setProspects(updatedProspects),
    onRunFinished: (run: WorkerRun) => {
      setLastRun(run);
      // Mark 6 prospects as prepared
      setProspects((prev) =>
        prev.map((p, idx) => {
          if (idx < 6 && p.personalizedOutreach) {
            return { ...p, outreachStatus: 'prepared' as const };
          }
          return p;
        })
      );
    },
    onActiveToolChange: (toolInfo: { name: string; input: unknown; output?: unknown } | null) =>
      setActiveTool(toolInfo),
  });

  const handleRunWorker = () => {
    orchestrator.speed = speed;
    orchestrator.simulateErrorAndRetry = simulateErrorAndRetry;
    orchestrator.forceDemoMode = !isLiveAi;

    orchestrator.runWorker(worker, prospects, getOrchestratorCallbacks());
  };

  const handleSkipDemo = () => {
    orchestrator.fastForwardToApproval(worker, getOrchestratorCallbacks());
  };

  const handleResetWorker = () => {
    orchestrator.resetWorker(worker, getOrchestratorCallbacks());
  };

  const handleApproveProspect = (id: string) => {
    setProspects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, outreachStatus: 'approved' as const } : p))
    );

    // Log approval action
    const approvalAct: WorkerAction = {
      id: `act-appr-${Date.now()}`,
      workerId: worker.id,
      actionType: 'approval',
      status: 'completed',
      summary: 'Outreach approved for sending',
      resultSummary: `Approved personalized email draft for ${prospects.find((p) => p.id === id)?.relevantPerson} at ${prospects.find((p) => p.id === id)?.company}. Ready for dispatch.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setActions((prev) => [approvalAct, ...prev]);

    // If all prepared messages are approved, mark worker as completed!
    setWorker((prev) => {
      const remainingAwaiting = prospects.filter(
        (p) => p.id !== id && p.outreachStatus === 'prepared'
      ).length;

      return {
        ...prev,
        status: remainingAwaiting === 0 ? 'COMPLETED' : 'AWAITING_APPROVAL',
        currentActionSummary:
          remainingAwaiting === 0
            ? 'All outreach approved and queued for dispatch'
            : `${remainingAwaiting} messages awaiting approval`,
        stats: {
          ...prev.stats,
          approvalsRequired: remainingAwaiting,
        },
      };
    });
  };

  const handleRejectProspect = (id: string) => {
    setProspects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, outreachStatus: 'rejected' as const } : p))
    );

    const rejectAct: WorkerAction = {
      id: `act-rej-${Date.now()}`,
      workerId: worker.id,
      actionType: 'approval',
      status: 'completed',
      summary: 'Outreach draft rejected',
      resultSummary: `Supervisor rejected draft for ${prospects.find((p) => p.id === id)?.company}. Message withheld from dispatch.`,
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
              version: p.personalizedOutreach.version + 1,
            },
          };
        }
        return p;
      })
    );

    const editAct: WorkerAction = {
      id: `act-edit-${Date.now()}`,
      workerId: worker.id,
      actionType: 'approval',
      status: 'completed',
      summary: 'Outreach edited by supervisor',
      resultSummary: `Updated message subject and body for ${prospects.find((p) => p.id === id)?.company}.`,
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
      workerId: worker.id,
      actionType: 'approval',
      status: 'completed',
      summary: 'Bulk approval granted for all 6 outreach messages',
      resultSummary: 'All drafted emails marked "Approved for sending" by human supervisor.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setActions((prev) => [bulkAct, ...prev]);

    setWorker((prev) => ({
      ...prev,
      status: 'COMPLETED',
      currentActionSummary: 'All outreach approved and queued for dispatch',
      stats: { ...prev.stats, approvalsRequired: 0 },
    }));
  };

  const handleWorkerCreated = (newWorker: Worker) => {
    setWorker(newWorker);
    setCurrentView('workspace');

    // Automatically trigger planning on new worker
    setTimeout(() => {
      orchestrator.speed = speed;
      orchestrator.forceDemoMode = !isLiveAi;
      orchestrator.runWorker(newWorker, prospects, getOrchestratorCallbacks());
    }, 400);
  };

  const handleResetAllData = () => {
    localStorage.removeItem('workeros_worker');
    localStorage.removeItem('workeros_prospects');
    localStorage.removeItem('workeros_actions');
    setWorker(INITIAL_WORKER);
    setProspects(SEEDED_PROSPECTS);
    setActions(INITIAL_ACTIONS);
    setTasks(INITIAL_TASKS);
    setLastRun(INITIAL_COMPLETED_RUN);
    setActiveTool(null);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans select-none antialiased">
      {/* Left Sidebar (Desktop persistent, Mobile slide-in drawer) */}
      <Sidebar
        currentView={currentView}
        onNavigate={(v) => {
          setCurrentView(v);
          setIsMobileMenuOpen(false);
        }}
        worker={worker}
        onCreateWorkerClick={() => {
          setCurrentView('create_worker');
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
          worker={worker}
          onNavigate={(v) => setCurrentView(v)}
          onRunWorker={() => {
            setCurrentView('workspace');
            handleRunWorker();
          }}
          isLiveAi={isLiveAi}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* View Routing */}
        <main className="flex-1 overflow-y-auto bg-slate-50/70 pb-16 md:pb-0">
          {currentView === 'dashboard' && (
            <DashboardView
              worker={worker}
              recentActions={actions}
              onNavigate={(v) => setCurrentView(v)}
              onRunWorker={handleRunWorker}
            />
          )}

          {currentView === 'workspace' && (
            <WorkerWorkspaceView
              worker={worker}
              activeTool={activeTool}
              actions={actions}
              lastRun={lastRun}
              onRunWorker={handleRunWorker}
              onSkipDemo={handleSkipDemo}
              onResetWorker={handleResetWorker}
              onOpenProspects={() => setCurrentView('prospects')}
              speed={speed}
              onSpeedChange={(s) => setSpeed(s)}
              simulateErrorAndRetry={simulateErrorAndRetry}
              onToggleSimulateError={(val) => setSimulateErrorAndRetry(val)}
              isLiveAi={isLiveAi}
              onToggleLiveAi={(val) => setIsLiveAi(val)}
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

          {currentView === 'activity' && (
            <ActivityView actions={actions} />
          )}

          {currentView === 'workers' && (
            <WorkersView
              worker={worker}
              onNavigate={(v) => setCurrentView(v)}
              onCreateWorkerClick={() => setCurrentView('create_worker')}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              isLiveAi={isLiveAi}
              onToggleLiveAi={(val) => setIsLiveAi(val)}
              onResetAllData={handleResetAllData}
              aiConfig={aiConfig}
            />
          )}

          {currentView === 'create_worker' && (
            <CreateWorkerWizard
              onWorkerCreated={handleWorkerCreated}
              onCancel={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'landing' && (
            <LandingView
              worker={worker}
              onNavigate={(v) => setCurrentView(v)}
              onRunWorker={() => {
                setCurrentView('workspace');
                handleRunWorker();
              }}
              isLiveAi={isLiveAi}
            />
          )}
        </main>

        {/* Mobile Quick Bottom Navigation Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-around z-30 px-2 shadow-xs">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium transition-colors cursor-pointer ${
              currentView === 'dashboard' ? 'text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mb-0.5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setCurrentView('workspace')}
            className={`flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium transition-colors cursor-pointer ${
              currentView === 'workspace' ? 'text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bot className="w-4 h-4 mb-0.5" />
            <span>Staff</span>
          </button>
          <button
            onClick={() => setCurrentView('prospects')}
            className={`flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium transition-colors cursor-pointer ${
              currentView === 'prospects' ? 'text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4 mb-0.5" />
            <span>Prospects</span>
          </button>
          <button
            onClick={() => setCurrentView('activity')}
            className={`flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium transition-colors cursor-pointer ${
              currentView === 'activity' ? 'text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="w-4 h-4 mb-0.5" />
            <span>Activity</span>
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <Menu className="w-4 h-4 mb-0.5" />
            <span>Menu</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
