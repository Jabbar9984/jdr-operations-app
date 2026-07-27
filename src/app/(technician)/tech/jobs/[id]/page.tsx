"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
  FileText,
  AlertCircle,
  CheckCircle,
  Calendar,
  DollarSign,
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
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const job = getJob(id);

  if (!job) {
    return (
      <div className="px-4 py-5 text-center text-jdr-slate">
        <p>Job not found.</p>
        <Link href="/tech/jobs" className="text-jdr-navy font-medium mt-2 block">← Back to Jobs</Link>
      </div>
    );
  }

  const customer = getCustomer(job.customerId);
  const tech = getTechnician(job.technicianId);
  const appliance = getAppliance(job.applianceId);
  const estimate = job.estimateId ? getEstimate(job.estimateId) : null;

  return (
    <div className="pb-6">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-jdr-navy p-1 -ml-1"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-jdr-navy text-sm truncate">{job.title}</p>
          <p className="text-jdr-slate text-xs">Job #{job.id}</p>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Priority / tags */}
        <div className="flex flex-wrap gap-2">
          <PriorityBadge priority={job.priority} />
          {job.tags?.map((tag) => (
            <span key={tag} className="jdr-badge bg-gray-100 text-gray-600 border border-gray-200">{tag}</span>
          ))}
        </div>

        {/* Schedule */}
        <Section title="Schedule">
          <Row icon={Calendar} label="Scheduled" value={formatDateTime(job.scheduledAt)} />
          <Row icon={Clock} label="Est. Duration" value={`${job.estimatedDuration} minutes`} />
          {job.completedAt && (
            <Row icon={CheckCircle} label="Completed" value={formatDateTime(job.completedAt)} />
          )}
        </Section>

        {/* Location */}
        <Section title="Location">
          <div className="flex items-start gap-3 py-2">
            <MapPin className="w-4 h-4 text-jdr-slate mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-jdr-navy text-sm font-medium">{job.address.street}</p>
              <p className="text-jdr-slate text-sm">{job.address.city}, {job.address.state} {job.address.zip}</p>
            </div>
          </div>
          <a
            href={`https://maps.apple.com/?address=${encodeURIComponent(`${job.address.street}, ${job.address.city}, ${job.address.state} ${job.address.zip}`)}`}
            className="jdr-btn-primary w-full mt-2 text-center text-sm inline-block"
          >
            Open in Maps
          </a>
        </Section>

        {/* Customer */}
        {customer && (
          <Section title="Customer">
            <div className="flex items-center justify-between mb-2">
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
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mt-2">
                <div className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-800 text-xs leading-relaxed">{customer.notes}</p>
                </div>
              </div>
            )}
            <a
              href={`tel:${customer.phone}`}
              className="flex items-center gap-2 mt-3 text-jdr-navy font-medium text-sm hover:text-jdr-gold transition-colors"
            >
              <Phone className="w-4 h-4" />
              {customer.phone}
            </a>
          </Section>
        )}

        {/* Appliance */}
        {appliance && (
          <Section title="Appliance">
            <Row icon={Wrench} label="Unit" value={`${appliance.brand} ${appliance.model}`} />
            <Row label="Type" value={appliance.type} />
            <Row label="Serial #" value={appliance.serial} />
            <Row label="Installed" value={new Date(appliance.installDate).toLocaleDateString()} />
            {appliance.warrantyExpiry && (
              <Row
                label="Warranty"
                value={
                  <span className={new Date(appliance.warrantyExpiry) > new Date() ? "text-green-600" : "text-red-500"}>
                    {new Date(appliance.warrantyExpiry) > new Date() ? "Active" : "Expired"} · {new Date(appliance.warrantyExpiry).toLocaleDateString()}
                  </span>
                }
              />
            )}
          </Section>
        )}

        {/* Description */}
        <Section title="Service Description">
          <p className="text-jdr-navy text-sm leading-relaxed">{job.description}</p>
        </Section>

        {/* Diagnosis */}
        {job.diagnosis && (
          <Section title="Diagnosis">
            <p className="text-jdr-navy text-sm leading-relaxed">{job.diagnosis}</p>
          </Section>
        )}

        {/* Resolution */}
        {job.resolution && (
          <Section title="Resolution">
            <div className="flex gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-jdr-navy text-sm leading-relaxed">{job.resolution}</p>
            </div>
          </Section>
        )}

        {/* Estimate */}
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
                <span className="text-jdr-navy font-medium">${estimate.laborHours * estimate.laborRate}</span>
              </div>
              {estimate.parts.map((part, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-jdr-slate flex-1 mr-2 text-xs">{part.description} ×{part.qty}</span>
                  <span className="text-jdr-navy font-medium">${part.unitPrice * part.qty}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-2 flex items-center justify-between">
              <div className="flex items-center gap-1 text-jdr-navy font-bold">
                <DollarSign className="w-4 h-4" />
                <span>Total</span>
              </div>
              <span className="text-jdr-navy font-bold text-lg">${estimate.total.toLocaleString()}</span>
            </div>
            {estimate.notes && (
              <p className="text-jdr-slate text-xs mt-2 leading-relaxed">{estimate.notes}</p>
            )}
          </Section>
        )}

        {/* Technician */}
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
          </Section>
        )}

        {/* Notes / actions for tech */}
        {["scheduled", "en_route", "in_progress"].includes(job.status) && (
          <div className="flex gap-3">
            <Link
              href="/tech/diagnose"
              className="flex-1 jdr-btn-gold text-center text-sm"
            >
              <FileText className="w-4 h-4 inline mr-1.5" />
              Add Diagnosis
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
