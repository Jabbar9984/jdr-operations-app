"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getJob,
  getCustomer,
  getTechnician,
  getAppliance,
  getEstimate,
} from "@/lib/mock-data";
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
} from "lucide-react";

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
        <p className="text-jdr-navy text-sm font-medium mt-0.5">{value}</p>
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

export default function OpsJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
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

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-jdr-navy p-1 -ml-1">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-jdr-navy text-lg truncate">{job.title}</h1>
          <p className="text-jdr-slate text-sm">Job #{job.id}</p>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Left column */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <PriorityBadge priority={job.priority} />
            {job.tags?.map((tag) => (
              <span key={tag} className="jdr-badge bg-gray-100 text-gray-600 border border-gray-200">{tag}</span>
            ))}
          </div>

          <Section title="Schedule">
            <Row icon={Calendar} label="Scheduled" value={formatDateTime(job.scheduledAt)} />
            <Row icon={Clock} label="Est. Duration" value={`${job.estimatedDuration} minutes`} />
            {job.completedAt && (
              <Row icon={CheckCircle} label="Completed" value={formatDateTime(job.completedAt)} />
            )}
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

          <Section title="Description">
            <p className="text-jdr-navy text-sm leading-relaxed">{job.description}</p>
          </Section>

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
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                  <div className="flex gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-amber-800 text-xs leading-relaxed">{customer.notes}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 mt-3 text-jdr-navy text-sm">
                <Phone className="w-4 h-4 text-jdr-slate" />
                {customer.phone}
              </div>
            </Section>
          )}

          {appliance && (
            <Section title="Appliance">
              <Row icon={Wrench} label="Unit" value={`${appliance.brand} ${appliance.model}`} />
              <Row label="Type" value={appliance.type} />
              <Row label="Serial #" value={appliance.serial} />
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
                  <span className="text-jdr-navy font-semibold text-sm">
                    {tech.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <p className="text-jdr-navy font-semibold text-sm">{tech.name}</p>
                  {tech.certifications && (
                    <p className="text-jdr-slate text-xs">{tech.certifications.slice(0, 2).join(", ")}</p>
                  )}
                </div>
              </div>
              {tech.phone && (
                <div className="flex items-center gap-2 mt-3 text-jdr-navy text-sm">
                  <Phone className="w-4 h-4 text-jdr-slate" />
                  {tech.phone}
                </div>
              )}
              <div className="flex items-center gap-2 mt-2 text-jdr-navy text-sm">
                <Mail className="w-4 h-4 text-jdr-slate" />
                {tech.email}
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
                  {estimate.status.replace("_", " ")}
                </span>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-jdr-slate">Labor ({estimate.laborHours}h × ${estimate.laborRate})</span>
                  <span className="font-medium">${estimate.laborHours * estimate.laborRate}</span>
                </div>
                {estimate.parts.map((part, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-jdr-slate text-xs flex-1 mr-2">{part.description}</span>
                    <span className="font-medium">${part.unitPrice * part.qty}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between items-center">
                <span className="font-bold text-jdr-navy">Total</span>
                <span className="font-bold text-jdr-navy text-lg">${estimate.total.toLocaleString()}</span>
              </div>
              {estimate.status === "pending_approval" && (
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 bg-green-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-green-700 transition-colors">
                    Approve
                  </button>
                  <button className="flex-1 bg-red-50 text-red-600 border border-red-200 rounded-lg py-2.5 text-sm font-semibold hover:bg-red-100 transition-colors">
                    Reject
                  </button>
                </div>
              )}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}
