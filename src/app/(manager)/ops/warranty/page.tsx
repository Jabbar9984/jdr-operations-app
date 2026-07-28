"use client";

import { useState } from "react";
import Link from "next/link";
import { APPROVALS, getJob, getTechnician, getAppliance } from "@/lib/mock-data";
import PageHeader from "@/components/ui/PageHeader";
import { Shield, Clock, User, Search, ChevronRight, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { clsx } from "clsx";
import type { Approval } from "@/types";

const WARRANTY_MOCK: (Approval & { brand?: string; claimRef?: string; submitDate?: string })[] = [
  {
    ...APPROVALS.find(a => a.id === "ap4")!,
    brand: "Miele",
    claimRef: "MW-2026-00447",
    submitDate: "2026-07-26",
  },
  {
    id: "wc_mock1",
    type: "warranty_claim",
    jobId: "j1",
    requestedBy: "u3",
    requestedAt: "2026-07-27T10:00:00",
    amount: 320,
    description: "Sub-Zero evaporator fan motor failure — unit within 5-year warranty",
    status: "pending",
    brand: "Sub-Zero",
    claimRef: undefined,
    submitDate: undefined,
  },
  {
    id: "wc_mock2",
    type: "warranty_claim",
    jobId: "j3",
    requestedBy: "u4",
    requestedAt: "2026-07-27T11:30:00",
    amount: 95,
    description: "Miele water inlet valve — within 2-year parts warranty",
    status: "pending",
    brand: "Miele",
    claimRef: undefined,
    submitDate: undefined,
  },
];

const STATUS_CONFIG = {
  pending: { label: "Pending Submission", color: "bg-amber-50 text-amber-700 border-amber-200", icon: AlertCircle },
  approved: { label: "Claim Submitted", color: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function WarrantyPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved">("all");

  const filtered = WARRANTY_MOCK.filter(w => {
    const matchSearch = !search || w.description.toLowerCase().includes(search.toLowerCase()) || (w.brand?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchStatus = statusFilter === "all" || w.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pendingCount = WARRANTY_MOCK.filter(w => w.status === "pending").length;
  const submittedCount = WARRANTY_MOCK.filter(w => w.status === "approved").length;
  const totalValue = WARRANTY_MOCK.reduce((s, w) => s + (w.amount ?? 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Warranty Claims" subtitle={`${pendingCount} pending submission · ${submittedCount} submitted`} />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="jdr-card p-4 text-center">
          <p className="text-amber-600 font-bold text-2xl">{pendingCount}</p>
          <p className="text-jdr-slate text-xs mt-1">Pending Submission</p>
        </div>
        <div className="jdr-card p-4 text-center">
          <p className="text-green-700 font-bold text-2xl">{submittedCount}</p>
          <p className="text-jdr-slate text-xs mt-1">Submitted</p>
        </div>
        <div className="jdr-card p-4 text-center">
          <p className="text-jdr-navy font-bold text-2xl">${totalValue.toLocaleString()}</p>
          <p className="text-jdr-slate text-xs mt-1">Claim Value</p>
        </div>
      </div>

      {/* Miele portal notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-amber-800 font-semibold text-sm">Miele Warranty Portal — Pending Activation</p>
          <p className="text-amber-700 text-xs mt-0.5">Direct claim submission is not yet active. Submit claims manually through the Miele dealer portal until integration is live.</p>
          <Link href="/ops/integrations" className="text-amber-700 font-medium text-xs hover:underline mt-1 block">Configure integration →</Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search claims…" className="jdr-input pl-9" />
        </div>
        <div className="flex gap-1">
          {(["all", "pending", "approved"] as const).map(f => (
            <button key={f} onClick={() => setStatusFilter(f)} className={clsx("px-3 py-2 rounded-lg text-sm font-medium transition-all capitalize", statusFilter === f ? "bg-jdr-navy text-white" : "bg-white text-jdr-slate border border-gray-200 hover:bg-gray-50")}>
              {f === "all" ? "All" : f === "pending" ? "Pending" : "Submitted"}
            </button>
          ))}
        </div>
      </div>

      {/* Claims list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="jdr-card p-12 text-center">
            <Shield className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-jdr-navy font-semibold">No warranty claims found</p>
          </div>
        ) : filtered.map(claim => {
          const job = getJob(claim.jobId);
          const tech = getTechnician(claim.requestedBy);
          const appliance = job ? getAppliance(job.applianceId) : undefined;
          const cfg = STATUS_CONFIG[claim.status];
          const StatusIcon = cfg.icon;
          return (
            <div key={claim.id} className={clsx("jdr-card p-4", claim.status === "approved" && "border-green-200")}>
              <div className="flex items-start gap-3">
                <div className={clsx("w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0", cfg.color)}>
                  <Shield className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {claim.brand && <span className="jdr-badge bg-gray-100 text-gray-700">{claim.brand}</span>}
                    <span className={clsx("jdr-badge border flex items-center gap-1", cfg.color)}>
                      <StatusIcon className="w-3 h-3" />{cfg.label}
                    </span>
                  </div>
                  <p className="text-jdr-navy font-semibold text-sm">{claim.description}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-jdr-slate text-xs flex-wrap">
                    {tech && <span className="flex items-center gap-1"><User className="w-3 h-3" />{tech.name}</span>}
                    {appliance && <span>{appliance.brand} {appliance.model} · S/N {appliance.serial}</span>}
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(claim.requestedAt)}</span>
                  </div>
                  {claim.claimRef && (
                    <p className="text-jdr-slate text-xs mt-1.5 font-medium">Claim Ref: <span className="text-jdr-navy font-mono">{claim.claimRef}</span> · Submitted: {claim.submitDate ? formatDate(claim.submitDate) : "—"}</p>
                  )}
                  {claim.notes && <p className="text-jdr-slate text-xs mt-1 italic">"{claim.notes}"</p>}
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {claim.amount && <span className="text-jdr-navy font-bold">${claim.amount.toLocaleString()}</span>}
                  {claim.status === "pending" && (
                    <Link href={`/ops/approvals/${claim.id}`} className="flex items-center gap-1.5 text-xs font-medium bg-jdr-navy text-white px-3 py-1.5 rounded-lg hover:bg-jdr-navy/80 transition-colors">
                      Review <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-jdr-slate text-xs pb-4">Warranty portal integration pending — claims shown are mock data.</p>
    </div>
  );
}
