import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Building2,
  Users,
  MapPin,
  ArrowUpDown,
  MailCheck,
} from 'lucide-react';
import { Prospect } from '../../types';
import { ProspectDetailModal } from './ProspectDetailModal';

interface ProspectsViewProps {
  prospects: Prospect[];
  onApproveProspect: (id: string) => void;
  onRejectProspect: (id: string) => void;
  onSaveOutreach: (id: string, subject: string, body: string) => void;
  onBulkApproveAll: () => void;
}

export const ProspectsView: React.FC<ProspectsViewProps> = ({
  prospects,
  onApproveProspect,
  onRejectProspect,
  onSaveOutreach,
  onBulkApproveAll,
}) => {
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'qualified' | 'awaiting_approval' | 'approved' | 'disqualified'>('all');

  const filteredProspects = prospects.filter((p) => {
    // Search
    const matchesSearch =
      p.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.relevantPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // Filter
    if (statusFilter === 'qualified') return p.researchStatus === 'qualified';
    if (statusFilter === 'awaiting_approval') return p.outreachStatus === 'prepared';
    if (statusFilter === 'approved') return p.outreachStatus === 'approved';
    if (statusFilter === 'disqualified') return p.researchStatus === 'disqualified';

    return true;
  });

  const awaitingApprovalCount = prospects.filter((p) => p.outreachStatus === 'prepared').length;
  const approvedCount = prospects.filter((p) => p.outreachStatus === 'approved').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Accounts & Outreach Approvals
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Accounts discovered, scored, and prepared by Sales Research Staff for supervisor review
          </p>
        </div>

        {/* Human-in-the-loop Approval Action */}
        {awaitingApprovalCount > 0 && (
          <button
            onClick={onBulkApproveAll}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve All Prepared Outreach ({awaitingApprovalCount})</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search company, person, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'all', label: 'All Accounts', count: prospects.length },
            { id: 'qualified', label: 'Qualified', count: 14 },
            { id: 'awaiting_approval', label: `Awaiting Approval (${awaitingApprovalCount})`, count: awaitingApprovalCount },
            { id: 'approved', label: `Approved (${approvedCount})`, count: approvedCount },
            { id: 'disqualified', label: 'Disqualified', count: 2 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Prospects Table Card */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Industry & Scale</th>
                <th className="py-3 px-4">Decision Maker</th>
                <th className="py-3 px-4">Fit Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProspects.map((prospect) => (
                <tr
                  key={prospect.id}
                  onClick={() => setSelectedProspect(prospect)}
                  className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                >
                  {/* Company */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 group-hover:text-slate-950">
                      {prospect.company}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {prospect.website}
                    </div>
                  </td>

                  {/* Industry & Headcount */}
                  <td className="py-3 px-4">
                    <div className="text-slate-800 font-medium">
                      {prospect.industry}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <span>{prospect.employeeCount} employees</span>
                      <span>•</span>
                      <span>{prospect.location}</span>
                    </div>
                  </td>

                  {/* Decision Maker */}
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900">
                      {prospect.relevantPerson}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {prospect.jobTitle}
                    </div>
                  </td>

                  {/* Fit Score */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                          prospect.fitScore >= 85
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : prospect.fitScore >= 70
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {prospect.fitScore}%
                      </span>
                      <span className="text-[11px] text-slate-500 hidden sm:inline">
                        {prospect.fitAssessment}
                      </span>
                    </div>
                  </td>

                  {/* Outreach Status */}
                  <td className="py-3 px-4">
                    {prospect.outreachStatus === 'prepared' ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        <Clock className="w-3 h-3 text-blue-600" />
                        <span>Awaiting Approval</span>
                      </span>
                    ) : prospect.outreachStatus === 'approved' ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Approved</span>
                      </span>
                    ) : prospect.outreachStatus === 'rejected' ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        <span>Rejected</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
                        <span>Researched</span>
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProspect(prospect);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredProspects.length} of {prospects.length} accounts</span>
          <span className="hidden sm:inline">Select row to review draft copy or modify approval status</span>
        </div>
      </div>

      {/* Prospect Detail Modal */}
      {selectedProspect && (
        <ProspectDetailModal
          prospect={selectedProspect}
          onClose={() => setSelectedProspect(null)}
          onApprove={(id) => {
            onApproveProspect(id);
            setSelectedProspect(null);
          }}
          onReject={(id) => {
            onRejectProspect(id);
            setSelectedProspect(null);
          }}
          onSaveOutreach={(id, subject, body) => {
            onSaveOutreach(id, subject, body);
            setSelectedProspect((prev) =>
              prev
                ? {
                    ...prev,
                    personalizedOutreach: prev.personalizedOutreach
                    ? { ...prev.personalizedOutreach, subject, body }
                    : undefined,
                  }
                : null
            );
          }}
        />
      )}
    </div>
  );
};

