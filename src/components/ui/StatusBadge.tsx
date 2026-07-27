import { clsx } from "clsx";
import type { JobStatus, JobPriority } from "@/types";

const STATUS_CONFIG: Record<JobStatus, { label: string; className: string }> = {
  scheduled: { label: "Scheduled", className: "bg-blue-50 text-blue-700 border border-blue-200" },
  en_route: { label: "En Route", className: "bg-purple-50 text-purple-700 border border-purple-200" },
  in_progress: { label: "In Progress", className: "bg-amber-50 text-amber-700 border border-amber-200" },
  pending_approval: { label: "Pending Approval", className: "bg-orange-50 text-orange-700 border border-orange-200" },
  completed: { label: "Completed", className: "bg-green-50 text-green-700 border border-green-200" },
  cancelled: { label: "Cancelled", className: "bg-gray-50 text-gray-500 border border-gray-200" },
};

const PRIORITY_CONFIG: Record<JobPriority, { label: string; className: string }> = {
  low: { label: "Low", className: "bg-gray-50 text-gray-500 border border-gray-200" },
  normal: { label: "Normal", className: "bg-blue-50 text-blue-600 border border-blue-200" },
  high: { label: "High", className: "bg-orange-50 text-orange-600 border border-orange-200" },
  urgent: { label: "Urgent", className: "bg-red-50 text-red-600 border border-red-200" },
};

export function StatusBadge({ status }: { status: JobStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={clsx("jdr-badge", config.className)}>
      {config.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: JobPriority }) {
  const config = PRIORITY_CONFIG[priority];
  return (
    <span className={clsx("jdr-badge", config.className)}>
      {config.label}
    </span>
  );
}

export function TierBadge({ tier }: { tier: "standard" | "premium" | "vip" }) {
  const config = {
    standard: "bg-gray-50 text-gray-600 border border-gray-200",
    premium: "bg-blue-50 text-blue-700 border border-blue-200",
    vip: "bg-amber-50 text-jdr-gold-dark border border-amber-200",
  }[tier];
  return (
    <span className={clsx("jdr-badge uppercase tracking-wide", config)}>
      {tier}
    </span>
  );
}

export function ApprovalBadge({ status }: { status: "pending" | "approved" | "rejected" }) {
  const config = {
    pending: "bg-orange-50 text-orange-700 border border-orange-200",
    approved: "bg-green-50 text-green-700 border border-green-200",
    rejected: "bg-red-50 text-red-600 border border-red-200",
  }[status];
  const label = { pending: "Pending", approved: "Approved", rejected: "Rejected" }[status];
  return <span className={clsx("jdr-badge", config)}>{label}</span>;
}
