"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getJob, getAppliance } from "@/lib/mock-data";
import { getSession } from "@/lib/auth";
import { getReport, saveReport, getSymptoms, getSavedDiagnostic as getDiagnostic, getWorkflowState } from "@/lib/store";
import WorkflowHeader from "@/components/tech/WorkflowHeader";
import WorkflowNav from "@/components/tech/WorkflowNav";
import type { ServiceReport, RepairType, JobWorkflowState } from "@/types";
import { CheckCircle, FileText, Clock, Wrench, AlertTriangle } from "lucide-react";
import { clsx } from "clsx";

const REPAIR_TYPES: { value: RepairType; label: string; desc: string }[] = [
  { value: "diagnosis_only", label: "Diagnosis Only", desc: "Identified the issue, no repair performed" },
  { value: "parts_replaced", label: "Parts Replaced", desc: "Installed one or more replacement parts" },
  { value: "adjustment_cleaning", label: "Adjustment / Cleaning", desc: "Cleaned, adjusted, or calibrated" },
  { value: "warranty_repair", label: "Warranty Repair", desc: "Covered under manufacturer warranty" },
  { value: "no_fault_found", label: "No Fault Found", desc: "Unable to reproduce or find fault" },
  { value: "refer_to_manager", label: "Refer to Manager", desc: "Requires manager escalation or approval" },
];

const OUTCOME_OPTIONS = [
  { value: "fully_repaired", label: "Fully Repaired", color: "bg-green-50 text-green-700 border-green-200" },
  { value: "partially_repaired", label: "Partially Repaired", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "parts_ordered", label: "Parts Ordered — Return Visit Needed", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { value: "needs_escalation", label: "Needs Escalation", color: "bg-red-50 text-red-700 border-red-200" },
  { value: "no_repair_performed", label: "No Repair Performed", color: "bg-gray-50 text-gray-700 border-gray-200" },
];

function TimeInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex-1">
      <label className="jdr-label">{label}</label>
      <input type="time" value={value} onChange={e => onChange(e.target.value)} className="jdr-input text-sm font-mono" />
    </div>
  );
}

export default function ReportPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [workflow, setWorkflow] = useState<JobWorkflowState | null>(null);
  const [saved, setSaved] = useState(false);

  const [repairType, setRepairType] = useState<RepairType>("parts_replaced");
  const [workPerformed, setWorkPerformed] = useState("");
  const [partsReplaced, setPartsReplaced] = useState<string[]>([]);
  const [newPart, setNewPart] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [travelTime, setTravelTime] = useState("30");
  const [outcome, setOutcome] = useState("fully_repaired");
  const [customerInformed, setCustomerInformed] = useState(true);
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [followUpNotes, setFollowUpNotes] = useState("");
  const [techNotes, setTechNotes] = useState("");
  const [safetyConcerns, setSafetyConcerns] = useState("");

  const job = getJob(id);
  const appliance = job ? getAppliance(job.applianceId) : null;
  const symptoms = getSymptoms(id);
  const diagnostic = getDiagnostic(id);

  useEffect(() => {
    const session = getSession();
    if (!session) { router.replace("/login"); return; }
    setWorkflow(getWorkflowState(id));

    const existing = getReport(id);
    if (existing) {
      setRepairType(existing.repairType);
      setWorkPerformed(existing.workPerformed);
      setPartsReplaced(existing.partsReplaced ?? []);
      setStartTime(existing.startTime);
      setEndTime(existing.endTime);
      setTravelTime(String(existing.travelTimeMinutes));
      setOutcome(existing.outcome);
      setCustomerInformed(existing.customerInformed);
      setFollowUpRequired(existing.followUpRequired);
      setFollowUpNotes(existing.followUpNotes ?? "");
      setTechNotes(existing.techNotes ?? "");
      setSafetyConcerns(existing.safetyConcerns ?? "");
    } else {
      // Pre-fill start time as now
      const now = new Date();
      setStartTime(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`);
      // Pre-fill from diagnostic
      if (diagnostic?.confirmedDiagnosis) setWorkPerformed(diagnostic.confirmedDiagnosis);
    }
  }, [id, diagnostic, router]);

  function addPart() {
    const p = newPart.trim();
    if (p && !partsReplaced.includes(p)) setPartsReplaced(prev => [...prev, p]);
    setNewPart("");
  }

  function calcLabor() {
    if (!startTime || !endTime) return 0;
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    return Math.max(0, (eh * 60 + em) - (sh * 60 + sm));
  }

  function handleSave() {
    const report: ServiceReport = {
      jobId: id,
      repairType,
      workPerformed,
      partsReplaced,
      startTime,
      endTime,
      laborMinutes: calcLabor(),
      travelTimeMinutes: parseInt(travelTime) || 0,
      outcome,
      customerInformed,
      followUpRequired,
      followUpNotes: followUpNotes || undefined,
      techNotes: techNotes || undefined,
      safetyConcerns: safetyConcerns || undefined,
      savedAt: new Date().toISOString(),
    };
    saveReport(id, report);
    setWorkflow(getWorkflowState(id));
    setSaved(true);
    setTimeout(() => { setSaved(false); router.push(`/tech/jobs/${id}/estimate`); }, 1200);
  }

  if (!job) return null;

  const laborMins = calcLabor();

  return (
    <div className="pb-8">
      <WorkflowHeader job={job} title="Service Report" backHref={`/tech/jobs/${id}`} />

      <div className="px-4 py-4 space-y-5">
        {workflow && <WorkflowNav jobId={id} state={workflow} compact />}

        {/* Auto-filled context */}
        {(symptoms || diagnostic) && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-1.5">
            <p className="text-blue-800 text-xs font-semibold uppercase tracking-wide">Auto-filled from previous steps</p>
            {symptoms?.customerComplaint && (
              <p className="text-blue-700 text-xs">
                <span className="font-medium">Complaint:</span> {symptoms.customerComplaint}
              </p>
            )}
            {diagnostic?.confirmedDiagnosis && (
              <p className="text-blue-700 text-xs">
                <span className="font-medium">Diagnosis:</span> {diagnostic.confirmedDiagnosis}
              </p>
            )}
          </div>
        )}

        {/* Repair type */}
        <div className="jdr-card p-4">
          <label className="jdr-label">Type of Repair</label>
          <div className="space-y-2">
            {REPAIR_TYPES.map(rt => (
              <button key={rt.value} onClick={() => setRepairType(rt.value)}
                className={clsx("w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all",
                  repairType === rt.value ? "border-jdr-navy bg-jdr-cream ring-1 ring-jdr-navy/20" : "border-gray-200 bg-white hover:border-gray-300"
                )}>
                <div className={clsx("w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 flex items-center justify-center",
                  repairType === rt.value ? "border-jdr-navy" : "border-gray-300"
                )}>
                  {repairType === rt.value && <div className="w-2 h-2 rounded-full bg-jdr-navy" />}
                </div>
                <div>
                  <p className={clsx("font-semibold text-sm", repairType === rt.value ? "text-jdr-navy" : "text-gray-700")}>{rt.label}</p>
                  <p className="text-gray-500 text-xs">{rt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Work performed */}
        <div className="jdr-card p-4">
          <label className="jdr-label">Work Performed *</label>
          <textarea value={workPerformed} onChange={e => setWorkPerformed(e.target.value)}
            placeholder="Describe in detail what was done during this service call…"
            rows={5} className="jdr-input resize-none text-sm" />
        </div>

        {/* Parts replaced */}
        {(repairType === "parts_replaced" || repairType === "warranty_repair") && (
          <div className="jdr-card p-4">
            <label className="jdr-label">Parts Replaced</label>
            <div className="flex gap-2 mb-3">
              <input value={newPart} onChange={e => setNewPart(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addPart()}
                placeholder="Part name or number…" className="jdr-input flex-1 text-sm" />
              <button onClick={addPart} disabled={!newPart.trim()}
                className="px-3 py-2 bg-jdr-navy text-white rounded-lg disabled:opacity-40 text-sm">Add</button>
            </div>
            {partsReplaced.length > 0 && (
              <div className="space-y-1.5">
                {partsReplaced.map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 bg-jdr-cream rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-jdr-navy">{p}</span>
                    </div>
                    <button onClick={() => setPartsReplaced(prev => prev.filter((_, j) => j !== i))}
                      className="text-gray-300 hover:text-red-500 text-xs">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Time on job */}
        <div className="jdr-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-jdr-navy" />
            <label className="jdr-label mb-0">Time on Job</label>
          </div>
          <div className="flex gap-3 mb-3">
            <TimeInput label="Start Time" value={startTime} onChange={setStartTime} />
            <TimeInput label="End Time" value={endTime} onChange={setEndTime} />
          </div>
          {laborMins > 0 && (
            <div className="flex items-center gap-2 bg-jdr-cream rounded-lg p-2.5">
              <Wrench className="w-3.5 h-3.5 text-jdr-navy" />
              <span className="text-jdr-navy text-sm font-semibold">
                {Math.floor(laborMins / 60)}h {laborMins % 60}m labor time
              </span>
            </div>
          )}
          <div className="mt-3">
            <label className="jdr-label">Travel Time (minutes)</label>
            <input type="number" value={travelTime} onChange={e => setTravelTime(e.target.value)}
              min="0" max="480" className="jdr-input text-sm w-28" />
          </div>
        </div>

        {/* Outcome */}
        <div className="jdr-card p-4">
          <label className="jdr-label">Job Outcome</label>
          <div className="space-y-2">
            {OUTCOME_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => setOutcome(opt.value)}
                className={clsx("w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                  outcome === opt.value ? `${opt.color} border-current ring-1 ring-current/30` : "bg-white border-gray-200 hover:border-gray-300"
                )}>
                <div className={clsx("w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center",
                  outcome === opt.value ? "border-current" : "border-gray-300"
                )}>
                  {outcome === opt.value && <div className="w-2 h-2 rounded-full bg-current" />}
                </div>
                <span className="text-sm font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Customer & follow-up */}
        <div className="jdr-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-jdr-navy text-sm">Customer Informed</p>
              <p className="text-jdr-slate text-xs">Customer was informed of work performed</p>
            </div>
            <button onClick={() => setCustomerInformed(v => !v)}
              className={clsx("w-12 h-6 rounded-full transition-colors relative",
                customerInformed ? "bg-green-500" : "bg-gray-200"
              )}>
              <div className={clsx("w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-sm",
                customerInformed ? "left-6" : "left-0.5"
              )} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-jdr-navy text-sm">Follow-up Required</p>
              <p className="text-jdr-slate text-xs">A return visit or call is needed</p>
            </div>
            <button onClick={() => setFollowUpRequired(v => !v)}
              className={clsx("w-12 h-6 rounded-full transition-colors relative",
                followUpRequired ? "bg-orange-400" : "bg-gray-200"
              )}>
              <div className={clsx("w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-sm",
                followUpRequired ? "left-6" : "left-0.5"
              )} />
            </button>
          </div>
          {followUpRequired && (
            <div>
              <label className="jdr-label">Follow-up Notes</label>
              <textarea value={followUpNotes} onChange={e => setFollowUpNotes(e.target.value)}
                placeholder="Describe what needs to be done on return visit…"
                rows={3} className="jdr-input resize-none text-sm" />
            </div>
          )}
        </div>

        {/* Safety concerns */}
        <div className="jdr-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <label className="jdr-label mb-0">Safety Concerns (optional)</label>
          </div>
          <textarea value={safetyConcerns} onChange={e => setSafetyConcerns(e.target.value)}
            placeholder="Any safety hazards noted, gas leaks, electrical issues, etc."
            rows={2} className="jdr-input resize-none text-sm" />
        </div>

        {/* Tech notes */}
        <div className="jdr-card p-4">
          <label className="jdr-label">Internal Tech Notes (not shown to customer)</label>
          <textarea value={techNotes} onChange={e => setTechNotes(e.target.value)}
            placeholder="Notes for the office, recommendations for management…"
            rows={3} className="jdr-input resize-none text-sm" />
        </div>

        <button onClick={handleSave} disabled={!workPerformed.trim()}
          className={clsx("w-full py-3.5 rounded-xl font-semibold text-sm transition-all",
            saved ? "bg-green-600 text-white" : "jdr-btn-gold disabled:opacity-50 disabled:cursor-not-allowed"
          )}>
          {saved ? "✓ Saved — Opening Estimate…" : "Save Report & Continue to Estimate"}
        </button>
      </div>
    </div>
  );
}
