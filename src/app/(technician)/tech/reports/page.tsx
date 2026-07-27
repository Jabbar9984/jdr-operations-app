"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth";
import { getJobsByTechnician, getTechnicianStats } from "@/lib/mock-data";
import PageHeader from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BarChart3, TrendingUp, Star, CheckCircle, Clock, DollarSign } from "lucide-react";
import type { Job } from "@/types";

function Metric({ label, value, icon: Icon, color = "text-jdr-navy", bg = "bg-jdr-cream" }: {
  label: string; value: string | number; icon: typeof BarChart3;
  color?: string; bg?: string;
}) {
  return (
    <div className="jdr-card p-4 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <p className="text-jdr-slate text-xs font-medium uppercase tracking-wide">{label}</p>
        <p className="text-jdr-navy font-bold text-xl mt-0.5">{value}</p>
      </div>
    </div>
  );
}

const STATUS_LABELS: Record<string, string> = {
  completed: "Completed",
  in_progress: "In Progress",
  scheduled: "Scheduled",
  pending_approval: "Pending Approval",
  en_route: "En Route",
  cancelled: "Cancelled",
};

export default function TechReportsPage() {
  const [techId, setTechId] = useState<string | null>(null);

  useEffect(() => {
    const s = getSession();
    if (s) setTechId(s.userId);
  }, []);

  const jobs: Job[] = techId ? getJobsByTechnician(techId) : [];
  const stats = techId ? getTechnicianStats(techId) : null;

  // Compute breakdown
  const statusCounts: Record<string, number> = {};
  jobs.forEach((j) => {
    statusCounts[j.status] = (statusCounts[j.status] ?? 0) + 1;
  });

  const completed = jobs.filter(j => j.status === "completed");
  const totalDuration = completed.reduce((sum, j) => sum + j.estimatedDuration, 0);
  const avgDuration = completed.length ? Math.round(totalDuration / completed.length) : 0;

  return (
    <div className="px-4 py-5 space-y-6">
      <PageHeader
        title="My Reports"
        subtitle="Performance summary"
        action={<BarChart3 className="w-5 h-5 text-jdr-slate" />}
      />

      {/* Key metrics */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate">This Week</p>
        <div className="grid grid-cols-2 gap-3">
          <Metric label="Jobs Completed" value={stats?.completedThisWeek ?? 0} icon={CheckCircle} color="text-green-600" bg="bg-green-50" />
          <Metric label="Avg Rating" value={`${stats?.avgRating ?? "—"} ★`} icon={Star} color="text-amber-600" bg="bg-amber-50" />
          <Metric label="Revenue" value={`$${((stats?.revenue ?? 0) / 1000).toFixed(1)}k`} icon={DollarSign} color="text-purple-600" bg="bg-purple-50" />
          <Metric label="Avg Job Time" value={avgDuration ? `${avgDuration}m` : "—"} icon={Clock} color="text-blue-600" bg="bg-blue-50" />
        </div>
      </div>

      {/* Job status breakdown */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-3">Job Breakdown</p>
        <div className="jdr-card divide-y divide-gray-50">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between px-4 py-3">
              <StatusBadge status={status as Job["status"]} />
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-jdr-navy rounded-full"
                    style={{ width: `${(count / jobs.length) * 100}%` }}
                  />
                </div>
                <span className="text-jdr-navy font-semibold text-sm w-6 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent completed jobs */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-3">Recently Completed</p>
        {completed.length === 0 ? (
          <div className="jdr-card p-6 text-center text-jdr-slate text-sm">No completed jobs yet</div>
        ) : (
          <div className="space-y-2">
            {completed.slice(0, 5).map((job) => (
              <div key={job.id} className="jdr-card p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-jdr-navy font-medium text-sm truncate">{job.title}</p>
                  <p className="text-jdr-slate text-xs">
                    {job.completedAt
                      ? new Date(job.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      : "—"
                    }
                  </p>
                </div>
                <TrendingUp className="w-4 h-4 text-jdr-slate" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
