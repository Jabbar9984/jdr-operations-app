"use client";

import { useState } from "react";
import Link from "next/link";
import { APPROVALS, JOBS, getJob, getTechnician, getCustomer, getAppliance } from "@/lib/mock-data";
import PageHeader from "@/components/ui/PageHeader";
import { Package, ChevronRight, Clock, User, Search, Filter } from "lucide-react";
import { clsx } from "clsx";
import type { Approval } from "@/types";

// Augment with some additional mock awaiting-parts scenarios
const MOCK_PART_ORDERS: (Approval & { eta?: string; partDetail?: string })[] = [
  ...APPROVALS.filter(a => a.type === "part_order").map(a => ({ ...a })),
  {
    id: "ap_mock1",
    type: "part_order" as const,
    jobId: "j4",
    requestedBy: "u5",
    requestedAt: "2026-07-26T14:00:00",
    amount: 155,
    description: "Sub-Zero Wine Cooler thermostat assembly (7021186) — resubmission",
    status: "pending" as const,
    eta: "2026-07-30",
    partDetail: "7021186",
  },
  {
    id: "ap_mock2",
    type: "part_order" as const,
    jobId: "j2",
    requestedBy: "u3",
    requestedAt: "2026-07-27T14:00:00",
    amount: 45,
    description: "Wolf Burner Igniter Electrode (804712) — front-left burner",
    status: "approved" as const,
    reviewedBy: "u2",
    reviewedAt: "2026-07-27T15:00:00",
    eta: "2026-07-28",
    partDetail: "804712",
  },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Awaiting Approval",
  approved: "Approved — Ordered",
  rejected: "Rejected",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function PartsWaitingPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved">("all");

  const filtered = MOCK_PART_ORDERS.filter(a => {
    const matchSearch = !search || a.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pendingCount = MOCK_PART_ORDERS.filter(a => a.status === "pending").length;
  const approvedCount = MOCK_PART_ORDERS.filter(a => a.status === "approved").length;
  const totalValue = MOCK_PART_ORDERS.reduce((s, a) => s + (a.amount ?? 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Parts Waiting" subtitle={`${pendingCount} orders awaiting approval · ${approvedCount} ordered`} />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="jdr-card p-4 text-center">
          <p className="text-jdr-navy font-bold text-2xl">{pendingCount}</p>
          <p className="text-jdr-slate text-xs mt-1">Awaiting Approval</p>
        </div>
        <div className="jdr-card p-4 text-center">
          <p className="text-green-700 font-bold text-2xl">{approvedCount}</p>
          <p className="text-jdr-slate text-xs mt-1">Ordered</p>
        </div>
        <div className="jdr-card p-4 text-center">
          <p className="text-jdr-navy font-bold text-2xl">${totalValue.toLocaleString()}</p>
          <p className="text-jdr-slate text-xs mt-1">Total Value</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search part orders…"
            className="jdr-input pl-9"
          />
        </div>
        <div className="flex gap-1">
          {(["all", "pending", "approved"] as const).map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={clsx(
                "px-3 py-2 rounded-lg text-sm font-medium transition-all capitalize",
                statusFilter === f ? "bg-jdr-navy text-white" : "bg-white text-jdr-slate border border-gray-200 hover:bg-gray-50"
              )}
            >
              {f === "all" ? "All" : STATUS_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Table-style list */}
      <div className="jdr-card overflow-hidden">
        <div className="hidden sm:grid grid-cols-12 gap-3 px-4 py-3 bg-jdr-cream border-b border-gray-100">
          <div className="col-span-4 text-xs font-semibold uppercase tracking-wide text-jdr-slate">Part / Description</div>
          <div className="col-span-2 text-xs font-semibold uppercase tracking-wide text-jdr-slate">Job</div>
          <div className="col-span-2 text-xs font-semibold uppercase tracking-wide text-jdr-slate">Technician</div>
          <div className="col-span-2 text-xs font-semibold uppercase tracking-wide text-jdr-slate">ETA / Requested</div>
          <div className="col-span-1 text-xs font-semibold uppercase tracking-wide text-jdr-slate">Amount</div>
          <div className="col-span-1 text-xs font-semibold uppercase tracking-wide text-jdr-slate">Status</div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-jdr-navy font-semibold">No part orders found</p>
            <p className="text-jdr-slate text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((order) => {
              const job = getJob(order.jobId);
              const tech = getTechnician(order.requestedBy);
              return (
                <div key={order.id} className="p-4 hover:bg-jdr-cream/50 transition-colors">
                  <div className="sm:hidden space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-jdr-navy font-semibold text-sm">{order.description}</p>
                        {job && <p className="text-jdr-slate text-xs mt-0.5">{job.title}</p>}
                      </div>
                      {order.amount && <span className="text-jdr-navy font-bold">${order.amount.toLocaleString()}</span>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-jdr-slate">
                      {tech && <span className="flex items-center gap-1"><User className="w-3 h-3" />{tech.name}</span>}
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(order.requestedAt)}</span>
                    </div>
                    <span className={clsx("jdr-badge border", STATUS_COLORS[order.status])}>{STATUS_LABELS[order.status]}</span>
                  </div>
                  <div className="hidden sm:grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-4">
                      <p className="text-jdr-navy font-medium text-sm leading-snug">{order.description}</p>
                    </div>
                    <div className="col-span-2">
                      {job ? (
                        <Link href={`/ops/jobs/${job.id}`} className="text-jdr-navy text-sm hover:text-jdr-gold transition-colors truncate block">
                          {job.title.split(" – ")[0]}
                        </Link>
                      ) : <span className="text-jdr-slate text-sm">—</span>}
                    </div>
                    <div className="col-span-2">
                      <span className="text-jdr-navy text-sm">{tech?.name ?? "—"}</span>
                    </div>
                    <div className="col-span-2">
                      <p className="text-jdr-navy text-sm">{(order as any).eta ? formatDate((order as any).eta) : "—"}</p>
                      <p className="text-jdr-slate text-xs">Req: {formatDate(order.requestedAt)}</p>
                    </div>
                    <div className="col-span-1">
                      <span className="text-jdr-navy font-semibold text-sm">{order.amount ? `$${order.amount.toLocaleString()}` : "—"}</span>
                    </div>
                    <div className="col-span-1">
                      <span className={clsx("jdr-badge border text-xs", STATUS_COLORS[order.status])}>
                        {order.status === "pending" ? "Pending" : order.status === "approved" ? "Ordered" : "Rejected"}
                      </span>
                    </div>
                  </div>
                  {order.status === "pending" && (
                    <div className="mt-3 flex justify-end">
                      <Link href={`/ops/approvals/${order.id}`} className="flex items-center gap-1.5 text-xs font-medium bg-jdr-navy text-white px-3 py-1.5 rounded-lg hover:bg-jdr-navy/80 transition-colors">
                        Review <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
