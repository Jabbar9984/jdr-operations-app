"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getJob, getAppliance, getMeterTemplates } from "@/lib/mock-data";
import { getSession } from "@/lib/auth";
import { getReadings, saveReading, deleteReading, getWorkflowState } from "@/lib/store";
import WorkflowHeader from "@/components/tech/WorkflowHeader";
import WorkflowNav from "@/components/tech/WorkflowNav";
import type { MeterReading, MeterReadingType, MeterReadingTemplate, JobWorkflowState } from "@/types";
import { Plus, X, Trash2, CheckCircle, XCircle, AlertCircle, Gauge, ChevronDown, ChevronUp } from "lucide-react";
import { clsx } from "clsx";

const TYPE_CONFIG: Record<MeterReadingType, { label: string; unit: string; icon: string; color: string }> = {
  voltage: { label: "Voltage", unit: "VAC/VDC", icon: "⚡", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
  resistance: { label: "Resistance", unit: "Ω / kΩ", icon: "〜", color: "bg-blue-50 border-blue-200 text-blue-700" },
  continuity: { label: "Continuity", unit: "Pass/Fail", icon: "⬤", color: "bg-purple-50 border-purple-200 text-purple-700" },
  temperature: { label: "Temperature", unit: "°F / °C", icon: "🌡", color: "bg-orange-50 border-orange-200 text-orange-700" },
  pressure: { label: "Pressure", unit: "PSI", icon: "◈", color: "bg-green-50 border-green-200 text-green-700" },
};

const RESULT_CONFIG = {
  pass: { label: "Pass", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50 border-green-200" },
  fail: { label: "Fail", icon: XCircle, color: "text-red-600", bg: "bg-red-50 border-red-200" },
  marginal: { label: "Marginal", icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  pending: { label: "Pending", icon: AlertCircle, color: "text-gray-400", bg: "bg-gray-50 border-gray-200" },
};

function uid() { return `r_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`; }

function ReadingCard({ reading, onDelete }: { reading: MeterReading; onDelete: () => void }) {
  const type = TYPE_CONFIG[reading.type];
  const result = RESULT_CONFIG[reading.result];
  const ResultIcon = result.icon;
  return (
    <div className={clsx("jdr-card p-4 border", result.bg)}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{type.icon}</span>
          <div>
            <p className="font-semibold text-jdr-navy text-sm">{reading.component}</p>
            <span className={clsx("jdr-badge border text-[10px]", type.color)}>{type.label}</span>
          </div>
        </div>
        <button onClick={onDelete} className="text-gray-300 hover:text-red-500 transition-colors p-1">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs mb-2">
        <div className="bg-white rounded-lg p-2 border border-gray-100">
          <p className="text-jdr-slate text-[10px] uppercase">Expected</p>
          <p className="text-jdr-navy font-mono font-semibold">{reading.expectedValue}</p>
        </div>
        <div className="bg-white rounded-lg p-2 border border-gray-100">
          <p className="text-jdr-slate text-[10px] uppercase">Measured</p>
          <p className={clsx("font-mono font-bold", result.color)}>{reading.measuredValue} {reading.unit}</p>
        </div>
        <div className={clsx("rounded-lg p-2 border flex flex-col items-center justify-center", result.bg)}>
          <ResultIcon className={clsx("w-4 h-4 mb-0.5", result.color)} />
          <p className={clsx("text-[10px] font-semibold", result.color)}>{result.label}</p>
        </div>
      </div>
      {reading.notes && <p className="text-jdr-slate text-xs">{reading.notes}</p>}
      <p className="text-gray-300 text-[10px] mt-1">{new Date(reading.timestamp).toLocaleTimeString()}</p>
    </div>
  );
}

function TemplateCard({ template, onUse }: { template: MeterReadingTemplate; onUse: (t: MeterReadingTemplate) => void }) {
  const [open, setOpen] = useState(false);
  const type = TYPE_CONFIG[template.type];
  return (
    <div className="jdr-card overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-3 p-3 text-left">
        <span className="text-base">{type.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-jdr-navy text-sm truncate">{template.component}</p>
          <p className="text-jdr-slate text-xs">{type.label} · Expected: <span className="font-mono font-semibold">{template.expectedValue}</span></p>
        </div>
        <button onClick={e => { e.stopPropagation(); onUse(template); }}
          className="flex-shrink-0 bg-jdr-navy text-white text-xs px-2.5 py-1.5 rounded-lg font-medium">
          Use
        </button>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-3 pb-3 border-t border-gray-50 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs mt-2">
            <div className="bg-jdr-cream rounded-lg p-2">
              <p className="text-jdr-slate text-[10px] uppercase">Normal Range</p>
              <p className="text-jdr-navy font-mono font-semibold">{template.normalRange}</p>
            </div>
            <div className="bg-jdr-cream rounded-lg p-2">
              <p className="text-jdr-slate text-[10px] uppercase">Unit</p>
              <p className="text-jdr-navy font-semibold">{template.unit}</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-2 text-xs">
            <p className="text-blue-700 font-semibold mb-0.5">Test Procedure</p>
            <p className="text-blue-600 leading-relaxed">{template.testProcedure}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-2 text-xs">
            <p className="text-red-700 font-semibold mb-0.5">Failure Indication</p>
            <p className="text-red-600">{template.failureIndication}</p>
          </div>
        </div>
      )}
    </div>
  );
}

const BLANK_READING = (): Partial<MeterReading> => ({
  type: "voltage",
  component: "",
  expectedValue: "",
  measuredValue: "",
  unit: "",
  result: "pending",
  notes: "",
});

export default function ReadingsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [workflow, setWorkflow] = useState<JobWorkflowState | null>(null);
  const [readings, setReadings] = useState<MeterReading[]>([]);
  const [templates, setTemplates] = useState<MeterReadingTemplate[]>([]);
  const [form, setForm] = useState<Partial<MeterReading>>(BLANK_READING());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const job = getJob(id);
  const appliance = job ? getAppliance(job.applianceId) : null;

  useEffect(() => {
    const session = getSession();
    if (!session) { router.replace("/login"); return; }
    setReadings(getReadings(id));
    setWorkflow(getWorkflowState(id));
    if (appliance) setTemplates(getMeterTemplates(appliance.brand, appliance.type));
  }, [id, appliance, router]);

  function handleUseTemplate(t: MeterReadingTemplate) {
    setForm({ type: t.type, component: t.component, expectedValue: t.expectedValue, unit: t.unit, result: "pending", notes: "", measuredValue: "" });
    setShowForm(true);
    window.scrollTo({ top: 999999, behavior: "smooth" });
  }

  function handleSaveReading() {
    if (!form.component || !form.measuredValue) return;
    const reading: MeterReading = {
      id: editingId ?? uid(),
      jobId: id,
      type: form.type as MeterReadingType,
      component: form.component!,
      expectedValue: form.expectedValue ?? "",
      measuredValue: form.measuredValue!,
      unit: form.unit ?? "",
      result: form.result as MeterReading["result"],
      notes: form.notes ?? "",
      timestamp: new Date().toISOString(),
    };
    saveReading(id, reading);
    setReadings(getReadings(id));
    setWorkflow(getWorkflowState(id));
    setForm(BLANK_READING());
    setEditingId(null);
    setShowForm(false);
  }

  function handleDelete(readingId: string) {
    deleteReading(id, readingId);
    setReadings(getReadings(id));
  }

  const passFail = { pass: readings.filter(r => r.result === "pass").length, fail: readings.filter(r => r.result === "fail").length, marginal: readings.filter(r => r.result === "marginal").length };

  if (!job) return null;

  return (
    <div className="pb-8">
      <WorkflowHeader job={job} title="Meter Readings" backHref={`/tech/jobs/${id}`} />

      <div className="px-4 py-4 space-y-4">
        {workflow && <WorkflowNav jobId={id} state={workflow} compact />}

        {/* Summary */}
        {readings.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Pass", value: passFail.pass, color: "text-green-600", bg: "bg-green-50 border-green-200" },
              { label: "Fail", value: passFail.fail, color: "text-red-600", bg: "bg-red-50 border-red-200" },
              { label: "Marginal", value: passFail.marginal, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
            ].map(s => (
              <div key={s.label} className={clsx("jdr-card p-3 text-center border", s.bg)}>
                <p className={clsx("font-bold text-2xl", s.color)}>{s.value}</p>
                <p className="text-xs text-jdr-slate mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Saved readings */}
        {readings.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-3">Recorded Readings ({readings.length})</p>
            <div className="space-y-3">
              {readings.map(r => (
                <ReadingCard key={r.id} reading={r} onDelete={() => handleDelete(r.id)} />
              ))}
            </div>
          </div>
        )}

        {/* Templates */}
        {templates.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-3">
              {appliance?.brand} Templates ({templates.length})
            </p>
            <div className="space-y-2">
              {templates.map(t => (
                <TemplateCard key={t.id} template={t} onUse={handleUseTemplate} />
              ))}
            </div>
          </div>
        )}

        {/* Add reading form */}
        {showForm ? (
          <div className="jdr-card p-4 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <p className="font-bold text-jdr-navy">New Reading</p>
              <button onClick={() => { setShowForm(false); setForm(BLANK_READING()); }} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
            </div>
            <div>
              <label className="jdr-label">Reading Type</label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {(Object.keys(TYPE_CONFIG) as MeterReadingType[]).map(type => {
                  const cfg = TYPE_CONFIG[type];
                  return (
                    <button key={type} onClick={() => setForm(f => ({ ...f, type }))}
                      className={clsx("flex flex-col items-center p-2.5 rounded-xl border text-xs font-medium transition-all",
                        form.type === type ? "border-jdr-navy bg-jdr-navy text-white" : "border-gray-200 bg-white text-jdr-slate hover:border-gray-300"
                      )}>
                      <span className="text-lg mb-0.5">{cfg.icon}</span>
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="jdr-label">Component / Location</label>
              <input value={form.component ?? ""} onChange={e => setForm(f => ({ ...f, component: e.target.value }))} placeholder="E.g. Evaporator Fan Motor, Heating Element…" className="jdr-input text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="jdr-label">Expected Reading</label>
                <input value={form.expectedValue ?? ""} onChange={e => setForm(f => ({ ...f, expectedValue: e.target.value }))} placeholder="E.g. 115V AC" className="jdr-input text-sm font-mono" />
              </div>
              <div>
                <label className="jdr-label">Unit</label>
                <input value={form.unit ?? ""} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} placeholder="VAC, Ω, °F…" className="jdr-input text-sm font-mono" />
              </div>
            </div>
            <div>
              <label className="jdr-label">Measured Value *</label>
              <input value={form.measuredValue ?? ""} onChange={e => setForm(f => ({ ...f, measuredValue: e.target.value }))} placeholder="Enter measured reading…" className="jdr-input text-sm font-mono text-lg" />
            </div>
            {form.type === "continuity" && (
              <div>
                <label className="jdr-label">Continuity Result</label>
                <div className="grid grid-cols-2 gap-2">
                  {["CONTINUITY", "NO CONTINUITY"].map(v => (
                    <button key={v} onClick={() => setForm(f => ({ ...f, measuredValue: v }))}
                      className={clsx("py-2.5 rounded-lg border text-sm font-semibold transition-all",
                        form.measuredValue === v
                          ? v === "CONTINUITY" ? "bg-green-600 text-white border-green-600" : "bg-red-500 text-white border-red-500"
                          : "bg-white border-gray-200 text-jdr-navy hover:border-gray-300"
                      )}>{v}</button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <label className="jdr-label">Result</label>
              <div className="grid grid-cols-3 gap-2">
                {(["pass", "fail", "marginal"] as const).map(r => {
                  const cfg = RESULT_CONFIG[r];
                  const Icon = cfg.icon;
                  return (
                    <button key={r} onClick={() => setForm(f => ({ ...f, result: r }))}
                      className={clsx("flex items-center justify-center gap-1.5 py-2.5 rounded-lg border text-sm font-semibold transition-all",
                        form.result === r ? `${cfg.bg} ${cfg.color} border-current` : "bg-white border-gray-200 text-jdr-slate hover:border-gray-300"
                      )}>
                      <Icon className="w-4 h-4" />{cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="jdr-label">Notes (optional)</label>
              <input value={form.notes ?? ""} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Observations, conditions…" className="jdr-input text-sm" />
            </div>
            <button onClick={handleSaveReading} disabled={!form.component || !form.measuredValue}
              className="w-full jdr-btn-gold disabled:opacity-50 disabled:cursor-not-allowed">
              Save Reading
            </button>
          </div>
        ) : (
          <button onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-gray-300 rounded-xl text-jdr-slate hover:border-jdr-gold hover:text-jdr-navy transition-colors font-medium text-sm">
            <Plus className="w-4 h-4" />Add Meter Reading
          </button>
        )}
      </div>
    </div>
  );
}

