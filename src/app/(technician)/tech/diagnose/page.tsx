"use client";

import { useState, useEffect } from "react";
import { getSession } from "@/lib/auth";
import { getTodaysJobs, getCustomer, getAppliance } from "@/lib/mock-data";
import PageHeader from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Stethoscope, ChevronDown, CheckCircle, AlertCircle, DollarSign, Wrench } from "lucide-react";
import type { Job } from "@/types";
import { clsx } from "clsx";

const FAULT_CODES: Record<string, string[]> = {
  "Sub-Zero": ["E1 – Condenser fan fault", "E2 – Evaporator fan fault", "E3 – Defrost heater open", "E9 – Door ajar", "EC – Control board fault"],
  "Wolf": ["F1 – Ignition module", "F2 – Gas valve fault", "F4 – Temperature probe", "F7 – Fan motor"],
  "Miele": ["E62 – Heating failure", "E14 – Flow sensor", "F11 – Drain pump", "F14 – Inlet valve"],
  "Thermador": ["E0 – Cooling fan", "E1 – Probe fault", "E3 – Door latch", "E9 – Control board"],
  "Gaggenau": ["F1 – Induction zone PCB", "F3 – Temperature overload", "F6 – Safety cutout"],
};

const PART_SUGGESTIONS: Record<string, string[]> = {
  "Sub-Zero": ["Evaporator Fan Motor (4204490)", "Compressor Relay (4211614)", "Door Gasket Kit (7021068)", "Control Board (4204495)"],
  "Wolf": ["Igniter Module (804706)", "Gas Valve (804748)", "Temp Probe (804769)", "Burner Cap (804712)"],
  "Miele": ["Heating Element (10289840)", "Water Inlet Valve (07119570)", "Drain Pump (06467902)", "Control PCB (07736391)"],
  "Thermador": ["Door Gasket (14-35-935)", "Temp Probe (14-40-043)", "Latch Assembly (14-31-028)"],
  "Gaggenau": ["Induction PCB (11021752)", "Safety Thermostat (11037952)", "Touch Interface (11025423)"],
};

export default function DiagnosePage() {
  const [techId, setTechId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [selectedFaults, setSelectedFaults] = useState<string[]>([]);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [laborHours, setLaborHours] = useState("2");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (s) setTechId(s.userId);
  }, []);

  const jobs = techId ? getTodaysJobs(techId).filter(j => ["in_progress", "scheduled", "en_route"].includes(j.status)) : [];

  function handleJobSelect(job: Job) {
    setSelectedJob(job);
    setDiagnosis("");
    setSelectedFaults([]);
    setSelectedParts([]);
    setSubmitted(false);
  }

  function toggleFault(code: string) {
    setSelectedFaults(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
  }

  function togglePart(part: string) {
    setSelectedParts(prev => prev.includes(part) ? prev.filter(p => p !== part) : [...prev, part]);
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  const appliance = selectedJob ? getAppliance(selectedJob.applianceId) : null;
  const faultCodes = appliance ? (FAULT_CODES[appliance.brand] ?? []) : [];
  const partSuggestions = appliance ? (PART_SUGGESTIONS[appliance.brand] ?? []) : [];
  const estimatedTotal = parseFloat(laborHours) * 185 + selectedParts.length * 180;

  if (submitted) {
    return (
      <div className="px-4 py-5">
        <div className="jdr-card p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-jdr-navy font-bold text-lg mb-2">Diagnosis Submitted</h2>
          <p className="text-jdr-slate text-sm mb-6">Your diagnosis and estimate have been submitted for manager approval.</p>
          <button
            onClick={() => { setSubmitted(false); setSelectedJob(null); }}
            className="jdr-btn-primary w-full"
          >
            Start New Diagnosis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 space-y-5">
      <PageHeader
        title="Diagnose"
        subtitle="Document findings and submit estimates"
        action={<Stethoscope className="w-5 h-5 text-jdr-slate" />}
      />

      {/* Job selector */}
      <div>
        <label className="jdr-label">Select Active Job</label>
        {jobs.length === 0 ? (
          <div className="jdr-card p-6 text-center text-jdr-slate text-sm">
            No active jobs to diagnose right now
          </div>
        ) : (
          <div className="space-y-2">
            {jobs.map((job) => {
              const customer = getCustomer(job.customerId);
              return (
                <button
                  key={job.id}
                  onClick={() => handleJobSelect(job)}
                  className={clsx(
                    "w-full jdr-card p-4 text-left flex items-center gap-3 transition-all",
                    selectedJob?.id === job.id ? "ring-2 ring-jdr-navy" : "hover:shadow-jdr-md"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-jdr-navy text-sm truncate">{job.title}</p>
                    <p className="text-jdr-slate text-xs">{customer?.name}</p>
                  </div>
                  <StatusBadge status={job.status} />
                  {selectedJob?.id === job.id && (
                    <div className="w-5 h-5 rounded-full bg-jdr-navy flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selectedJob && appliance && (
        <>
          {/* Appliance info */}
          <div className="jdr-card p-4 bg-jdr-cream border-none">
            <div className="flex items-center gap-3">
              <Wrench className="w-4 h-4 text-jdr-navy" />
              <div>
                <p className="text-jdr-navy font-semibold text-sm">{appliance.brand} {appliance.model}</p>
                <p className="text-jdr-slate text-xs">{appliance.type} · S/N: {appliance.serial}</p>
              </div>
            </div>
          </div>

          {/* Fault codes */}
          {faultCodes.length > 0 && (
            <div>
              <label className="jdr-label">Fault Codes Detected</label>
              <div className="space-y-2">
                {faultCodes.map((code) => (
                  <button
                    key={code}
                    onClick={() => toggleFault(code)}
                    className={clsx(
                      "w-full flex items-center gap-3 p-3 rounded-lg border text-left text-sm transition-all",
                      selectedFaults.includes(code)
                        ? "border-red-300 bg-red-50 text-red-700"
                        : "border-gray-200 bg-white text-jdr-navy hover:border-gray-300"
                    )}
                  >
                    {selectedFaults.includes(code)
                      ? <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      : <div className="w-4 h-4 rounded border-2 border-gray-300 flex-shrink-0" />
                    }
                    {code}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Diagnosis notes */}
          <div>
            <label className="jdr-label">Diagnosis Notes *</label>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Describe the issue, root cause, and findings…"
              rows={4}
              className="jdr-input resize-none"
            />
          </div>

          {/* Parts required */}
          {partSuggestions.length > 0 && (
            <div>
              <label className="jdr-label">Parts Required</label>
              <div className="space-y-2">
                {partSuggestions.map((part) => (
                  <button
                    key={part}
                    onClick={() => togglePart(part)}
                    className={clsx(
                      "w-full flex items-center gap-3 p-3 rounded-lg border text-left text-sm transition-all",
                      selectedParts.includes(part)
                        ? "border-jdr-navy bg-jdr-cream text-jdr-navy"
                        : "border-gray-200 bg-white text-jdr-navy hover:border-gray-300"
                    )}
                  >
                    {selectedParts.includes(part)
                      ? <CheckCircle className="w-4 h-4 text-jdr-navy flex-shrink-0" />
                      : <div className="w-4 h-4 rounded border-2 border-gray-300 flex-shrink-0" />
                    }
                    {part}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Labor estimate */}
          <div>
            <label className="jdr-label">Labor Hours</label>
            <input
              type="number"
              min="0.5"
              max="8"
              step="0.5"
              value={laborHours}
              onChange={(e) => setLaborHours(e.target.value)}
              className="jdr-input"
            />
          </div>

          {/* Estimate summary */}
          <div className="jdr-card p-4 bg-jdr-navy">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-jdr-gold" />
              <span className="text-white font-semibold text-sm">Estimated Total</span>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-white/70">
                <span>Labor ({laborHours}h × $185)</span>
                <span>${(parseFloat(laborHours) * 185).toFixed(0)}</span>
              </div>
              {selectedParts.length > 0 && (
                <div className="flex justify-between text-white/70">
                  <span>Parts ({selectedParts.length} items, est.)</span>
                  <span>${(selectedParts.length * 180).toFixed(0)}</span>
                </div>
              )}
              <div className="border-t border-white/10 pt-1.5 flex justify-between text-white font-bold">
                <span>Total</span>
                <span>${estimatedTotal.toFixed(0)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!diagnosis.trim()}
            className="jdr-btn-gold w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit for Approval
          </button>
        </>
      )}
    </div>
  );
}
