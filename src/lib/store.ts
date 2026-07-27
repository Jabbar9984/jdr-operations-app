"use client";

import type {
  MeterReading,
  JobPhoto,
  ServiceReport,
  LocalEstimate,
  JobWorkflowState,
} from "@/types";

// ─── Generic localStorage helpers ────────────────────────────────────────────

function getKey(ns: string, jobId: string) {
  return `jdr_${ns}_${jobId}`;
}

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Workflow state ───────────────────────────────────────────────────────────

export function getWorkflowState(jobId: string): JobWorkflowState {
  return load<JobWorkflowState>(getKey("workflow", jobId), {
    jobId,
    symptomsRecorded: false,
    diagnosticCompleted: false,
    readingsRecorded: false,
    photosAdded: false,
    reportCompleted: false,
    estimateBuilt: false,
    submitted: false,
    lastUpdated: new Date().toISOString(),
  });
}

export function updateWorkflowState(
  jobId: string,
  patch: Partial<JobWorkflowState>
) {
  const current = getWorkflowState(jobId);
  save(getKey("workflow", jobId), {
    ...current,
    ...patch,
    lastUpdated: new Date().toISOString(),
  });
}

export function markJobSubmitted(jobId: string) {
  updateWorkflowState(jobId, { submitted: true });
}

// ─── Meter readings ───────────────────────────────────────────────────────────

export function getReadings(jobId: string): MeterReading[] {
  return load<MeterReading[]>(getKey("readings", jobId), []);
}

export function saveReading(jobId: string, reading: MeterReading) {
  const existing = getReadings(jobId);
  const idx = existing.findIndex((r) => r.id === reading.id);
  if (idx >= 0) existing[idx] = reading;
  else existing.push(reading);
  save(getKey("readings", jobId), existing);
  updateWorkflowState(jobId, { readingsRecorded: true });
}

export function deleteReading(jobId: string, readingId: string) {
  const existing = getReadings(jobId).filter((r) => r.id !== readingId);
  save(getKey("readings", jobId), existing);
  if (existing.length === 0) {
    updateWorkflowState(jobId, { readingsRecorded: false });
  }
}

// ─── Photos ───────────────────────────────────────────────────────────────────

export function getPhotos(jobId: string): JobPhoto[] {
  return load<JobPhoto[]>(getKey("photos", jobId), []);
}

export function addPhoto(jobId: string, photo: JobPhoto) {
  const existing = getPhotos(jobId);
  existing.push(photo);
  save(getKey("photos", jobId), existing);
  updateWorkflowState(jobId, { photosAdded: true });
}

export function deletePhoto(jobId: string, photoId: string) {
  const existing = getPhotos(jobId).filter((p) => p.id !== photoId);
  save(getKey("photos", jobId), existing);
  if (existing.length === 0) {
    updateWorkflowState(jobId, { photosAdded: false });
  }
}

// ─── Service report ───────────────────────────────────────────────────────────

export function getReport(jobId: string): ServiceReport | null {
  return load<ServiceReport | null>(getKey("report", jobId), null);
}

export function saveReport(jobId: string, report: ServiceReport) {
  save(getKey("report", jobId), report);
  updateWorkflowState(jobId, { reportCompleted: true });
}

// ─── Estimate (local tech draft) ─────────────────────────────────────────────

export function getLocalEstimate(jobId: string): LocalEstimate | null {
  return load<LocalEstimate | null>(getKey("estimate", jobId), null);
}

export function saveLocalEstimate(jobId: string, est: LocalEstimate) {
  save(getKey("estimate", jobId), est);
  updateWorkflowState(jobId, { estimateBuilt: true });
}

// ─── Symptoms ─────────────────────────────────────────────────────────────────

export interface SymptomRecord {
  jobId: string;
  customerComplaint: string;
  observedSymptoms: string[];
  errorCodes: string[];
  applianceAge: string;
  frequencyOfIssue: string;
  whenOccurs: string;
  additionalNotes: string;
  savedAt: string;
}

export function getSymptoms(jobId: string): SymptomRecord | null {
  return load<SymptomRecord | null>(getKey("symptoms", jobId), null);
}

export function saveSymptoms(jobId: string, rec: SymptomRecord) {
  save(getKey("symptoms", jobId), rec);
  updateWorkflowState(jobId, { symptomsRecorded: true });
}

// ─── Diagnostic result ────────────────────────────────────────────────────────

export interface SavedDiagnostic {
  jobId: string;
  guideId: string;
  confirmedDiagnosis: string;
  techNotes: string;
  completedTests: string[];
  savedAt: string;
}

export function getSavedDiagnostic(jobId: string): SavedDiagnostic | null {
  return load<SavedDiagnostic | null>(getKey("diagnostic", jobId), null);
}

/** Alias for getSavedDiagnostic — use in pages that call getDiagnostic */
export const getDiagnostic = getSavedDiagnostic;

export function saveDiagnostic(jobId: string, d: SavedDiagnostic) {
  save(getKey("diagnostic", jobId), d);
  updateWorkflowState(jobId, { diagnosticCompleted: true });
}
