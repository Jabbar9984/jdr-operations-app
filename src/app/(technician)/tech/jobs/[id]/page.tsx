"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getJob, getCustomer, getAppliance, getEstimate } from "@/lib/mock-data";
import { getWorkflowState } from "@/lib/store";
import { getSession } from "@/lib/auth";
import WorkflowHeader from "@/components/tech/WorkflowHeader";
import WorkflowNav from "@/components/tech/WorkflowNav";
import { StatusBadge, PriorityBadge, TierBadge } from "@/components/ui/StatusBadge";
import type { JobWorkflowState } from "@/types";
import {
  MapPin, Clock, Phone, User, Wrench, AlertCircle, CheckCircle,
  Calendar, ChevronRight, Navigation, Star, DollarSign, Shield,
  Stethoscope, Gauge, Camera, BookOpen, Package, FileText, Calculator, SendHorizonal,
} from "lucide-react";
import { clsx } from "clsx";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

const WORKFLOW_STEPS = [
  { key: "symptomsRecorded", label: "Symptoms", icon: FileText, path: "/symptoms", desc: "Record complaint & symptoms" },
  { key: "diagnosticCompleted", label: "Diagnose", icon: Stethoscope, path: "/diagnose", desc: "Run diagnostic assistant" },
  { key: "readingsRecorded", label: "Readings", icon: Gauge, path: "/readings", desc: "Log meter readings" },
  { key: "photosAdded", label: "Photos", icon: Camera, path: "/photos", desc: "Attach photos" },
  { key: "reportCompleted", label: "Report", icon: FileText, path: "/report", desc: "Build service report" },
  { key: "estimateBuilt", label: "Estimate", icon: Calculator, path: "/estimate", desc: "Create estimate" },
  { key: "submitted", label: "Submit", icon: SendHorizonal, path: "/submit", desc: "Submit for approval" },
];

const TOOL_SHORTCUTS = [
  { label: "Service Manuals", icon: BookOpen, path: "/manuals", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { label: "OEM Parts Finder", icon: Package, path: "/parts", color: "bg-purple-50 text-purple-700 border-purple-200" },
];

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [workflow, setWorkflow] = useState<JobWorkflowState | null>(null);

  const job = getJob(id);

  useEffect(() => {
    // Auth check
    const session = getSession();
    if (!session) { router.replace("/login"); return; }
    // Ownership check — technicians only see their jobs
    if (session.role === "technician" && job && job.technicianId !== session.userId) {
      router.replace("/tech/jobs");
      return;
    }
    setWorkflow(getWorkflowState(id));
  }, [id, job, router]);

  if (!job) {
    return (
      <div className="p-8 text-center text-jdr-slate">
        <p className="text-lg font-semibold mb-2">Job not found</p>
        <Link href="/tech/jobs" className="text-jdr-navy font-medium">← Back to Jobs</Link>
      </div>
    );
  }

  const customer = getCustomer(job.customerId);
  const appliance = getAppliance(job.applianceId);
  const estimate = job.estimateId ? getEstimate(job.estimateId) : null;

  const completedSteps = workflow
    ? WORKFLOW_STEPS.filter(s => workflow[s.key as keyof JobWorkflowState]).length
    : 0;
  const progress = Math.round((completedSteps / WORKFLOW_STEPS.length) * 100);

  const canStartWork = ["in_progress", "en_route", "scheduled"].includes(job.status);

  return (
    <div className="pb-8">
      <WorkflowHeader job={job} backHref="/tech/jobs" />

      <div className="px-4 py-4 space-y-5">

        {/* Priority & tags */}
        <div className="flex flex-wrap gap-2">
          <PriorityBadge priority={job.priority} />
          {job.tags?.map(tag => (
            <span key={tag} className="jdr-badge bg-gray-100 text-gray-600 border border-gray-200">{tag}</span>
          ))}
        </div>

        {/* Schedule card */}
        <div className="jdr-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-jdr-slate text-xs font-semibold uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5" />Schedule
            </div>
            <span className="text-jdr-navy font-semibold text-sm">{formatDate(job.scheduledAt)}</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-jdr-slate">
              <Clock className="w-4 h-4" />{formatTime(job.scheduledAt)}
            </div>
            <div className="flex items-center gap-1.5 text-jdr-slate">
              <span className="text-jdr-slate">~{job.estimatedDuration}m</span>
            </div>
          </div>
        </div>

        {/* Customer */}
        {customer && (
          <div className="jdr-card p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-jdr-navy/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-jdr-navy" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-jdr-navy font-semibold text-sm">{customer.name}</p>
                    <TierBadge tier={customer.tier} />
                  </div>
                  <p className="text-jdr-slate text-xs">{customer.email}</p>
                </div>
              </div>
              <a href={`tel:${customer.phone}`}
                className="flex items-center gap-1.5 bg-jdr-navy text-white text-xs font-medium rounded-lg px-3 py-1.5">
                <Phone className="w-3.5 h-3.5" />Call
              </a>
            </div>
            {customer.notes && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-800 text-xs leading-relaxed">{customer.notes}</p>
              </div>
            )}
            <div className="mt-3 flex items-start gap-1.5 text-jdr-slate text-xs">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>{job.address.street}, {job.address.city}, {job.address.state} {job.address.zip}</span>
            </div>
            <a href={`https://maps.apple.com/?address=${encodeURIComponent(`${job.address.street}, ${job.address.city}, ${job.address.state} ${job.address.zip}`)}`}
              className="mt-2 flex items-center gap-2 text-jdr-navy text-xs font-medium hover:text-jdr-gold transition-colors">
              <Navigation className="w-3.5 h-3.5" />Open in Maps
            </a>
          </div>
        )}

        {/* Appliance */}
        {appliance && (
          <div className="jdr-card p-4">
            <div className="flex items-center gap-2 text-jdr-slate text-xs font-semibold uppercase tracking-widest mb-3">
              <Wrench className="w-3.5 h-3.5" />Appliance
            </div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <p className="text-jdr-navy font-bold text-base">{appliance.brand} {appliance.model}</p>
                <p className="text-jdr-slate text-sm">{appliance.type}</p>
              </div>
              {appliance.warrantyExpiry && (
                <div className={clsx(
                  "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg border",
                  new Date(appliance.warrantyExpiry) > new Date()
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-600 border-red-200"
                )}>
                  <Shield className="w-3 h-3" />
                  {new Date(appliance.warrantyExpiry) > new Date() ? "In Warranty" : "Expired"}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: "Serial #", value: appliance.serial },
                { label: "Installed", value: new Date(appliance.installDate).toLocaleDateString() },
                appliance.voltage ? { label: "Voltage", value: appliance.voltage } : null,
                appliance.amperage ? { label: "Amperage", value: appliance.amperage } : null,
                appliance.refrigerant ? { label: "Refrigerant", value: appliance.refrigerant } : null,
                appliance.lastServiced ? { label: "Last Serviced", value: new Date(appliance.lastServiced).toLocaleDateString() } : null,
              ].filter(Boolean).map(item => (
                <div key={item!.label} className="bg-jdr-cream rounded-lg px-2.5 py-2">
                  <p className="text-jdr-slate text-[10px] uppercase tracking-wide">{item!.label}</p>
                  <p className="text-jdr-navy font-semibold mt-0.5">{item!.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customer complaint */}
        {job.customerComplaint && (
          <div className="jdr-card p-4">
            <div className="flex items-center gap-2 text-jdr-slate text-xs font-semibold uppercase tracking-widest mb-2">
              Customer Complaint
            </div>
            <p className="text-jdr-navy text-sm leading-relaxed italic">"{job.customerComplaint}"</p>
          </div>
        )}

        {/* Service description */}
        <div className="jdr-card p-4">
          <div className="flex items-center gap-2 text-jdr-slate text-xs font-semibold uppercase tracking-widest mb-2">
            Work Order
          </div>
          <p className="text-jdr-navy text-sm leading-relaxed">{job.description}</p>
          {job.reportedErrorCodes && job.reportedErrorCodes.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {job.reportedErrorCodes.map(code => (
                <span key={code} className="jdr-badge bg-red-50 text-red-700 border border-red-200 font-mono">{code}</span>
              ))}
            </div>
          )}
        </div>

        {/* Workflow progress */}
        {canStartWork && workflow && (
          <div className="jdr-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-jdr-slate text-xs font-semibold uppercase tracking-widest">
                Workflow Progress
              </div>
              <span className="text-jdr-navy font-bold text-sm">{completedSteps}/{WORKFLOW_STEPS.length}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-4 overflow-hidden">
              <div className="h-full bg-jdr-navy rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }} />
            </div>
            <div className="space-y-2">
              {WORKFLOW_STEPS.map((step, i) => {
                const done = workflow[step.key as keyof JobWorkflowState] as boolean;
                const href = `/tech/jobs/${id}${step.path}`;
                const isNext = !done && WORKFLOW_STEPS.slice(0, i).every(s => workflow[s.key as keyof JobWorkflowState]);
                return (
                  <Link key={step.key} href={href}
                    className={clsx(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all",
                      done ? "border-green-200 bg-green-50" :
                      isNext ? "border-jdr-gold bg-amber-50 ring-1 ring-jdr-gold/30" :
                      "border-gray-100 bg-white hover:bg-jdr-cream"
                    )}>
                    <div className={clsx(
                      "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold",
                      done ? "bg-green-600 text-white" :
                      isNext ? "bg-jdr-gold text-jdr-navy" :
                      "bg-gray-100 text-gray-500"
                    )}>
                      {done ? <CheckCircle className="w-4 h-4" /> : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={clsx("font-semibold text-sm", done ? "text-green-700" : isNext ? "text-jdr-navy" : "text-jdr-slate")}>
                        {step.label}
                      </p>
                      <p className="text-xs text-jdr-slate">{step.desc}</p>
                    </div>
                    <ChevronRight className={clsx("w-4 h-4", done ? "text-green-400" : "text-gray-300")} />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Tool shortcuts */}
        {canStartWork && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-3">Reference Tools</p>
            <div className="grid grid-cols-2 gap-3">
              {TOOL_SHORTCUTS.map(tool => (
                <Link key={tool.label} href={`/tech/jobs/${id}${tool.path}`}
                  className={clsx("jdr-card flex items-center gap-3 p-4 border hover:shadow-jdr-md transition-all", tool.color)}>
                  <tool.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-semibold text-sm">{tool.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Existing estimate */}
        {estimate && (
          <div className="jdr-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-jdr-slate text-xs font-semibold uppercase tracking-widest">
                <DollarSign className="w-3.5 h-3.5" />Estimate on File
              </div>
              <span className={clsx("jdr-badge", estimate.status === "approved" ? "bg-green-50 text-green-700 border border-green-200" : estimate.status === "pending_approval" ? "bg-orange-50 text-orange-700 border border-orange-200" : "bg-gray-50 text-gray-600 border border-gray-200")}>
                {estimate.status.replace("_", " ")}
              </span>
            </div>
            <p className="text-jdr-navy font-bold text-2xl">${estimate.total.toLocaleString()}</p>
            <p className="text-jdr-slate text-xs mt-1">{estimate.laborHours}h labor + {estimate.parts.length} parts</p>
          </div>
        )}

        {/* Completed state */}
        {job.status === "completed" && (
          <div className="jdr-card p-4 bg-green-50 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-semibold">Job Completed</span>
            </div>
            {job.resolution && <p className="text-green-700 text-sm leading-relaxed">{job.resolution}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
