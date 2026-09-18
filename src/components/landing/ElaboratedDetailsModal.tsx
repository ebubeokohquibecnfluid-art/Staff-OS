import React, { useState } from 'react';
import {
  X,
  ArrowRight,
  Play,
  CheckCircle2,
  ShieldCheck,
  SlidersHorizontal,
  Briefcase,
  Terminal,
  Activity,
  Layers,
  Lock,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { ViewScreen, Worker } from '../../types';

interface ElaboratedDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker: Worker;
  onNavigate: (view: ViewScreen) => void;
  onRunWorker: () => void;
}

export const ElaboratedDetailsModal: React.FC<ElaboratedDetailsModalProps> = ({
  isOpen,
  onClose,
  worker,
  onNavigate,
  onRunWorker,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'protocol' | 'staff' | 'governance' | 'contracts'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-900">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-950 font-editorial">
                STAFF OS • How It Works & Platform Architecture
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                AI staff that actually work • Human-in-the-Loop Supervision
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 bg-white flex items-center gap-2 sm:gap-6 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'overview'
                ? 'border-slate-950 text-slate-950'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            System Overview
          </button>
          <button
            onClick={() => setActiveTab('protocol')}
            className={`py-3 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'protocol'
                ? 'border-slate-950 text-slate-950'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            6-Stage Protocol
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`py-3 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'staff'
                ? 'border-slate-950 text-slate-950'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Active Staff: Alex Mercer
          </button>
          <button
            onClick={() => setActiveTab('governance')}
            className={`py-3 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'governance'
                ? 'border-slate-950 text-slate-950'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Human Governance
          </button>
          <button
            onClick={() => setActiveTab('contracts')}
            className={`py-3 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'contracts'
                ? 'border-slate-950 text-slate-950'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Tool Contracts
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-slate-950 text-base font-editorial mb-2">
                  What is Staff OS?
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Staff OS gives businesses AI staff that can be assigned work, execute multi-step tasks, report results, and ask for human approval when important decisions are required. Rather than unreliable chatbots, Staff OS provides dedicated digital staff members who research, analyze, execute, and keep people in control of critical decisions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="text-xl font-bold text-slate-900 font-editorial">100%</div>
                  <div className="font-semibold text-slate-800 text-xs mt-1">Supervised Outbound</div>
                  <div className="text-xs text-slate-500 mt-1">Zero messages dispatched without explicit human sign-off.</div>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="text-xl font-bold text-slate-900 font-editorial">6 Stages</div>
                  <div className="font-semibold text-slate-800 text-xs mt-1">Deterministic Architecture</div>
                  <div className="text-xs text-slate-500 mt-1">Structured checkpoints from goal intake to completion.</div>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="text-xl font-bold text-slate-900 font-editorial">Full Audit</div>
                  <div className="font-semibold text-slate-800 text-xs mt-1">Verifiable Execution Logs</div>
                  <div className="text-xs text-slate-500 mt-1">Immutable records of every tool invocation and rationale.</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm font-editorial">Core Platform Capabilities</h4>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">Autonomous Market Scanning:</strong> Scours business registries, DOT filings, and industry directories to identify prospects meeting strict parameter gates.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">Deterministic ICP Scoring:</strong> Evaluates fleet capacity, location, compliance records, and recent corporate triggers before qualifying candidates.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">Supervised Approvals Gate:</strong> Human supervisors review prepared drafts, adjust copy, and approve or reject candidates with one click.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'protocol' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500">
                Staff OS enforces a rigorous 6-stage execution lifecycle for every worker task:
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-md bg-slate-950 text-white font-mono text-xs flex items-center justify-center shrink-0">1</span>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">Stage 1: Assignment Definition & Goal Intake</h5>
                    <p className="text-xs text-slate-600 mt-0.5">Parameters are ingested (target industry, fleet scale, geographical constraints, and target decision-maker titles).</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-md bg-slate-950 text-white font-mono text-xs flex items-center justify-center shrink-0">2</span>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">Stage 2: Deterministic Decomposition</h5>
                    <p className="text-xs text-slate-600 mt-0.5">The agent decomposes the objective into ordered sub-tasks with clear stopping conditions and JSON schema contracts.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-md bg-slate-950 text-white font-mono text-xs flex items-center justify-center shrink-0">3</span>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">Stage 3: Public Registry & Carrier Discovery</h5>
                    <p className="text-xs text-slate-600 mt-0.5">Scrapes state and federal filings (such as Texas DOT census) to construct the candidate pipeline.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-md bg-slate-950 text-white font-mono text-xs flex items-center justify-center shrink-0">4</span>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">Stage 4: ICP Fit Scoring & Trigger Extraction</h5>
                    <p className="text-xs text-slate-600 mt-0.5">Calculates mathematical fit scores (0-100%) and extracts operational events (e.g. facility openings, new lanes).</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-md bg-slate-950 text-white font-mono text-xs flex items-center justify-center shrink-0">5</span>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">Stage 5: Decision Maker Pinpointing & Drafting</h5>
                    <p className="text-xs text-slate-600 mt-0.5">Identifies verified safety directors and operational VPs, preparing personalized outreach letters.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/70 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-mono text-xs flex items-center justify-center shrink-0">6</span>
                  <div>
                    <h5 className="font-bold text-blue-950 text-xs">Stage 6: Mandatory Supervisory Sign-Off</h5>
                    <p className="text-xs text-blue-900/80 mt-0.5">The execution halts permanently until a human operator reviews and explicitly authorizes the outbound dispatches.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'staff' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-950 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  AM
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-base font-editorial">Alex Mercer</h4>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold">
                      Active
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-700">Sales Research Staff Specialist</div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    Specialized in B2B market intelligence, commercial transport registries, and personalized executive communication.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono text-slate-500">
                  Current Assignment Scope:
                </h5>
                <div className="text-xs space-y-2 text-slate-700">
                  <div><strong>Geography:</strong> State of Texas (Dallas-Fort Worth, San Antonio, Houston, El Paso)</div>
                  <div><strong>Fleet Parameter:</strong> Mid-market carriers with 15 to 50 active power units</div>
                  <div><strong>Target Roles:</strong> Director of Fleet Safety, VP of Transportation, Logistics Head</div>
                  <div><strong>Deliverable:</strong> 6 qualified accounts with researched operational triggers and drafted outreach</div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('workspace');
                    onRunWorker();
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-950 text-white text-xs font-semibold hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Execute Alex's Assignment Now</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('prospects');
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-800 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                >
                  Review Prepared Approvals (6)
                </button>
              </div>
            </div>
          )}

          {activeTab === 'governance' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-mono">
                  <Lock className="w-4 h-4" />
                  <span>ZERO-LEAK OUTBOUND GUARANTEE</span>
                </div>
                <h4 className="font-bold text-base text-white font-editorial">
                  Architectural Human-in-the-Loop Safeguards
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Autonomous agents can operate at high velocity, but unchecked outbound actions destroy client trust. Staff OS prevents rogue dispatches by isolating all draft synthesis inside a sandboxed state machine until a human verifies and signs off.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <strong className="text-slate-900">In-Line Copy Modification</strong>
                  <p className="text-slate-600">Supervisors can tweak subject lines, salutations, or pitch angles directly before dispatch.</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <strong className="text-slate-900">Single & Batch Approvals</strong>
                  <p className="text-slate-600">Approve accounts individually with detailed inspections or batch-authorize qualified tiers.</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <strong className="text-slate-900">Traceable Rejection Logs</strong>
                  <p className="text-slate-600">Provide feedback when rejecting an account to fine-tune future scoring algorithms.</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <strong className="text-slate-900">Role-Based Access Control</strong>
                  <p className="text-slate-600">Define which team members hold approval authority across different campaign tiers.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contracts' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500">
                Staff OS uses deterministic JSON contracts for all tool invocations:
              </div>

              <div className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs space-y-2">
                <div className="text-emerald-400 font-bold">// Tool: carrier_registry_scan</div>
                <pre className="text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
{`{
  "jurisdiction": "US-TX",
  "registry": "Texas DOT / FMCSA Carrier Database",
  "filters": {
    "carrier_type": "Interstate General Freight",
    "fleet_power_units": { "min": 15, "max": 50 },
    "safety_rating": "Satisfactory",
    "operating_status": "ACTIVE"
  }
}`}
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs space-y-2">
                <div className="text-emerald-400 font-bold">// Tool: outbound_composer (Paused at Gate)</div>
                <pre className="text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
{`{
  "target_company": "Lonestar Express Logistics",
  "contact": { "name": "Marcus Vance", "role": "Director of Fleet Safety" },
  "fit_score": 94,
  "trigger": "Facility expansion in Dallas-Fort Worth metroplex",
  "status": "AWAITING_SUPERVISOR_SIGN_OFF"
}`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
          >
            Close Details
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onNavigate('workspace');
              }}
              className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs font-semibold hover:bg-slate-100 cursor-pointer flex items-center gap-1.5"
            >
              <span>Tasks Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                onClose();
                onNavigate('dashboard');
              }}
              className="px-5 py-2 rounded-lg bg-slate-950 text-white text-xs font-semibold hover:bg-slate-800 cursor-pointer flex items-center gap-2"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
