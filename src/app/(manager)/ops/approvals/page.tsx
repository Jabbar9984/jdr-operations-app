"use client";

import { useState } from "react";
import Link from "next/link";
import { APPROVALS, getJob, getTechnician } from "@/lib/mock-data";
import PageHeader from "@/components/ui/PageHeader";
import { ApprovalBadge } from "@/components/ui/StatusBadge";
import {
  CheckSquare,
  DollarSign,
  FileText,
  Package,
  Shield,
  Clock,
  ChevronRight,
  Eye,
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

// Review packet available for ap1, ap2, ap3
const HAS_REVIEW = new Set(["ap1", "ap2", "ap3"]);

function ApprovalRow({ approval }: { approval: Approval }) {
  const job = getJob(approval.jobId);
  const tech = getTechnician(approval.requestedBy);

  return (
    <div className={clsx(
      "jdr-card flex items-start gap-3 p-4 hover:shadow-jdr-md transition-all",
      approval.status === "approved" && "border-green-200 bg-green-50/30",
      approval.status === "rejected" && "border-red-200 bg-red-50/30",
    )}>
      <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border", TYPE_COLORS[approval.type])}>
        {TYPE_ICONS[approval.type]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className={clsx("jdr-badge border", TYPE_COLORS[approval.type])}>{TYPE_LABELS[approval.type]}</span>
          <ApprovalBadge status={approval.status} />
          {HAS_REVIEW.has(approval.id) && approval.status === "pending" && (
            <span className="jdr-badge bg-indigo-50 text-indigo-700 border border-indigo-200">Full Review Available</span>
          )}
        </div>
        <p className="text-jdr-navy font-semibold text-sm leading-snug">{approval.description}</p>
        <div className="flex items-center gap-3 mt-1.5 text-jdr-slate text-xs flex-wrap">
          {tech && <span>{tech.name}</span>}
          {job && <span>· {job.title}</span>}
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(approval.requestedAt)}</span>
        </div>
        {approval.notes && approval.status !== "pending" && (
          <p className="text-jdr-slate text-xs mt-1 italic">"{approval.notes}"</p>
        )}
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-2">
        {approval.amount && <span className="text-jdr-navy font-bold text-base">${approval.amount.toLocaleString()}</span>}
        <Link
          href={`/ops/approvals/${approval.id}`}
          className={clsx(
            "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors",
            approval.status === "pending"
              ? "bg-jdr-navy text-white hover:bg-jdr-navy/80"
              : "bg-gray-100 text-jdr-slate hover:bg-gray-200"
          )}
        >
          {approval.status === "pending" ? <><Eye className="w-3.5 h-3.5" /> Review</> : <><ChevronRight className="w-3.5 h-3.5" /> View</>}
        </Link>
      </div>
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
      <PageHeader title="Approval Queue" subtitle={`${pending.length} items awaiting review`} />

      {/* Summary bar */}
      {pending.length > 0 && (
        <div className="jdr-card p-5 bg-jdr-navy">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs font-medium uppercase tracking-wide">Total Pending Value</p>
              <p className="text-white font-bold text-3xl mt-1">${totalPending.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-4">
              {(["estimate", "part_order", "warranty_claim"] as Approval["type"][]).map(type => {
                const count = pending.filter(a => a.type === type).length;
                if (!count) return null;
                return (
                  <div key={type} className="text-center bg-white/10 rounded-xl px-4 py-2">
                    <p className="text-white font-bold text-lg leading-tight">{count}</p>
                    <p className="text-white/50 text-xs">{TYPE_LABELS[type]}</p>
                  </div>
                );
              })}
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
              "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
              activeTab === tab ? "bg-jdr-navy text-white" : "bg-white text-jdr-slate border border-gray-200 hover:bg-jdr-cream-dark"
            )}
          >
            {tab === "pending" ? `Pending (${pending.length})` : `All (${APPROVALS.length})`}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="jdr-card p-12 text-center">
          <CheckSquare className="w-10 h-10 text-green-500 mx-auto mb-3" />
          <p className="text-jdr-navy font-semibold">All caught up!</p>
          <p className="text-jdr-slate text-sm mt-1">No pending approvals</p>
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map((ap) => <ApprovalRow key={ap.id} approval={ap} />)}
        </div>
      )}
    </div>
  );
}
