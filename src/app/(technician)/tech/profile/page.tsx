"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, clearSession } from "@/lib/auth";
import { getTechnician, getTechnicianStats } from "@/lib/mock-data";
import PageHeader from "@/components/ui/PageHeader";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Award,
  Calendar,
  Star,
  LogOut,
  ChevronRight,
  Bell,
  Shield,
  HelpCircle,
} from "lucide-react";

export default function TechProfilePage() {
  const router = useRouter();
  const [techId, setTechId] = useState<string | null>(null);

  useEffect(() => {
    const s = getSession();
    if (s) setTechId(s.userId);
  }, []);

  const tech = techId ? getTechnician(techId) : null;
  const stats = techId ? getTechnicianStats(techId) : null;

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  if (!tech) return null;

  const initials = tech.name.split(" ").map(n => n[0]).join("");

  return (
    <div className="pb-6">
      {/* Hero */}
      <div className="bg-jdr-navy px-4 pt-6 pb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-jdr-gold/20 border-2 border-jdr-gold/40 flex items-center justify-center flex-shrink-0">
            <span className="text-jdr-gold text-2xl font-bold">{initials}</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">{tech.name}</h1>
            <p className="text-white/60 text-sm capitalize">{tech.role}</p>
            {tech.zone && (
              <div className="flex items-center gap-1 text-white/40 text-xs mt-1">
                <MapPin className="w-3 h-3" />
                {tech.zone}
              </div>
            )}
          </div>
        </div>

        {/* Stats row */}
        {stats && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: "This Week", value: stats.completedThisWeek },
              { label: "Avg Rating", value: `${stats.avgRating}★` },
              { label: "Revenue", value: `$${(stats.revenue / 1000).toFixed(1)}k` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                <p className="text-white font-bold text-base">{value}</p>
                <p className="text-white/40 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Contact info */}
        <div className="jdr-card p-4 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-jdr-slate">Contact</h2>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-jdr-slate flex-shrink-0" />
            <span className="text-jdr-navy text-sm">{tech.email}</span>
          </div>
          {tech.phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-jdr-slate flex-shrink-0" />
              <span className="text-jdr-navy text-sm">{tech.phone}</span>
            </div>
          )}
          {tech.joinDate && (
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-jdr-slate flex-shrink-0" />
              <span className="text-jdr-navy text-sm">
                Joined {new Date(tech.joinDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
            </div>
          )}
        </div>

        {/* Certifications */}
        {tech.certifications && tech.certifications.length > 0 && (
          <div className="jdr-card p-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-3">Certifications</h2>
            <div className="space-y-2">
              {tech.certifications.map((cert) => (
                <div key={cert} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <span className="text-jdr-navy text-sm font-medium">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings links */}
        <div className="jdr-card divide-y divide-gray-50">
          {[
            { icon: Bell, label: "Notifications" },
            { icon: Shield, label: "Privacy & Security" },
            { icon: HelpCircle, label: "Help & Support" },
          ].map(({ icon: Icon, label }) => (
            <button key={label} className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-jdr-cream-dark transition-colors">
              <Icon className="w-4 h-4 text-jdr-slate flex-shrink-0" />
              <span className="flex-1 text-left text-jdr-navy text-sm font-medium">{label}</span>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-red-200 text-red-600 font-medium text-sm hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </div>
  );
}
