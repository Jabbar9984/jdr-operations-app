"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth";
import { getJobsByTechnician } from "@/lib/mock-data";
import JobCard from "@/components/ui/JobCard";
import PageHeader from "@/components/ui/PageHeader";
import { clsx } from "clsx";
import type { JobStatus } from "@/types";

const FILTER_TABS: { label: string; statuses: JobStatus[] | "all" }[] = [
  { label: "All", statuses: "all" },
  { label: "Today", statuses: ["scheduled", "en_route", "in_progress"] },
  { label: "Pending", statuses: ["pending_approval"] },
  { label: "Done", statuses: ["completed"] },
];

export default function TechJobsPage() {
  const [techId, setTechId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState(0);

  useEffect(() => {
    const s = getSession();
    if (s) setTechId(s.userId);
  }, []);

  const allJobs = techId ? getJobsByTechnician(techId) : [];
  const filter = FILTER_TABS[activeFilter];
  const jobs = filter.statuses === "all"
    ? allJobs
    : allJobs.filter((j) => (filter.statuses as JobStatus[]).includes(j.status));

  return (
    <div className="px-4 py-5">
      <PageHeader
        title="My Jobs"
        subtitle={`${allJobs.length} total assignments`}
      />

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
        {FILTER_TABS.map((tab, i) => (
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
            {tab.label}
          </button>
        ))}
      </div>

      {jobs.length === 0 ? (
        <div className="jdr-card p-10 text-center text-jdr-slate text-sm">
          No jobs found
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} href={`/tech/jobs/${job.id}`} />
          ))}
        </div>
      )}
    </div>
  );
}
