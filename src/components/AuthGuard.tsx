"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import type { Role } from "@/types";

interface AuthGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

export default function AuthGuard({ allowedRoles, children }: AuthGuardProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    if (!allowedRoles.includes(session.role)) {
      // Redirect to the correct home for their role
      if (session.role === "technician") router.replace("/tech/dashboard");
      else router.replace("/ops/dashboard");
      return;
    }
    setReady(true);
  }, [router, allowedRoles]);

  if (!ready) {
    return (
      <div className="min-h-dvh bg-jdr-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-jdr-navy border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
