"use client";

import { useState } from "react";
import { APPROVALS, getJob, getTechnician } from "@/lib/mock-data";
import PageHeader from "@/components/ui/PageHeader";
import { ApprovalBadge } from "@/components/ui/StatusBadge";
import {
  CheckSquare,
  CheckCircle,
  XCircle,
  DollarSign,
  FileText,
  Package,
  Shield,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { clsx } from "clsx";
import type { Approval } from "@/types";

const TYPE_ICONS: Record<Approval["type"], React.ReactNode> = {
  estimate: <FileText className="w-4 h-4" />,
  part_order: <Package className="w-4 h-4" />,
  warranty_claim: <Shield className="w-4 h-4" />,
};

const TYPE_LABELS: Record<Approval["type"], string> = {
  estimate: "Estimate",
  part_order: "Parts Order",
  warranty_claim: "Warranty Claim",
};

const TYPE_COLORS: Record<Approval["type"], string> = {
  estimate: "bg-blue-50 text-blue-700 border-blue-200",
  part_order: "bg-purple-50 text-purple-700 border-purple-200",
  warranty_claim: "bg-green-50 text-green-700 border-green-200",
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

function ApprovalCard({ approval }: { approval: Approval }) {
  const [expanded, setExpanded] = useState(false);
  const [localStatus, setLocalStatus] = useState(approval.status);
  const [actionNote, setActionNote] = useState("");

  const job = getJob(approval.jobId);
  const tech = getTechnician(approval.requestedBy);

  function handleApprove() {
    setLocalStatus("approved");
  }

  function handleReject() {
    setLocalStatus("rejected");
  }

  return (
    <div className={clsx(
      "jdr-card overflow-hidden transition-all",
      localStatus === "approved" && "border-green-200 bg-green-50/30",
      localStatus === "rejected" && "border-red-200 bg-red-50/30",
    )}>
      {/* Main row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-3 p-4 text-left"
      >
        <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border", TYPE_COLORS[approval.type])}>
          {TYPE_ICONS[approval.type]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={clsx("jdr-badge border", TYPE_COLORS[approval.type])}>
              {TYPE_LABELS[approval.type]}
            </span>
            <ApprovalBadge status={localStatus} />
          </div>
          <p className="text-jdr-navy font-semibold text-sm leading-snug">{approval.description}</p>
          <div className="flex items-center gap-3 mt-1.5 text-jdr-slate text-xs">
            {tech && <span>{tech.name}</span>}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(approval.requestedAt)}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {approval.amount && (
            <span className="text-jdr-navy font-bold text-base">${approval.amount.toLocaleString()}</span>
          )}
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          {job && (
            <div className="mt-3 py-3 border-b border-gray-100">
              <p className="text-jdr-slate text-xs font-medium uppercase tracking-wide mb-1">Related Job</p>
              <p className="text-jdr-navy font-semibold text-sm">{job.title}</p>
              <p className="text-jdr-slate text-xs mt-0.5">{job.address.city}, {job.address.state}</p>
            </div>
          )}

          {approval.notes && (
            <div className="mt-3 py-3 border-b border-gray-100">
              <p className="text-jdr-slate text-xs font-medium uppercase tracking-wide mb-1">Notes</p>
              <p className="text-jdr-navy text-sm">{approval.notes}</p>
              {approval.reviewedBy && (
                <p className="text-jdr-slate text-xs mt-1">
                  Reviewed by {getTechnician(approval.reviewedBy)?.name} · {approval.reviewedAt ? formatTime(approval.reviewedAt) : ""}
                </p>
              )}
            </div>
          )}

          {localStatus === "pending" && (
            <div className="mt-3 space-y-3">
              <div>
                <label className="jdr-label">Notes (optional)</label>
                <input
                  type="text"
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder="Add a note before deciding…"
                  className="jdr-input text-sm"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-semibold py-2.5 rounded-lg text-sm transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          )}

          {localStatus === "approved" && (
            <div className="mt-3 flex items-center gap-2 text-green-700 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Approved
            </div>
          )}

          {localStatus === "rejected" && (
            <div className="mt-3 flex items-center gap-2 text-red-600 text-sm font-medium">
              <XCircle className="w-4 h-4" />
              Rejected
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");

  const pending = APPROVALS.filter(a => a.status === "pending");
  const shown = activeTab === "pending" ? pending : APPROVALS;

  const totalPending = pending.reduce((sum, a) => sum + (a.amount ?? 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Approval Queue"
        subtitle={`${pending.length} items awaiting review`}
      />

      {/* Summary bar */}
      {pending.length > 0 && (
        <div className="jdr-card p-4 bg-jdr-navy">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs font-medium uppercase tracking-wide">Total Pending Value</p>
              <p className="text-white font-bold text-2xl mt-1">${totalPending.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
              <CheckSquare className="w-5 h-5 text-jdr-gold" />
              <div>
                <p className="text-white font-bold text-lg leading-tight">{pending.length}</p>
                <p className="text-white/50 text-xs">Pending</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {(["pending", "all"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize",
              activeTab === tab
                ? "bg-jdr-navy text-white"
                : "bg-white text-jdr-slate border border-gray-200 hover:bg-jdr-cream-dark"
            )}
          >
            {tab === "pending" ? `Pending (${pending.length})` : `All (${APPROVALS.length})`}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="jdr-card p-12 text-center">
          <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
          <p className="text-jdr-navy font-semibold">All caught up!</p>
          <p className="text-jdr-slate text-sm mt-1">No pending approvals</p>
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map((ap) => (
            <ApprovalCard key={ap.id} approval={ap} />
          ))}
        </div>
      )}
    </div>
  );
}
