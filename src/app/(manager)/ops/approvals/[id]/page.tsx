"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { APPROVALS, getJob, getTechnician, getAppliance, getCustomer, getReviewPacket } from "@/lib/mock-data";
import { getSession } from "@/lib/auth";
import { logApprovalAction } from "@/lib/audit-store";
import PageHeader from "@/components/ui/PageHeader";
import { ApprovalBadge } from "@/components/ui/StatusBadge";
import {
  ChevronLeft,
  CheckCircle,
  XCircle,
  CornerUpLeft,
  Edit3,
  FileText,
  Package,
  Shield,
  Activity,
  Camera,
  ClipboardList,
  DollarSign,
  Globe,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  Wrench,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { clsx } from "clsx";
import type { ReviewPacket } from "@/types";

type Tab = "overview" | "symptoms" | "diagnostic" | "readings" | "photos" | "report" | "estimate" | "hcp";
const TABS: { id: Tab; label: string; icon: typeof FileText }[] = [
  { id: "overview", label: "Overview", icon: ClipboardList },
  { id: "symptoms", label: "Symptoms", icon: Activity },
  { id: "diagnostic", label: "Diagnostic", icon: Wrench },
  { id: "readings", label: "Readings", icon: Activity },
  { id: "photos", label: "Photos", icon: Camera },
  { id: "report", label: "Report", icon: FileText },
  { id: "estimate", label: "Estimate", icon: DollarSign },
  { id: "hcp", label: "HCP Changes", icon: Globe },
];

const RESULT_COLORS = { pass: "text-green-700 bg-green-50 border-green-200", fail: "text-red-700 bg-red-50 border-red-200", marginal: "text-amber-700 bg-amber-50 border-amber-200" };
const PHOTO_CATEGORY_LABELS: Record<string, string> = { before: "Before", after: "After", defect: "Defect", parts: "Parts", serial_number: "Serial #", meter_reading: "Meter Reading", other: "Other" };
const PHOTO_COLORS: Record<string, string> = { before: "bg-blue-100 text-blue-700", after: "bg-green-100 text-green-700", defect: "bg-red-100 text-red-700", parts: "bg-purple-100 text-purple-700", serial_number: "bg-gray-100 text-gray-700", meter_reading: "bg-amber-100 text-amber-700", other: "bg-slate-100 text-slate-700" };

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
}

export default function ApprovalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [session, setSession] = useState<{ userId: string; name: string; role: string } | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [localStatus, setLocalStatus] = useState<"pending" | "approved" | "rejected" | "returned">("pending");
  const [actionNote, setActionNote] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedNote, setEditedNote] = useState("");
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [actionTaken, setActionTaken] = useState<string | null>(null);

  useEffect(() => {
    const s = getSession();
    if (s) setSession(s);
  }, []);

  const approval = APPROVALS.find(a => a.id === id);
  if (!approval) {
    return (
      <div className="space-y-6">
        <PageHeader title="Approval Not Found" subtitle="" />
        <div className="jdr-card p-12 text-center text-jdr-slate">No approval found with ID: {id}</div>
      </div>
    );
  }

  const job = getJob(approval.jobId);
  const tech = getTechnician(approval.requestedBy);
  const appliance = job ? getAppliance(job.applianceId) : undefined;
  const customer = job ? getCustomer(job.customerId) : undefined;
  const packet = getReviewPacket(id);

  const isAlreadyReviewed = approval.status !== "pending";
  const effectiveStatus = isAlreadyReviewed ? approval.status : localStatus;

  // Capture for use inside closures (TS narrowing doesn't persist into function bodies)
  const approvalId = approval.id;
  const approvalLabel = approval.description;

  function doAction(action: "approved" | "rejected" | "returned") {
    const statusMap = { approved: "approved", rejected: "rejected", returned: "returned" } as const;
    setLocalStatus(statusMap[action]);
    setActionTaken(action);
    setShowActionPanel(false);
    if (session && !isAlreadyReviewed) {
      const auditAction = action === "approved" ? "approved" : action === "rejected" ? "rejected" : "returned_for_info";
      logApprovalAction({
        actorId: session.userId,
        actorName: session.name,
        action: auditAction,
        approvalId,
        approvalLabel,
        before: "pending",
        after: action,
        notes: actionNote || undefined,
      });
    }
  }

  const TYPE_BADGE: Record<string, string> = {
    estimate: "bg-blue-50 text-blue-700 border-blue-200",
    part_order: "bg-purple-50 text-purple-700 border-purple-200",
    warranty_claim: "bg-green-50 text-green-700 border-green-200",
  };
  const TYPE_ICON = approval.type === "estimate" ? <FileText className="w-4 h-4" /> : approval.type === "part_order" ? <Package className="w-4 h-4" /> : <Shield className="w-4 h-4" />;
  const TYPE_LABEL = approval.type === "estimate" ? "Estimate" : approval.type === "part_order" ? "Parts Order" : "Warranty Claim";

  const pendingActions = !isAlreadyReviewed && localStatus === "pending";

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link href="/ops/approvals" className="mt-1 p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-jdr-slate">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={clsx("jdr-badge border", TYPE_BADGE[approval.type])}>{TYPE_ICON}<span className="ml-1">{TYPE_LABEL}</span></span>
            {actionTaken ? (
              <span className={clsx("jdr-badge border font-semibold", actionTaken === "approved" ? "bg-green-50 text-green-700 border-green-300" : actionTaken === "rejected" ? "bg-red-50 text-red-700 border-red-300" : "bg-amber-50 text-amber-700 border-amber-300")}>
                {actionTaken === "approved" ? "✓ Approved" : actionTaken === "rejected" ? "✗ Rejected" : "↩ Returned for Info"}
              </span>
            ) : <ApprovalBadge status={approval.status} />}
          </div>
          <h1 className="text-xl font-bold text-jdr-navy leading-tight">{approval.description}</h1>
          <div className="flex items-center gap-3 mt-1 text-jdr-slate text-xs">
            {tech && <span className="flex items-center gap-1"><User className="w-3 h-3" />{tech.name}</span>}
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(approval.requestedAt)}</span>
            {approval.amount && <span className="font-semibold text-jdr-navy text-sm">${approval.amount.toLocaleString()}</span>}
          </div>
        </div>
      </div>

      {/* Action taken confirmation */}
      {actionTaken && (
        <div className={clsx("rounded-xl p-4 border flex items-center gap-3",
          actionTaken === "approved" ? "bg-green-50 border-green-200" :
          actionTaken === "rejected" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
        )}>
          {actionTaken === "approved" ? <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" /> :
           actionTaken === "rejected" ? <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" /> :
           <CornerUpLeft className="w-5 h-5 text-amber-600 flex-shrink-0" />}
          <div>
            <p className={clsx("font-semibold text-sm", actionTaken === "approved" ? "text-green-800" : actionTaken === "rejected" ? "text-red-800" : "text-amber-800")}>
              {actionTaken === "approved" ? "Approval confirmed — logged to audit trail" :
               actionTaken === "rejected" ? "Rejection recorded — technician will be notified" :
               "Returned for additional information — technician will be notified"}
            </p>
            {actionNote && <p className="text-xs mt-0.5 text-gray-600">Note: {actionNote}</p>}
          </div>
        </div>
      )}

      {/* Tab nav */}
      <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
        {TABS.filter(t => t.id === "overview" || packet || t.id === "hcp").map(({ id: tabId, label, icon: Icon }) => (
          <button
            key={tabId}
            onClick={() => setActiveTab(tabId)}
            className={clsx(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0",
              activeTab === tabId ? "bg-jdr-navy text-white" : "bg-white text-jdr-slate border border-gray-200 hover:bg-gray-50"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="space-y-4">
        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              {job && (
                <div className="jdr-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-jdr-slate mb-2">Job</p>
                  <p className="text-jdr-navy font-semibold text-sm">{job.title}</p>
                  <p className="text-jdr-slate text-xs mt-1">{job.address.city}, {job.address.state}</p>
                  <Link href={`/ops/jobs/${job.id}`} className="text-jdr-navy text-xs font-medium hover:text-jdr-gold mt-2 block">View job →</Link>
                </div>
              )}
              {customer && (
                <div className="jdr-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-jdr-slate mb-2">Customer</p>
                  <p className="text-jdr-navy font-semibold text-sm">{customer.name}</p>
                  <p className="text-jdr-slate text-xs mt-1 capitalize">{customer.tier} tier</p>
                  <p className="text-jdr-slate text-xs">{customer.phone}</p>
                </div>
              )}
              {appliance && (
                <div className="jdr-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-jdr-slate mb-2">Appliance</p>
                  <p className="text-jdr-navy font-semibold text-sm">{appliance.brand} {appliance.model}</p>
                  <p className="text-jdr-slate text-xs mt-1">{appliance.type} · S/N {appliance.serial}</p>
                  {appliance.warrantyExpiry && <p className="text-jdr-slate text-xs">Warranty exp: {appliance.warrantyExpiry}</p>}
                </div>
              )}
            </div>

            {!packet && (
              <div className="jdr-card p-6 text-center">
                <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-jdr-navy font-semibold text-sm">No Detailed Review Packet</p>
                <p className="text-jdr-slate text-xs mt-1">This approval was submitted without full tech findings attached.</p>
              </div>
            )}

            {packet && (
              <div className="jdr-card p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-jdr-slate mb-3">Technician Summary</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-jdr-slate mb-1 font-medium">Confirmed Diagnosis</p>
                    <p className="text-sm text-jdr-navy font-medium">{packet.diagnostic.confirmedDiagnosis}</p>
                  </div>
                  <div>
                    <p className="text-xs text-jdr-slate mb-1 font-medium">Work Performed</p>
                    <p className="text-sm text-jdr-navy">{packet.serviceReport.workPerformed}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100">
                    <div className="text-center">
                      <p className="text-jdr-navy font-bold text-lg">{packet.readings.length}</p>
                      <p className="text-jdr-slate text-xs">Readings</p>
                    </div>
                    <div className="text-center">
                      <p className="text-jdr-navy font-bold text-lg">{packet.photos.length}</p>
                      <p className="text-jdr-slate text-xs">Photos</p>
                    </div>
                    <div className="text-center">
                      <p className={clsx("font-bold text-lg", packet.readings.some(r => r.result === "fail") ? "text-red-600" : "text-green-600")}>
                        {packet.readings.filter(r => r.result === "fail").length} fail
                      </p>
                      <p className="text-jdr-slate text-xs">Failed tests</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {approval.notes && (
              <div className="jdr-card p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-jdr-slate mb-1">Existing Notes</p>
                <p className="text-jdr-navy text-sm">{approval.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Symptoms */}
        {activeTab === "symptoms" && packet && (
          <div className="jdr-card p-5 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-jdr-slate mb-1">Customer Complaint</p>
              <p className="text-jdr-navy text-sm italic">"{packet.symptoms.customerComplaint}"</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-jdr-slate mb-2">Observed Symptoms</p>
              <div className="flex flex-wrap gap-2">
                {packet.symptoms.observedSymptoms.map(s => (
                  <span key={s} className="jdr-badge bg-orange-50 text-orange-700 border border-orange-200">{s}</span>
                ))}
              </div>
            </div>
            {packet.symptoms.errorCodes.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-jdr-slate mb-2">Error Codes</p>
                <div className="flex flex-wrap gap-2">
                  {packet.symptoms.errorCodes.map(c => (
                    <span key={c} className="jdr-badge bg-red-50 text-red-700 border border-red-200 font-mono">{c}</span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-jdr-slate mb-1">Frequency</p>
              <p className="text-jdr-navy text-sm">{packet.symptoms.frequencyOfIssue}</p>
            </div>
            {packet.symptoms.additionalNotes && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-jdr-slate mb-1">Tech Notes</p>
                <p className="text-jdr-navy text-sm">{packet.symptoms.additionalNotes}</p>
              </div>
            )}
          </div>
        )}

        {/* Diagnostic */}
        {activeTab === "diagnostic" && packet && (
          <div className="space-y-4">
            <div className="jdr-card p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-jdr-slate mb-2">Confirmed Diagnosis</p>
              <p className="text-jdr-navy font-semibold text-sm">{packet.diagnostic.confirmedDiagnosis}</p>
            </div>
            <div className="jdr-card p-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-jdr-slate">Diagnoses Considered</p>
              {packet.diagnostic.suspectedDiagnoses.map((d, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className={clsx("jdr-badge border mt-0.5", d.status === "confirmed" ? "bg-green-50 text-green-700 border-green-200" : d.status === "ruled_out" ? "bg-gray-50 text-gray-500 border-gray-200" : "bg-amber-50 text-amber-700 border-amber-200")}>
                    {d.status.replace("_", " ")}
                  </span>
                  <div className="flex-1">
                    <p className="text-jdr-navy text-sm font-medium">{d.diagnosis}</p>
                    <p className="text-jdr-slate text-xs mt-0.5">{d.confidence}% confidence</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="jdr-card p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-jdr-slate mb-2">Tests Completed</p>
              <ul className="space-y-1">
                {packet.diagnostic.completedTests.map(t => (
                  <li key={t} className="flex items-center gap-2 text-sm text-jdr-navy">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />{t}
                  </li>
                ))}
              </ul>
            </div>
            {packet.diagnostic.techNotes && (
              <div className="jdr-card p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-jdr-slate mb-1">Tech Notes</p>
                <p className="text-jdr-navy text-sm">{packet.diagnostic.techNotes}</p>
              </div>
            )}
          </div>
        )}

        {/* Readings */}
        {activeTab === "readings" && packet && (
          <div className="jdr-card overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-jdr-slate">Meter Readings ({packet.readings.length})</p>
            </div>
            <div className="divide-y divide-gray-50">
              {packet.readings.map((r, i) => (
                <div key={i} className="flex items-center gap-3 p-4">
                  <div className={clsx("px-2 py-0.5 rounded-full text-xs font-semibold border", RESULT_COLORS[r.result])}>
                    {r.result.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-jdr-navy font-medium text-sm">{r.component}</p>
                    <p className="text-jdr-slate text-xs">{r.type} · Expected: {r.expectedValue}</p>
                  </div>
                  <div className="text-right">
                    <p className={clsx("font-bold text-sm", r.result === "fail" ? "text-red-600" : r.result === "marginal" ? "text-amber-600" : "text-green-700")}>
                      {r.measuredValue} {r.unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photos */}
        {activeTab === "photos" && packet && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {packet.photos.map((photo) => (
                <div key={photo.id} className="jdr-card overflow-hidden">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <Camera className="w-10 h-10 text-gray-300" />
                  </div>
                  <div className="p-3">
                    <span className={clsx("jdr-badge text-xs", PHOTO_COLORS[photo.category])}>{PHOTO_CATEGORY_LABELS[photo.category]}</span>
                    <p className="text-jdr-navy text-xs font-medium mt-1.5 leading-snug">{photo.caption}</p>
                    <p className="text-jdr-slate text-xs mt-0.5">{formatTime(photo.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-jdr-slate text-xs text-center">Photos stored in field device — thumbnails shown above are placeholders in demo mode.</p>
          </div>
        )}

        {/* Service Report */}
        {activeTab === "report" && packet && (
          <div className="jdr-card p-5 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-jdr-slate mb-1">Repair Type</p>
                <p className="text-jdr-navy text-sm font-medium capitalize">{packet.serviceReport.repairType.replace(/_/g, " ")}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-jdr-slate mb-1">Labor</p>
                <p className="text-jdr-navy text-sm font-medium">{packet.serviceReport.laborMinutes} min</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-jdr-slate mb-1">Work Performed</p>
              <p className="text-jdr-navy text-sm">{packet.serviceReport.workPerformed}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-jdr-slate mb-1">Outcome</p>
              <p className="text-jdr-navy text-sm">{packet.serviceReport.outcome}</p>
            </div>
            {packet.serviceReport.safetyConcerns && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-800 text-sm">{packet.serviceReport.safetyConcerns}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
              <div className={clsx("rounded-xl p-3 text-center", packet.serviceReport.followUpRequired ? "bg-orange-50" : "bg-green-50")}>
                <p className={clsx("font-semibold text-sm", packet.serviceReport.followUpRequired ? "text-orange-700" : "text-green-700")}>
                  {packet.serviceReport.followUpRequired ? "Follow-Up Required" : "No Follow-Up Needed"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-jdr-slate text-xs">Parts Replaced</p>
                <p className="text-jdr-navy font-semibold text-sm">{packet.serviceReport.partsReplaced.length === 0 ? "None (pending)" : packet.serviceReport.partsReplaced.join(", ")}</p>
              </div>
            </div>
          </div>
        )}

        {/* Estimate */}
        {activeTab === "estimate" && packet && (
          <div className="jdr-card overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-jdr-slate">Estimate Breakdown</p>
            </div>
            <div className="divide-y divide-gray-50">
              {packet.estimateLines.map((line, i) => (
                <div key={i} className="flex items-center gap-3 p-4">
                  <span className={clsx("jdr-badge", line.type === "labor" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700")}>{line.type}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-jdr-navy text-sm font-medium">{line.description}</p>
                    <p className="text-jdr-slate text-xs">Qty {line.quantity} × ${line.unitPrice.toLocaleString()}</p>
                  </div>
                  <p className="text-jdr-navy font-semibold text-sm">${(line.quantity * line.unitPrice).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="p-4 bg-jdr-navy rounded-b-2xl flex items-center justify-between">
              <p className="text-white font-bold">Total</p>
              <p className="text-white font-bold text-xl">${packet.estimateTotal.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* HCP Changes */}
        {activeTab === "hcp" && packet && (
          <div className="space-y-3">
            <p className="text-jdr-slate text-sm">Proposed changes to the Housecall Pro job record if approved:</p>
            {packet.proposedHcpChanges.map((change, i) => (
              <div key={i} className="jdr-card p-4">
                <p className="text-xs font-semibold text-jdr-slate uppercase tracking-wide mb-2">{change.field}</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                    <p className="text-xs text-red-600 font-medium mb-1">Current</p>
                    <p className="text-red-800 text-sm">{change.currentValue}</p>
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                    <p className="text-xs text-green-600 font-medium mb-1">Proposed</p>
                    <p className="text-green-800 text-sm">{change.proposedValue}</p>
                  </div>
                </div>
                <p className="text-jdr-slate text-xs mt-2 italic">{change.reason}</p>
              </div>
            ))}
            <p className="text-jdr-slate text-xs text-center">HCP integration is mocked — changes will not be sent in demo mode.</p>
          </div>
        )}
      </div>

      {/* Action panel */}
      {!isAlreadyReviewed && !actionTaken && (
        <div className="sticky bottom-4">
          <div className="jdr-card p-4 border-2 border-jdr-navy/10 shadow-jdr-lg">
            <div className="flex items-center justify-between mb-3">
              <p className="text-jdr-navy font-bold text-sm">Decision Required</p>
              <button onClick={() => setShowActionPanel(!showActionPanel)} className="text-jdr-slate hover:text-jdr-navy">
                {showActionPanel ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>

            {showActionPanel && (
              <div className="space-y-3 mb-4">
                <div>
                  <label className="jdr-label">Note (optional)</label>
                  <input value={actionNote} onChange={e => setActionNote(e.target.value)} className="jdr-input text-sm" placeholder="Add context or instructions for the technician…" />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button onClick={() => doAction("approved")} className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
                <ThumbsUp className="w-4 h-4" /> Approve
              </button>
              <button onClick={() => doAction("rejected")} className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-semibold py-2.5 rounded-xl text-sm transition-colors">
                <ThumbsDown className="w-4 h-4" /> Reject
              </button>
              <button onClick={() => doAction("returned")} className="flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-semibold py-2.5 rounded-xl text-sm transition-colors">
                <CornerUpLeft className="w-4 h-4" /> Return
              </button>
              <button onClick={() => { setEditMode(!editMode); setShowActionPanel(true); }} className="flex items-center justify-center gap-2 bg-jdr-cream hover:bg-jdr-cream-dark text-jdr-navy border border-gray-200 font-semibold py-2.5 rounded-xl text-sm transition-colors">
                <Edit3 className="w-4 h-4" /> Edit
              </button>
            </div>
            <p className="text-center text-jdr-slate text-xs mt-2">All actions are logged to the audit trail</p>
          </div>
        </div>
      )}

      {isAlreadyReviewed && (
        <div className="jdr-card p-4 text-center">
          <p className="text-jdr-slate text-sm">This approval was reviewed on {approval.reviewedAt ? formatTime(approval.reviewedAt) : "N/A"} by {approval.reviewedBy ? getTechnician(approval.reviewedBy)?.name : "—"}</p>
          {approval.notes && <p className="text-jdr-navy text-sm font-medium mt-1">"{approval.notes}"</p>}
        </div>
      )}
    </div>
  );
}
