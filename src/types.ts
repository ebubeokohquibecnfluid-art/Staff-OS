export type WorkerStatus =
  | 'IDLE'
  | 'PLANNING'
  | 'RESEARCHING'
  | 'QUALIFYING'
  | 'CONTACT_RESEARCH'
  | 'PERSONALIZING'
  | 'AWAITING_APPROVAL'
  | 'COMPLETED'
  | 'FAILED';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'retrying';

export interface TargetCriteria {
  industry: string;
  companySize: string;
  location: string;
  targetTitle: string;
  customNotes?: string;
}

export interface Worker {
  id: string;
  name: string;
  role: string;
  description: string;
  goal: string;
  status: WorkerStatus;
  targetCriteria: TargetCriteria;
  currentTaskId?: string;
  currentActionSummary?: string;
  initials?: string;
  capabilities?: string[];
  completedAssignmentsCount?: number;
  stats: {
    prospectsResearched: number;
    qualifiedProspects: number;
    decisionMakersIdentified: number;
    outreachPrepared: number;
    tasksCompleted: number;
    approvalsRequired: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface WorkerTask {
  id: string;
  workerId: string;
  workerName?: string;
  type?:
    | 'create_plan'
    | 'research_prospects'
    | 'evaluate_prospects'
    | 'research_decision_makers'
    | 'generate_outreach'
    | 'human_approval'
    | 'complete';
  status: TaskStatus;
  title: string;
  description: string;
  toolUsed?: string;
  input?: Record<string, unknown>;
  result?: Record<string, unknown>;
  retryCount?: number;
  createdAt?: string;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
}

export interface WorkerAction {
  id: string;
  workerId: string;
  workerName?: string;
  taskId?: string;
  actionType: 'worker_action' | 'research' | 'approval' | 'error';
  status: 'in_progress' | 'completed' | 'retrying' | 'failed';
  summary: string;
  resultSummary?: string;
  toolName?: string;
  timestamp: string;
  durationMs?: number;
  metadata?: Record<string, unknown>;
}

export interface DecisionMaker {
  id: string;
  name: string;
  jobTitle: string;
  department: string;
  email?: string;
  linkedinSnippet?: string;
  backgroundSummary: string;
  tenureYears?: number;
}

export interface Prospect {
  id: string;
  workerId?: string;
  workerName?: string;
  recordType?: 'prospect' | 'carrier' | 'hub_dispatch' | 'compliance_audit' | 'support_ticket';
  actionRequired?: string;
  riskLevel?: 'Low' | 'Medium' | 'High';
  company: string;
  website: string;
  industry: string;
  location: string;
  employeeCount: number;
  relevantPerson: string;
  jobTitle: string;
  companySummary: string;
  fitAssessment: 'High fit' | 'Medium fit' | 'Low fit' | 'Disqualified';
  fitScore: number; // 0-100
  reasonsForQualification: string[];
  frictionPoints?: string[];
  operationalSignals: string[];
  researchStatus: 'discovered' | 'researched' | 'qualified' | 'disqualified';
  outreachStatus: 'none' | 'prepared' | 'approved' | 'rejected' | 'sent';
  recommendedApproach: string;
  personalizedOutreach?: {
    subject: string;
    body: string;
    preparedAt: string;
    approvedAt?: string;
    version: number;
  };
}

export interface WorkerRun {
  id: string;
  workerId: string;
  workerName?: string;
  goal: string;
  status: WorkerStatus;
  startedAt: string;
  completedAt?: string;
  durationSeconds: number;
  tasksCompleted: number;
  companiesResearched: number;
  companiesQualified: number;
  decisionMakersIdentified: number;
  messagesPrepared: number;
  approvalsRequired: number;
  errorsCount: number;
  retryCount: number;
  deliverablesSummary?: string;
  nextSteps?: string;
}

export type ViewScreen =
  | 'landing'
  | 'quickstart'
  | 'dashboard'
  | 'workers'
  | 'workspace'
  | 'tasks'
  | 'prospects'
  | 'approvals'
  | 'activity'
  | 'results'
  | 'settings'
  | 'create_worker';
