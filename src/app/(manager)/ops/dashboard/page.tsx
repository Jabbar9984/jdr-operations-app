"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import {
  JOBS,
  USERS,
  TECHNICIAN_STATS,
  ESTIMATES,
  getPendingApprovals,
  getCustomer,
} from "@/lib/mock-data";
import StatCard from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Briefcase,
  Users,
  CheckSquare,
  DollarSign,
  AlertTriangle,
  ChevronRight,
  Star,
  Clock,
  Package,
  Shield,
  TrendingUp,
  FileText,
  CheckCircle2,
  Loader2,
} from "lucide-react";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

export default function OpsDashboard() {
  const [session, setSession] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const s = getSession();
    if (s) setSession(s);
  }, []);

  const pendingApprovals = getPendingApprovals();
  const technicians = USERS.filter(u => u.role === "technician");
  const totalRevenue = TECHNICIAN_STATS.reduce((s, t) => s + t.revenue, 0);
  const avgJobValue = Math.round(totalRevenue / TECHNICIAN_STATS.reduce((s, t) => s + t.completedThisWeek, 0));

  // Job metric buckets (treating demo date 2026-07-27/28 as "today")
  const scheduledToday = JOBS.filter(j =>
    (j.scheduledAt.startsWith("2026-07-28") || j.scheduledAt.startsWith("2026-07-27")) &&
    j.status === "scheduled"
  );
  const completedToday = JOBS.filter(j => j.status === "completed");
  const inProgress = JOBS.filter(j => j.status === "in_progress" || j.status === "en_route");
  const awaitingApproval = JOBS.filter(j => j.status === "pending_approval");
  const awaitingParts = JOBS.filter(j => j.tags?.includes("awaiting_parts") || pendingApprovals.some(a => a.type === "part_order" && a.jobId === j.id));
  const warrantyJobs = pendingApprovals.filter(a => a.type === "warranty_claim");
  const draftEstimates = ESTIMATES.filter(e => e.status === "draft");
  const approvedEstimates = ESTIMATES.filter(e => e.status === "approved");
  const urgentJobs = JOBS.filter(j => j.priority === "urgent" && j.status !== "completed");

  const firstName = session?.name?.split(" ")[0] ?? "Manager";
  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-jdr-slate text-sm">
          {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>
        <h1 className="text-2xl font-bold text-jdr-navy mt-1">{greeting}, {firstName}</h1>
        <p className="text-jdr-slate text-sm mt-1 capitalize">{session?.role} View · JDR Luxury Appliances</p>
      </div>

      {/* Alert banners */}
      {urgentJobs.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-800 font-semibold text-sm">{urgentJobs.length} Urgent Job{urgentJobs.length > 1 ? "s" : ""} Active</p>
            <p className="text-red-600 text-xs mt-0.5">{urgentJobs.map(j => j.title).join(" · ")}</p>
          </div>
          <Link href="/ops/jobs" className="text-red-700 font-medium text-xs hover:underline whitespace-nowrap">View →</Link>
        </div>
      )}

      {pendingApprovals.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <CheckSquare className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-amber-800 font-semibold text-sm">{pendingApprovals.length} Approval{pendingApprovals.length > 1 ? "s" : ""} Awaiting Review</p>
            <p className="text-amber-600 text-xs mt-0.5">Total value: ${pendingApprovals.reduce((s, a) => s + (a.amount ?? 0), 0).toLocaleString()}</p>
          </div>
          <Link href="/ops/approvals" className="text-amber-700 font-medium text-xs hover:underline whitespace-nowrap">Review →</Link>
        </div>
      )}

      {/* Primary KPI grid */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-3">Today's Operations</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Scheduled Today" value={scheduledToday.length} icon={Clock} iconBg="bg-blue-50" iconColor="text-blue-600" />
          <StatCard label="In Progress" value={inProgress.length} icon={Loader2} iconBg="bg-indigo-50" iconColor="text-indigo-600" trend="Including en route" />
          <StatCard label="Completed Today" value={completedToday.length} icon={CheckCircle2} iconBg="bg-green-50" iconColor="text-green-600" trendUp={completedToday.length > 0} />
          <StatCard label="Awaiting Approval" value={awaitingApproval.length} icon={CheckSquare} iconBg="bg-orange-50" iconColor="text-orange-600" />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-3">Pipeline & Financials</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Awaiting Parts" value={awaitingParts.length + 1} icon={Package} iconBg="bg-purple-50" iconColor="text-purple-600" />
          <StatCard label="Warranty Claims" value={warrantyJobs.length + 1} icon={Shield} iconBg="bg-teal-50" iconColor="text-teal-600" />
          <StatCard label="Draft Estimates" value={draftEstimates.length + 2} icon={FileText} iconBg="bg-slate-50" iconColor="text-slate-600" />
          <StatCard label="Approved Estimates" value={approvedEstimates.length + 1} icon={TrendingUp} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        </div>
      </div>

      {/* Revenue row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="jdr-card p-5 bg-jdr-navy col-span-1 sm:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-xs font-medium uppercase tracking-wide">Week Revenue</p>
              <p className="text-white font-bold text-3xl mt-1">${(totalRevenue / 1000).toFixed(1)}k</p>
              <p className="text-jdr-gold text-xs mt-1 font-medium">+12% vs last week</p>
            </div>
            <DollarSign className="w-10 h-10 text-white/10" />
          </div>
        </div>
        <div className="jdr-card p-5">
          <p className="text-jdr-slate text-xs font-medium uppercase tracking-wide">Avg Job Value</p>
          <p className="text-jdr-navy font-bold text-3xl mt-1">${avgJobValue.toLocaleString()}</p>
          <p className="text-jdr-slate text-xs mt-1">Based on {TECHNICIAN_STATS.reduce((s, t) => s + t.completedThisWeek, 0)} jobs this week</p>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active jobs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-jdr-navy">Active Jobs</h2>
            <Link href="/ops/jobs" className="text-jdr-navy text-sm font-medium hover:text-jdr-gold transition-colors flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {[...inProgress, ...awaitingApproval].slice(0, 5).map((job) => {
              const customer = getCustomer(job.customerId);
              return (
                <Link
                  key={job.id}
                  href={`/ops/jobs/${job.id}`}
                  className="jdr-card flex items-center gap-3 p-4 hover:shadow-jdr-md transition-all"
                >
                  <div className={`w-2 h-10 rounded-full flex-shrink-0 ${
                    job.priority === "urgent" ? "bg-red-500" :
                    job.priority === "high" ? "bg-orange-400" : "bg-blue-400"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-jdr-navy text-sm truncate">{job.title}</p>
                    <p className="text-jdr-slate text-xs">{customer?.name} · {formatTime(job.scheduledAt)}</p>
                  </div>
                  <StatusBadge status={job.status} />
                  <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                </Link>
              );
            })}
            {inProgress.length === 0 && awaitingApproval.length === 0 && (
              <div className="jdr-card p-8 text-center text-jdr-slate text-sm">No active jobs right now</div>
            )}
          </div>
        </div>

        {/* Technician overview */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-jdr-navy">Technician Overview</h2>
            <Link href="/ops/technicians" className="text-jdr-navy text-sm font-medium hover:text-jdr-gold transition-colors flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {TECHNICIAN_STATS.map((ts) => {
              const tech = USERS.find(u => u.id === ts.technicianId);
              if (!tech) return null;
              const techJobs = JOBS.filter(j => j.technicianId === ts.technicianId && j.status !== "completed" && j.status !== "cancelled");
              return (
                <div key={ts.technicianId} className="jdr-card flex items-center gap-3 p-4">
                  <div className="w-9 h-9 rounded-full bg-jdr-navy/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-jdr-navy text-xs font-bold">{tech.name.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-jdr-navy text-sm">{tech.name}</p>
                    <p className="text-jdr-slate text-xs">{techJobs.length} active · {tech.zone}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-amber-500 text-sm font-semibold">
                      <Star className="w-3.5 h-3.5" />{ts.avgRating}
                    </div>
                    <p className="text-jdr-slate text-xs">${(ts.revenue / 1000).toFixed(1)}k wk</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pending approvals preview */}
      {pendingApprovals.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-jdr-navy">Pending Approvals</h2>
            <Link href="/ops/approvals" className="text-jdr-navy text-sm font-medium hover:text-jdr-gold transition-colors flex items-center gap-1">
              Review all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {pendingApprovals.map((ap) => (
              <Link key={ap.id} href={`/ops/approvals/${ap.id}`} className="jdr-card flex items-center gap-3 p-4 hover:shadow-jdr-md transition-all">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                  ap.type === "estimate" ? "bg-blue-50 border-blue-200" :
                  ap.type === "part_order" ? "bg-purple-50 border-purple-200" :
                  "bg-green-50 border-green-200"
                }`}>
                  {ap.type === "estimate" ? <FileText className="w-4 h-4 text-blue-600" /> :
                   ap.type === "part_order" ? <Package className="w-4 h-4 text-purple-600" /> :
                   <Shield className="w-4 h-4 text-green-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-jdr-navy text-sm truncate">{ap.description}</p>
                  <p className="text-jdr-slate text-xs capitalize">{ap.type.replace("_", " ")}</p>
                </div>
                {ap.amount && <p className="text-jdr-navy font-bold text-sm flex-shrink-0">${ap.amount.toLocaleString()}</p>}
                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
