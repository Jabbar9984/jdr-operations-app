"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import {
  JOBS,
  USERS,
  TECHNICIAN_STATS,
  getPendingApprovals,
  getActiveJobs,
  getCustomer,
} from "@/lib/mock-data";
import StatCard from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import PageHeader from "@/components/ui/PageHeader";
import {
  Briefcase,
  Users,
  CheckSquare,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Activity,
  ChevronRight,
  Star,
} from "lucide-react";

export default function OpsDashboard() {
  const [session, setSession] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const s = getSession();
    if (s) setSession(s);
  }, []);

  const pendingApprovals = getPendingApprovals();
  const activeJobs = getActiveJobs();
  const technicians = USERS.filter(u => u.role === "technician");
  const totalRevenue = TECHNICIAN_STATS.reduce((s, t) => s + t.revenue, 0);
  const urgentJobs = JOBS.filter(j => j.priority === "urgent" && j.status !== "completed");
  const completedToday = JOBS.filter(j => j.status === "completed");

  const firstName = session?.name?.split(" ")[0] ?? "Manager";
  const now = new Date();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-jdr-slate text-sm">
          {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>
        <h1 className="text-2xl font-bold text-jdr-navy mt-1">Good morning, {firstName}</h1>
        <p className="text-jdr-slate text-sm mt-1 capitalize">{session?.role} View</p>
      </div>

      {/* Alert banner */}
      {urgentJobs.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-800 font-semibold text-sm">{urgentJobs.length} Urgent Job{urgentJobs.length > 1 ? "s" : ""} Active</p>
            <p className="text-red-600 text-xs mt-0.5">Immediate attention required</p>
          </div>
          <Link href="/ops/jobs" className="text-red-700 font-medium text-xs hover:underline">View →</Link>
        </div>
      )}

      {/* Pending approvals alert */}
      {pendingApprovals.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <CheckSquare className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-amber-800 font-semibold text-sm">{pendingApprovals.length} Approval{pendingApprovals.length > 1 ? "s" : ""} Awaiting Review</p>
            <p className="text-amber-600 text-xs mt-0.5">Estimates and parts orders pending</p>
          </div>
          <Link href="/ops/approvals" className="text-amber-700 font-medium text-xs hover:underline">Review →</Link>
        </div>
      )}

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Jobs"
          value={activeJobs.length}
          icon={Briefcase}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          trend={`${completedToday.length} completed today`}
          trendUp={completedToday.length > 0}
        />
        <StatCard
          label="Pending Approvals"
          value={pendingApprovals.length}
          icon={CheckSquare}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
        />
        <StatCard
          label="Technicians"
          value={technicians.length}
          icon={Users}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          trend="All active"
          trendUp
        />
        <StatCard
          label="Week Revenue"
          value={`$${(totalRevenue / 1000).toFixed(1)}k`}
          icon={DollarSign}
          iconBg="bg-green-50"
          iconColor="text-green-600"
          trend="+12% vs last week"
          trendUp
        />
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
            {activeJobs.slice(0, 4).map((job) => {
              const customer = getCustomer(job.customerId);
              return (
                <Link
                  key={job.id}
                  href={`/ops/jobs/${job.id}`}
                  className="jdr-card flex items-center gap-3 p-4 hover:shadow-jdr-md transition-all"
                >
                  <div className={`w-2 h-10 rounded-full flex-shrink-0 ${
                    job.priority === "urgent" ? "bg-red-500" :
                    job.priority === "high" ? "bg-orange-400" :
                    "bg-blue-400"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-jdr-navy text-sm truncate">{job.title}</p>
                    <p className="text-jdr-slate text-xs">{customer?.name}</p>
                  </div>
                  <StatusBadge status={job.status} />
                  <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                </Link>
              );
            })}
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
              return (
                <div key={ts.technicianId} className="jdr-card flex items-center gap-3 p-4">
                  <div className="w-9 h-9 rounded-full bg-jdr-navy/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-jdr-navy text-xs font-bold">
                      {tech.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-jdr-navy text-sm">{tech.name}</p>
                    <p className="text-jdr-slate text-xs">{ts.pendingJobs} jobs · {tech.zone}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-amber-600 text-sm font-semibold">
                      <Star className="w-3.5 h-3.5" />
                      {ts.avgRating}
                    </div>
                    <p className="text-jdr-slate text-xs">${(ts.revenue / 1000).toFixed(1)}k</p>
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
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {pendingApprovals.map((ap) => (
              <Link key={ap.id} href="/ops/approvals" className="jdr-card flex items-center gap-3 p-4 hover:shadow-jdr-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center flex-shrink-0">
                  <CheckSquare className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-jdr-navy text-sm truncate">{ap.description}</p>
                  <p className="text-jdr-slate text-xs capitalize">{ap.type.replace("_", " ")}</p>
                </div>
                {ap.amount && (
                  <p className="text-jdr-navy font-bold text-sm flex-shrink-0">${ap.amount.toLocaleString()}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
