"use client";

import { useState } from "react";
import { JOBS, getCustomer, getTechnician } from "@/lib/mock-data";
import JobCard from "@/components/ui/JobCard";
import PageHeader from "@/components/ui/PageHeader";
import { clsx } from "clsx";
import type { JobStatus } from "@/types";

const FILTERS: { label: string; statuses: JobStatus[] | "all" }[] = [
  { label: "All Jobs", statuses: "all" },
  { label: "Active", statuses: ["scheduled", "en_route", "in_progress"] },
  { label: "Awaiting", statuses: ["pending_approval"] },
  { label: "Completed", statuses: ["completed"] },
];

export default function OpsJobsPage() {
  const [activeFilter, setActiveFilter] = useState(0);
  const [search, setSearch] = useState("");

  const filter = FILTERS[activeFilter];
  const filtered = JOBS.filter((job) => {
    const matchesStatus = filter.statuses === "all" || (filter.statuses as JobStatus[]).includes(job.status);
    if (!matchesStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const customer = getCustomer(job.customerId);
      const tech = getTechnician(job.technicianId);
      return (
        job.title.toLowerCase().includes(q) ||
        customer?.name.toLowerCase().includes(q) ||
        tech?.name.toLowerCase().includes(q) ||
        job.address.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Jobs"
        subtitle={`${JOBS.length} total jobs`}
      />

      {/* Search */}
      <input
        type="text"
        placeholder="Search by job, customer, technician, city…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="jdr-input"
      />

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {FILTERS.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveFilter(i)}
            className={clsx(
              "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all",
              activeFilter === i
                ? "bg-jdr-navy text-white"
                : "bg-white text-jdr-slate border border-gray-200 hover:bg-jdr-cream-dark"
            )}
          >
            {tab.label} {filter.statuses === tab.statuses ? `(${filtered.length})` : ""}
          </button>
        ))}
      </div>

      {/* Job list */}
      {filtered.length === 0 ? (
        <div className="jdr-card p-10 text-center text-jdr-slate">No jobs found</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              href={`/ops/jobs/${job.id}`}
              showTechnician
            />
          ))}
        </div>
      )}
    </div>
  );
}
