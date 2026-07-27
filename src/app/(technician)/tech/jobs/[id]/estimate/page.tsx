"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getJob, getAppliance } from "@/lib/mock-data";
import { getSession } from "@/lib/auth";
import { getLocalEstimate, saveLocalEstimate, getReport, getWorkflowState } from "@/lib/store";
import WorkflowHeader from "@/components/tech/WorkflowHeader";
import WorkflowNav from "@/components/tech/WorkflowNav";
import type { LocalEstimate, EstimateLine, JobWorkflowState } from "@/types";
// EstimateLine and LocalEstimate are now in types/index.ts
import { Plus, Trash2, DollarSign, Wrench, Package, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { clsx } from "clsx";

function uid() { return `el_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`; }

const LABOR_PRESETS = [
  { label: "Diagnostic (1 hr)", hours: 1, rate: 185 },
  { label: "Standard Labor (1 hr)", hours: 1, rate: 165 },
  { label: "Extended Labor (2 hr)", hours: 2, rate: 165 },
  { label: "Complex Repair (3 hr)", hours: 3, rate: 165 },
  { label: "Travel Charge", hours: 0.5, rate: 85 },
];

function LineItemRow({ item, onDelete, onUpdate }: {
  item: EstimateLine;
  onDelete: () => void;
  onUpdate: (field: keyof EstimateLine, value: string | number) => void;
}) {
  const isLabor = item.type === "labor";
  const total = parseFloat(String(item.quantity || 0)) * parseFloat(String(item.unitPrice || 0));

  return (
    <div className={clsx("jdr-card p-3 border-l-4", isLabor ? "border-l-blue-400" : "border-l-purple-400")}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          {isLabor ? <Wrench className="w-3.5 h-3.5 text-blue-500" /> : <Package className="w-3.5 h-3.5 text-purple-500" />}
          <span className={clsx("jdr-badge text-[10px]", isLabor ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-purple-50 text-purple-700 border border-purple-200")}>
            {isLabor ? "Labor" : "Part"}
          </span>
        </div>
        <button onClick={onDelete} className="text-gray-300 hover:text-red-500 p-0.5"><Trash2 className="w-4 h-4" /></button>
      </div>
      <input value={item.description} onChange={e => onUpdate("description", e.target.value)}
        placeholder="Description…" className="jdr-input text-sm mb-2" />
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <label className="text-[10px] text-jdr-slate font-medium uppercase">
            {isLabor ? "Hours" : "Qty"}
          </label>
          <input type="number" value={item.quantity} onChange={e => onUpdate("quantity", parseFloat(e.target.value) || 0)}
            min="0" step={isLabor ? "0.25" : "1"} className="jdr-input text-sm font-mono mt-0.5" />
        </div>
        <div>
          <label className="text-[10px] text-jdr-slate font-medium uppercase">
            {isLabor ? "$/hr" : "Unit $"}
          </label>
          <input type="number" value={item.unitPrice} onChange={e => onUpdate("unitPrice", parseFloat(e.target.value) || 0)}
            min="0" step="0.01" className="jdr-input text-sm font-mono mt-0.5" />
        </div>
        <div>
          <label className="text-[10px] text-jdr-slate font-medium uppercase">Total</label>
          <div className="jdr-input bg-jdr-cream text-jdr-navy font-bold font-mono text-sm mt-0.5">
            ${total.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EstimatePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [workflow, setWorkflow] = useState<JobWorkflowState | null>(null);
  const [lines, setLines] = useState<EstimateLine[]>([]);
  const [notes, setNotes] = useState("");
  const [showPresets, setShowPresets] = useState(false);
  const [saved, setSaved] = useState(false);

  const job = getJob(id);
  const appliance = job ? getAppliance(job.applianceId) : null;
  const report = getReport(id);

  useEffect(() => {
    const session = getSession();
    if (!session) { router.replace("/login"); return; }
    setWorkflow(getWorkflowState(id));

    const existing = getLocalEstimate(id);
    if (existing) {
      setLines(existing.lines);
      setNotes(existing.notes ?? "");
    } else if (report?.laborMinutes) {
      // Pre-fill labor from report
      const hrs = Math.ceil(report.laborMinutes / 60 * 4) / 4; // round to nearest 0.25
      setLines([{
        id: uid(), type: "labor", description: "Diagnostic & Repair Labor", quantity: hrs, unitPrice: 165,
      }]);
    }
  }, [id, report, router]);

  function addLine(type: EstimateLine["type"]) {
    setLines(prev => [...prev, { id: uid(), type, description: "", quantity: type === "labor" ? 1 : 1, unitPrice: type === "labor" ? 165 : 0 }]);
    setShowPresets(false);
  }

  function addPreset(preset: typeof LABOR_PRESETS[0]) {
    setLines(prev => [...prev, { id: uid(), type: "labor", description: preset.label, quantity: preset.hours, unitPrice: preset.rate }]);
    setShowPresets(false);
  }

  function updateLine(lineId: string, field: keyof EstimateLine, value: string | number) {
    setLines(prev => prev.map(l => l.id === lineId ? { ...l, [field]: value } : l));
  }

  function deleteLine(lineId: string) {
    setLines(prev => prev.filter(l => l.id !== lineId));
  }

  const subtotal = lines.reduce((acc, l) => acc + (Number(l.quantity) * Number(l.unitPrice)), 0);
  const tax = subtotal * 0.0875; // 8.75% LA county
  const total = subtotal + tax;

  function handleSave() {
    const est: LocalEstimate = {
      jobId: id, lines, notes: notes || undefined,
      subtotal, tax, total,
      savedAt: new Date().toISOString(),
    };
    saveLocalEstimate(id, est);
    setWorkflow(getWorkflowState(id));
    setSaved(true);
    setTimeout(() => { setSaved(false); router.push(`/tech/jobs/${id}/submit`); }, 1200);
  }

  if (!job) return null;

  const laborTotal = lines.filter(l => l.type === "labor").reduce((acc, l) => acc + Number(l.quantity) * Number(l.unitPrice), 0);
  const partsTotal = lines.filter(l => l.type === "part").reduce((acc, l) => acc + Number(l.quantity) * Number(l.unitPrice), 0);

  return (
    <div className="pb-8">
      <WorkflowHeader job={job} title="Estimate Builder" backHref={`/tech/jobs/${id}`} />

      <div className="px-4 py-4 space-y-5">
        {workflow && <WorkflowNav jobId={id} state={workflow} compact />}

        {/* Pending estimate notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-amber-700 text-xs">
            <span className="font-semibold">Technician draft only.</span> This estimate requires manager approval before presenting to the customer. Do not quote prices directly.
          </p>
        </div>

        {/* Line items */}
        <div className="space-y-3">
          {lines.length === 0 ? (
            <div className="jdr-card p-8 text-center">
              <DollarSign className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-jdr-navy font-semibold">No Line Items Yet</p>
              <p className="text-jdr-slate text-sm mt-1">Add labor and parts below</p>
            </div>
          ) : (
            lines.map(line => (
              <LineItemRow key={line.id} item={line}
                onDelete={() => deleteLine(line.id)}
                onUpdate={(f, v) => updateLine(line.id, f, v)} />
            ))
          )}
        </div>

        {/* Add line buttons */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <button onClick={() => addLine("labor")}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-blue-200 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors">
              <Plus className="w-4 h-4" /><Wrench className="w-4 h-4" />Add Labor
            </button>
            <button onClick={() => addLine("part")}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-purple-200 bg-purple-50 text-purple-700 rounded-xl text-sm font-medium hover:bg-purple-100 transition-colors">
              <Plus className="w-4 h-4" /><Package className="w-4 h-4" />Add Part
            </button>
          </div>

          {/* Labor presets toggle */}
          <button onClick={() => setShowPresets(o => !o)}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-jdr-slate text-xs hover:text-jdr-navy border border-dashed border-gray-300 rounded-xl transition-colors">
            {showPresets ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            Labor Presets
          </button>

          {showPresets && (
            <div className="grid grid-cols-1 gap-1.5">
              {LABOR_PRESETS.map(p => (
                <button key={p.label} onClick={() => addPreset(p)}
                  className="flex items-center justify-between px-4 py-2.5 bg-jdr-cream border border-gray-200 rounded-xl hover:bg-white transition-colors">
                  <span className="text-jdr-navy text-sm font-medium">{p.label}</span>
                  <span className="text-jdr-slate text-sm font-mono">${(p.hours * p.rate).toFixed(0)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="jdr-card p-4">
          <label className="jdr-label">Estimate Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Additional notes for the manager reviewing this estimate…"
            rows={3} className="jdr-input resize-none text-sm" />
        </div>

        {/* Totals */}
        {lines.length > 0 && (
          <div className="jdr-card p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-3">Estimate Summary</p>
            <div className="space-y-2">
              {laborTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-jdr-slate flex items-center gap-1"><Wrench className="w-3.5 h-3.5" /> Labor</span>
                  <span className="font-mono text-jdr-navy">${laborTotal.toFixed(2)}</span>
                </div>
              )}
              {partsTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-jdr-slate flex items-center gap-1"><Package className="w-3.5 h-3.5" /> Parts</span>
                  <span className="font-mono text-jdr-navy">${partsTotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm border-t border-gray-100 pt-2">
                <span className="text-jdr-slate">Subtotal</span>
                <span className="font-mono text-jdr-navy">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-jdr-slate">Tax (8.75%)</span>
                <span className="font-mono text-jdr-navy">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t-2 border-jdr-navy pt-2 mt-1">
                <span className="text-jdr-navy">Total</span>
                <span className="font-mono text-jdr-navy">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <button onClick={handleSave}
          className={clsx("w-full py-3.5 rounded-xl font-semibold text-sm transition-all",
            saved ? "bg-green-600 text-white" : "jdr-btn-gold"
          )}>
          {saved ? "✓ Saved — Opening Final Review…" : "Save Estimate & Continue to Submit"}
        </button>
      </div>
    </div>
  );
}
