import { Prospect, TargetCriteria, Worker, WorkerAction, WorkerRun, WorkerStatus, WorkerTask } from '../types';
import { workerToolProvider } from '../tools/workerTools';
import { aiService } from '../services/aiService';
import { INITIAL_COMPLETED_RUN } from '../data/seedData';

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
      currentActionSummary: 'Interpreting business goal and formulating research plan...',
      updatedAt: new Date().toISOString(),
    };
    callbacks.onWorkerUpdate(worker);

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
      updateStatus('PLANNING', 'Interpreting goal & formulating research plan');
      callbacks.onActiveToolChange?.({
        name: 'createWorkerPlan()',
        input: { goal: worker.goal, criteria: worker.targetCriteria },
      });

      logAction('worker_action', 'Goal received', `Targeting ${worker.targetCriteria.industry} in ${worker.targetCriteria.location}`);
      await this.sleep(1200);

      // Call AI Service or deterministic plan
      const planRes = await aiService.generatePlan(worker.goal, worker.targetCriteria, this.forceDemoMode);
      callbacks.onActiveToolChange?.({
        name: 'createWorkerPlan()',
        input: { goal: worker.goal, criteria: worker.targetCriteria },
        output: planRes.plan,
      });

      logAction('worker_action', 'Research plan created', '6 logical execution stages defined', 'createWorkerPlan()');
      await this.sleep(1000);

      // -------------------------------------------------------------
      // STAGE 2: RESEARCH COMPANIES (DISCOVERY)
      // -------------------------------------------------------------
      updateStatus('RESEARCHING', 'Searching for companies matching target ICP criteria');
      callbacks.onActiveToolChange?.({
        name: 'researchCompanies()',
        input: { criteria: worker.targetCriteria },
      });

      logAction('research', 'Searching for companies', `Scanning company intelligence for ${worker.targetCriteria.industry}`, 'researchCompanies()');
      await this.sleep(1400);

      // Optional Simulated Error & Retry demonstration (Section 18 of prompt)
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
      logAction('research', '32 potential companies discovered', 'Identified regional logistics carriers spanning Midwest, South-Central, and Southeast', 'researchCompanies()');
      await this.sleep(1400);

      // -------------------------------------------------------------
      // STAGE 3: QUALIFY COMPANIES (FIT EVALUATION)
      // -------------------------------------------------------------
      updateStatus('QUALIFYING', 'Evaluating companies against target criteria & operational signals');
      callbacks.onActiveToolChange?.({
        name: 'analyzeFit()',
        input: { totalCandidates: 32, criteria: worker.targetCriteria },
      });

      logAction('research', 'Evaluating companies against target criteria', 'Scoring operational expansion, fleet complexity, and facility count', 'analyzeFit()');
      await this.sleep(1600);

      worker.stats.qualifiedProspects = 14;
      callbacks.onWorkerUpdate({ ...worker });
      logAction('research', '14 companies qualified', '18 companies filtered out (size mismatch or low operational complexity)', 'analyzeFit()');
      await this.sleep(1200);

      // -------------------------------------------------------------
      // STAGE 4: DECISION MAKER RESEARCH
      // -------------------------------------------------------------
      updateStatus('CONTACT_RESEARCH', 'Researching operational decision makers at qualified accounts');
      callbacks.onActiveToolChange?.({
        name: 'findDecisionMaker()',
        input: { targetTitle: worker.targetCriteria.targetTitle, count: 14 },
      });

      logAction('research', 'Researching decision makers', `Locating verified ${worker.targetCriteria.targetTitle} and Operations VP profiles`, 'findDecisionMaker()');
      await this.sleep(1800);

      worker.stats.decisionMakersIdentified = 9;
      callbacks.onWorkerUpdate({ ...worker });
      logAction('research', '9 decision makers identified', 'Verified operational leadership across top qualified carriers', 'findDecisionMaker()');
      await this.sleep(1200);

      // -------------------------------------------------------------
      // STAGE 5: PREPARE PERSONALIZED OUTREACH
      // -------------------------------------------------------------
      updateStatus('PERSONALIZING', 'Drafting personalized value-proposition outreach messages');
      callbacks.onActiveToolChange?.({
        name: 'generateOutreach()',
        input: { recipients: 6, focus: 'Operational dispatch efficiency & dwell-time reduction' },
      });

      logAction('worker_action', 'Preparing personalized outreach', 'Synthesizing specific facility expansions into tailored value propositions', 'generateOutreach()');
      await this.sleep(1800);

      worker.stats.outreachPrepared = 6;
      worker.stats.approvalsRequired = 6;
      callbacks.onWorkerUpdate({ ...worker });
      logAction('worker_action', '6 outreach messages prepared', 'Tailored emails drafted and labeled "Prepared by Worker"', 'generateOutreach()');
      await this.sleep(1000);

      // -------------------------------------------------------------
      // STAGE 6: PAUSE AT AWAITING APPROVAL (HUMAN-IN-THE-LOOP)
      // -------------------------------------------------------------
      updateStatus('AWAITING_APPROVAL', 'Execution paused: 6 outreach messages are ready for review.');
      callbacks.onActiveToolChange?.(null);

      logAction('approval', 'Awaiting human approval', '6 outreach messages require supervisor review before any dispatch action');

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
      currentActionSummary: 'Execution paused: 6 outreach messages are ready for review.',
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
      currentActionSummary: 'Ready to execute multi-step research plan',
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
