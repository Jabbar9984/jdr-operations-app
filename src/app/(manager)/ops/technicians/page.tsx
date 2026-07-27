"use client";

import { useState } from "react";
import { USERS, TECHNICIAN_STATS, getJobsByTechnician } from "@/lib/mock-data";
import PageHeader from "@/components/ui/PageHeader";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Award,
  Star,
  Briefcase,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Calendar,
} from "lucide-react";
import { clsx } from "clsx";
import type { User as UserType } from "@/types";

function TechCard({ tech }: { tech: UserType }) {
  const [expanded, setExpanded] = useState(false);
  const stats = TECHNICIAN_STATS.find(s => s.technicianId === tech.id);
  const jobs = getJobsByTechnician(tech.id);
  const initials = tech.name.split(" ").map(n => n[0]).join("");

  const activeJobs = jobs.filter(j => ["scheduled", "en_route", "in_progress"].includes(j.status));

  return (
    <div className="jdr-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-4 text-left"
      >
        {/* Avatar */}
        <div className="w-12 h-12 rounded-2xl bg-jdr-navy flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">{initials}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-jdr-navy">{tech.name}</p>
          <div className="flex items-center gap-1.5 text-jdr-slate text-xs mt-0.5">
            {tech.zone && (
              <>
                <MapPin className="w-3 h-3" />
                <span>{tech.zone}</span>
              </>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {stats && (
            <div className="text-right">
              <div className="flex items-center gap-1 text-amber-600">
                <Star className="w-3.5 h-3.5" />
                <span className="font-semibold text-sm">{stats.avgRating}</span>
              </div>
              <p className="text-jdr-slate text-xs">{activeJobs.length} active</p>
            </div>
          )}
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-4">
          {/* Stats row */}
          {stats && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Week Jobs", value: stats.completedThisWeek, icon: Briefcase },
                { label: "Revenue", value: `$${(stats.revenue / 1000).toFixed(1)}k`, icon: TrendingUp },
                { label: "Pending", value: stats.pendingJobs, icon: Calendar },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-jdr-cream rounded-xl p-3 text-center">
                  <p className="text-jdr-navy font-bold text-base">{value}</p>
                  <p className="text-jdr-slate text-[10px] uppercase tracking-wide mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Contact */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate">Contact</p>
            <div className="flex items-center gap-2 text-jdr-navy text-sm">
              <Mail className="w-4 h-4 text-jdr-slate flex-shrink-0" />
              {tech.email}
            </div>
            {tech.phone && (
              <div className="flex items-center gap-2 text-jdr-navy text-sm">
                <Phone className="w-4 h-4 text-jdr-slate flex-shrink-0" />
                {tech.phone}
              </div>
            )}
            {tech.joinDate && (
              <div className="flex items-center gap-2 text-jdr-navy text-sm">
                <Calendar className="w-4 h-4 text-jdr-slate flex-shrink-0" />
                Joined {new Date(tech.joinDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </div>
            )}
          </div>

          {/* Certs */}
          {tech.certifications && tech.certifications.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-2">Certifications</p>
              <div className="flex flex-wrap gap-2">
                {tech.certifications.map((cert) => (
                  <div key={cert} className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1">
                    <Award className="w-3 h-3 text-amber-600" />
                    <span className="text-amber-800 text-xs font-medium">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active jobs */}
          {activeJobs.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-2">Active Jobs</p>
              <div className="space-y-1.5">
                {activeJobs.map((job) => (
                  <div key={job.id} className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <span className="text-blue-800 text-xs font-medium flex-1 truncate">{job.title}</span>
                    <span className="text-blue-600 text-xs">{job.address.city}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TechniciansPage() {
  const technicians = USERS.filter(u => u.role === "technician");

  const totalRevenue = TECHNICIAN_STATS.reduce((s, t) => s + t.revenue, 0);
  const avgRating = TECHNICIAN_STATS.reduce((s, t) => s + t.avgRating, 0) / TECHNICIAN_STATS.length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Technicians"
        subtitle={`${technicians.length} field technicians`}
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active Techs", value: technicians.length, color: "text-jdr-navy" },
          { label: "Avg Rating", value: `${avgRating.toFixed(1)}★`, color: "text-amber-600" },
          { label: "Week Revenue", value: `$${(totalRevenue / 1000).toFixed(0)}k`, color: "text-green-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="jdr-card p-4 text-center">
            <p className={clsx("font-bold text-xl", color)}>{value}</p>
            <p className="text-jdr-slate text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Technician cards */}
      <div className="space-y-3">
        {technicians.map((tech) => (
          <TechCard key={tech.id} tech={tech} />
        ))}
      </div>
    </div>
  );
}
