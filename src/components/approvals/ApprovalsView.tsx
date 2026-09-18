import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Edit3,
  CheckCheck,
  AlertTriangle,
  Building2,
  Mail,
  ShieldCheck,
  UserCheck,
  FileText,
  Save,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { Prospect } from '../../types';

interface ApprovalsViewProps {
  prospects: Prospect[];
  onApproveProspect: (id: string) => void;
  onRejectProspect: (id: string) => void;
  onSaveOutreach: (id: string, subject: string, body: string) => void;
  onBulkApproveAll: () => void;
}

export const ApprovalsView: React.FC<ApprovalsViewProps> = ({
  prospects,
  onApproveProspect,
  onRejectProspect,
  onSaveOutreach,
  onBulkApproveAll,
}) => {
  const [filterType, setFilterType] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');

  // Items with prepared outreach or approval requirements
  const approvalItems = prospects.filter((p) => p.personalizedOutreach);

  const pendingCount = approvalItems.filter((p) => p.outreachStatus === 'prepared').length;
  const approvedCount = approvalItems.filter((p) => p.outreachStatus === 'approved').length;
  const rejectedCount = approvalItems.filter((p) => p.outreachStatus === 'rejected').length;

  const filteredItems = approvalItems.filter((item) => {
    if (filterType === 'pending') return item.outreachStatus === 'prepared';
    if (filterType === 'approved') return item.outreachStatus === 'approved';
    if (filterType === 'rejected') return item.outreachStatus === 'rejected';
    return true;
  });

  const handleStartEdit = (item: Prospect) => {
    if (!item.personalizedOutreach) return;
    setEditingId(item.id);
    setEditSubject(item.personalizedOutreach.subject);
    setEditBody(item.personalizedOutreach.body);
  };

  const handleSaveEdit = (id: string) => {
    onSaveOutreach(id, editSubject, editBody);
    setEditingId(null);
  };

  const getRiskBadge = (riskLevel?: string) => {
    const r = riskLevel || 'Low';
    if (r === 'High') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <AlertTriangle className="w-3 h-3 text-rose-600" />
          <span>High Impact</span>
        </span>
      );
    }
    if (r === 'Medium') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          <span>Medium Impact</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <ShieldCheck className="w-3 h-3 text-emerald-600" />
        <span>Standard Impact</span>
      </span>
    );
  };

  const getRecordTypeLabel = (type?: string) => {
    switch (type) {
      case 'carrier':
        return 'Carrier Spot Booking';
      case 'hub_dispatch':
        return 'Corridor Dispatch Directive';
      case 'compliance_audit':
        return 'Regulatory Compliance Notice';
      case 'support_ticket':
        return 'Customer Resolution SLA';
      default:
        return 'Personalized B2B Outreach';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            <span>Human Supervision & Approvals Queue</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Review, edit, and authorize actions prepared by autonomous staff members before external dispatch
          </p>
        </div>

        {pendingCount > 0 && (
          <button
            onClick={onBulkApproveAll}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span>Approve All Pending ({pendingCount})</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setFilterType('pending')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
            filterType === 'pending'
              ? 'bg-blue-50 text-blue-800 border border-blue-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Awaiting Review</span>
          <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
            {pendingCount}
          </span>
        </button>

        <button
          onClick={() => setFilterType('approved')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
            filterType === 'approved'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Authorized</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
            {approvedCount}
          </span>
        </button>

        <button
          onClick={() => setFilterType('rejected')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
            filterType === 'rejected'
              ? 'bg-rose-50 text-rose-800 border border-rose-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Rejected</span>
          <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
            {rejectedCount}
          </span>
        </button>

        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            filterType === 'all'
              ? 'bg-slate-100 text-slate-800 border border-slate-300 font-bold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>All Records ({approvalItems.length})</span>
        </button>
      </div>

      {/* Approval Cards Grid */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
            <p className="text-sm font-semibold text-slate-900">Queue is clear</p>
            <p className="text-xs text-slate-400 mt-1">
              {filterType === 'pending'
                ? 'All pending staff actions have been reviewed and approved.'
                : 'No records found for the selected filter.'}
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isEditing = editingId === item.id;
            const isPending = item.outreachStatus === 'prepared';
            const isApproved = item.outreachStatus === 'approved';
            const isRejected = item.outreachStatus === 'rejected';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl border transition-all shadow-xs overflow-hidden ${
                  isPending
                    ? 'border-blue-200 ring-1 ring-blue-100'
                    : isApproved
                    ? 'border-emerald-200'
                    : 'border-slate-200 opacity-80'
                }`}
              >
                {/* Card Header Bar */}
                <div className="bg-slate-50/70 px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-xs px-2 py-0.5 rounded bg-slate-900 text-white">
                      {getRecordTypeLabel(item.recordType)}
                    </span>
                    {getRiskBadge(item.riskLevel)}
                    <span className="text-xs text-slate-500 font-medium">
                      Prepared by{' '}
                      <span className="font-semibold text-slate-800">
                        {item.workerName || 'Alex Mercer'}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isPending && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 animate-pulse">
                        <Clock className="w-3 h-3 text-blue-600" />
                        Requires Supervisor Approval
                      </span>
                    )}
                    {isApproved && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Authorized & Queued
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        Rejected / Withheld
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4">
                  {/* Target Company & Contact Banner */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-4 border-b border-slate-100">
                    <div className="md:col-span-6 space-y-1">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="font-bold text-slate-900 text-sm">{item.company}</span>
                        <span className="text-xs text-slate-400 font-normal">({item.location})</span>
                      </div>
                      <p className="text-xs text-slate-600 pl-6">{item.companySummary}</p>
                    </div>

                    <div className="md:col-span-3 text-xs space-y-1">
                      <span className="text-slate-400 block">Recipient / Decision Maker</span>
                      <div className="font-semibold text-slate-900">{item.relevantPerson}</div>
                      <div className="text-slate-500">{item.jobTitle}</div>
                    </div>

                    <div className="md:col-span-3 text-xs space-y-1">
                      <span className="text-slate-400 block">Fit / Confidence Score</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-sm">{item.fitScore}/100</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                          {item.fitAssessment}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {item.reasonsForQualification[0] || 'Criteria verified'}
                      </div>
                    </div>
                  </div>

                  {/* Operational Context: Why this requires approval */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800 block">
                        Supervision Rationale & Recommended Approach
                      </span>
                      <p className="text-slate-600 mt-0.5">
                        {item.recommendedApproach ||
                          'Automated outreach generated with personalized commercial hook. System paused for mandatory human sign-off prior to email dispatch.'}
                      </p>
                    </div>
                  </div>

                  {/* Prepared Draft Content Preview / Editor */}
                  {item.personalizedOutreach && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span>Prepared Draft (Version {item.personalizedOutreach.version || 1})</span>
                        </span>

                        {!isEditing && isPending && (
                          <button
                            onClick={() => handleStartEdit(item)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit Message</span>
                          </button>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-300">
                          <div>
                            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                              Subject Line
                            </label>
                            <input
                              type="text"
                              value={editSubject}
                              onChange={(e) => setEditSubject(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 bg-white focus:ring-1 focus:ring-slate-900"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                              Message Body
                            </label>
                            <textarea
                              rows={6}
                              value={editBody}
                              onChange={(e) => setEditBody(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono text-slate-900 bg-white focus:ring-1 focus:ring-slate-900"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveEdit(item.id)}
                              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shadow-xs"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Save Modifications</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2 text-xs">
                          <div className="font-semibold text-slate-900 pb-2 border-b border-slate-200/80">
                            <span className="text-slate-400 font-normal">Subject: </span>
                            {item.personalizedOutreach.subject}
                          </div>
                          <div className="font-sans text-slate-700 whitespace-pre-wrap leading-relaxed">
                            {item.personalizedOutreach.body}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <div className="text-[11px] text-slate-400">
                      Labeled:{' '}
                      <span className="font-mono font-medium text-slate-600">
                        Prepared by Staff OS • Human Sign-off Required
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isPending && (
                        <>
                          <button
                            onClick={() => onRejectProspect(item.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-700 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                          <button
                            onClick={() => onApproveProspect(item.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Authorize & Dispatch</span>
                          </button>
                        </>
                      )}

                      {isApproved && (
                        <button
                          onClick={() => onRejectProspect(item.id)}
                          className="text-xs text-slate-500 hover:text-rose-600 font-medium cursor-pointer"
                        >
                          Revoke authorization
                        </button>
                      )}

                      {isRejected && (
                        <button
                          onClick={() => onApproveProspect(item.id)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                        >
                          Re-approve draft
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
