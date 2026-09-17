import React, { useState } from 'react';
import {
  Settings,
  Server,
  Database,
  RotateCcw,
  CheckCircle2,
  Info,
  ShieldCheck,
  Cpu,
  RefreshCw,
  Layers,
} from 'lucide-react';
import { AIConfig } from '../../services/aiService';

interface SettingsViewProps {
  isLiveAi: boolean;
  onToggleLiveAi: (enabled: boolean) => void;
  onResetAllData: () => void;
  aiConfig: AIConfig | null;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isLiveAi,
  onToggleLiveAi,
  onResetAllData,
  aiConfig,
}) => {
  const [resetConfirmed, setResetConfirmed] = useState(false);

  const handleReset = () => {
    onResetAllData();
    setResetConfirmed(true);
    setTimeout(() => setResetConfirmed(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          System Settings & Platform Architecture
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure model execution routing, deterministic datasets, and governance parameters
        </p>
      </div>

      {/* Section 1: Execution Engine */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-slate-100 text-slate-700 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Staff Execution Engine
              </h2>
              <p className="text-xs text-slate-500">
                Switch between live autonomous orchestration and deterministic benchmark mode
              </p>
            </div>
          </div>

          <span
            className={`text-xs font-medium px-2.5 py-1 rounded border ${
              isLiveAi
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {isLiveAi ? 'Live Autonomous Engine' : 'Deterministic Mode'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Live AI Option */}
          <div
            onClick={() => onToggleLiveAi(true)}
            className={`p-4 rounded-lg border transition-all cursor-pointer ${
              isLiveAi
                ? 'border-slate-900 bg-slate-50/70 shadow-2xs'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-xs text-slate-900">Live Autonomous Engine</span>
              {isLiveAi && <CheckCircle2 className="w-4 h-4 text-slate-900" />}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Executes dynamic multi-step reasoning via secure server-side API proxy. Generates multi-step research plans, qualifies accounts, and drafts customized outreach.
            </p>
            <div className="mt-3 text-[11px] font-mono text-slate-500 bg-white p-2 rounded border border-slate-200">
              API Connection: {aiConfig?.liveAiAvailable ? 'Active & Verified' : 'Demo Fallback Ready'}
            </div>
          </div>

          {/* Deterministic Benchmark Option */}
          <div
            onClick={() => onToggleLiveAi(false)}
            className={`p-4 rounded-lg border transition-all cursor-pointer ${
              !isLiveAi
                ? 'border-slate-900 bg-slate-50/70 shadow-2xs'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-xs text-slate-900">Deterministic Seeded Mode</span>
              {!isLiveAi && <CheckCircle2 className="w-4 h-4 text-slate-900" />}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              High-fidelity repeatable benchmark dataset. Uses realistic seeded companies and verified decision-makers for latency-free evaluation.
            </p>
            <div className="mt-3 text-[11px] font-mono text-slate-500 bg-white p-2 rounded border border-slate-200">
              Seeded Pool: 32 companies • 14 qualified
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Data Persistence & State */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-slate-100 text-slate-700 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Data Persistence & State Management
              </h2>
              <p className="text-xs text-slate-500">
                Staff state models are typed and structured for transactional persistence
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{resetConfirmed ? 'Reset Successful' : 'Reset to Seed State'}</span>
          </button>
        </div>

        <div className="text-xs text-slate-600 leading-relaxed space-y-2">
          <p>
            The Staff OS data layer decouples the staff orchestration state machine from the storage medium. The domain models (<code className="font-mono bg-slate-100 px-1 rounded">Worker</code>, <code className="font-mono bg-slate-100 px-1 rounded">WorkerTask</code>, <code className="font-mono bg-slate-100 px-1 rounded">WorkerAction</code>, <code className="font-mono bg-slate-100 px-1 rounded">Prospect</code>) are strictly typed in TypeScript and structured identically to relational tables.
          </p>
        </div>
      </div>

      {/* Section 3: Architecture & Governance */}
      <div className="bg-slate-900 text-white rounded-lg p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Platform Architecture & Governance
          </h2>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed">
          Staff OS operates on the principle that AI should be structured as autonomous staff members executing high-fidelity business operations, backed by strict human governance.
        </p>

        <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1.5">
          <div className="font-semibold text-slate-300">Core Operational Principles:</div>
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            <li><strong>Outcome over Instructions:</strong> Operators define high-level objectives; Staff OS breaks work into planned operational steps.</li>
            <li><strong>Tool Abstraction:</strong> Execution occurs through formal tool contracts (<code className="font-mono text-emerald-300">researchCompanies</code>, <code className="font-mono text-emerald-300">analyzeFit</code>).</li>
            <li><strong>Human-in-the-Loop Governance:</strong> Automated execution strictly pauses at <code className="font-mono text-blue-300">AWAITING_APPROVAL</code> before communication dispatch.</li>
            <li><strong>Auditability:</strong> Comprehensive log records every tool input, execution result, and supervisor authorization.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
