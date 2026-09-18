import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Users,
  ShieldCheck,
  RotateCcw,
  Search,
  Check,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { ViewScreen, Worker } from '../../types';

// Photographs
import salesResearchImg from '../../assets/images/service_sales_research_1789681967814.jpg';
import fleetLogisticsImg from '../../assets/images/service_fleet_logistics_1789681979057.jpg';
import transitYardImg from '../../assets/images/gallery_transit_yard_1789682291205.jpg';
import complianceAuditImg from '../../assets/images/service_compliance_audit_1789681989445.jpg';
import supportTriageImg from '../../assets/images/service_support_triage_1789682001928.jpg';

interface QuickStartViewProps {
  workers: Worker[];
  onStartAssignment: (worker: Worker, customGoal: string) => void;
  onExplorePlatform: () => void;
  initialGoal?: string;
}

interface WorkerRecommendationMeta {
  workerId: string;
  image: string;
  reason: string;
  actions: string[];
}

const RECOMMENDATION_METAS: Record<string, WorkerRecommendationMeta> = {
  'worker-alex-mercer': {
    workerId: 'worker-alex-mercer',
    image: salesResearchImg,
    reason: 'Alex can research potential companies, qualify high-fit prospects, and prepare personalized outreach for your review.',
    actions: [
      'Research companies matching your target criteria',
      'Analyze operational signals and qualify fit',
      'Identify decision makers (VP Operations / Directors)',
      'Prepare personalized outreach drafts',
      'Bring all drafted communications to you for approval',
    ],
  },
  'worker-jordan-hayes': {
    workerId: 'worker-jordan-hayes',
    image: fleetLogisticsImg,
    reason: 'Jordan can research carrier availability, verify safety certifications, and match suitable carriers to the shipment.',
    actions: [
      'Analyze cargo specifications and transit lane requirements',
      'Search verified carrier registries for available capacity',
      'Audit safety ratings, operating authority, and insurance',
      'Benchmark spot market rates and prepare booking drafts',
      'Pause for supervisor authorization before confirming loads',
    ],
  },
  'worker-field-logistics': {
    workerId: 'worker-field-logistics',
    image: transitYardImg,
    reason: 'Field Logistics Staff can monitor terminal dwell times, identify yard bottlenecks, and prepare gate rebalancing directives.',
    actions: [
      'Ingest transit corridor and terminal telemetry',
      'Detect cross-dock turnaround bottlenecks and dwell spikes',
      'Calculate driver turnaround efficiency metrics',
      'Formulate corrective dispatch instructions',
      'Present priority yard directives for operational approval',
    ],
  },
  'worker-morgan-vance': {
    workerId: 'worker-morgan-vance',
    image: complianceAuditImg,
    reason: 'Morgan can review carrier filings, audit electronic logging device (ELD) hours, and flag compliance anomalies for review.',
    actions: [
      'Inspect carrier safety filings and inspection histories',
      'Audit driver Hours of Service (HOS) logs for threshold breaches',
      'Verify DOT annual certifications and vehicle maintenance records',
      'Generate prioritized safety audit notices',
      'Route flagged compliance violations to safety directors',
    ],
  },
  'worker-elena-chen': {
    workerId: 'worker-elena-chen',
    image: supportTriageImg,
    reason: 'Elena can triage customer questions, retrieve verified order specifications, and draft high-accuracy resolution responses.',
    actions: [
      'Triage incoming shipper inquiries and classify urgency',
      'Retrieve GPS telemetry, bill of lading data, and delivery status',
      'Formulate verified, policy-compliant resolution drafts',
      'Enforce customer SLA standards and escalation rules',
      'Submit resolution drafts to support leads for dispatch sign-off',
    ],
  },
};

const GOAL_EXAMPLES = [
  {
    label: 'Find B2B prospects for SaaS sales',
    fullGoal: 'Find B2B prospects for SaaS sales, research company profiles, qualify operational fit, and prepare personalized outreach drafts for decision makers.',
    workerId: 'worker-alex-mercer',
  },
  {
    label: 'Research competitor pricing and features',
    fullGoal: 'Research competitor pricing models, feature offerings, market positioning, and summarize key insights for product strategy.',
    workerId: 'worker-alex-mercer',
  },
  {
    label: 'Draft email follow-ups for warm leads',
    fullGoal: 'Draft high-touch personalized email follow-ups for warm prospective leads with contextual value propositions and staging for sign-off.',
    workerId: 'worker-alex-mercer',
  },
  {
    label: 'Clean and enrich inbound customer data',
    fullGoal: 'Clean and enrich inbound customer account data, verify company sizes, website urls, and decision-maker contact records.',
    workerId: 'worker-alex-mercer',
  },
  {
    label: 'Monitor industry news and summarize trends',
    fullGoal: 'Monitor regional logistics and freight industry trends, identify regulatory shifts, and prepare weekly executive briefs.',
    workerId: 'worker-field-logistics',
  },
  {
    label: 'Match trucks to shipments',
    fullGoal: 'Find available carriers for freight shipments, verify transit capacity and safety ratings, and prepare carrier booking recommendations.',
    workerId: 'worker-jordan-hayes',
  },
  {
    label: 'Review carrier compliance and safety',
    fullGoal: 'Review carrier safety records for compliance concerns, audit driver hours and safety inspection logs, and flag anomalies for supervisor review.',
    workerId: 'worker-morgan-vance',
  },
  {
    label: 'Handle customer support inquiries',
    fullGoal: 'Handle unresolved customer inquiries, retrieve verified shipment specifications and tracking telemetry, and draft high-accuracy resolution responses.',
    workerId: 'worker-elena-chen',
  },
];

export const QuickStartView: React.FC<QuickStartViewProps> = ({
  workers,
  onStartAssignment,
  onExplorePlatform,
  initialGoal = '',
}) => {
  const [goal, setGoal] = useState<string>(initialGoal);
  const [currentStep, setCurrentStep] = useState<'input' | 'recommendation' | 'confirmation'>('input');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('worker-alex-mercer');
  const [isChoosingAnotherStaff, setIsChoosingAnotherStaff] = useState<boolean>(false);

  // Deterministic recommendation algorithm based on keywords
  const determineWorkerFromGoal = (goalText: string): Worker => {
    const lower = goalText.toLowerCase();

    // Jordan Hayes: carrier, truck, shipment, freight, trailer, load
    if (
      lower.includes('truck') ||
      lower.includes('freight') ||
      lower.includes('carrier') ||
      lower.includes('shipment') ||
      lower.includes('load') ||
      lower.includes('haulage') ||
      lower.includes('cargo')
    ) {
      return workers.find((w) => w.id === 'worker-jordan-hayes') || workers[0];
    }

    // Morgan Vance: compliance, audit, safety, dot, eld, hours, violation, regulatory
    if (
      lower.includes('compliance') ||
      lower.includes('audit') ||
      lower.includes('safety') ||
      lower.includes('regulat') ||
      lower.includes('dot') ||
      lower.includes('eld') ||
      lower.includes('violation')
    ) {
      return workers.find((w) => w.id === 'worker-morgan-vance') || workers[0];
    }

    // Elena Chen: support, inquiry, customer, ticket, questions, complaint, sla, help
    if (
      lower.includes('support') ||
      lower.includes('inquir') ||
      lower.includes('ticket') ||
      lower.includes('question') ||
      lower.includes('complaint') ||
      lower.includes('customer') && (lower.includes('help') || lower.includes('service') || lower.includes('issue'))
    ) {
      return workers.find((w) => w.id === 'worker-elena-chen') || workers[0];
    }

    // Field Logistics: terminal, hub, dock, corridor, dwell, turnaround, bottleneck, gate
    if (
      lower.includes('terminal') ||
      lower.includes('hub') ||
      lower.includes('dock') ||
      lower.includes('corridor') ||
      lower.includes('dwell') ||
      lower.includes('bottleneck') ||
      lower.includes('gate') ||
      lower.includes('yard')
    ) {
      return workers.find((w) => w.id === 'worker-field-logistics') || workers[0];
    }

    // Default: Alex Mercer (Sales Research Staff)
    return workers.find((w) => w.id === 'worker-alex-mercer') || workers[0];
  };

  const handleSelectExample = (exampleGoal: string, explicitWorkerId?: string) => {
    setGoal(exampleGoal);
    if (explicitWorkerId) {
      setSelectedWorkerId(explicitWorkerId);
    }
  };

  const handleContinueFromInput = () => {
    if (!goal.trim()) return;
    const recommended = determineWorkerFromGoal(goal);
    setSelectedWorkerId(recommended.id);
    setIsChoosingAnotherStaff(false);
    setCurrentStep('recommendation');
  };

  const selectedWorker = workers.find((w) => w.id === selectedWorkerId) || workers[0];
  const meta = RECOMMENDATION_METAS[selectedWorker.id] || RECOMMENDATION_METAS['worker-alex-mercer'];

  return (
    <div className="min-h-full bg-slate-50 flex flex-col justify-between py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto w-full">
        {/* Step Indicator & Back Link */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-900 text-white">
              STAFF OS
            </span>
            <span className="text-xs text-slate-400 font-medium">/</span>
            <span className="text-xs text-slate-600 font-medium">
              {currentStep === 'input' && 'Step 1: Define Goal'}
              {currentStep === 'recommendation' && 'Step 2: Recommended Staff'}
              {currentStep === 'confirmation' && 'Step 3: Confirm Assignment'}
            </span>
          </div>

          <button
            onClick={onExplorePlatform}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Explore Staff OS</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* STEP 1: DEFINE GOAL */}
        {currentStep === 'input' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-8 animate-fadeIn">
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 font-editorial">
                What would you like your staff to do?
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                Give Staff OS a goal. We'll choose the right AI staff and handle the work.
              </p>
            </div>

            {/* Main Goal Input */}
            <div className="space-y-3">
              <label htmlFor="goal-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Your Assignment Goal
              </label>
              <div className="relative">
                <textarea
                  id="goal-input"
                  rows={4}
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="Example: Find companies that may need our logistics services and prepare outreach for them."
                  className="w-full rounded-xl border border-slate-200 p-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all resize-none shadow-2xs leading-relaxed"
                />
              </div>
            </div>

            {/* Clickable Quick Examples */}
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-slate-500 block">
                Or choose an example to start:
              </span>
              <div className="flex flex-wrap gap-2">
                {GOAL_EXAMPLES.map((ex) => (
                  <button
                    key={ex.label}
                    onClick={() => handleSelectExample(ex.fullGoal, ex.workerId)}
                    className="px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 transition-colors cursor-pointer text-left"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button
                onClick={onExplorePlatform}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer py-2 text-center sm:text-left"
              >
                Skip to full dashboard
              </button>

              <button
                onClick={handleContinueFromInput}
                disabled={!goal.trim()}
                className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all cursor-pointer shadow-xs ${
                  goal.trim()
                    ? 'bg-slate-900 hover:bg-slate-800 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SMART STAFF RECOMMENDATION */}
        {currentStep === 'recommendation' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Recommendation Card */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              {/* Top Banner Tag */}
              <div className="bg-slate-900 px-6 py-2.5 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider font-mono">
                    WE RECOMMEND
                  </span>
                </div>
                <span className="text-[11px] text-slate-300 font-medium">
                  Matches your objective
                </span>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                {/* Staff Profile Hero */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-slate-200 shrink-0 shadow-xs relative">
                    <img
                      src={meta.image}
                      alt={selectedWorker.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                        {selectedWorker.name}
                      </h2>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {selectedWorker.role}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                      {meta.reason}
                    </p>
                  </div>
                </div>

                {/* What the Staff Will Do */}
                <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    What {selectedWorker.name} will do:
                  </span>

                  <ol className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-normal">
                    {meta.actions.map((act, index) => (
                      <li key={index} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="leading-snug">{act}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Human Control Assurance */}
                <div className="flex items-center gap-2.5 text-xs text-slate-500 bg-white p-3 rounded-lg border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Human in control:</strong> {selectedWorker.name} will prepare all research and drafts, but will wait for your review and approval before any external actions are dispatched.
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => setCurrentStep('input')}
                      className="px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Edit Goal
                    </button>

                    <button
                      onClick={() => setIsChoosingAnotherStaff(!isChoosingAnotherStaff)}
                      className="px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      {isChoosingAnotherStaff ? 'Hide options' : 'Choose another staff'}
                    </button>
                  </div>

                  <button
                    onClick={() => setCurrentStep('confirmation')}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Continue to Confirmation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Alternative Staff Picker (if user clicked "Choose another staff") */}
            {isChoosingAnotherStaff && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Choose from your 5 available AI staff members:
                  </h3>
                  <span className="text-xs text-slate-500">Click to select</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {workers.map((w) => {
                    const isSelected = w.id === selectedWorker.id;
                    const wMeta = RECOMMENDATION_METAS[w.id];
                    return (
                      <div
                        key={w.id}
                        onClick={() => {
                          setSelectedWorkerId(w.id);
                          setIsChoosingAnotherStaff(false);
                        }}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'border-slate-900 ring-1 ring-slate-900 bg-slate-50'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        {wMeta?.image ? (
                          <img
                            src={wMeta.image}
                            alt={w.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {w.initials || 'ST'}
                          </div>
                        )}

                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 leading-tight">
                              {w.name}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 block truncate">
                            {w.role}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: CONFIRMATION ("YOUR ASSIGNMENT") */}
        {currentStep === 'confirmation' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6 animate-fadeIn">
            <div className="space-y-1 pb-4 border-b border-slate-100">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                READY TO COMMENCE
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-editorial">
                Your Assignment
              </h1>
            </div>

            {/* Directive & Staff Summary */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Directive Goal:
                </span>
                <p className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                  "{goal}"
                </p>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white">
                <img
                  src={meta.image}
                  alt={selectedWorker.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Assigned Staff Member:
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{selectedWorker.name}</span>
                    <span className="text-xs text-slate-500">({selectedWorker.role})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Observable Workflow Checklist */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                {selectedWorker.name} will execute:
              </span>

              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                  <span>Research relevant market entities and operational parameters</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                  <span>Qualify operational fit according to assignment criteria</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                  <span>Identify decision makers and verify contact details</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                  <span>Prepare personalized communications and operational drafts</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span className="font-semibold text-slate-900">
                    Bring all critical decisions back to you for approval
                  </span>
                </li>
              </ul>
            </div>

            {/* Start Button & Edit Goal */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                onClick={() => setCurrentStep('recommendation')}
                className="px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-center"
              >
                Back to recommendation
              </button>

              <button
                onClick={() => onStartAssignment(selectedWorker, goal)}
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-md transition-all cursor-pointer active:scale-98"
              >
                <span>Start Assignment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer subtle brand mark */}
      <div className="text-center pt-8 text-xs text-slate-400 font-mono">
        STAFF OS • AUTONOMOUS WORKFORCE WITH HUMAN SUPERVISION
      </div>
    </div>
  );
};
