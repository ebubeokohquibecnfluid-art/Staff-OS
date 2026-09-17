import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, Briefcase, Target, FileCheck, Layers, UserCheck } from 'lucide-react';
import { TargetCriteria, Worker } from '../../types';

interface CreateWorkerWizardProps {
  onWorkerCreated: (newWorker: Worker) => void;
  onCancel: () => void;
}

export const CreateWorkerWizard: React.FC<CreateWorkerWizardProps> = ({
  onWorkerCreated,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form states
  const [goal, setGoal] = useState<string>('Find potential customers for my logistics software.');
  const [industry, setIndustry] = useState<string>('Logistics & Supply Chain');
  const [companySize, setCompanySize] = useState<string>('50–500 employees');
  const [location, setLocation] = useState<string>('United States');
  const [targetTitle, setTargetTitle] = useState<string>('VP Operations');
  const [outcome, setOutcome] = useState<string>('Identify qualified prospects and prepare personalized outreach.');
  const [workerName, setWorkerName] = useState<string>('Sales Research Staff');

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const targetCriteria: TargetCriteria = {
      industry,
      companySize,
      location,
      targetTitle,
    };

    const newWorker: Worker = {
      id: `worker-${Date.now()}`,
      name: workerName,
      role: 'Prospect Research Staff',
      description: `Autonomous staff member tasked to: ${goal}`,
      goal: `${goal} Focus on ${industry} (${companySize}) in ${location} targeting ${targetTitle}. ${outcome}`,
      status: 'IDLE',
      targetCriteria,
      currentActionSummary: 'Ready to execute research plan',
      stats: {
        prospectsResearched: 0,
        qualifiedProspects: 0,
        decisionMakersIdentified: 0,
        outreachPrepared: 0,
        tasksCompleted: 0,
        approvalsRequired: 0,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onWorkerCreated(newWorker);
  };

  const stepLabels = [
    { num: 1, title: 'Objective' },
    { num: 2, title: 'Targeting' },
    { num: 3, title: 'Outcome' },
    { num: 4, title: 'Review' },
  ];

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {/* Wizard Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 mb-3">
          <Briefcase className="w-3.5 h-3.5 text-slate-700" />
          <span>New Staff Assignment</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Configure Staff Member
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Define the operational objectives and boundary criteria. Staff OS will orchestrate research and workflow execution.
        </p>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {stepLabels.map((s, idx) => (
            <React.Fragment key={s.num}>
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-colors ${
                  currentStep === s.num
                    ? 'bg-slate-900 text-white font-medium'
                    : currentStep > s.num
                    ? 'bg-emerald-100 text-emerald-800 font-medium'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {currentStep > s.num ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <span>{s.num}.</span>
                )}
                <span>{s.title}</span>
              </div>
              {idx < stepLabels.length - 1 && (
                <div className="w-4 h-px bg-slate-200" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Wizard Card Body */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-2xs">
        {/* STEP 1: What should your staff member do? */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Step 1: Define staff objective
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Describe the high-level operational goal in plain business terms.
              </p>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Objective Statement
              </label>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                rows={3}
                className="w-full text-xs p-3 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all leading-relaxed"
                placeholder="e.g., Find potential customers for my logistics software."
              />
            </div>

            {/* Quick Suggestions */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Sample Objectives
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Find potential customers for my logistics software.',
                  'Discover regional trucking fleets facing dispatch bottlenecks.',
                  'Target cold-chain food distributors needing automated compliance.',
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setGoal(preset)}
                    className="text-xs text-left px-2.5 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Who should it focus on? */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Step 2: Account Targeting Criteria
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Define the Ideal Customer Profile boundaries for this assignment.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Industry
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full text-xs p-2 rounded-md border border-slate-300 focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  placeholder="e.g. Logistics"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Company size
                </label>
                <input
                  type="text"
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full text-xs p-2 rounded-md border border-slate-300 focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  placeholder="e.g. 50–500 employees"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs p-2 rounded-md border border-slate-300 focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  placeholder="e.g. United States"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Target job title
                </label>
                <input
                  type="text"
                  value={targetTitle}
                  onChange={(e) => setTargetTitle(e.target.value)}
                  className="w-full text-xs p-2 rounded-md border border-slate-300 focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  placeholder="e.g. VP Operations"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: What outcome do you want? */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Step 3: Deliverable & Governance
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Specify the deliverable produced before supervisor sign-off.
              </p>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Expected Deliverable
              </label>
              <textarea
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                rows={3}
                className="w-full text-xs p-3 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all leading-relaxed"
                placeholder="Identify qualified prospects and prepare personalized outreach."
              />
            </div>

            <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <div className="font-semibold text-slate-800 mb-1">
                Human-in-the-Loop Governance:
              </div>
              Staff OS will autonomously research and draft communications, but strictly pause at{' '}
              <span className="font-semibold text-slate-900">Awaiting Approval</span> for supervisor confirmation before any message is dispatched.
            </div>
          </div>
        )}

        {/* STEP 4: Review */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Step 4: Review & Deploy Assignment
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify parameters before activating staff member.
              </p>
            </div>

            <div className="pt-2 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Staff Member Name
                </label>
                <input
                  type="text"
                  value={workerName}
                  onChange={(e) => setWorkerName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-md border border-slate-300 focus:ring-1 focus:ring-slate-900 focus:outline-none font-semibold text-slate-900"
                />
              </div>

              <div className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Goal: </span>
                  <span className="font-semibold text-slate-900">{goal}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-slate-500">Industry: </span>
                    <span className="font-medium text-slate-800">{industry}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Size: </span>
                    <span className="font-medium text-slate-800">{companySize}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Location: </span>
                    <span className="font-medium text-slate-800">{location}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Target Buyer: </span>
                    <span className="font-medium text-slate-800">{targetTitle}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-500">Deliverable: </span>
                  <span className="font-medium text-slate-800">{outcome}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
          <div>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onCancel}
                className="text-xs font-medium text-slate-500 hover:text-slate-700 px-3 py-1.5 cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>

          <div>
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Initialize Staff Assignment</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
