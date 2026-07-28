"use client";

import { JOBS, TECHNICIAN_STATS, USERS, CUSTOMERS, ESTIMATES, APPROVALS } from "@/lib/mock-data";
import PageHeader from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Briefcase,
  Users,
  Clock,
  Star,
  MapPin,
  Target,
  CheckCircle2,
  Zap,
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

// Mock weekly revenue trend data
const REVENUE_TREND = [
  { week: "Jun 30", revenue: 18200 },
  { week: "Jul 7",  revenue: 19800 },
  { week: "Jul 14", revenue: 17400 },
  { week: "Jul 21", revenue: 21900 },
  { week: "Jul 28", revenue: 22160 },
];

export default function OpsReportsPage() {
  const completedJobs = JOBS.filter(j => j.status === "completed");
  const activeJobs = JOBS.filter(j => !["completed", "cancelled"].includes(j.status));
  const totalRevenue = TECHNICIAN_STATS.reduce((s, t) => s + t.revenue, 0);
  const totalCompleted = TECHNICIAN_STATS.reduce((s, t) => s + t.completedThisWeek, 0);
  const avgJobValue = Math.round(totalRevenue / totalCompleted);
  const avgRating = TECHNICIAN_STATS.reduce((s, t) => s + t.avgRating, 0) / TECHNICIAN_STATS.length;
  const technicians = USERS.filter(u => u.role === "technician");
  const vipCustomers = CUSTOMERS.filter(c => c.tier === "vip");
  const approvedEstimates = ESTIMATES.filter(e => e.status === "approved" || e.status === "pending_approval");

  // First-time fix rate mock: jobs resolved in one visit vs. needing follow-up
  const firstTimeFixRate = 78; // mock

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

  const maxRevenue = Math.max(...topTechs.map(t => t.revenue));
  const maxTrendRevenue = Math.max(...REVENUE_TREND.map(d => d.revenue));

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
          <KpiCard label="Week Revenue" value={`$${totalRevenue.toLocaleString()}`} sub="+12% vs last week" icon={DollarSign} color="text-green-700" bg="bg-green-50" />
          <KpiCard label="Avg Job Value" value={`$${avgJobValue.toLocaleString()}`} sub={`${totalCompleted} jobs completed`} icon={TrendingUp} color="text-indigo-700" bg="bg-indigo-50" />
          <KpiCard label="First-Time Fix Rate" value={`${firstTimeFixRate}%`} sub="Target: 80%" icon={Target} color="text-teal-700" bg="bg-teal-50" />
          <KpiCard label="Total Jobs" value={JOBS.length} sub={`${completedJobs.length} completed`} icon={Briefcase} color="text-blue-700" bg="bg-blue-50" />
          <KpiCard label="Avg Rating" value={`${avgRating.toFixed(1)} ★`} sub="Customer satisfaction" icon={Star} color="text-amber-600" bg="bg-amber-50" />
          <KpiCard label="Active Jobs" value={activeJobs.length} sub="Across all techs" icon={Clock} color="text-orange-700" bg="bg-orange-50" />
        </div>
      </div>

      {/* Revenue trend */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-4">Weekly Revenue Trend</p>
        <div className="jdr-card p-5">
          <div className="flex items-end gap-3 h-32">
            {REVENUE_TREND.map((d, i) => {
              const height = Math.max(8, Math.round((d.revenue / maxTrendRevenue) * 100));
              const isLatest = i === REVENUE_TREND.length - 1;
              return (
                <div key={d.week} className="flex-1 flex flex-col items-center gap-1.5">
                  <p className={clsx("text-xs font-semibold", isLatest ? "text-jdr-navy" : "text-jdr-slate")}>
                    ${(d.revenue / 1000).toFixed(1)}k
                  </p>
                  <div
                    className={clsx("w-full rounded-t-lg transition-all", isLatest ? "bg-jdr-gold" : "bg-jdr-navy/20")}
                    style={{ height: `${height}%` }}
                  />
                  <p className={clsx("text-xs whitespace-nowrap", isLatest ? "text-jdr-navy font-semibold" : "text-jdr-slate")}>{d.week}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-6 text-sm">
            <div>
              <p className="text-jdr-slate text-xs">This week</p>
              <p className="text-jdr-navy font-bold">${totalRevenue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-jdr-slate text-xs">vs last week</p>
              <p className="text-green-600 font-bold">+$2,260 (+12%)</p>
            </div>
            <div>
              <p className="text-jdr-slate text-xs">4-week avg</p>
              <p className="text-jdr-navy font-bold">${Math.round(REVENUE_TREND.slice(0, 4).reduce((s, d) => s + d.revenue, 0) / 4).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Job status breakdown */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-4">Job Status Breakdown</p>
          <div className="jdr-card divide-y divide-gray-50">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between px-4 py-3">
                <StatusBadge status={status as (typeof JOBS)[0]["status"]} />
                <div className="flex items-center gap-3">
                  <div className="w-28 bg-gray-100 rounded-full h-1.5 overflow-hidden">
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

        {/* Priority breakdown */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-4">Jobs by Priority</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { priority: "urgent", color: "bg-red-500", text: "text-red-700", bg: "bg-red-50 border-red-200" },
              { priority: "high",   color: "bg-orange-400", text: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
              { priority: "normal", color: "bg-blue-400", text: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
              { priority: "low",    color: "bg-gray-400", text: "text-gray-600", bg: "bg-gray-50 border-gray-200" },
            ].map(({ priority, text, bg }) => (
              <div key={priority} className={clsx("jdr-card p-5 text-center border", bg)}>
                <p className={clsx("font-bold text-3xl", text)}>{priorityCounts[priority] ?? 0}</p>
                <p className={clsx("text-xs mt-1.5 capitalize font-semibold", text)}>{priority}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technician performance */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-4">Technician Performance</p>
        <div className="space-y-3">
          {topTechs.map((ts, i) => (
            <div key={ts.technicianId} className="jdr-card p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-jdr-navy flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-jdr-navy font-semibold text-sm">{ts.user?.name}</p>
                  <p className="text-jdr-slate text-xs">{ts.user?.zone}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-jdr-navy font-bold">${ts.revenue.toLocaleString()}</p>
                  <div className="flex items-center gap-1 text-amber-500 justify-end">
                    <Star className="w-3 h-3" />
                    <span className="text-xs font-medium">{ts.avgRating}</span>
                  </div>
                </div>
              </div>
              {/* Revenue bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-jdr-navy rounded-full transition-all"
                    style={{ width: `${(ts.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
                <div className="flex items-center gap-3 text-xs text-jdr-slate flex-shrink-0">
                  <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{ts.completedThisWeek} jobs</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" />{ts.completedToday} today</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer tier breakdown */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-4">Customer Portfolio</p>
        <div className="grid grid-cols-3 gap-4">
          {(["vip", "premium", "standard"] as const).map(tier => {
            const count = CUSTOMERS.filter(c => c.tier === tier).length;
            const colors = { vip: "bg-amber-50 border-amber-200 text-amber-700", premium: "bg-blue-50 border-blue-200 text-blue-700", standard: "bg-gray-50 border-gray-200 text-gray-600" };
            return (
              <div key={tier} className={clsx("jdr-card p-5 text-center border capitalize", colors[tier])}>
                <p className="font-bold text-3xl">{count}</p>
                <p className="text-xs mt-1.5 font-semibold capitalize">{tier}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
