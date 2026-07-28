"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getJob,
  getCustomer,
  getTechnician,
  getAppliance,
  getEstimate,
  APPROVALS,
  getReviewPacket,
} from "@/lib/mock-data";
import { getWorkflowState, getSymptoms, getSavedDiagnostic, getReadings, getReport, getLocalEstimate } from "@/lib/store";
import { getSession } from "@/lib/auth";
import { StatusBadge, PriorityBadge, TierBadge } from "@/components/ui/StatusBadge";
import {
  ChevronLeft,
  MapPin,
  Clock,
  Phone,
  User,
  Wrench,
  AlertCircle,
  CheckCircle,
  Calendar,
  DollarSign,
  Mail,
  Award,
  FileText,
  Activity,
  Camera,
  Package,
  ChevronRight,
  ClipboardList,
} from "lucide-react";
import { clsx } from "clsx";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="jdr-card p-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-3">{title}</h2>
      {children}
    </div>
  );
}

function Row({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon?: typeof MapPin }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
      {Icon && <Icon className="w-4 h-4 text-jdr-slate mt-0.5 flex-shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-jdr-slate text-xs">{label}</p>
        <div className="text-jdr-navy text-sm font-medium mt-0.5">{value}</div>
      </div>
    </div>
  );
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

const RESULT_COLORS = {
  pass: "text-green-700 bg-green-50",
  fail: "text-red-700 bg-red-50",
  marginal: "text-amber-700 bg-amber-50",
  pending: "text-gray-600 bg-gray-50",
};

export default function OpsJobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [session, setSession] = useState<{ userId: string; name: string; role: string } | null>(null);

  // localStorage data — only available client-side
  const [localLoaded, setLocalLoaded] = useState(false);
  const [workflow, setWorkflow] = useState<ReturnType<typeof getWorkflowState> | null>(null);
  const [symptoms, setSymptoms] = useState<ReturnType<typeof getSymptoms>>(null);
  const [diagnostic, setDiagnostic] = useState<ReturnType<typeof getSavedDiagnostic>>(null);
  const [readings, setReadings] = useState<ReturnType<typeof getReadings>>([]);
  const [report, setReport] = useState<ReturnType<typeof getReport>>(null);
  const [localEstimate, setLocalEstimate] = useState<ReturnType<typeof getLocalEstimate>>(null);

  useEffect(() => {
    const s = getSession();
    if (s) setSession(s);
    // Load localStorage tech findings
    setWorkflow(getWorkflowState(id));
    setSymptoms(getSymptoms(id));
    setDiagnostic(getSavedDiagnostic(id));
    setReadings(getReadings(id));
    setReport(getReport(id));
    setLocalEstimate(getLocalEstimate(id));
    setLocalLoaded(true);
  }, [id]);

  const job = getJob(id);

  if (!job) {
    return (
      <div className="text-center text-jdr-slate py-20">
        <p>Job not found.</p>
        <Link href="/ops/jobs" className="text-jdr-navy font-medium mt-2 block">← Back to Jobs</Link>
      </div>
    );
  }

  const customer = getCustomer(job.customerId);
  const tech = getTechnician(job.technicianId);
  const appliance = getAppliance(job.applianceId);
  const estimate = job.estimateId ? getEstimate(job.estimateId) : null;

  // Check for pending approval + review packet
  const relatedApproval = APPROVALS.find(a => a.jobId === job.id && a.status === "pending");
  const reviewPacket = relatedApproval ? getReviewPacket(relatedApproval.id) : null;

  const hasLocalData = localLoaded && (
    symptoms || diagnostic || readings.length > 0 || report || localEstimate
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-jdr-navy p-1 -ml-1">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-jdr-navy text-xl truncate">{job.title}</h1>
          <p className="text-jdr-slate text-sm">Job #{job.id}</p>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <div className="flex flex-wrap gap-2">
        <PriorityBadge priority={job.priority} />
        {job.tags?.map((tag) => (
          <span key={tag} className="jdr-badge bg-gray-100 text-gray-600 border border-gray-200">{tag}</span>
        ))}
        {job.reportedErrorCodes?.map(code => (
          <span key={code} className="jdr-badge bg-red-50 text-red-700 border border-red-200 font-mono">{code}</span>
        ))}
      </div>

      {/* Approval CTA */}
      {relatedApproval && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-amber-800 font-semibold text-sm">Pending Approval: {relatedApproval.description}</p>
            <p className="text-amber-600 text-xs mt-0.5">${relatedApproval.amount?.toLocaleString()} · Submitted by {getTechnician(relatedApproval.requestedBy)?.name}</p>
          </div>
          <Link href={`/ops/approvals/${relatedApproval.id}`} className="jdr-btn-primary text-xs px-3 py-2 whitespace-nowrap">
            Review →
          </Link>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Left column */}
        <div className="space-y-4">
          <Section title="Schedule">
            <Row icon={Calendar} label="Scheduled" value={formatDateTime(job.scheduledAt)} />
            <Row icon={Clock} label="Est. Duration" value={`${job.estimatedDuration} minutes`} />
            {job.completedAt && <Row icon={CheckCircle} label="Completed" value={formatDateTime(job.completedAt)} />}
          </Section>

          <Section title="Location">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-jdr-slate mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-jdr-navy text-sm font-medium">{job.address.street}</p>
                <p className="text-jdr-slate text-sm">{job.address.city}, {job.address.state} {job.address.zip}</p>
              </div>
            </div>
          </Section>

          <Section title="Job Description">
            <p className="text-jdr-navy text-sm leading-relaxed">{job.description}</p>
          </Section>

          {job.customerComplaint && (
            <Section title="Customer Complaint">
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-3">
                <p className="text-orange-800 text-sm italic">"{job.customerComplaint}"</p>
              </div>
            </Section>
          )}

          {job.diagnosis && (
            <Section title="Diagnosis">
              <p className="text-jdr-navy text-sm leading-relaxed">{job.diagnosis}</p>
            </Section>
          )}

          {job.resolution && (
            <Section title="Resolution">
              <div className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-jdr-navy text-sm leading-relaxed">{job.resolution}</p>
              </div>
            </Section>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {customer && (
            <Section title="Customer">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-jdr-navy/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-jdr-navy" />
                  </div>
                  <div>
                    <p className="text-jdr-navy font-semibold text-sm">{customer.name}</p>
                    <p className="text-jdr-slate text-xs">{customer.email}</p>
                  </div>
                </div>
                <TierBadge tier={customer.tier} />
              </div>
              {customer.notes && (
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-3">
                  <div className="flex gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-amber-800 text-xs leading-relaxed">{customer.notes}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 text-jdr-navy text-sm">
                <Phone className="w-4 h-4 text-jdr-slate" />
                {customer.phone}
              </div>
            </Section>
          )}

          {appliance && (
            <Section title="Appliance">
              <Row icon={Wrench} label="Unit" value={`${appliance.brand} ${appliance.model}`} />
              <Row label="Type" value={appliance.type} />
              <Row label="Serial #" value={<span className="font-mono text-xs">{appliance.serial}</span>} />
              <Row label="Installed" value={new Date(appliance.installDate).toLocaleDateString()} />
              {appliance.warrantyExpiry && (
                <Row label="Warranty" value={
                  <span className={new Date(appliance.warrantyExpiry) > new Date() ? "text-green-600" : "text-red-500"}>
                    {new Date(appliance.warrantyExpiry) > new Date() ? "Active" : "Expired"} · {new Date(appliance.warrantyExpiry).toLocaleDateString()}
                  </span>
                } />
              )}
            </Section>
          )}

          {tech && (
            <Section title="Assigned Technician">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-jdr-navy/10 flex items-center justify-center">
                  <span className="text-jdr-navy font-semibold text-sm">{tech.name.split(" ").map(n => n[0]).join("")}</span>
                </div>
                <div>
                  <p className="text-jdr-navy font-semibold text-sm">{tech.name}</p>
                  {tech.certifications && <p className="text-jdr-slate text-xs">{tech.certifications.slice(0, 2).join(", ")}</p>}
                </div>
              </div>
              {tech.phone && (
                <div className="flex items-center gap-2 mt-3 text-jdr-navy text-sm">
                  <Phone className="w-4 h-4 text-jdr-slate" />{tech.phone}
                </div>
              )}
              <div className="flex items-center gap-2 mt-2 text-jdr-navy text-sm">
                <Mail className="w-4 h-4 text-jdr-slate" />{tech.email}
              </div>
            </Section>
          )}

          {estimate && (
            <Section title="Estimate">
              <div className="flex items-center justify-between mb-3">
                <span className="text-jdr-slate text-xs">Est #{estimate.id}</span>
                <span className={`jdr-badge ${
                  estimate.status === "approved" ? "bg-green-50 text-green-700 border border-green-200" :
                  estimate.status === "pending_approval" ? "bg-orange-50 text-orange-700 border border-orange-200" :
                  "bg-gray-50 text-gray-600 border border-gray-200"
                }`}>
                  {estimate.status.replace(/_/g, " ")}
                </span>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-jdr-slate">Labor ({estimate.laborHours}h × ${estimate.laborRate})</span>
                  <span className="font-medium">${(estimate.laborHours * estimate.laborRate).toLocaleString()}</span>
                </div>
                {estimate.parts.map((part, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-jdr-slate text-xs flex-1 mr-2">{part.description}</span>
                    <span className="font-medium">${(part.unitPrice * part.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between items-center">
                <span className="font-bold text-jdr-navy">Total</span>
                <span className="font-bold text-jdr-navy text-lg">${estimate.total.toLocaleString()}</span>
              </div>
            </Section>
          )}
        </div>
      </div>

      {/* Tech findings from review packet */}
      {reviewPacket && (
        <div>
          <h2 className="font-bold text-jdr-navy mb-4 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-jdr-slate" />
            Technician Findings
            <Link href={`/ops/approvals/${relatedApproval?.id}`} className="text-jdr-navy text-xs font-medium hover:text-jdr-gold ml-auto flex items-center gap-1">
              Full review <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Diagnosis */}
            <div className="jdr-card p-4 col-span-full">
              <p className="text-xs font-semibold uppercase tracking-wide text-jdr-slate mb-1">Confirmed Diagnosis</p>
              <p className="text-jdr-navy text-sm font-medium">{reviewPacket.diagnostic.confirmedDiagnosis}</p>
            </div>
            {/* Readings summary */}
            {reviewPacket.readings.map((r, i) => (
              <div key={i} className={clsx("jdr-card p-4 border", r.result === "fail" ? "border-red-200" : r.result === "pass" ? "border-green-200" : "border-gray-200")}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-jdr-navy text-xs font-semibold">{r.component}</p>
                  <span className={clsx("text-xs font-bold px-2 py-0.5 rounded-full", RESULT_COLORS[r.result])}>
                    {r.result.toUpperCase()}
                  </span>
                </div>
                <p className="text-jdr-navy font-bold">{r.measuredValue} {r.unit}</p>
                <p className="text-jdr-slate text-xs">Expected: {r.expectedValue}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Local tech findings (from localStorage — only shown when data exists) */}
      {hasLocalData && !reviewPacket && (
        <div>
          <h2 className="font-bold text-jdr-navy mb-4 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-jdr-slate" />
            Technician Findings (Live)
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {symptoms && (
              <div className="jdr-card p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-jdr-slate mb-2 flex items-center gap-1.5"><Activity className="w-3 h-3" /> Symptoms Recorded</p>
                <p className="text-jdr-navy text-sm italic mb-2">"{symptoms.customerComplaint}"</p>
                <div className="flex flex-wrap gap-1.5">
                  {symptoms.observedSymptoms.map(s => <span key={s} className="jdr-badge bg-orange-50 text-orange-700 border border-orange-100 text-xs">{s}</span>)}
                </div>
              </div>
            )}

            {diagnostic && (
              <div className="jdr-card p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-jdr-slate mb-2 flex items-center gap-1.5"><Wrench className="w-3 h-3" /> Diagnostic</p>
                <p className="text-jdr-navy text-sm font-medium">{diagnostic.confirmedDiagnosis}</p>
                {diagnostic.techNotes && <p className="text-jdr-slate text-xs mt-1">{diagnostic.techNotes}</p>}
              </div>
            )}

            {readings.length > 0 && (
              <div className="jdr-card p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-jdr-slate mb-2 flex items-center gap-1.5"><Activity className="w-3 h-3" /> Meter Readings ({readings.length})</p>
                <div className="space-y-1.5">
                  {readings.slice(0, 3).map(r => (
                    <div key={r.id} className="flex items-center justify-between text-xs">
                      <span className="text-jdr-slate truncate flex-1 mr-2">{r.component}</span>
                      <span className={clsx("font-semibold", r.result === "fail" ? "text-red-600" : r.result === "pass" ? "text-green-600" : "text-amber-600")}>{r.measuredValue} {r.unit}</span>
                    </div>
                  ))}
                  {readings.length > 3 && <p className="text-jdr-slate text-xs">+{readings.length - 3} more</p>}
                </div>
              </div>
            )}

            {report && (
              <div className="jdr-card p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-jdr-slate mb-2 flex items-center gap-1.5"><FileText className="w-3 h-3" /> Service Report</p>
                <p className="text-jdr-navy text-sm">{report.workPerformed}</p>
                <p className={clsx("text-xs mt-1.5 font-medium", report.followUpRequired ? "text-orange-600" : "text-green-600")}>
                  {report.followUpRequired ? "Follow-up required" : "No follow-up needed"}
                </p>
              </div>
            )}

            {localEstimate && (
              <div className="jdr-card p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-jdr-slate mb-2 flex items-center gap-1.5"><DollarSign className="w-3 h-3" /> Tech Estimate (Draft)</p>
                <p className="text-jdr-navy font-bold text-xl">${localEstimate.total.toLocaleString()}</p>
                <p className="text-jdr-slate text-xs">{localEstimate.lines.length} line items</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Workflow checklist */}
      {workflow && (
        <Section title="Workflow Checklist">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {([
              { key: "symptomsRecorded", label: "Symptoms" },
              { key: "diagnosticCompleted", label: "Diagnostic" },
              { key: "readingsRecorded", label: "Readings" },
              { key: "photosAdded", label: "Photos" },
              { key: "reportCompleted", label: "Report" },
              { key: "estimateBuilt", label: "Estimate" },
              { key: "submitted", label: "Submitted" },
            ] as { key: keyof typeof workflow; label: string }[]).map(({ key, label }) => (
              <div key={key} className={clsx("flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium", workflow[key] ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-400")}>
                <CheckCircle className={clsx("w-3.5 h-3.5 flex-shrink-0", workflow[key] ? "text-green-600" : "text-gray-300")} />
                {label}
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
