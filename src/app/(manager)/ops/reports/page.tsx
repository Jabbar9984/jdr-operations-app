"use client";

import { JOBS, TECHNICIAN_STATS, USERS, CUSTOMERS } from "@/lib/mock-data";
import PageHeader from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Briefcase,
  Users,
  CheckCircle,
  Clock,
  Star,
  MapPin,
} from "lucide-react";
import { clsx } from "clsx";

function KpiCard({ label, value, sub, icon: Icon, color = "text-jdr-navy", bg = "bg-jdr-cream" }: {
  label: string; value: string | number; sub?: string;
  icon: typeof BarChart3; color?: string; bg?: string;
}) {
  return (
    <div className="jdr-card p-5 flex items-center gap-4">
      <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", bg)}>
        <Icon className={clsx("w-6 h-6", color)} />
      </div>
      <div>
        <p className="text-jdr-slate text-xs font-medium uppercase tracking-wide">{label}</p>
        <p className={clsx("font-bold text-2xl mt-0.5", color)}>{value}</p>
        {sub && <p className="text-jdr-slate text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function OpsReportsPage() {
  const completedJobs = JOBS.filter(j => j.status === "completed");
  const activeJobs = JOBS.filter(j => !["completed", "cancelled"].includes(j.status));
  const totalRevenue = TECHNICIAN_STATS.reduce((s, t) => s + t.revenue, 0);
  const avgRating = TECHNICIAN_STATS.reduce((s, t) => s + t.avgRating, 0) / TECHNICIAN_STATS.length;
  const technicians = USERS.filter(u => u.role === "technician");
  const vipCustomers = CUSTOMERS.filter(c => c.tier === "vip");

  // Status breakdown
  const statusCounts: Record<string, number> = {};
  JOBS.forEach(j => { statusCounts[j.status] = (statusCounts[j.status] ?? 0) + 1; });

  // Priority breakdown
  const priorityCounts: Record<string, number> = {};
  JOBS.forEach(j => { priorityCounts[j.priority] = (priorityCounts[j.priority] ?? 0) + 1; });

  // Top technicians by revenue
  const topTechs = [...TECHNICIAN_STATS]
    .sort((a, b) => b.revenue - a.revenue)
    .map(ts => ({ ...ts, user: USERS.find(u => u.id === ts.technicianId) }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Operations Report"
        subtitle={`Week of ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`}
        action={<BarChart3 className="w-5 h-5 text-jdr-slate" />}
      />

      {/* KPIs */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-4">Key Performance Indicators</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <KpiCard label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} sub="This week" icon={DollarSign} color="text-green-700" bg="bg-green-50" />
          <KpiCard label="Total Jobs" value={JOBS.length} sub={`${completedJobs.length} completed`} icon={Briefcase} color="text-blue-700" bg="bg-blue-50" />
          <KpiCard label="Active Jobs" value={activeJobs.length} sub="Across all techs" icon={Clock} color="text-amber-700" bg="bg-amber-50" />
          <KpiCard label="Avg Rating" value={`${avgRating.toFixed(1)} ★`} sub="Customer satisfaction" icon={Star} color="text-amber-600" bg="bg-amber-50" />
          <KpiCard label="Technicians" value={technicians.length} sub="All active" icon={Users} color="text-purple-700" bg="bg-purple-50" />
          <KpiCard label="VIP Customers" value={vipCustomers.length} sub={`${CUSTOMERS.length} total accounts`} icon={MapPin} color="text-jdr-gold-dark" bg="bg-amber-50" />
        </div>
      </div>

      {/* Job status breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-4">Job Status Breakdown</p>
          <div className="jdr-card divide-y divide-gray-50">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between px-4 py-3">
                <StatusBadge status={status as (typeof JOBS)[0]["status"]} />
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-jdr-navy rounded-full"
                      style={{ width: `${(count / JOBS.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-jdr-navy font-semibold text-sm w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-4">Technician Performance</p>
          <div className="space-y-3">
            {topTechs.map((ts, i) => (
              <div key={ts.technicianId} className="jdr-card flex items-center gap-3 p-4">
                <div className="w-8 h-8 rounded-full bg-jdr-navy flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-jdr-navy font-semibold text-sm">{ts.user?.name}</p>
                  <p className="text-jdr-slate text-xs">{ts.completedThisWeek} jobs · {ts.user?.zone}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-jdr-navy font-bold text-sm">${ts.revenue.toLocaleString()}</p>
                  <div className="flex items-center gap-1 text-amber-600 justify-end">
                    <Star className="w-3 h-3" />
                    <span className="text-xs">{ts.avgRating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Priority breakdown */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-4">Jobs by Priority</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { priority: "urgent", color: "bg-red-500", text: "text-red-700", bg: "bg-red-50 border-red-200" },
            { priority: "high", color: "bg-orange-400", text: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
            { priority: "normal", color: "bg-blue-400", text: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
            { priority: "low", color: "bg-gray-400", text: "text-gray-600", bg: "bg-gray-50 border-gray-200" },
          ].map(({ priority, text, bg }) => (
            <div key={priority} className={clsx("jdr-card p-4 text-center border", bg)}>
              <p className={clsx("font-bold text-2xl", text)}>{priorityCounts[priority] ?? 0}</p>
              <p className={clsx("text-xs mt-1 capitalize font-medium", text)}>{priority}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
