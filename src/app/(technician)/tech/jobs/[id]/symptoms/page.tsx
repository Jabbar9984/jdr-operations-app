"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getJob, getAppliance } from "@/lib/mock-data";
import { getSession } from "@/lib/auth";
import { getSymptoms, saveSymptoms, getWorkflowState } from "@/lib/store";
import WorkflowHeader from "@/components/tech/WorkflowHeader";
import WorkflowNav from "@/components/tech/WorkflowNav";
import type { JobWorkflowState } from "@/types";
import { Plus, X, CheckCircle, AlertCircle } from "lucide-react";
import { clsx } from "clsx";

const COMMON_SYMPTOMS: Record<string, string[]> = {
  "Refrigerator": ["Not cooling", "Not freezing", "Ice maker not working", "Unusual noise", "Frost buildup", "Water leak", "Door seal issue", "Temperature fluctuation", "Compressor cycling"],
  "Range": ["Burner won't ignite", "Burner ignites intermittently", "Oven not heating", "Oven overheating", "Gas smell", "Display error", "Uneven heating", "Self-clean failure"],
  "Dishwasher": ["Not cleaning dishes", "Not draining", "Not filling with water", "Door latch issue", "Unusual noise", "Water leak", "Error code displayed", "Dishes not dry", "Cycle not completing"],
  "Wine Cooler": ["Not cooling", "Temperature fluctuation", "Unusual noise", "Compressor not running", "Door seal failure", "Condensation inside"],
  "Wall Oven": ["Not heating", "Temperature inaccurate", "Uneven baking", "Door not sealing", "Self-clean issue", "Display error", "Fan noise"],
  "Cooktop": ["Zone not working", "Fault code displayed", "All zones dead", "Intermittent operation", "Control panel unresponsive", "Residual heat indicator fault"],
};

export default function SymptomsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [workflow, setWorkflow] = useState<JobWorkflowState | null>(null);
  const [customerComplaint, setCustomerComplaint] = useState("");
  const [observed, setObserved] = useState<string[]>([]);
  const [errorCodes, setErrorCodes] = useState<string[]>([]);
  const [newCode, setNewCode] = useState("");
  const [frequency, setFrequency] = useState("");
  const [whenOccurs, setWhenOccurs] = useState("");
  const [applianceAge, setApplianceAge] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const job = getJob(id);
  const appliance = job ? getAppliance(job.applianceId) : null;
  const suggestions = appliance ? (COMMON_SYMPTOMS[appliance.type] ?? []) : [];

  useEffect(() => {
    const session = getSession();
    if (!session) { router.replace("/login"); return; }
    if (job) setCustomerComplaint(job.customerComplaint ?? "");
    if (job?.reportedErrorCodes?.length) setErrorCodes(job.reportedErrorCodes);

    const existing = getSymptoms(id);
    if (existing) {
      setCustomerComplaint(existing.customerComplaint);
      setObserved(existing.observedSymptoms);
      setErrorCodes(existing.errorCodes);
      setFrequency(existing.frequencyOfIssue);
      setWhenOccurs(existing.whenOccurs);
      setApplianceAge(existing.applianceAge);
      setAdditionalNotes(existing.additionalNotes);
    }
    setWorkflow(getWorkflowState(id));
  }, [id, job, router]);

  function toggleSymptom(s: string) {
    setObserved(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  function addErrorCode() {
    const code = newCode.trim().toUpperCase();
    if (code && !errorCodes.includes(code)) {
      setErrorCodes(prev => [...prev, code]);
    }
    setNewCode("");
  }

  function handleSave() {
    saveSymptoms(id, {
      jobId: id,
      customerComplaint,
      observedSymptoms: observed,
      errorCodes,
      frequencyOfIssue: frequency,
      whenOccurs,
      applianceAge,
      additionalNotes,
      savedAt: new Date().toISOString(),
    });
    setWorkflow(getWorkflowState(id));
    setSaved(true);
    setTimeout(() => { setSaved(false); router.push(`/tech/jobs/${id}/diagnose`); }, 1200);
  }

  if (!job) return null;

  return (
    <div className="pb-8">
      <WorkflowHeader job={job} title="Symptoms & Complaint" backHref={`/tech/jobs/${id}`} />

      <div className="px-4 py-4 space-y-5">
        {workflow && <WorkflowNav jobId={id} state={workflow} compact />}

        {/* Customer complaint */}
        <div className="jdr-card p-4">
          <label className="jdr-label">Customer's Complaint</label>
          <textarea
            value={customerComplaint}
            onChange={e => setCustomerComplaint(e.target.value)}
            placeholder="What did the customer describe as the problem?"
            rows={3}
            className="jdr-input resize-none text-sm"
          />
        </div>

        {/* Observed symptoms */}
        <div className="jdr-card p-4">
          <label className="jdr-label">Observed Symptoms (tap to select)</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => toggleSymptom(s)}
                className={clsx(
                  "px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
                  observed.includes(s)
                    ? "bg-jdr-navy text-white border-jdr-navy"
                    : "bg-white text-jdr-slate border-gray-200 hover:border-gray-300"
                )}
              >
                {observed.includes(s) && <span className="mr-1">✓</span>}{s}
              </button>
            ))}
          </div>
          {observed.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {observed.map(s => (
                <span key={s} className="jdr-badge bg-jdr-navy text-white border-jdr-navy flex items-center gap-1">
                  {s}
                  <button onClick={() => toggleSymptom(s)} className="hover:opacity-70"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Error codes */}
        <div className="jdr-card p-4">
          <label className="jdr-label">Error / Fault Codes</label>
          <div className="flex gap-2 mb-3">
            <input
              value={newCode}
              onChange={e => setNewCode(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addErrorCode()}
              placeholder="E.g. E62, F1, EC…"
              className="jdr-input flex-1 text-sm font-mono uppercase"
            />
            <button onClick={addErrorCode} disabled={!newCode.trim()}
              className="px-3 py-2 bg-jdr-navy text-white rounded-lg disabled:opacity-40">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {errorCodes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {errorCodes.map(code => (
                <span key={code} className="jdr-badge bg-red-50 text-red-700 border border-red-200 font-mono flex items-center gap-1">
                  {code}
                  <button onClick={() => setErrorCodes(prev => prev.filter(c => c !== code))} className="hover:opacity-70"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Frequency & when */}
        <div className="jdr-card p-4 space-y-3">
          <div>
            <label className="jdr-label">Frequency of Issue</label>
            <select value={frequency} onChange={e => setFrequency(e.target.value)} className="jdr-input text-sm">
              <option value="">Select…</option>
              <option value="constant">Constant — always present</option>
              <option value="frequent">Frequent — happens most of the time</option>
              <option value="intermittent">Intermittent — comes and goes</option>
              <option value="rare">Rare — happened once or twice</option>
              <option value="getting_worse">Getting worse over time</option>
            </select>
          </div>
          <div>
            <label className="jdr-label">When Does It Occur?</label>
            <input
              value={whenOccurs}
              onChange={e => setWhenOccurs(e.target.value)}
              placeholder="E.g. only during defrost cycle, after door is opened…"
              className="jdr-input text-sm"
            />
          </div>
          <div>
            <label className="jdr-label">Estimated Appliance Age at Failure</label>
            <select value={applianceAge} onChange={e => setApplianceAge(e.target.value)} className="jdr-input text-sm">
              <option value="">Select…</option>
              <option value="<1yr">Less than 1 year</option>
              <option value="1-3yr">1–3 years</option>
              <option value="3-5yr">3–5 years</option>
              <option value="5-10yr">5–10 years</option>
              <option value=">10yr">More than 10 years</option>
            </select>
          </div>
        </div>

        {/* Additional notes */}
        <div className="jdr-card p-4">
          <label className="jdr-label">Additional Notes</label>
          <textarea
            value={additionalNotes}
            onChange={e => setAdditionalNotes(e.target.value)}
            placeholder="Any other observations — smells, sounds, visual damage…"
            rows={3}
            className="jdr-input resize-none text-sm"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!customerComplaint.trim() && observed.length === 0}
          className={clsx(
            "w-full py-3.5 rounded-xl font-semibold text-sm transition-all",
            saved ? "bg-green-600 text-white" : "jdr-btn-gold disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {saved ? "✓ Saved — Opening Diagnostic…" : "Save & Continue to Diagnostic"}
        </button>
      </div>
    </div>
  );
}
