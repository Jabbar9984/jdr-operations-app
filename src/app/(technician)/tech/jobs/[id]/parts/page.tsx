"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getJob, getAppliance, getPartsForBrand, searchParts } from "@/lib/mock-data";
import { getSession } from "@/lib/auth";
import { getWorkflowState } from "@/lib/store";
import WorkflowHeader from "@/components/tech/WorkflowHeader";
import WorkflowNav from "@/components/tech/WorkflowNav";
import type { OEMPart, PartAvailability, JobWorkflowState } from "@/types";
import { Package, Search, Plus, Check, ChevronDown, ChevronUp, AlertCircle, Clock, Truck } from "lucide-react";
import { clsx } from "clsx";

const AVAIL_CONFIG: Record<PartAvailability, { label: string; color: string; icon: React.ElementType }> = {
  in_stock: { label: "In Stock", color: "bg-green-50 text-green-700 border-green-200", icon: Check },
  order_2_3_days: { label: "2–3 Days", color: "bg-blue-50 text-blue-700 border-blue-200", icon: Clock },
  order_1_week: { label: "~1 Week", color: "bg-orange-50 text-orange-700 border-orange-200", icon: Truck },
  special_order: { label: "Special Order", color: "bg-red-50 text-red-700 border-red-200", icon: AlertCircle },
};

const CATEGORIES = ["All", "Motors & Fans", "Heating Elements", "Electronics & Control Boards", "Sensors & Probes", "Ignition System", "Water System", "Defrost System", "Seals & Gaskets", "Compressor & Refrigeration", "Gas System", "Refrigerants", "Pumps & Motors", "Controls & Thermostats"];

function PartCard({ part, onAdd, added }: { part: OEMPart; onAdd: (p: OEMPart) => void; added: boolean }) {
  const [open, setOpen] = useState(false);
  const avail = AVAIL_CONFIG[part.availability];
  const AvailIcon = avail.icon;

  return (
    <div className={clsx("jdr-card overflow-hidden border transition-all", added ? "border-jdr-gold/50 bg-amber-50/30" : "")}>
      <div className="flex items-start gap-3 p-4">
        <div className="w-10 h-10 rounded-xl bg-jdr-cream border border-gray-200 flex items-center justify-center flex-shrink-0">
          <Package className="w-5 h-5 text-jdr-navy" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-jdr-navy text-sm leading-snug">{part.description}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="font-mono text-jdr-slate text-xs">#{part.partNumber}</span>
            {part.oemPartNumber && <span className="text-gray-400 text-xs">OEM: {part.oemPartNumber}</span>}
          </div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={clsx("jdr-badge border text-[10px]", avail.color)}>
              <AvailIcon className="w-2.5 h-2.5 mr-0.5" />{avail.label}
            </span>
            <span className="jdr-badge bg-gray-100 text-gray-600 border border-gray-200 text-[10px]">{part.category}</span>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-jdr-navy font-bold text-base">${part.unitCost}</p>
          <button onClick={() => onAdd(part)}
            className={clsx("mt-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
              added ? "bg-jdr-gold text-jdr-navy" : "bg-jdr-navy text-white hover:bg-jdr-navy-light"
            )}>
            {added ? "✓ Added" : "+ Add"}
          </button>
        </div>
      </div>

      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-4 pb-3 text-jdr-slate text-xs hover:text-jdr-navy transition-colors">
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {open ? "Less info" : "More details"}
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-3">
          {part.compatibleModels.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-jdr-slate mb-1.5">Compatible Models</p>
              <div className="flex flex-wrap gap-1.5">
                {part.compatibleModels.map(m => (
                  <span key={m} className="jdr-badge bg-jdr-cream text-jdr-navy border border-gray-200 text-xs">{m}</span>
                ))}
              </div>
            </div>
          )}
          {part.notes && (
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
              <div className="flex gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-700 text-xs">{part.notes}</p>
              </div>
            </div>
          )}
          {part.weight && (
            <p className="text-jdr-slate text-xs">Weight: {part.weight}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function PartsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [workflow, setWorkflow] = useState<JobWorkflowState | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [results, setResults] = useState<OEMPart[]>([]);
  const [jobParts, setJobParts] = useState<OEMPart[]>([]);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"job" | "search">("job");

  const job = getJob(id);
  const appliance = job ? getAppliance(job.applianceId) : null;

  useEffect(() => {
    const session = getSession();
    if (!session) { router.replace("/login"); return; }
    setWorkflow(getWorkflowState(id));
    if (appliance) {
      setJobParts(getPartsForBrand(appliance.brand, appliance.type));
    }
  }, [id, appliance, router]);

  useEffect(() => {
    if (query.trim().length >= 2) {
      setResults(searchParts(query));
    } else if (query.trim() === "") {
      setResults([]);
    }
  }, [query]);

  function handleAdd(part: OEMPart) {
    setAddedIds(prev => {
      const n = new Set(prev);
      n.has(part.id) ? n.delete(part.id) : n.add(part.id);
      return n;
    });
  }

  const filteredJobParts = category === "All"
    ? jobParts
    : jobParts.filter(p => p.category === category);

  const availCategories = ["All", ...Array.from(new Set(jobParts.map(p => p.category)))];

  if (!job) return null;

  return (
    <div className="pb-8">
      <WorkflowHeader job={job} title="OEM Parts Finder" backHref={`/tech/jobs/${id}`} />

      <div className="px-4 py-4 space-y-4">
        {workflow && <WorkflowNav jobId={id} state={workflow} compact />}

        {/* Added count */}
        {addedIds.size > 0 && (
          <div className="bg-jdr-gold/20 border border-jdr-gold/40 rounded-xl p-3 flex items-center justify-between">
            <span className="text-jdr-navy font-semibold text-sm">{addedIds.size} part{addedIds.size !== 1 ? "s" : ""} selected for estimate</span>
            <button onClick={() => setAddedIds(new Set())} className="text-jdr-slate text-xs hover:text-red-500">Clear</button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2">
          {(["job", "search"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={clsx("px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize",
                activeTab === tab ? "bg-jdr-navy text-white" : "bg-white text-jdr-slate border border-gray-200 hover:bg-jdr-cream"
              )}>
              {tab === "job" ? `${appliance?.brand ?? "Job"} Parts (${jobParts.length})` : "Search All"}
            </button>
          ))}
        </div>

        {activeTab === "search" ? (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search by part number, description, brand, model…"
                className="jdr-input pl-9 text-sm" />
            </div>
            {results.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-jdr-slate font-medium">{results.length} result{results.length !== 1 ? "s" : ""}</p>
                {results.map(p => <PartCard key={p.id} part={p} onAdd={handleAdd} added={addedIds.has(p.id)} />)}
              </div>
            ) : query.length >= 2 ? (
              <div className="jdr-card p-8 text-center">
                <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-jdr-navy font-semibold">No Parts Found</p>
                <p className="text-jdr-slate text-sm mt-1">Try a different search term or part number</p>
              </div>
            ) : (
              <div className="jdr-card p-6 text-center text-jdr-slate text-sm">
                Enter at least 2 characters to search
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Category filter */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {availCategories.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={clsx("flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                    category === cat ? "bg-jdr-navy text-white border-jdr-navy" : "bg-white text-jdr-slate border-gray-200 hover:border-gray-300"
                  )}>
                  {cat}
                </button>
              ))}
            </div>

            {filteredJobParts.length === 0 ? (
              <div className="jdr-card p-8 text-center">
                <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-jdr-slate text-sm">No parts in this category</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredJobParts.map(p => (
                  <PartCard key={p.id} part={p} onAdd={handleAdd} added={addedIds.has(p.id)} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
