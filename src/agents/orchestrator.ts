import { Prospect, TargetCriteria, Worker, WorkerAction, WorkerRun, WorkerStatus, WorkerTask } from '../types';
import { workerToolProvider } from '../tools/workerTools';
import { aiService } from '../services/aiService';
import { INITIAL_COMPLETED_RUN, INITIAL_TASKS } from '../data/seedData';

export type ExecutionSpeed = 'realtime' | 'accelerated' | 'instant';

export interface OrchestratorCallbacks {
  onWorkerUpdate: (worker: Worker) => void;
  onTasksUpdate: (tasks: WorkerTask[]) => void;
  onActionLogged: (action: WorkerAction) => void;
  onProspectsUpdate: (prospects: Prospect[]) => void;
  onRunFinished: (run: WorkerRun) => void;
  onActiveToolChange?: (toolInfo: { name: string; input: unknown; output?: unknown } | null) => void;
}

export class WorkerOrchestrator {
  private isRunning = false;
  private isPaused = false;
  private abortController: AbortController | null = null;
  public speed: ExecutionSpeed = 'realtime';
  public simulateErrorAndRetry = false;
  public forceDemoMode = false;

  private getDelay(baseMs: number): number {
    if (this.speed === 'instant') return 30;
    if (this.speed === 'accelerated') return Math.max(100, Math.floor(baseMs / 4));
    return baseMs;
  }

  private async sleep(ms: number): Promise<void> {
    const delay = this.getDelay(ms);
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  private formatTime(): string {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  async runWorker(
    currentWorker: Worker,
    prospectsList: Prospect[],
    callbacks: OrchestratorCallbacks
  ): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;
    this.isPaused = false;
    this.abortController = new AbortController();

    const startTime = Date.now();
    let retryCount = 0;
    let errorsCount = 0;

    const worker: Worker = {
      ...currentWorker,
      status: 'PLANNING',
      currentActionSummary: 'Interpreting directive and synthesizing multi-stage work plan...',
      updatedAt: new Date().toISOString(),
    };
    callbacks.onWorkerUpdate(worker);

    // Build worker-tailored tasks
    const tasks: WorkerTask[] = [
      {
        id: `tsk-plan-${Date.now()}`,
        workerId: worker.id,
        workerName: worker.name,
        title: 'Formulate Sequential Execution Plan',
        description: `Decompose directive "${worker.goal}" into bounded stages and tool calls`,
        status: 'in_progress',
        toolUsed: 'createWorkerPlan()',
        input: { goal: worker.goal, targetCriteria: worker.targetCriteria },
        startedAt: new Date().toISOString(),
      },
      {
        id: `tsk-research-${Date.now()}`,
        workerId: worker.id,
        workerName: worker.name,
        title: 'Discover & Ingest Domain Records',
        description: `Search verified registries for ${worker.targetCriteria.industry} in ${worker.targetCriteria.location}`,
        status: 'pending',
        toolUsed: 'researchCompanies()',
      },
      {
        id: `tsk-qualify-${Date.now()}`,
        workerId: worker.id,
        workerName: worker.name,
        title: 'Evaluate Fit Against Qualification Signals',
        description: 'Score operations size, telemetry health, and operational compatibility',
        status: 'pending',
        toolUsed: 'analyzeFit()',
      },
      {
        id: `tsk-contact-${Date.now()}`,
        workerId: worker.id,
        workerName: worker.name,
        title: `Verify ${worker.targetCriteria.targetTitle} Authority`,
        description: 'Identify verified decision maker leadership profiles and authority credentials',
        status: 'pending',
        toolUsed: 'findDecisionMaker()',
      },
      {
        id: `tsk-draft-${Date.now()}`,
        workerId: worker.id,
        workerName: worker.name,
        title: 'Prepare Actionable Operational Deliverables',
        description: 'Synthesize structured drafts with specific commercial and logistical hooks',
        status: 'pending',
        toolUsed: 'generateOutreach()',
      },
      {
        id: `tsk-approve-${Date.now()}`,
        workerId: worker.id,
        workerName: worker.name,
        title: 'Human-in-the-Loop Supervisor Sign-off',
        description: 'Hold all external dispatches in staging until supervisor approves or edits',
        status: 'pending',
        type: 'human_approval',
      },
    ];

    callbacks.onTasksUpdate([...tasks]);

    // Helper to log action
    const logAction = (
      actionType: WorkerAction['actionType'],
      summary: string,
      resultSummary: string,
      toolName?: string,
      status: WorkerAction['status'] = 'completed',
      durationMs = 400
    ) => {
      const act: WorkerAction = {
        id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        workerId: worker.id,
        actionType,
        status,
        summary,
        resultSummary,
        toolName,
        timestamp: this.formatTime(),
        durationMs,
      };
      callbacks.onActionLogged(act);
      return act;
    };

    // Helper to update worker status
    const updateStatus = (status: WorkerStatus, summary: string) => {
      worker.status = status;
      worker.currentActionSummary = summary;
      worker.updatedAt = new Date().toISOString();
      callbacks.onWorkerUpdate({ ...worker });
    };

    try {
      // -------------------------------------------------------------
      // STAGE 1: PLAN (GOAL RECEIVED -> CREATE PLAN)
      // -------------------------------------------------------------
      updateStatus('PLANNING', 'Interpreting directive & formulating work plan');
      callbacks.onActiveToolChange?.({
        name: 'createWorkerPlan()',
        input: { goal: worker.goal, criteria: worker.targetCriteria },
      });

      logAction('worker_action', 'Operational directive ingested', `Targeting ${worker.targetCriteria.industry} in ${worker.targetCriteria.location}`);
      await this.sleep(1200);

      // Call AI Service or deterministic plan
      const planRes = await aiService.generatePlan(worker.goal, worker.targetCriteria, this.forceDemoMode);
      callbacks.onActiveToolChange?.({
        name: 'createWorkerPlan()',
        input: { goal: worker.goal, criteria: worker.targetCriteria },
        output: planRes.plan,
      });

      tasks[0].status = 'completed';
      tasks[0].completedAt = new Date().toISOString();
      tasks[0].result = { stages: 6, estimatedDuration: '18s' };
      tasks[1].status = 'in_progress';
      tasks[1].startedAt = new Date().toISOString();
      callbacks.onTasksUpdate([...tasks]);

      logAction('worker_action', 'Execution plan synthesized', '6 logical execution stages defined', 'createWorkerPlan()');
      await this.sleep(1000);

      // -------------------------------------------------------------
      // STAGE 2: RESEARCH / DISCOVERY
      // -------------------------------------------------------------
      updateStatus('RESEARCHING', `Scanning database for ${worker.targetCriteria.industry}`);
      callbacks.onActiveToolChange?.({
        name: 'researchCompanies()',
        input: { criteria: worker.targetCriteria },
      });

      logAction('research', 'Discovering operational records', `Scanning database registries for ${worker.targetCriteria.industry}`, 'researchCompanies()');
      await this.sleep(1400);

      // Optional Simulated Error & Retry demonstration
      if (this.simulateErrorAndRetry) {
        errorsCount++;
        retryCount++;
        logAction('error', 'Research temporarily failed (Attempt 1)', 'Data source registry connection timed out (HTTP 504)', 'researchCompanies()', 'retrying');
        updateStatus('RESEARCHING', 'Research temporarily failed. Worker will retry (Attempt 2)...');
        await this.sleep(1500);

        logAction('worker_action', 'Worker retrying research task (Attempt 2)', 'Re-establishing connection via secondary cache endpoint', 'researchCompanies()', 'completed');
        await this.sleep(1200);
      }

      const discoveryRes = await workerToolProvider.researchCompanies(worker.targetCriteria);
      callbacks.onActiveToolChange?.({
        name: 'researchCompanies()',
        input: { criteria: worker.targetCriteria },
        output: discoveryRes.output,
      });

      worker.stats.prospectsResearched = 32;
      callbacks.onWorkerUpdate({ ...worker });

      tasks[1].status = 'completed';
      tasks[1].completedAt = new Date().toISOString();
      tasks[1].result = { discoveredCount: 32, matchedRegion: worker.targetCriteria.location };
      tasks[2].status = 'in_progress';
      tasks[2].startedAt = new Date().toISOString();
      callbacks.onTasksUpdate([...tasks]);

      logAction('research', '32 potential entities discovered', `Identified records matching ${worker.targetCriteria.industry} criteria`, 'researchCompanies()');
      await this.sleep(1400);

      // -------------------------------------------------------------
      // STAGE 3: QUALIFY
      // -------------------------------------------------------------
      updateStatus('QUALIFYING', 'Evaluating entities against operational qualification signals');
      callbacks.onActiveToolChange?.({
        name: 'analyzeFit()',
        input: { totalCandidates: 32, criteria: worker.targetCriteria },
      });

      logAction('research', 'Evaluating qualification signals', 'Scoring operational expansion, fleet complexity, and safety metrics', 'analyzeFit()');
      await this.sleep(1600);

      worker.stats.qualifiedProspects = 14;
      callbacks.onWorkerUpdate({ ...worker });

      tasks[2].status = 'completed';
      tasks[2].completedAt = new Date().toISOString();
      tasks[2].result = { qualifiedCount: 14, rejectedCount: 18, benchmarkScore: '85/100' };
      tasks[3].status = 'in_progress';
      tasks[3].startedAt = new Date().toISOString();
      callbacks.onTasksUpdate([...tasks]);

      logAction('research', '14 entities qualified', '18 records filtered out (size mismatch or low operational complexity)', 'analyzeFit()');
      await this.sleep(1200);

      // -------------------------------------------------------------
      // STAGE 4: CONTACT & AUTHORITY RESEARCH
      // -------------------------------------------------------------
      updateStatus('CONTACT_RESEARCH', `Verifying ${worker.targetCriteria.targetTitle} leadership profiles`);
      callbacks.onActiveToolChange?.({
        name: 'findDecisionMaker()',
        input: { targetTitle: worker.targetCriteria.targetTitle, count: 14 },
      });

      logAction('research', 'Researching decision makers', `Locating verified ${worker.targetCriteria.targetTitle} profiles`, 'findDecisionMaker()');
      await this.sleep(1800);

      worker.stats.decisionMakersIdentified = 9;
      callbacks.onWorkerUpdate({ ...worker });

      tasks[3].status = 'completed';
      tasks[3].completedAt = new Date().toISOString();
      tasks[3].result = { verifiedProfiles: 9, authorityLevel: 'VP & Director' };
      tasks[4].status = 'in_progress';
      tasks[4].startedAt = new Date().toISOString();
      callbacks.onTasksUpdate([...tasks]);

      logAction('research', '9 decision makers identified', 'Verified operational leadership across top qualified accounts', 'findDecisionMaker()');
      await this.sleep(1200);

      // -------------------------------------------------------------
      // STAGE 5: PREPARE DELIVERABLES
      // -------------------------------------------------------------
      updateStatus('PERSONALIZING', 'Drafting tailored operational outputs & messages');
      callbacks.onActiveToolChange?.({
        name: 'generateOutreach()',
        input: { recipients: 6, focus: worker.goal },
      });

      logAction('worker_action', 'Preparing operational outputs', 'Synthesizing verified data points into tailored deliverables', 'generateOutreach()');
      await this.sleep(1800);

      worker.stats.outreachPrepared = 6;
      worker.stats.approvalsRequired = 6;
      callbacks.onWorkerUpdate({ ...worker });

      tasks[4].status = 'completed';
      tasks[4].completedAt = new Date().toISOString();
      tasks[4].result = { draftsGenerated: 6, qualityReview: 'Passed' };
      tasks[5].status = 'in_progress';
      tasks[5].startedAt = new Date().toISOString();
      callbacks.onTasksUpdate([...tasks]);

      logAction('worker_action', '6 deliverables synthesized', 'Drafts staged and marked "Awaiting Supervisor Sign-off"', 'generateOutreach()');
      await this.sleep(1000);

      // -------------------------------------------------------------
      // STAGE 6: PAUSE AT AWAITING APPROVAL (HUMAN-IN-THE-LOOP)
      // -------------------------------------------------------------
      updateStatus('AWAITING_APPROVAL', 'Execution paused: 6 deliverables are ready for supervisor review.');
      callbacks.onActiveToolChange?.(null);

      logAction('approval', 'Awaiting human approval', '6 deliverables require supervisor sign-off before dispatch');

      const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
      const runSummary: WorkerRun = {
        id: `run-${Date.now()}`,
        workerId: worker.id,
        goal: worker.goal,
        status: 'AWAITING_APPROVAL',
        startedAt: new Date(startTime).toISOString(),
        completedAt: new Date().toISOString(),
        durationSeconds: elapsedSeconds,
        tasksCompleted: 6,
        companiesResearched: 32,
        companiesQualified: 14,
        decisionMakersIdentified: 9,
        messagesPrepared: 6,
        approvalsRequired: 6,
        errorsCount,
        retryCount,
      };

      callbacks.onRunFinished(runSummary);
    } catch (err) {
      console.error('Worker orchestration error:', err);
      updateStatus('FAILED', 'Worker encountered an unrecoverable execution error.');
      logAction('error', 'Worker failed', String(err));
    } finally {
      this.isRunning = false;
    }
  }

  fastForwardToApproval(
    currentWorker: Worker,
    callbacks: OrchestratorCallbacks
  ): void {
    const worker: Worker = {
      ...currentWorker,
      status: 'AWAITING_APPROVAL',
      currentActionSummary: 'Execution paused: 6 deliverables are ready for review.',
      stats: {
        prospectsResearched: 32,
        qualifiedProspects: 14,
        decisionMakersIdentified: 9,
        outreachPrepared: 6,
        tasksCompleted: 7,
        approvalsRequired: 6,
      },
      updatedAt: new Date().toISOString(),
    };
    callbacks.onWorkerUpdate(worker);
    callbacks.onActiveToolChange?.(null);

    const runSummary: WorkerRun = {
      ...INITIAL_COMPLETED_RUN,
      id: `run-fast-${Date.now()}`,
      workerId: worker.id,
      goal: worker.goal,
      durationSeconds: 18,
    };
    callbacks.onRunFinished(runSummary);
  }

  resetWorker(currentWorker: Worker, callbacks: OrchestratorCallbacks): void {
    this.isRunning = false;
    this.isPaused = false;
    const resetWorker: Worker = {
      ...currentWorker,
      status: 'IDLE',
      currentActionSummary: 'Ready to execute assignment',
      stats: {
        prospectsResearched: 0,
        qualifiedProspects: 0,
        decisionMakersIdentified: 0,
        outreachPrepared: 0,
        tasksCompleted: 0,
        approvalsRequired: 0,
      },
      updatedAt: new Date().toISOString(),
    };
    callbacks.onWorkerUpdate(resetWorker);
    callbacks.onActiveToolChange?.(null);
  }
}

export const orchestrator = new WorkerOrchestrator();
