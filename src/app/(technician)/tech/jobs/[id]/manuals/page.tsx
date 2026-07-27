"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getJob, getAppliance, getManualsForAppliance, SERVICE_MANUALS } from "@/lib/mock-data";
import { getSession } from "@/lib/auth";
import { getWorkflowState } from "@/lib/store";
import WorkflowHeader from "@/components/tech/WorkflowHeader";
import WorkflowNav from "@/components/tech/WorkflowNav";
import type { ServiceManual, ManualType, JobWorkflowState } from "@/types";
import { BookOpen, FileText, Zap, Package, Settings, ChevronDown, ChevronUp, Download, ExternalLink, Search } from "lucide-react";
import { clsx } from "clsx";

const TYPE_CONFIG: Record<ManualType, { label: string; icon: React.ElementType; color: string }> = {
  service_manual: { label: "Service Manual", icon: BookOpen, color: "bg-blue-50 text-blue-700 border-blue-200" },
  tech_sheet: { label: "Tech Sheet", icon: FileText, color: "bg-green-50 text-green-700 border-green-200" },
  wiring_diagram: { label: "Wiring Diagram", icon: Zap, color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  parts_diagram: { label: "Parts Diagram", icon: Package, color: "bg-purple-50 text-purple-700 border-purple-200" },
  installation_guide: { label: "Installation Guide", icon: Settings, color: "bg-gray-50 text-gray-700 border-gray-200" },
};

function ManualCard({ manual }: { manual: ServiceManual }) {
  const [open, setOpen] = useState(false);
  const typeCfg = TYPE_CONFIG[manual.type];
  const TypeIcon = typeCfg.icon;

  return (
    <div className="jdr-card overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-start gap-3 p-4 text-left">
        <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border", typeCfg.color)}>
          <TypeIcon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-jdr-navy text-sm leading-snug">{manual.title}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={clsx("jdr-badge border text-[10px]", typeCfg.color)}>{typeCfg.label}</span>
            <span className="text-jdr-slate text-[10px]">{manual.pages} pages</span>
            <span className="text-jdr-slate text-[10px]">Rev. {manual.lastRevision}</span>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />}
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-gray-50 space-y-4">
          {/* Applicable models */}
          <div className="mt-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-jdr-slate mb-1.5">Applicable Models</p>
            <div className="flex flex-wrap gap-1.5">
              {manual.applicableModels.map(m => (
                <span key={m} className="jdr-badge bg-gray-100 text-gray-600 border border-gray-200 text-xs">{m}</span>
              ))}
            </div>
          </div>

          {/* Highlights */}
          {manual.highlights.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-jdr-slate mb-1.5">Key Highlights</p>
              <div className="space-y-1">
                {manual.highlights.map((h, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-jdr-gold flex-shrink-0 mt-1.5" />
                    <p className="text-jdr-navy text-xs">{h}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Table of contents */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-jdr-slate mb-1.5">Table of Contents</p>
            <div className="bg-jdr-cream rounded-xl p-3 space-y-1">
              {manual.sections.map((section, i) => (
                <div key={i} className="flex items-center gap-2.5 py-1.5 border-b border-gray-100 last:border-0">
                  <span className="text-jdr-slate text-xs w-5 flex-shrink-0">{i + 1}.</span>
                  <span className="text-jdr-navy text-xs">{section}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-jdr-navy text-white rounded-xl text-sm font-semibold">
              <ExternalLink className="w-4 h-4" />View Manual
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-jdr-slate text-sm hover:bg-jdr-cream transition-colors">
              <Download className="w-4 h-4" />PDF
            </button>
          </div>
          <p className="text-gray-300 text-[10px] text-center">Full manual access available on device (demo mode)</p>
        </div>
      )}
    </div>
  );
}

export default function ManualsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [workflow, setWorkflow] = useState<JobWorkflowState | null>(null);
  const [manuals, setManuals] = useState<ServiceManual[]>([]);
  const [allManuals, setAllManuals] = useState<ServiceManual[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"job" | "all">("job");

  const job = getJob(id);
  const appliance = job ? getAppliance(job.applianceId) : null;

  useEffect(() => {
    const session = getSession();
    if (!session) { router.replace("/login"); return; }
    if (appliance) {
      setManuals(getManualsForAppliance(appliance.brand, appliance.model));
    }
    setAllManuals(SERVICE_MANUALS);
    setWorkflow(getWorkflowState(id));
  }, [id, appliance, router]);

  const filtered = (activeTab === "job" ? manuals : allManuals).filter(m => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return m.title.toLowerCase().includes(q) ||
      m.brand.toLowerCase().includes(q) ||
      m.modelFamily.toLowerCase().includes(q) ||
      m.applicableModels.some(am => am.toLowerCase().includes(q));
  });

  if (!job) return null;

  return (
    <div className="pb-8">
      <WorkflowHeader job={job} title="Service Manuals" backHref={`/tech/jobs/${id}`} />

      <div className="px-4 py-4 space-y-4">
        {workflow && <WorkflowNav jobId={id} state={workflow} compact />}

        {/* Appliance context */}
        {appliance && (
          <div className="jdr-card p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-jdr-navy flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-jdr-navy text-sm">{appliance.brand} {appliance.model}</p>
              <p className="text-jdr-slate text-xs">{manuals.length} manual{manuals.length !== 1 ? "s" : ""} available for this unit</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2">
          {(["job", "all"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={clsx("px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                activeTab === tab ? "bg-jdr-navy text-white" : "bg-white text-jdr-slate border border-gray-200 hover:bg-jdr-cream"
              )}>
              {tab === "job" ? `For This Job (${manuals.length})` : `All Manuals (${allManuals.length})`}
            </button>
          ))}
        </div>

        {/* Search */}
        {activeTab === "all" && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by brand, model, title…"
              className="jdr-input pl-9 text-sm" />
          </div>
        )}

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="jdr-card p-10 text-center">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-jdr-navy font-semibold">No Manuals Found</p>
            <p className="text-jdr-slate text-sm mt-1">
              {activeTab === "job" ? `No manuals on file for ${appliance?.brand} ${appliance?.model}` : "Try a different search term"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(manual => (
              <ManualCard key={manual.id} manual={manual} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
