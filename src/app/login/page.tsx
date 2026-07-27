"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAs, getHomeRoute } from "@/lib/auth";
import { DEMO_ACCOUNTS } from "@/lib/mock-data";
import { Shield, Wrench, BarChart3, ChevronRight } from "lucide-react";
import type { Role } from "@/types";

const ROLE_ICONS: Record<Role, React.ReactNode> = {
  owner: <Shield className="w-5 h-5" />,
  manager: <BarChart3 className="w-5 h-5" />,
  technician: <Wrench className="w-5 h-5" />,
};

const ROLE_COLORS: Record<Role, string> = {
  owner: "bg-amber-50 text-amber-700 border-amber-200",
  manager: "bg-blue-50 text-blue-700 border-blue-200",
  technician: "bg-green-50 text-green-700 border-green-200",
};

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  function handleLogin(userId: string, role: Role) {
    setLoading(userId);
    const session = loginAs(userId);
    if (session) {
      setTimeout(() => router.push(getHomeRoute(role)), 300);
    }
  }

  return (
    <div className="min-h-dvh bg-jdr-navy flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-8">
        {/* Logo area */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-jdr-gold/20 border border-jdr-gold/30 mb-4">
            <span className="text-jdr-gold text-2xl font-bold">JDR</span>
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">JDR Operations</h1>
          <p className="text-white/50 text-sm mt-1">JDR Luxury Appliances</p>
        </div>

        {/* Demo login card */}
        <div className="w-full max-w-sm">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">
            <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-4 text-center">
              Demo — Select a Role
            </p>

            <div className="space-y-3">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.id}
                  onClick={() => handleLogin(account.id, account.role)}
                  disabled={loading !== null}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/10
                             bg-white/5 hover:bg-white/10 active:scale-[0.98]
                             transition-all duration-150 text-left group
                             disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {/* Role icon */}
                  <div className={`w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0 ${ROLE_COLORS[account.role]}`}>
                    {ROLE_ICONS[account.role]}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm leading-tight">{account.name}</p>
                    <p className="text-white/50 text-xs capitalize mt-0.5">{account.role}</p>
                    <p className="text-white/40 text-xs mt-1 leading-tight truncate">{account.description}</p>
                  </div>

                  {/* Arrow / spinner */}
                  <div className="flex-shrink-0 text-white/30 group-hover:text-jdr-gold transition-colors">
                    {loading === account.id ? (
                      <div className="w-4 h-4 border-2 border-jdr-gold border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <p className="text-white/25 text-xs text-center mt-6">
            This is a demo environment. No real data is used.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="pb-8 text-center">
        <p className="text-white/20 text-xs">© 2026 JDR Luxury Appliances. All rights reserved.</p>
      </div>
    </div>
  );
}
