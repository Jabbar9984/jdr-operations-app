"use client";

import { useEffect, useState } from "react";
import { getAuditLog } from "@/lib/audit-store";
import PageHeader from "@/components/ui/PageHeader";
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  CornerUpLeft,
  Edit3,
  ArrowRight,
  Filter,
  RefreshCw,
  User,
  Briefcase,
  DollarSign,
  Puzzle,
  Shield,
  FileText,
} from "lucide-react";
import { clsx } from "clsx";
import type { AuditLogEntry, AuditEntityType, AuditAction } from "@/types";

const ACTION_CONFIG: Record<AuditAction, { label: string; color: string; Icon: typeof CheckCircle }> = {
  approved:          { label: "Approved",              color: "bg-green-50 text-green-700 border-green-200",  Icon: CheckCircle },
  rejected:          { label: "Rejected",              color: "bg-red-50 text-red-700 border-red-200",        Icon: XCircle },
  returned_for_info: { label: "Returned for Info",     color: "bg-amber-50 text-amber-700 border-amber-200",  Icon: CornerUpLeft },
  edited:            { label: "Edited",                color: "bg-blue-50 text-blue-700 border-blue-200",     Icon: Edit3 },
  created:           { label: "Created",               color: "bg-indigo-50 text-indigo-700 border-indigo-200", Icon: ClipboardList },
  submitted:         { label: "Submitted",             color: "bg-purple-50 text-purple-700 border-purple-200", Icon: ArrowRight },
  status_changed:    { label: "Status Changed",        color: "bg-blue-50 text-blue-700 border-blue-200",     Icon: ArrowRight },
  updated:           { label: "Updated",               color: "bg-slate-50 text-slate-700 border-slate-200",  Icon: Edit3 },
  connected:         { label: "Connected",             color: "bg-green-50 text-green-700 border-green-200",  Icon: CheckCircle },
  disconnected:      { label: "Disconnected",          color: "bg-gray-50 text-gray-600 border-gray-200",     Icon: XCircle },
};

const ENTITY_ICONS: Record<AuditEntityType, typeof User> = {
  approval: FileText,
  job: Briefcase,
  estimate: DollarSign,
  pricing: DollarSign,
  integration: Puzzle,
  user: User,
};

const ENTITY_LABELS: Record<AuditEntityType, string> = {
  approval: "Approval",
  job: "Job",
  estimate: "Estimate",
  pricing: "Pricing",
  integration: "Integration",
  user: "User",
};

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

function groupByDate(entries: AuditLogEntry[]) {
  const groups: Record<string, AuditLogEntry[]> = {};
  for (const entry of entries) {
    const date = new Date(entry.timestamp).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    if (!groups[date]) groups[date] = [];
    groups[date].push(entry);
  }
  return Object.entries(groups);
}

export default function AuditLogPage() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [entityFilter, setEntityFilter] = useState<AuditEntityType | "all">("all");
  const [search, setSearch] = useState("");

  function reload() {
    setEntries(getAuditLog());
  }

  useEffect(() => { reload(); }, []);

  const filtered = entries.filter(e => {
    const matchEntity = entityFilter === "all" || e.entityType === entityFilter;
    const matchSearch = !search || e.entityLabel.toLowerCase().includes(search.toLowerCase()) || e.actorName.toLowerCase().includes(search.toLowerCase()) || e.action.includes(search.toLowerCase());
    return matchEntity && matchSearch;
  });

  const grouped = groupByDate(filtered);

  const entityTypes: (AuditEntityType | "all")[] = ["all", "approval", "job", "pricing", "integration"];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader title="Audit Log" subtitle={`${entries.length} total entries`} />
        <button onClick={reload} className="flex items-center gap-1.5 text-xs font-medium bg-white border border-gray-200 text-jdr-slate hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors mt-1">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by label, actor, or action…" className="jdr-input pl-9" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {entityTypes.map(et => (
            <button key={et} onClick={() => setEntityFilter(et)} className={clsx("px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize", entityFilter === et ? "bg-jdr-navy text-white" : "bg-white text-jdr-slate border border-gray-200 hover:bg-gray-50")}>
              {et === "all" ? "All" : ENTITY_LABELS[et as AuditEntityType]}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped entries */}
      {filtered.length === 0 ? (
        <div className="jdr-card p-12 text-center">
          <ClipboardList className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-jdr-navy font-semibold">No audit entries found</p>
          <p className="text-jdr-slate text-sm mt-1">Activity will appear here as actions are taken</p>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(([date, dayEntries]) => (
            <div key={date}>
              <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-3">{date}</p>
              <div className="space-y-2">
                {dayEntries.map(entry => {
                  const cfg = ACTION_CONFIG[entry.action] ?? ACTION_CONFIG.updated;
                  const ActionIcon = cfg.Icon;
                  const EntityIcon = ENTITY_ICONS[entry.entityType];
                  return (
                    <div key={entry.id} className="jdr-card p-4">
                      <div className="flex items-start gap-3">
                        <div className={clsx("w-8 h-8 rounded-xl border flex items-center justify-center flex-shrink-0", cfg.color)}>
                          <ActionIcon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={clsx("jdr-badge border text-xs", cfg.color)}>{cfg.label}</span>
                            <span className="jdr-badge bg-gray-50 text-gray-600 border border-gray-200 text-xs flex items-center gap-1">
                              <EntityIcon className="w-3 h-3" />{ENTITY_LABELS[entry.entityType]}
                            </span>
                          </div>
                          <p className="text-jdr-navy font-semibold text-sm">{entry.entityLabel}</p>
                          <div className="flex items-center gap-3 mt-1 text-jdr-slate text-xs flex-wrap">
                            <span className="flex items-center gap-1"><User className="w-3 h-3" />{entry.actorName}</span>
                            <span>{formatTimestamp(entry.timestamp)}</span>
                          </div>
                          {(entry.before || entry.after) && (
                            <div className="flex items-center gap-2 mt-2 text-xs">
                              {entry.before && <span className="bg-red-50 text-red-700 border border-red-100 px-2 py-1 rounded-lg">{entry.before}</span>}
                              {entry.before && entry.after && <ArrowRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
                              {entry.after && <span className="bg-green-50 text-green-700 border border-green-100 px-2 py-1 rounded-lg">{entry.after}</span>}
                            </div>
                          )}
                          {entry.notes && <p className="text-jdr-slate text-xs mt-1.5 italic">"{entry.notes}"</p>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
