"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import {
  getTodaysJobs,
  getTechnicianStats,
  getCustomer,
  getAppliance,
} from "@/lib/mock-data";
import { StatusBadge } from "@/components/ui/StatusBadge";
import StatCard from "@/components/ui/StatCard";
import {
  Briefcase,
  Star,
  CheckCircle,
  TrendingUp,
  MapPin,
  Clock,
  ChevronRight,
  Sun,
} from "lucide-react";
import type { Job } from "@/types";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

export default function TechDashboard() {
  const [techId, setTechId] = useState<string | null>(null);

  useEffect(() => {
    const s = getSession();
    if (s) setTechId(s.userId);
  }, []);

  const todaysJobs = techId ? getTodaysJobs(techId) : [];
  const stats = techId ? getTechnicianStats(techId) : null;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const session = typeof window !== "undefined" ? getSession() : null;
  const firstName = session?.name?.split(" ")[0] ?? "Technician";

  const nextJob = todaysJobs.find(j => ["scheduled", "en_route", "in_progress"].includes(j.status));

  return (
    <div className="px-4 py-5 space-y-6">
      {/* Greeting */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-jdr-gold flex items-center justify-center flex-shrink-0">
          <Sun className="w-5 h-5 text-jdr-navy" />
        </div>
        <div>
          <p className="text-jdr-slate text-xs">{now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
          <h1 className="text-jdr-navy font-bold text-lg leading-tight">{greeting}, {firstName}</h1>
        </div>
      </div>

      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Today's Jobs"
            value={todaysJobs.length}
            icon={Briefcase}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            label="Completed"
            value={stats.completedThisWeek}
            icon={CheckCircle}
            iconBg="bg-green-50"
            iconColor="text-green-600"
            trend="This week"
          />
          <StatCard
            label="Avg Rating"
            value={stats.avgRating}
            icon={Star}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />
          <StatCard
            label="Revenue"
            value={`$${(stats.revenue / 1000).toFixed(1)}k`}
            icon={TrendingUp}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
            trend="This week"
          />
        </div>
      )}

      {/* Next job highlight */}
      {nextJob && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-2">Next Job</p>
          <NextJobCard job={nextJob} />
        </div>
      )}

      {/* Today's schedule */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate">Today&apos;s Schedule</p>
          <Link href="/tech/jobs" className="text-jdr-navy text-xs font-medium hover:text-jdr-gold transition-colors">
            View all →
          </Link>
        </div>

        {todaysJobs.length === 0 ? (
          <div className="jdr-card p-8 text-center text-jdr-slate text-sm">
            No jobs scheduled for today
          </div>
        ) : (
          <div className="space-y-2">
            {todaysJobs.slice(0, 4).map((job) => (
              <ScheduleRow key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NextJobCard({ job }: { job: Job }) {
  const customer = getCustomer(job.customerId);
  const appliance = getAppliance(job.applianceId);

  return (
    <Link href={`/tech/jobs/${job.id}`} className="block">
      <div className="rounded-2xl bg-jdr-navy text-white p-5 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute -right-4 -bottom-8 w-24 h-24 rounded-full bg-jdr-gold/10" />
        <div className="relative">
          <div className="flex items-start justify-between mb-3">
            <StatusBadge status={job.status} />
            <span className="text-white/60 text-xs">{formatTime(job.scheduledAt)}</span>
          </div>
          <h3 className="font-bold text-base leading-snug mb-1">{job.title}</h3>
          {customer && <p className="text-white/60 text-sm mb-3">{customer.name}</p>}
          {appliance && (
            <p className="text-white/50 text-xs mb-3">{appliance.brand} {appliance.model}</p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-white/60 text-xs">
              <MapPin className="w-3.5 h-3.5" />
              <span>{job.address.city}, {job.address.state}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/60 text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>{job.estimatedDuration}m est.</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ScheduleRow({ job }: { job: Job }) {
  const customer = getCustomer(job.customerId);
  return (
    <Link href={`/tech/jobs/${job.id}`} className="jdr-card flex items-center gap-3 p-3 hover:shadow-jdr-md active:scale-[0.99] transition-all">
      <div className="text-center w-12 flex-shrink-0">
        <p className="text-jdr-navy font-bold text-sm">{formatTime(job.scheduledAt).split(" ")[0]}</p>
        <p className="text-jdr-slate text-[10px]">{formatTime(job.scheduledAt).split(" ")[1]}</p>
      </div>
      <div className="w-px h-8 bg-gray-100 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-jdr-navy text-sm leading-tight truncate">{job.title}</p>
        {customer && <p className="text-jdr-slate text-xs">{customer.name} · {job.address.city}</p>}
      </div>
      <StatusBadge status={job.status} />
      <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
    </Link>
  );
}
