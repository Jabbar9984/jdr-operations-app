"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutGrid,
  Stethoscope,
  Gauge,
  Camera,
  BookOpen,
  Package,
  FileText,
  Calculator,
  SendHorizonal,
} from "lucide-react";
import type { JobWorkflowState } from "@/types";

interface NavItem {
  key: keyof Omit<JobWorkflowState, "jobId" | "lastUpdated">;
  label: string;
  icon: React.ElementType;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: "symptomsRecorded", label: "Symptoms", icon: LayoutGrid, path: "/symptoms" },
  { key: "diagnosticCompleted", label: "Diagnose", icon: Stethoscope, path: "/diagnose" },
  { key: "readingsRecorded", label: "Readings", icon: Gauge, path: "/readings" },
  { key: "photosAdded", label: "Photos", icon: Camera, path: "/photos" },
  { key: "reportCompleted", label: "Report", icon: FileText, path: "/report" },
  { key: "estimateBuilt", label: "Estimate", icon: Calculator, path: "/estimate" },
  { key: "submitted", label: "Submit", icon: SendHorizonal, path: "/submit" },
];

const EXTRA_ITEMS = [
  { label: "Manuals", icon: BookOpen, path: "/manuals" },
  { label: "Parts", icon: Package, path: "/parts" },
];

interface WorkflowNavProps {
  jobId: string;
  state: JobWorkflowState;
  compact?: boolean;
}

export default function WorkflowNav({ jobId, state, compact = false }: WorkflowNavProps) {
  const pathname = usePathname();
  const base = `/tech/jobs/${jobId}`;

  if (compact) {
    return (
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
        {[...NAV_ITEMS, ...EXTRA_ITEMS].map((item) => {
          const href = `${base}${item.path}`;
          const active = pathname === href;
          const done = "key" in item ? state[item.key as keyof JobWorkflowState] : false;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                active
                  ? "bg-jdr-navy text-white border-jdr-navy"
                  : done
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-white text-jdr-slate border-gray-200 hover:border-gray-300"
              )}
            >
              <item.icon className="w-3 h-3" />
              {item.label}
              {done && !active && <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {NAV_ITEMS.map((item) => {
        const href = `${base}${item.path}`;
        const active = pathname === href;
        const done = state[item.key as keyof JobWorkflowState] as boolean;
        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
              active ? "bg-jdr-navy text-white" : "bg-white text-jdr-navy hover:bg-jdr-cream"
            )}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 font-medium text-sm">{item.label}</span>
            {done ? (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">Done</span>
            ) : (
              <span className="text-xs text-gray-400">Pending</span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
