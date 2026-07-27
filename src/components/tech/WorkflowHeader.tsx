"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { StatusBadge, PriorityBadge } from "@/components/ui/StatusBadge";
import type { Job } from "@/types";

interface WorkflowHeaderProps {
  job: Job;
  title?: string;
  backLabel?: string;
  backHref?: string;
}

export default function WorkflowHeader({ job, title, backLabel, backHref }: WorkflowHeaderProps) {
  const router = useRouter();
  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-100">
      <div className="flex items-center gap-2 px-4 py-3">
        {backHref ? (
          <Link href={backHref} className="text-jdr-navy p-1 -ml-1 flex-shrink-0">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        ) : (
          <button onClick={() => router.back()} className="text-jdr-navy p-1 -ml-1 flex-shrink-0">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-jdr-navy text-sm truncate">{title ?? job.title}</p>
          <p className="text-jdr-slate text-xs">Job #{job.id}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <StatusBadge status={job.status} />
        </div>
      </div>
    </div>
  );
}
