"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSession, clearSession } from "@/lib/auth";
import PageHeader from "@/components/ui/PageHeader";
import {
  Building2,
  Bell,
  Shield,
  Users,
  DollarSign,
  Globe,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Save,
  LogOut,
  CheckCircle,
  Puzzle,
  ClipboardList,
} from "lucide-react";
import { clsx } from "clsx";

interface SettingRow {
  icon: typeof Building2;
  label: string;
  description: string;
  href?: string;
}

const SETTING_GROUPS: { title: string; items: SettingRow[] }[] = [
  {
    title: "Company",
    items: [
      { icon: Building2, label: "Business Profile", description: "Name, logo, and brand details" },
      { icon: Globe, label: "Service Zones", description: "Manage geographic coverage areas" },
      { icon: DollarSign, label: "Pricing & Rates", description: "Labor rates, travel fees, tier multipliers", href: "/ops/pricing" },
    ],
  },
  {
    title: "Notifications",
    items: [
      { icon: Bell, label: "Job Alerts", description: "New, updated, and urgent job notifications" },
      { icon: Mail, label: "Email Digests", description: "Daily and weekly summary emails" },
      { icon: Phone, label: "SMS Alerts", description: "Text notifications for approvals" },
    ],
  },
  {
    title: "Operations",
    items: [
      { icon: Users, label: "Team Management", description: "Roles, permissions, and access control" },
      { icon: Shield, label: "Approval Thresholds", description: "Auto-approve limits and escalation rules" },
      { icon: MapPin, label: "Dispatch Settings", description: "Assignment rules and routing preferences" },
      { icon: Puzzle, label: "Integrations", description: "Housecall Pro, Stripe, AI, and more", href: "/ops/integrations" },
      { icon: ClipboardList, label: "Audit Log", description: "Full history of all system actions", href: "/ops/audit" },
    ],
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const [session, setSession] = useState<{ name: string; role: string; userId: string } | null>(null);
  const [saved, setSaved] = useState(false);

  const [companyName, setCompanyName] = useState("JDR Luxury Appliances");
  const [companyPhone, setCompanyPhone] = useState("(310) 555-0100");
  const [companyEmail, setCompanyEmail] = useState("ops@jdrluxury.com");
  const [laborRate, setLaborRate] = useState("185");
  const [approvalThreshold, setApprovalThreshold] = useState("500");

  useEffect(() => {
    const s = getSession();
    if (s) setSession(s);
  }, []);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <PageHeader title="Settings" subtitle={`${session?.role === "owner" ? "Owner" : "Manager"} configuration`} />

      {/* Company basics form */}
      <div className="jdr-card p-5 space-y-4">
        <h2 className="font-bold text-jdr-navy flex items-center gap-2">
          <Building2 className="w-4 h-4 text-jdr-slate" />
          Company Details
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="jdr-label">Company Name</label>
            <input value={companyName} onChange={e => setCompanyName(e.target.value)} className="jdr-input" />
          </div>
          <div>
            <label className="jdr-label">Contact Phone</label>
            <input value={companyPhone} onChange={e => setCompanyPhone(e.target.value)} className="jdr-input" />
          </div>
          <div>
            <label className="jdr-label">Operations Email</label>
            <input value={companyEmail} onChange={e => setCompanyEmail(e.target.value)} className="jdr-input" />
          </div>
          <div>
            <label className="jdr-label">Default Labor Rate ($/hr)</label>
            <input type="number" value={laborRate} onChange={e => setLaborRate(e.target.value)} className="jdr-input" />
          </div>
          <div>
            <label className="jdr-label">Auto-Approve Below ($)</label>
            <input type="number" value={approvalThreshold} onChange={e => setApprovalThreshold(e.target.value)} className="jdr-input" />
          </div>
        </div>
        <button
          onClick={handleSave}
          className={clsx(
            "flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all",
            saved ? "bg-green-600 text-white" : "jdr-btn-primary"
          )}
        >
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Quick links to new Phase 2 pages */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Link href="/ops/pricing" className="jdr-card p-4 flex items-center gap-3 hover:shadow-jdr-md transition-all group">
          <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-5 h-5 text-green-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-jdr-navy font-semibold text-sm">Pricing Configuration</p>
            <p className="text-jdr-slate text-xs">Labor rates, fees & multipliers</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-jdr-gold transition-colors" />
        </Link>
        <Link href="/ops/integrations" className="jdr-card p-4 flex items-center gap-3 hover:shadow-jdr-md transition-all group">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center flex-shrink-0">
            <Puzzle className="w-5 h-5 text-purple-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-jdr-navy font-semibold text-sm">Integrations</p>
            <p className="text-jdr-slate text-xs">HCP, Stripe, AI, Twilio, Miele</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-jdr-gold transition-colors" />
        </Link>
        <Link href="/ops/audit" className="jdr-card p-4 flex items-center gap-3 hover:shadow-jdr-md transition-all group">
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
            <ClipboardList className="w-5 h-5 text-slate-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-jdr-navy font-semibold text-sm">Audit Log</p>
            <p className="text-jdr-slate text-xs">Full action history</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-jdr-gold transition-colors" />
        </Link>
        <Link href="/ops/parts" className="jdr-card p-4 flex items-center gap-3 hover:shadow-jdr-md transition-all group">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-blue-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-jdr-navy font-semibold text-sm">Parts & Warranty</p>
            <p className="text-jdr-slate text-xs">Orders and claims boards</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-jdr-gold transition-colors" />
        </Link>
      </div>

      {/* Settings groups */}
      {SETTING_GROUPS.map((group) => (
        <div key={group.title}>
          <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-3">{group.title}</p>
          <div className="jdr-card divide-y divide-gray-50">
            {group.items.map(({ icon: Icon, label, description, href }) => {
              const content = (
                <div className={clsx("flex items-center gap-4 w-full px-4 py-4 hover:bg-jdr-cream-dark transition-colors text-left", href && "cursor-pointer")}>
                  <div className="w-9 h-9 rounded-xl bg-jdr-cream border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-jdr-navy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-jdr-navy font-medium text-sm">{label}</p>
                    <p className="text-jdr-slate text-xs mt-0.5">{description}</p>
                  </div>
                  <ChevronRight className={clsx("w-4 h-4 flex-shrink-0", href ? "text-jdr-gold" : "text-gray-300")} />
                </div>
              );
              return href ? (
                <Link key={label} href={href}>{content}</Link>
              ) : (
                <button key={label}>{content}</button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Account info */}
      <div className="jdr-card p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-3">Account</p>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-jdr-navy flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">
              {session?.name?.split(" ").map(n => n[0]).join("") ?? "?"}
            </span>
          </div>
          <div>
            <p className="text-jdr-navy font-semibold">{session?.name}</p>
            <p className="text-jdr-slate text-xs capitalize">{session?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 font-medium text-sm hover:text-red-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>

      <p className="text-jdr-slate text-xs text-center pb-4">
        JDR Operations v2.0.0 — Demo environment · No real data
      </p>
    </div>
  );
}
