"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getJob, getAppliance, getDiagnosticGuide
} from "@/lib/mock-data";
import { getSession } from "@/lib/auth";
import { getSavedDiagnostic, saveDiagnostic, getSymptoms } from "@/lib/store";
import WorkflowHeader from "@/components/tech/WorkflowHeader";
import WorkflowNav from "@/components/tech/WorkflowNav";
import { getWorkflowState } from "@/lib/store";
import type { DiagnosticGuide, JobWorkflowState } from "@/types";
import {
  AlertTriangle, Info, CheckCircle, HelpCircle, ChevronDown, ChevronUp,
  ArrowRight, Wrench, ShieldAlert, Eye, FlaskConical, Zap, Star
} from "lucide-react";
import { clsx } from "clsx";

const LIKELIHOOD_CONFIG = {
  very_likely: { label: "Very Likely", color: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
  likely: { label: "Likely", color: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-400" },
  possible: { label: "Possible", color: "bg-yellow-50 text-yellow-700 border-yellow-200", dot: "bg-yellow-400" },
  unlikely: { label: "Unlikely", color: "bg-gray-50 text-gray-500 border-gray-200", dot: "bg-gray-400" },
};

const CONFIDENCE_COLOR = (c: number) =>
  c >= 80 ? "text-green-600" : c >= 60 ? "text-orange-500" : "text-gray-500";

const DIAG_STATUS_CONFIG = {
  confirmed: { icon: CheckCircle, color: "bg-green-50 border-green-300 text-green-800", badge: "bg-green-100 text-green-700 border-green-300", label: "Confirmed" },
  suspected: { icon: HelpCircle, color: "bg-amber-50 border-amber-300 text-amber-800", badge: "bg-amber-100 text-amber-700 border-amber-300", label: "Suspected" },
  ruled_out: { icon: CheckCircle, color: "bg-gray-50 border-gray-200 text-gray-500", badge: "bg-gray-100 text-gray-500 border-gray-200", label: "Ruled Out" },
};

function Section({ title, icon: Icon, children, defaultOpen = true, accent }: {
  title: string; icon?: React.ElementType; children: React.ReactNode;
  defaultOpen?: boolean; accent?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={clsx("jdr-card overflow-hidden", accent)}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-4 text-left">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-jdr-slate" />}
          <span className="font-bold text-jdr-navy text-sm">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export default function DiagnosePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [guide, setGuide] = useState<DiagnosticGuide | null>(null);
  const [workflow, setWorkflow] = useState<JobWorkflowState | null>(null);
  const [completedTests, setCompletedTests] = useState<Set<string>>(new Set());
  const [techNotes, setTechNotes] = useState("");
  const [confirmedDiag, setConfirmedDiag] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const job = getJob(id);
  const appliance = job ? getAppliance(job.applianceId) : null;

  useEffect(() => {
    const session = getSession();
    if (!session) { router.replace("/login"); return; }
    if (!job || !appliance) { setLoading(false); return; }

    const symptoms = getSymptoms(id);
    const keywords = [
      ...(symptoms?.observedSymptoms ?? []),
      ...(symptoms?.errorCodes ?? []),
      ...(job.reportedErrorCodes ?? []),
      job.description,
    ].join(" ").split(/\s+/);

    const found = getDiagnosticGuide(appliance.brand, appliance.type, keywords);
    setGuide(found);

    const saved = getSavedDiagnostic(id);
    if (saved) {
      setTechNotes(saved.techNotes);
      setConfirmedDiag(saved.confirmedDiagnosis);
      setCompletedTests(new Set(saved.completedTests));
    } else if (found?.confirmedDiagnosis) {
      setConfirmedDiag(found.confirmedDiagnosis);
    }

    setWorkflow(getWorkflowState(id));
    setLoading(false);
  }, [id, job, appliance, router]);

  function toggleTest(testId: string) {
    setCompletedTests(prev => {
      const n = new Set(prev);
      n.has(testId) ? n.delete(testId) : n.add(testId);
      return n;
    });
  }

  function handleSave() {
    if (!guide) return;
    saveDiagnostic(id, {
      jobId: id,
      guideId: guide.id,
      confirmedDiagnosis: confirmedDiag,
      techNotes,
      completedTests: Array.from(completedTests),
      savedAt: new Date().toISOString(),
    });
    setWorkflow(getWorkflowState(id));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading || !job) return <div className="min-h-dvh flex items-center justify-center"><div className="w-8 h-8 border-2 border-jdr-navy border-t-transparent rounded-full animate-spin" /></div>;

  if (!guide) {
    return (
      <div>
        <WorkflowHeader job={job} title="Diagnostic Assistant" backHref={`/tech/jobs/${id}`} />
        <div className="px-4 py-6">
          {workflow && <div className="mb-4"><WorkflowNav jobId={id} state={workflow} compact /></div>}
          <div className="jdr-card p-8 text-center">
            <HelpCircle className="w-10 h-10 text-jdr-slate mx-auto mb-3" />
            <p className="text-jdr-navy font-semibold mb-1">No Diagnostic Guide Available</p>
            <p className="text-jdr-slate text-sm">No structured guide found for {appliance?.brand} {appliance?.type}. Document findings manually in the service report.</p>
          </div>
        </div>
      </div>
    );
  }

  const confirmedDiagnoses = guide.suspectedDiagnoses.filter(d => d.status === "confirmed");
  const suspectedDiagnoses = guide.suspectedDiagnoses.filter(d => d.status === "suspected");
  const ruled_out = guide.suspectedDiagnoses.filter(d => d.status === "ruled_out");

  return (
    <div className="pb-8">
      <WorkflowHeader job={job} title="Diagnostic Assistant" backHref={`/tech/jobs/${id}`} />

      <div className="px-4 py-4 space-y-4">
        {workflow && <WorkflowNav jobId={id} state={workflow} compact />}

        {/* Appliance context */}
        <div className="jdr-card p-3 bg-jdr-navy text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-sm">{appliance?.brand} {appliance?.model}</p>
              <p className="text-white/60 text-xs">{appliance?.type} · S/N {appliance?.serial}</p>
            </div>
            <div className="text-right">
              <p className="text-jdr-gold text-xs font-semibold">{guide.primarySymptom}</p>
            </div>
          </div>
        </div>

        {/* ── SAFETY WARNINGS ── */}
        <div className="bg-red-50 border border-red-300 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="font-bold text-red-700 text-sm uppercase tracking-wide">Safety Warnings</span>
          </div>
          <div className="space-y-2">
            {guide.safetyWarnings.map((w, i) => (
              <div key={i} className="flex gap-2.5">
                <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">{i + 1}</div>
                <p className="text-red-800 text-sm leading-relaxed">{w}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── MISSING INFORMATION ── */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span className="font-bold text-amber-700 text-sm uppercase tracking-wide">Missing Information — Confirm Before Proceeding</span>
          </div>
          <div className="space-y-2">
            {guide.missingInfo.map((m, i) => (
              <div key={i} className="flex gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-2" />
                <p className="text-amber-800 text-sm leading-relaxed">{m}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── DIAGNOSIS SECTIONS ── */}
        <Section title="Confirmed Diagnosis" icon={CheckCircle} accent="border-green-200">
          {confirmedDiagnoses.length > 0 ? confirmedDiagnoses.map(d => (
            <div key={d.diagnosis} className="bg-green-50 border border-green-200 rounded-xl p-4 mb-2">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="font-bold text-green-800 text-sm leading-snug">{d.diagnosis}</p>
                <span className={clsx("jdr-badge border flex-shrink-0", DIAG_STATUS_CONFIG.confirmed.badge)}>Confirmed</span>
              </div>
              <p className="text-green-700 text-xs leading-relaxed">{d.reason}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className={clsx("text-sm font-bold", CONFIDENCE_COLOR(d.confidence))}>{d.confidence}%</span>
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: `${d.confidence}%` }} />
                </div>
                <span className="text-xs text-green-600 font-medium">Confidence</span>
              </div>
            </div>
          )) : (
            <p className="text-jdr-slate text-sm italic">No confirmed diagnosis yet — complete tests below to confirm.</p>
          )}
        </Section>

        <Section title="Suspected Diagnosis" icon={HelpCircle} accent="border-amber-200">
          {suspectedDiagnoses.map(d => (
            <div key={d.diagnosis} className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-2">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="font-bold text-amber-800 text-sm leading-snug">{d.diagnosis}</p>
                <span className={clsx("jdr-badge border flex-shrink-0", DIAG_STATUS_CONFIG.suspected.badge)}>Suspected</span>
              </div>
              <p className="text-amber-700 text-xs leading-relaxed">{d.reason}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className={clsx("text-sm font-bold", CONFIDENCE_COLOR(d.confidence))}>{d.confidence}%</span>
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: `${d.confidence}%` }} />
                </div>
                <span className="text-xs text-amber-600 font-medium">Confidence</span>
              </div>
            </div>
          ))}
        </Section>

        {guide.additionalTestsRequired.length > 0 && (
          <Section title="Additional Testing Required" icon={FlaskConical} accent="border-blue-200">
            <div className="space-y-2">
              {guide.additionalTestsRequired.map((t, i) => (
                <div key={i} className="flex gap-2.5 bg-blue-50 rounded-lg p-3">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">{i + 1}</div>
                  <p className="text-blue-800 text-sm leading-relaxed">{t}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── POSSIBLE CAUSES ── */}
        <Section title="Possible Causes — Priority Order" icon={Zap}>
          <div className="space-y-3">
            {guide.possibleCauses.map((cause, i) => {
              const cfg = LIKELIHOOD_CONFIG[cause.likelihood];
              return (
                <div key={i} className="bg-white border border-gray-100 rounded-xl p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-jdr-navy text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">{cause.priority}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-semibold text-jdr-navy text-sm">{cause.cause}</p>
                        <span className={clsx("jdr-badge border", cfg.color)}>{cfg.label}</span>
                      </div>
                      <p className="text-jdr-slate text-xs leading-relaxed">{cause.evidence}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* ── STEP-BY-STEP TESTS ── */}
        <Section title="Step-by-Step Tests" icon={FlaskConical}>
          <div className="space-y-4">
            {guide.tests.map((test, i) => {
              const done = completedTests.has(test.id);
              return (
                <div key={test.id} className={clsx("rounded-xl border overflow-hidden transition-all", done ? "border-green-200 bg-green-50/30" : "border-gray-200 bg-white")}>
                  <div className="flex items-start gap-3 p-4">
                    <button
                      onClick={() => toggleTest(test.id)}
                      className={clsx("w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition-all",
                        done ? "bg-green-600 border-green-600 text-white" : "bg-white border-gray-300 text-gray-400 hover:border-jdr-gold"
                      )}>
                      {done ? <CheckCircle className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className={clsx("font-bold text-sm", done ? "text-green-700" : "text-jdr-navy")}>{test.name}</p>
                        <span className="jdr-badge bg-gray-100 text-gray-600 border border-gray-200 text-[10px] flex-shrink-0">{test.tool}</span>
                      </div>

                      {test.safetyNote && (
                        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3 flex gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                          <p className="text-red-700 text-xs">{test.safetyNote}</p>
                        </div>
                      )}

                      <div className="mb-3">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-jdr-slate mb-1.5">Procedure</p>
                        <div className="space-y-1">
                          {test.procedure.map((step, si) => (
                            <div key={si} className="flex gap-2">
                              <span className="text-jdr-gold font-bold text-xs flex-shrink-0 w-4">{si + 1}.</span>
                              <p className="text-jdr-navy text-xs leading-relaxed">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-2">
                          <p className="text-blue-600 font-semibold mb-0.5 text-[10px] uppercase">Expected Reading</p>
                          <p className="text-blue-800 font-mono font-bold">{test.expectedReading}</p>
                          {test.normalRange && <p className="text-blue-600 text-[10px] mt-0.5">Range: {test.normalRange}</p>}
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-lg p-2">
                          <p className="text-gray-600 font-semibold mb-0.5 text-[10px] uppercase">Result Interpretation</p>
                          <p className="text-green-700 text-[10px] leading-snug mb-1"><span className="font-bold">PASS:</span> {test.passResult.slice(0, 60)}{test.passResult.length > 60 ? "…" : ""}</p>
                          <p className="text-red-600 text-[10px] leading-snug"><span className="font-bold">FAIL:</span> {test.failResult.slice(0, 60)}{test.failResult.length > 60 ? "…" : ""}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-jdr-slate text-xs mt-3 text-center">Tap each test to mark it complete</p>
        </Section>

        {/* ── LIKELY PARTS ── */}
        <Section title="Likely Parts Required" icon={Wrench}>
          <div className="space-y-2">
            {guide.likelyParts.map(part => (
              <div key={part.partNumber} className={clsx(
                "flex items-start gap-3 p-3 rounded-xl border",
                part.priority === "required" ? "border-red-200 bg-red-50" :
                part.priority === "likely" ? "border-orange-200 bg-orange-50" :
                "border-gray-200 bg-white"
              )}>
                <div className={clsx("w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1",
                  part.priority === "required" ? "bg-red-500" :
                  part.priority === "likely" ? "bg-orange-400" : "bg-gray-400"
                )} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-jdr-navy text-sm">{part.description}</p>
                    <span className="text-[10px] font-mono text-jdr-slate">#{part.partNumber}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={clsx("jdr-badge text-[10px]",
                      part.priority === "required" ? "bg-red-100 text-red-700 border border-red-200" :
                      part.priority === "likely" ? "bg-orange-100 text-orange-700 border border-orange-200" :
                      "bg-gray-100 text-gray-600 border border-gray-200"
                    )}>{part.priority.toUpperCase()}</span>
                    <span className={clsx("jdr-badge text-[10px]",
                      part.availability === "in_stock" ? "bg-green-100 text-green-700 border border-green-200" :
                      part.availability === "order_2_3_days" ? "bg-blue-100 text-blue-700 border border-blue-200" :
                      "bg-purple-100 text-purple-700 border border-purple-200"
                    )}>{part.availability.replace(/_/g, " ")}</span>
                    <span className="text-jdr-navy font-bold text-sm ml-auto">${part.estimatedCost}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── RECOMMENDED ACTION ── */}
        <div className="bg-jdr-navy rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowRight className="w-4 h-4 text-jdr-gold" />
            <span className="text-white font-bold text-sm">Recommended Next Action</span>
          </div>
          <p className="text-white/80 text-sm leading-relaxed">{guide.recommendedNextAction}</p>
          {guide.techNotes && (
            <div className="mt-3 border-t border-white/10 pt-3">
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wide mb-1">Tech Notes</p>
              <p className="text-white/70 text-xs leading-relaxed">{guide.techNotes}</p>
            </div>
          )}
        </div>

        {/* ── TECH'S CONFIRMED DIAGNOSIS ── */}
        <div className="jdr-card p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-2">Your Confirmed Diagnosis</p>
          <textarea
            value={confirmedDiag}
            onChange={e => setConfirmedDiag(e.target.value)}
            placeholder="Enter your confirmed diagnosis after completing tests…"
            rows={3}
            className="jdr-input resize-none text-sm mb-3"
          />
          <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-2">Technical Notes</p>
          <textarea
            value={techNotes}
            onChange={e => setTechNotes(e.target.value)}
            placeholder="Additional findings, observations, or notes for the service report…"
            rows={3}
            className="jdr-input resize-none text-sm mb-3"
          />
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={!confirmedDiag.trim()}
              className={clsx(
                "flex-1 py-3 rounded-lg font-semibold text-sm transition-all",
                saved ? "bg-green-600 text-white" :
                "jdr-btn-gold disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {saved ? "✓ Saved" : "Save Diagnosis"}
            </button>
            <span className="text-xs text-jdr-slate">{completedTests.size}/{guide.tests.length} tests done</span>
          </div>
        </div>
      </div>
    </div>
  );
}
