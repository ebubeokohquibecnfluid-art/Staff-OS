import React, { useState } from 'react';
import {
  X,
  Building2,
  Users,
  MapPin,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Edit3,
  Send,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Save,
  MailCheck,
} from 'lucide-react';
import { Prospect } from '../../types';

interface ProspectDetailModalProps {
  prospect: Prospect;
  onClose: () => void;
  onApprove: (prospectId: string) => void;
  onReject: (prospectId: string) => void;
  onSaveOutreach: (prospectId: string, subject: string, body: string) => void;
}

export const ProspectDetailModal: React.FC<ProspectDetailModalProps> = ({
  prospect,
  onClose,
  onApprove,
  onReject,
  onSaveOutreach,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [subject, setSubject] = useState(prospect.personalizedOutreach?.subject || '');
  const [body, setBody] = useState(prospect.personalizedOutreach?.body || '');

  const handleSave = () => {
    onSaveOutreach(prospect.id, subject, body);
    setIsEditing(false);
  };

  const getStatusBadge = () => {
    switch (prospect.outreachStatus) {
      case 'approved':
        return { label: 'Approved for sending', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' };
      case 'rejected':
        return { label: 'Rejected', color: 'bg-rose-50 text-rose-800 border-rose-300' };
      case 'prepared':
        return { label: 'Awaiting Human Approval', color: 'bg-blue-50 text-blue-800 border-blue-300' };
      default:
        return { label: 'Researched', color: 'bg-slate-100 text-slate-700 border-slate-300' };
    }
  };

  const status = getStatusBadge();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-xl border border-slate-200 overflow-hidden">
        {/* Modal Top Header */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {prospect.company}
              </h2>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${status.color}`}>
                {status.label}
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-900 text-white">
                {prospect.fitScore}% Fit
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {prospect.industry}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                {prospect.employeeCount} employees
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {prospect.location}
              </span>
              <span>•</span>
              <span className="text-slate-400 font-mono text-[11px]">
                {prospect.website}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Section 1: Company Overview & Decision Maker */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h3 className="font-semibold text-slate-800 uppercase tracking-wider text-[10px] mb-2">
                Company Overview
              </h3>
              <p className="text-slate-700 leading-relaxed">
                {prospect.companySummary}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h3 className="font-semibold text-slate-800 uppercase tracking-wider text-[10px] mb-2">
                Target Decision Maker
              </h3>
              <div className="font-semibold text-slate-900 text-sm">
                {prospect.relevantPerson}
              </div>
              <div className="text-slate-600 font-medium">{prospect.jobTitle}</div>
              <div className="text-slate-500 mt-2 leading-relaxed">
                Direct oversight for regional dispatch workflows, fleet allocation, and logistics software procurement.
              </div>
            </div>
          </div>

          {/* Section 2: Why Staff Member Selected Them */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="font-semibold text-slate-800 uppercase tracking-wider text-[10px]">
              Selection & Qualification Rationale
            </h3>
            <ul className="space-y-1.5">
              {prospect.reasonsForQualification.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-700">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>

            {prospect.operationalSignals && prospect.operationalSignals.length > 0 && (
              <div className="pt-3 border-t border-slate-200">
                <span className="font-semibold text-slate-800 text-[11px] block mb-1.5">
                  Research Findings & Operational Growth Signals:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {prospect.operationalSignals.map((sig, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 text-[11px]"
                    >
                      {sig}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Recommended Approach */}
          <div className="p-3.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800">
            <span className="font-semibold block mb-0.5 text-[10px] uppercase tracking-wider text-slate-600">
              Recommended Positioning
            </span>
            <p className="leading-relaxed text-slate-900">
              {prospect.recommendedApproach}
            </p>
          </div>

          {/* Section 4: Prepared Outreach Draft */}
          <div className="border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
            <div className="px-4 py-2.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MailCheck className="w-3.5 h-3.5 text-slate-300" />
                <span className="font-semibold text-xs">Prepared Outreach</span>
                <span className="text-[10px] font-medium uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Drafted by Staff Member
                </span>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 text-[11px] font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Draft</span>
                </button>
              )}
            </div>

            <div className="p-4 bg-white space-y-3">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Subject Line
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Message Body
                    </label>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      rows={8}
                      className="w-full text-xs font-mono p-2.5 rounded-lg border border-slate-300 focus:ring-1 focus:ring-slate-900 focus:outline-none leading-relaxed"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="pb-2 border-b border-slate-100">
                    <span className="font-semibold text-slate-500">Subject: </span>
                    <span className="font-bold text-slate-900">{subject}</span>
                  </div>
                  <div className="whitespace-pre-wrap font-mono text-[11px] text-slate-700 bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 leading-relaxed">
                    {body}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions: Approve / Edit / Reject */}
        <div className="p-3.5 px-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {prospect.outreachStatus === 'approved' ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Approved for dispatch queue
              </span>
            ) : prospect.outreachStatus === 'rejected' ? (
              <span className="text-rose-700 font-semibold flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                Rejected by supervisor
              </span>
            ) : (
              <span>Review prepared message and grant supervisor approval</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onReject(prospect.id)}
              disabled={prospect.outreachStatus === 'rejected'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject</span>
            </button>

            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
            >
              Edit Message
            </button>

            <button
              onClick={() => onApprove(prospect.id)}
              disabled={prospect.outreachStatus === 'approved'}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve for sending</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
