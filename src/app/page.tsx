"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, getHomeRoute } from "@/lib/auth";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (session) {
      router.replace(getHomeRoute(session.role));
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-dvh bg-jdr-navy flex items-center justify-center">
      <div className="text-jdr-gold text-sm font-medium animate-pulse">Loading JDR Operations…</div>
    </div>
  );
}
