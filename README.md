# WorkerOS — Autonomous AI Worker Platform

**WorkerOS** is a specialized B2B autonomous AI worker platform designed to plan, orchestrate, and execute complex multi-step business objectives. Rather than acting as a reactive chatbot or a single-prompt text generator, WorkerOS treats business workflows as stateful, observable, tool-assisted agent executions with strict human-in-the-loop control.

This prototype demonstrates a production-grade autonomous agent: the **Prospect Research Worker** ("Sales Researcher"), which takes a high-level business goal (e.g., finding qualified B2B customers for logistics software), decomposes it into discrete logical tasks, invokes specialized research tools, evaluates companies against ICP criteria, identifies operational decision makers, and drafts personalized outreach messages—all while maintaining persistent state and pausing for human approval before any message is authorized for dispatch.

---

## Core Product Principles

1. **Outcome Over Instructions:** The operator provides an objective (e.g., *"Find potential customers for my logistics software"*), not an imperative script of individual micro-actions.
2. **Autonomous Goal Decomposition:** The worker decomposes the objective into an auditable multi-phase execution graph: `Goal → Plan → Tasks → Tools → Results → Decisions → State → Next Action`.
3. **Formal Tool Abstraction:** Execution happens exclusively through bounded tool interfaces (`researchCompanies`, `analyzeFit`, `findDecisionMaker`, `generateOutreach`), ensuring predictable input/output contracts.
4. **Persistent Finite State Machine:** The worker transitions through explicit, well-defined operational states with deterministic resumption semantics.
5. **Strict Human-in-the-Loop Gate:** The worker pauses at `AWAITING_APPROVAL` with prepared artifacts. No external action (e.g., email dispatch) occurs without explicit human authorization.
6. **Observable Execution Stream:** Normal users see real-time observable actions, milestones, and structured outputs without exposing confusing internal chain-of-thought or raw model reasoning.

---

## Architecture Overview

```
                      ┌────────────────────────────┐
                      │    Operator Web Console    │
                      │  (React 19 + Tailwind CSS) │
                      └─────────────┬──────────────┘
                                    │
                                    ▼
                      ┌────────────────────────────┐
                      │    Worker Orchestrator     │
                      │   (Agent State Machine)    │
                      └──────┬──────────────┬──────┘
                             │              │
              ┌──────────────┴────┐   ┌─────┴───────────────┐
              ▼                   ▼   ▼                     ▼
     ┌─────────────────┐ ┌─────────────────┐       ┌─────────────────┐
     │  Tool Registry  │ │ Local / Cloud   │       │   Server-Side   │
     │  (Abstracted    │ │ State Store     │       │   AI Engine     │
     │   Research API) │ │ (Relational     │       │ (Gemini 3.8 /   │
     │                 │ │  Schema)        │       │  Demo Provider) │
     └─────────────────┘ └─────────────────┘       └─────────────────┘
```

The system is architected into clean, decoupled layers:

- **Frontend Presentation (`/src/components`):** Minimalist, high-contrast B2B interface focusing on task progress, structured candidate tables, approval drawers, and chronological audit timelines.
- **Agent Orchestrator (`/src/agents/orchestrator.ts`):** Central state machine managing the worker lifecycle, step sequencing, execution speeds (18s Real-time, 4s Accelerated, Instant), error retries, and human approval interrupts.
- **Tool System (`/src/tools/workerTools.ts`):** Modular providers returning structured JSON payloads for company discovery, facility signal extraction, ICP fit scoring, and decision-maker discovery.
- **AI Service Layer (`/src/services/aiService.ts` & `server.ts`):** Server-side proxy interfacing with `@google/genai` (Gemini 3.8 Flash) with structured JSON schemas, coupled with an identical deterministic fallback provider for reliable local benchmarking.
- **Data Models (`/src/types.ts` & `/src/data`):** Strictly typed entities modeled after relational database tables (`Worker`, `WorkerTask`, `WorkerAction`, `Prospect`, `DecisionMaker`, `Outreach`, `Approval`, `WorkerRun`).

---

## Worker Lifecycle & State Machine

The worker transitions sequentially through the following states:

```
[ IDLE ]
   │
   ▼
[ PLANNING ] ──────────► Formulates execution phases and ICP scoring weights
   │
   ▼
[ RESEARCHING ] ───────► Discovers candidate companies (32 accounts identified)
   │                     (Includes automated error retry handler on network flake)
   ▼
[ QUALIFYING ] ────────► Scores operational signals, headcount, and logistics complexity
   │                     (14 accounts qualified, 18 disqualified)
   ▼
[ CONTACT_RESEARCH ] ──► Locates VP Operations, COOs, and Supply Chain leadership
   │
   ▼
[ PERSONALIZING ] ─────► Synthesizes expansion news into tailored value propositions
   │
   ▼
[ AWAITING_APPROVAL ] ─► PAUSES EXECUTION. Presents 6 prepared messages for human review
   │
   ├── [ Human Edits / Approves / Rejects ]
   ▼
[ COMPLETED ] ─────────► All approved messages queued for dispatch; state finalized
```

---

## Tool System Abstraction

Every research action performed by the worker is executed through a formal tool interface:

| Tool Name | Input Parameters | Structured Output Payload |
|---|---|---|
| `researchCompanies()` | Industry, Headcount Range, Geographic Scope | Candidate list with headcount, HQ location, and website |
| `researchCompany()` | Company ID, Domain Name | Facility square footage, fleet size, logistics tech stack signals |
| `analyzeFit()` | Candidate Profile, Target ICP Parameters | Fit Score (0–100), Fit Category, Qualification Reasons, Friction Points |
| `findDecisionMaker()` | Company Name, Target Title | Verified Leader Name, Job Title, Department, Background Summary |
| `generateOutreach()` | Account Signals, Decision Maker Profile | Customized Subject Line, Contextual Email Body, "Prepared by Worker" label |

---

## Engineering Decisions

### 1. Explicit State Machine vs. Free-Form ReAct Loops
*Why:* Unconstrained LLM agent loops frequently hallucinate cyclic tool invocations, exhaust API budgets, and fail non-deterministically. WorkerOS enforces explicit, typed states (`PLANNING`, `RESEARCHING`, `QUALIFYING`, `CONTACT_RESEARCH`, `PERSONALIZING`, `AWAITING_APPROVAL`). The LLM is used to reason *within* each stage, but transitions are enforced by the orchestrator.

### 2. Task Separation & Granular Persistence
*Why:* Rather than packing the entire objective into a single monolithic prompt, each phase is executed as an isolated `WorkerTask`. If a network error occurs during company research, the system retries only that specific task rather than restarting the entire pipeline from scratch.

### 3. Structured Outputs with Schemas
*Why:* All tool calls and AI responses enforce strict JSON schemas. Unstructured model markdown is rejected at the service layer to prevent broken UI tables and invalid qualification scores.

### 4. Human Approval as a First-Class Architectural Boundary
*Why:* Fully autonomous execution of outbound customer communications carries unacceptable brand risk. The worker is hard-coded to halt at `AWAITING_APPROVAL`. Outreach messages are tagged `Prepared by Worker` and cannot transition to `Approved for sending` without explicit human authorization.

### 5. Observable Action Stream over Chain-of-Thought
*Why:* Displaying raw chain-of-thought tokens clutters user interfaces and exposes internal reasoning vulnerabilities. WorkerOS translates internal operations into concise, observable action entries (`Timestamp`, `Action`, `Tool Used`, `Result Summary`, `Status`).

---

## Data Model

The domain model is designed for straightforward migration to PostgreSQL or Cloud SQL:

```typescript
interface Worker {
  id: string;
  name: string;
  role: string;
  goal: string;
  status: WorkerStatus;
  targetCriteria: TargetCriteria;
  stats: WorkerStats;
  createdAt: string;
  updatedAt: string;
}

interface WorkerTask {
  id: string;
  workerId: string;
  type: TaskType;
  status: TaskStatus;
  toolUsed?: string;
  input?: Record<string, unknown>;
  result?: Record<string, unknown>;
  retryCount: number;
  completedAt?: string;
}

interface Prospect {
  id: string;
  company: string;
  website: string;
  industry: string;
  location: string;
  employeeCount: number;
  relevantPerson: string;
  jobTitle: string;
  fitAssessment: 'High fit' | 'Medium fit' | 'Low fit' | 'Disqualified';
  fitScore: number;
  reasonsForQualification: string[];
  operationalSignals: string[];
  outreachStatus: 'none' | 'prepared' | 'approved' | 'rejected' | 'sent';
  personalizedOutreach?: OutreachDraft;
}
```

---

## Future Production Improvements

For production deployment at enterprise scale, the following enhancements are planned:

1. **PostgreSQL & Drizzle ORM:** Replace local client storage with durable relational storage supporting foreign keys, audit log immutability, and tenant isolation.
2. **Background Job Queues (Temporal / BullMQ):** Decouple worker execution from browser sessions using durable execution workflows that survive container restarts.
3. **Live B2B Data Providers:** Integrate live company discovery and enrichment APIs (e.g., Apollo, Clearbit, ZoomInfo) behind the existing `WorkerToolProvider` interface.
4. **Email Delivery Provider:** Connect authorized sending pipelines (SendGrid, Postmark, Google Workspace OAuth) to dispatch approved messages.
5. **Observability & Telemetry:** Emit OpenTelemetry traces for every tool execution, tracking token usage, latency percentiles, and qualification accuracy metrics.
6. **Multi-Worker Orchestration:** Allow specialized workers (e.g., Customer Support Worker, Market Intelligence Worker) to collaborate and pass tasks hierarchically.

---

## Portfolio Presentation Notice

> **About this prototype:**
> *WorkerOS is an independent prototype exploring how autonomous AI workers can plan, execute and manage multi-step business tasks through a simple interface.*
