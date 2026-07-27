"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Briefcase, Stethoscope, FileText, User as UserIcon, LogOut } from "lucide-react";
import { clsx } from "clsx";
import AuthGuard from "@/components/AuthGuard";
import { clearSession } from "@/lib/auth";
import { getSession } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/tech/jobs", label: "Jobs", icon: Briefcase },
  { href: "/tech/diagnose", label: "Diagnose", icon: Stethoscope },
  { href: "/tech/reports", label: "Reports", icon: FileText },
  { href: "/tech/profile", label: "Profile", icon: UserIcon },
];

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = typeof window !== "undefined" ? getSession() : null;

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  return (
    <AuthGuard allowedRoles={["technician"]}>
      <div className="min-h-dvh flex flex-col bg-jdr-cream">
        {/* Top Header */}
        <header className="bg-jdr-navy text-white px-4 pt-safe">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-jdr-gold/20 border border-jdr-gold/30 flex items-center justify-center">
                <span className="text-jdr-gold text-xs font-bold">JDR</span>
              </div>
              <span className="text-white font-semibold text-sm">Operations</span>
            </div>
            <div className="flex items-center gap-3">
              {session && (
                <span className="text-white/50 text-xs hidden sm:block">{session.name}</span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs transition-colors p-1"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Log out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto pb-20">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom z-50">
          <div className="flex items-center justify-around px-2 h-16">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    "nav-tab flex-1",
                    active
                      ? "text-jdr-navy"
                      : "text-jdr-slate hover:text-jdr-navy"
                  )}
                >
                  <Icon
                    className={clsx(
                      "w-5 h-5 transition-colors",
                      active ? "text-jdr-navy" : "text-jdr-slate"
                    )}
                    strokeWidth={active ? 2.5 : 1.8}
                  />
                  <span className={clsx("text-[10px]", active && "font-semibold")}>{label}</span>
                  {active && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-jdr-navy rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </AuthGuard>
  );
}
