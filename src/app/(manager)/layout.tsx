"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Package,
  Shield,
  ClipboardList,
} from "lucide-react";
import { clsx } from "clsx";
import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { clearSession, getSession } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/ops/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ops/jobs", label: "Jobs", icon: Briefcase },
  { href: "/ops/approvals", label: "Approvals", icon: CheckSquare },
  { href: "/ops/technicians", label: "Technicians", icon: Users },
  { href: "/ops/parts", label: "Parts Waiting", icon: Package },
  { href: "/ops/warranty", label: "Warranty Claims", icon: Shield },
  { href: "/ops/reports", label: "Reports", icon: FileText },
  { href: "/ops/audit", label: "Audit Log", icon: ClipboardList },
  { href: "/ops/settings", label: "Settings", icon: Settings },
];

function NavLink({ href, label, icon: Icon, active, onClick }: {
  href: string; label: string; icon: typeof LayoutDashboard;
  active: boolean; onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-sm font-medium",
        active
          ? "bg-jdr-gold text-jdr-navy"
          : "text-white/60 hover:bg-white/10 hover:text-white"
      )}
    >
      <Icon className="w-4.5 h-4.5 flex-shrink-0" size={18} />
      <span>{label}</span>
    </Link>
  );
}

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const session = typeof window !== "undefined" ? getSession() : null;

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-jdr-gold/20 border border-jdr-gold/30 flex items-center justify-center flex-shrink-0">
            <span className="text-jdr-gold text-xs font-bold">JDR</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">JDR Operations</p>
            <p className="text-white/40 text-xs">Luxury Appliances</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            active={pathname.startsWith(item.href)}
            onClick={() => setMobileOpen(false)}
          />
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-jdr-gold/20 border border-jdr-gold/30 flex items-center justify-center flex-shrink-0">
            <span className="text-jdr-gold text-xs font-semibold">
              {session?.name?.split(" ").map(n => n[0]).join("") ?? "??"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{session?.name ?? "User"}</p>
            <p className="text-white/40 text-xs capitalize">{session?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <AuthGuard allowedRoles={["manager", "owner"]}>
      <div className="min-h-dvh flex bg-jdr-cream">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-60 bg-jdr-navy flex-col flex-shrink-0 fixed left-0 top-0 bottom-0 z-40">
          {sidebar}
        </aside>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Mobile sidebar */}
        <aside
          className={clsx(
            "fixed left-0 top-0 bottom-0 w-64 bg-jdr-navy z-50 lg:hidden transition-transform duration-200",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4 text-white/50 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          {sidebar}
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-dvh lg:ml-60">
          {/* Mobile topbar */}
          <header className="lg:hidden bg-jdr-navy text-white px-4 h-14 flex items-center justify-between sticky top-0 z-30">
            <button
              onClick={() => setMobileOpen(true)}
              className="text-white/70 hover:text-white p-1"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-white/70 text-xs font-medium uppercase tracking-widest">JDR Operations</span>
            </div>
            <div className="w-7" />
          </header>

          <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
