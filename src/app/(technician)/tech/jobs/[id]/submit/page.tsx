"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getJob, getAppliance, getCustomer } from "@/lib/mock-data";
import { getSession } from "@/lib/auth";
import {
  getWorkflowState, getSymptoms, getDiagnostic,
  getReadings, getPhotos, getReport, getLocalEstimate,
  markJobSubmitted,
} from "@/lib/store";
import WorkflowHeader from "@/components/tech/WorkflowHeader";
import WorkflowNav from "@/components/tech/WorkflowNav";
import type { JobWorkflowState } from "@/types";
import {
  CheckCircle, Circle, AlertCircle, Send,
  FileText, Zap, Camera, Wrench, DollarSign, ClipboardList, Stethoscope,
} from "lucide-react";
import { clsx } from "clsx";

interface StepSummary {
  key: keyof JobWorkflowState;
  label: string;
  icon: React.ElementType;
  done: boolean;
  detail: string;
  required: boolean;
  linkPath: string;
}

export default function SubmitPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [workflow, setWorkflow] = useState<JobWorkflowState | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const job = getJob(id);
  const appliance = job ? getAppliance(job.applianceId) : null;
  const customer = job ? getCustomer(job.customerId) : null;

  const symptoms = getSymptoms(id);
  const diagnostic = getDiagnostic(id);
  const readings = getReadings(id);
  const photos = getPhotos(id);
  const report = getReport(id);
  const estimate = getLocalEstimate(id);

  useEffect(() => {
    const session = getSession();
    if (!session) { router.replace("/login"); return; }
    const wf = getWorkflowState(id);
    setWorkflow(wf);
    if (wf?.submitted) setSubmitted(true);
  }, [id, router]);

  function buildSteps(wf: JobWorkflowState): StepSummary[] {
    return [
      {
        key: "symptomsRecorded",
        label: "Symptoms Recorded",
        icon: FileText,
        done: wf.symptomsRecorded,
        required: true,
        linkPath: "symptoms",
        detail: symptoms?.observedSymptoms?.length
          ? `${symptoms.observedSymptoms.length} symptom(s) — ${symptoms.observedSymptoms.slice(0, 2).join(", ")}${symptoms.observedSymptoms.length > 2 ? "…" : ""}`
          : symptoms?.customerComplaint ? "Complaint captured" : "Not recorded",
      },
      {
        key: "diagnosticCompleted",
        label: "Diagnostic Complete",
        icon: Stethoscope,
        done: wf.diagnosticCompleted,
        required: true,
        linkPath: "diagnose",
        detail: diagnostic?.confirmedDiagnosis
          ? diagnostic.confirmedDiagnosis.slice(0, 80) + (diagnostic.confirmedDiagnosis.length > 80 ? "…" : "")
          : "Not completed",
      },
      {
        key: "readingsRecorded",
        label: "Meter Readings",
        icon: Zap,
        done: wf.readingsRecorded,
        required: false,
        linkPath: "readings",
        detail: readings.length > 0
          ? `${readings.length} reading(s) — ${readings.filter(r => r.result === "pass").length} pass, ${readings.filter(r => r.result === "fail").length} fail`
          : "No readings recorded",
      },
      {
        key: "photosAdded",
        label: "Photos Attached",
        icon: Camera,
        done: wf.photosAdded,
        required: false,
        linkPath: "photos",
        detail: photos.length > 0
          ? `${photos.length} photo(s) across ${new Set(photos.map(p => p.category)).size} categor${new Set(photos.map(p => p.category)).size === 1 ? "y" : "ies"}`
          : "No photos attached",
      },
      {
        key: "reportCompleted",
        label: "Service Report",
        icon: ClipboardList,
        done: wf.reportCompleted,
        required: true,
        linkPath: "report",
        detail: report
          ? `${report.outcome.replace(/_/g, " ")} — ${Math.floor((report.laborMinutes ?? 0) / 60)}h ${(report.laborMinutes ?? 0) % 60}m labor`
          : "Not completed",
      },
      {
        key: "estimateBuilt",
        label: "Estimate Created",
        icon: DollarSign,
        done: wf.estimateBuilt,
        required: false,
        linkPath: "estimate",
        detail: estimate
          ? `$${estimate.total.toFixed(2)} total (${estimate.lines.length} line item${estimate.lines.length !== 1 ? "s" : ""})`
          : "No estimate created",
      },
    ];
  }

  const steps = workflow ? buildSteps(workflow) : [];
  const requiredDone = steps.filter(s => s.required).every(s => s.done);
  const completedCount = steps.filter(s => s.done).length;
  const allDone = completedCount === steps.length;

  function handleSubmit() {
    if (!requiredDone || submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      markJobSubmitted(id);
      setWorkflow(getWorkflowState(id));
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  }

  if (!job) return null;

  if (submitted) {
    return (
      <div className="pb-8">
        <WorkflowHeader job={job} title="Submitted" backHref={`/tech/jobs/${id}`} />
        <div className="px-4 py-8 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-jdr-navy">Job Submitted!</h2>
          <p className="text-jdr-slate mt-2">{job.title} has been submitted for manager review.</p>
          <p className="text-jdr-slate text-sm mt-1">The operations team will review and process the estimate.</p>

          {estimate && (
            <div className="jdr-card p-4 mt-6 text-left">
              <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-3">Submitted Estimate</p>
              <div className="space-y-1.5">
                {estimate.lines.map((l, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-jdr-slate">{l.description}</span>
                    <span className="font-mono text-jdr-navy">${(Number(l.quantity) * Number(l.unitPrice)).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-100 pt-2 flex justify-between font-bold">
                  <span className="text-jdr-navy">Total</span>
                  <span className="font-mono text-jdr-navy">${estimate.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button onClick={() => router.push(`/tech/jobs/${id}`)}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-jdr-slate text-sm font-medium hover:bg-jdr-cream">
              View Job
            </button>
            <button onClick={() => router.push("/tech/jobs")} className="flex-1 jdr-btn-gold">
              All Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <WorkflowHeader job={job} title="Final Review & Submit" backHref={`/tech/jobs/${id}`} />

      <div className="px-4 py-4 space-y-5">
        {workflow && <WorkflowNav jobId={id} state={workflow} compact />}

        {/* Progress summary */}
        <div className="jdr-card p-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#f0ede8" strokeWidth="6" />
                <circle cx="32" cy="32" r="28" fill="none"
                  stroke={allDone ? "#16a34a" : requiredDone ? "#c8a85a" : "#e2e8f0"}
                  strokeWidth="6"
                  strokeDasharray={`${steps.length ? (completedCount / steps.length) * 175.9 : 0} 175.9`}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-jdr-navy font-bold text-sm">{completedCount}/{steps.length}</span>
              </div>
            </div>
            <div>
              <p className="font-bold text-jdr-navy">
                {allDone ? "All Steps Complete" : requiredDone ? "Ready to Submit" : "Required Steps Incomplete"}
              </p>
              <p className="text-jdr-slate text-sm mt-0.5">{completedCount} of {steps.length} workflow steps done</p>
              {!requiredDone && (
                <p className="text-red-600 text-xs mt-1 font-medium">Complete required steps to submit</p>
              )}
            </div>
          </div>
        </div>

        {/* Job overview */}
        <div className="jdr-card p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-3">Job Details</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-jdr-slate">Customer</span>
              <span className="text-jdr-navy font-medium">{customer?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-jdr-slate">Appliance</span>
              <span className="text-jdr-navy">{appliance?.brand} {appliance?.model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-jdr-slate">Scheduled</span>
              <span className="text-jdr-navy">
                {job.scheduledAt ? new Date(job.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Workflow checklist */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-3">Workflow Checklist</p>
          <div className="space-y-2">
            {steps.map(step => {
              const StepIcon = step.icon;
              return (
                <div key={step.key}
                  className={clsx("jdr-card p-4 border transition-all",
                    step.done ? "border-green-200 bg-green-50/30" : step.required ? "border-red-200 bg-red-50/20" : "border-gray-200"
                  )}>
                  <div className="flex items-start gap-3">
                    <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      step.done ? "bg-green-100" : step.required ? "bg-red-100" : "bg-gray-100"
                    )}>
                      {step.done
                        ? <CheckCircle className="w-4 h-4 text-green-600" />
                        : step.required
                          ? <AlertCircle className="w-4 h-4 text-red-500" />
                          : <Circle className="w-4 h-4 text-gray-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={clsx("font-semibold text-sm", step.done ? "text-green-800" : "text-jdr-navy")}>
                          {step.label}
                        </p>
                        {step.required && !step.done && (
                          <span className="jdr-badge bg-red-50 text-red-600 border border-red-200 text-[10px]">Required</span>
                        )}
                        {!step.required && (
                          <span className="jdr-badge bg-gray-100 text-gray-500 border border-gray-200 text-[10px]">Optional</span>
                        )}
                      </div>
                      <p className={clsx("text-xs mt-0.5", step.done ? "text-green-700" : "text-jdr-slate")}>
                        {step.detail}
                      </p>
                    </div>
                    {!step.done && (
                      <button onClick={() => router.push(`/tech/jobs/${id}/${step.linkPath}`)}
                        className="flex-shrink-0 text-jdr-navy text-xs font-semibold hover:text-jdr-gold transition-colors">
                        Go →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Estimate preview */}
        {estimate && (
          <div className="jdr-card p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-3">Estimate Preview</p>
            <div className="space-y-1.5 mb-3">
              {estimate.lines.map((l, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-jdr-slate truncate mr-2">{l.description}</span>
                  <span className="font-mono text-jdr-navy flex-shrink-0">${(Number(l.quantity) * Number(l.unitPrice)).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-base">
              <span className="text-jdr-navy">Total</span>
              <span className="font-mono text-jdr-navy">${estimate.total.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Reminders */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-800 font-semibold text-sm mb-2">Before You Submit</p>
          <div className="space-y-1.5">
            {[
              "Do NOT quote the estimate total to the customer — await manager approval",
              "Ensure the customer complaint is accurately captured in symptoms",
              "Confirm all meter readings are saved with correct pass/fail results",
            ].map((n, i) => (
              <div key={i} className="flex gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-700 text-xs">{n}</p>
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleSubmit} disabled={!requiredDone || submitting}
          className={clsx("w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base transition-all",
            requiredDone
              ? "bg-jdr-navy text-white hover:bg-jdr-navy/90 active:scale-[0.98]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          )}>
          {submitting ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting…</>
          ) : (
            <><Send className="w-5 h-5" />Submit Job for Review</>
          )}
        </button>

        {!requiredDone && (
          <p className="text-center text-red-500 text-xs">
            Complete Symptoms, Diagnostic, and Service Report to submit
          </p>
        )}
      </div>
    </div>
  );
}
