"use client";

import type { AuditLogEntry, AuditAction, AuditEntityType } from "@/types";
import { INITIAL_AUDIT_LOG } from "./mock-data";

const AUDIT_KEY = "jdr_audit_log";

function load(): AuditLogEntry[] {
  if (typeof window === "undefined") return INITIAL_AUDIT_LOG;
  try {
    const raw = localStorage.getItem(AUDIT_KEY);
    if (!raw) return INITIAL_AUDIT_LOG;
    const stored = JSON.parse(raw) as AuditLogEntry[];
    // Merge: stored entries on top, then seed entries not already in stored
    const storedIds = new Set(stored.map(e => e.id));
    const merged = [...stored, ...INITIAL_AUDIT_LOG.filter(e => !storedIds.has(e.id))];
    merged.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    return merged;
  } catch {
    return INITIAL_AUDIT_LOG;
  }
}

function persist(entries: AuditLogEntry[]) {
  if (typeof window === "undefined") return;
  // Only persist the non-seed entries to keep localStorage lean
  const seedIds = new Set(INITIAL_AUDIT_LOG.map(e => e.id));
  const newEntries = entries.filter(e => !seedIds.has(e.id));
  localStorage.setItem(AUDIT_KEY, JSON.stringify(newEntries));
}

export function getAuditLog(): AuditLogEntry[] {
  return load();
}

export function addAuditEntry(entry: Omit<AuditLogEntry, "id" | "timestamp">): AuditLogEntry {
  const current = load();
  const newEntry: AuditLogEntry = {
    ...entry,
    id: `al_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
  };
  const updated = [newEntry, ...current];
  persist(updated);
  return newEntry;
}

export function logApprovalAction(opts: {
  actorId: string;
  actorName: string;
  action: AuditAction;
  approvalId: string;
  approvalLabel: string;
  before?: string;
  after?: string;
  notes?: string;
}): AuditLogEntry {
  return addAuditEntry({
    actorId: opts.actorId,
    actorName: opts.actorName,
    action: opts.action,
    entityType: "approval",
    entityId: opts.approvalId,
    entityLabel: opts.approvalLabel,
    before: opts.before,
    after: opts.after,
    notes: opts.notes,
  });
}

export function logJobStatusChange(opts: {
  actorId: string;
  actorName: string;
  jobId: string;
  jobLabel: string;
  before: string;
  after: string;
  notes?: string;
}): AuditLogEntry {
  return addAuditEntry({
    actorId: opts.actorId,
    actorName: opts.actorName,
    action: "status_changed",
    entityType: "job",
    entityId: opts.jobId,
    entityLabel: opts.jobLabel,
    before: opts.before,
    after: opts.after,
    notes: opts.notes,
  });
}

export function logPricingUpdate(opts: {
  actorId: string;
  actorName: string;
  field: string;
  before: string;
  after: string;
}): AuditLogEntry {
  return addAuditEntry({
    actorId: opts.actorId,
    actorName: opts.actorName,
    action: "updated",
    entityType: "pricing",
    entityId: "pricing_config",
    entityLabel: `Pricing: ${opts.field}`,
    before: opts.before,
    after: opts.after,
  });
}
