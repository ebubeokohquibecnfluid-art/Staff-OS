import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Search,
  CheckSquare,
  SlidersHorizontal,
  FileText,
  Building2,
  Briefcase,
  Play,
} from 'lucide-react';
import { ViewScreen, Worker } from '../../types';

interface LandingViewProps {
  worker: Worker;
  onNavigate: (view: ViewScreen) => void;
  onRunWorker: () => void;
  isLiveAi: boolean;
}

export const LandingView: React.FC<LandingViewProps> = ({
  worker,
  onNavigate,
  onRunWorker,
  isLiveAi,
}) => {
  return (
    <div className="w-full min-h-full bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-2xs">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Staff OS</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">Business Workforce Operating System</span>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Staff that actually work.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Deploy autonomous staff members to research, analyze, qualify, and prepare business work — with complete human supervisor approval.
          </p>
        </div>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span>Open Operations Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigate('workspace')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-slate-800" />
            <span>View Tasks Console</span>
          </button>
          <button
            onClick={() => onNavigate('prospects')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-slate-600 hover:text-slate-900 text-xs font-medium transition-colors cursor-pointer"
          >
            <span>Review Approvals (6) →</span>
          </button>
        </div>

        {/* Core Principles */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left">
          <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
            <span className="text-slate-700 font-medium">Clear assignments & objective goals</span>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs flex items-center gap-2.5">
            <SlidersHorizontal className="w-4 h-4 text-slate-700 shrink-0" />
            <span className="text-slate-700 font-medium">Verifiable sequential work stages</span>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-slate-700 shrink-0" />
            <span className="text-slate-700 font-medium">Mandatory human sign-off before action</span>
          </div>
        </div>
      </section>

      {/* Section: Operational Model */}
      <section id="how-it-works" className="py-14 border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-1 max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              How Staff OS Operates
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              A disciplined operating structure designed for business tasks and verifiable outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-lg border border-slate-200 bg-slate-50 space-y-2.5">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Step 1</div>
              <h3 className="text-sm font-bold text-slate-900">Assign a Work Goal</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Define the business objective, industry parameters, fleet criteria, and target buyer persona.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-slate-200 bg-slate-50 space-y-2.5">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Step 2</div>
              <h3 className="text-sm font-bold text-slate-900">Formulate Work Plan</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The orchestration engine breaks down the assignment into discrete, measurable execution steps.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-slate-200 bg-slate-50 space-y-2.5">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Step 3</div>
              <h3 className="text-sm font-bold text-slate-900">Autonomous Execution</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Staff collects registry records, qualifies accounts, discovers decision makers, and drafts messaging.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-slate-200 bg-slate-50 space-y-2.5">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Step 4</div>
              <h3 className="text-sm font-bold text-slate-900">Human Supervisor Review</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Staff OS pauses for explicit human sign-off. Edit copy, approve targets, or reject prior to dispatch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Active Team Member (Sales Research Staff) */}
      <section className="py-14 border-t border-slate-200 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <Briefcase className="w-3.5 h-3.5 text-slate-600" />
                <span>Assigned Staff Member</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Sales Research Staff
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Active B2B outbound research and qualification team member.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('workspace')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 shadow-2xs transition-colors cursor-pointer"
              >
                <span>Open Tasks Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Staff Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 text-slate-900 font-bold text-sm flex items-center justify-center shrink-0">
                  SR
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900">Current Assignment:</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                      In Progress
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                    "{worker.goal}"
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onNavigate('workspace');
                  onRunWorker();
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Run Assignment</span>
              </button>
            </div>

            {/* Current Work Checklist Sequence */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs space-y-1">
                <span className="text-[10px] font-mono text-slate-400">01</span>
                <div className="font-semibold text-slate-800">Goal received</div>
                <p className="text-[11px] text-slate-500">Criteria verified</p>
              </div>
              <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs space-y-1">
                <span className="text-[10px] font-mono text-slate-400">02</span>
                <div className="font-semibold text-slate-800">Plan created</div>
                <p className="text-[11px] text-slate-500">6 tasks mapped</p>
              </div>
              <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs space-y-1">
                <span className="text-[10px] font-mono text-slate-400">03</span>
                <div className="font-semibold text-slate-800">Researched</div>
                <p className="text-[11px] text-slate-500">32 candidates</p>
              </div>
              <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs space-y-1">
                <span className="text-[10px] font-mono text-slate-400">04</span>
                <div className="font-semibold text-slate-800">Qualified</div>
                <p className="text-[11px] text-slate-500">14 matching fit</p>
              </div>
              <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs space-y-1">
                <span className="text-[10px] font-mono text-slate-400">05</span>
                <div className="font-semibold text-slate-800">Prepared</div>
                <p className="text-[11px] text-slate-500">6 tailored drafts</p>
              </div>
              <div className="p-3 rounded-lg border border-blue-200 bg-blue-50 text-xs space-y-1">
                <span className="text-[10px] font-mono text-blue-700">06</span>
                <div className="font-semibold text-blue-900">Approval</div>
                <p className="text-[11px] text-blue-800">Human sign-off</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Human Governance */}
      <section className="py-14 border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-10 space-y-4">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
              Operational Safety & Governance
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Work gets done. You stay in control.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-normal max-w-2xl">
              Staff OS is engineered for business operations where accountability matters. Staff performs the labor-intensive prospecting, qualification, and initial message preparation, but execution pauses at defined checkpoints for your review.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Single-click approval workflow</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-300" />
                <span>Full editorial review of prepared drafts</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>No messages sent without confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Staff Roster Overview */}
      <section className="py-14 border-t border-slate-200 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-1 max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Staff Roles & Operations
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Specialized staff members for business development, operational triage, and logistics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs flex items-center justify-center">
                  SR
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Operational
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Sales Research Staff</h3>
                <p className="text-xs text-slate-500 mt-0.5">B2B market discovery & outreach prep</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Discovers target accounts, evaluates operational fit criteria, pinpoints decision makers, and drafts personalized messages.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 font-bold text-xs flex items-center justify-center">
                  CS
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  Planned
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Support Operations Staff</h3>
                <p className="text-xs text-slate-500 mt-0.5">Inquiry qualification & triage</p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Triages inbound customer questions, checks specifications and standard operating procedures, and drafts verified solutions.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 font-bold text-xs flex items-center justify-center">
                  LO
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  Planned
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Logistics Operations Staff</h3>
                <p className="text-xs text-slate-500 mt-0.5">Carrier tracking & exception management</p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Monitors transit milestones, detects delay risks, and prepares dispatcher reports for human escalation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Final CTA */}
      <section className="py-16 border-t border-slate-200 bg-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Put Staff OS to work
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Assign your work goal and let Sales Research Staff manage research and qualification with complete supervisory control.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('workspace')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-colors cursor-pointer"
            >
              <span>View Tasks Console</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
