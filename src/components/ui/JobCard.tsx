import Link from "next/link";
import { MapPin, Clock, User } from "lucide-react";
import { StatusBadge, PriorityBadge } from "./StatusBadge";
import { getCustomer, getTechnician, getAppliance } from "@/lib/mock-data";
import type { Job } from "@/types";
import { clsx } from "clsx";

interface JobCardProps {
  job: Job;
  href: string;
  showTechnician?: boolean;
  className?: string;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function JobCard({ job, href, showTechnician = false, className }: JobCardProps) {
  const customer = getCustomer(job.customerId);
  const appliance = getAppliance(job.applianceId);
  const tech = showTechnician ? getTechnician(job.technicianId) : null;

  return (
    <Link href={href} className={clsx(
      "jdr-card block p-4 hover:shadow-jdr-md active:scale-[0.99] transition-all duration-150",
      className
    )}>
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-jdr-navy text-sm leading-tight truncate">{job.title}</p>
          {customer && (
            <p className="text-jdr-slate text-xs mt-0.5">{customer.name}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <StatusBadge status={job.status} />
          {job.priority !== "normal" && job.priority !== "low" && (
            <PriorityBadge priority={job.priority} />
          )}
        </div>
      </div>

      {/* Appliance */}
      {appliance && (
        <p className="text-xs text-jdr-slate mb-2">
          {appliance.brand} {appliance.model} — {appliance.type}
        </p>
      )}

      {/* Footer row */}
      <div className="flex items-center gap-3 text-xs text-jdr-slate">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {formatTime(job.scheduledAt)} · {job.estimatedDuration}m
        </span>
        <span className="flex items-center gap-1 flex-1 min-w-0 truncate">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{job.address.city}</span>
        </span>
        {tech && (
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            {tech.name.split(" ")[0]}
          </span>
        )}
      </div>
    </Link>
  );
}
