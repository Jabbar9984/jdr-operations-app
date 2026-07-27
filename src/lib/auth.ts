"use client";

import type { Role, User } from "@/types";
import { USERS } from "./mock-data";

const SESSION_KEY = "jdr_session";

export interface Session {
  userId: string;
  role: Role;
  name: string;
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function setSession(session: Session): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}

export function loginAs(userId: string): Session | null {
  const user = USERS.find((u) => u.id === userId);
  if (!user) return null;
  const session: Session = { userId: user.id, role: user.role, name: user.name };
  setSession(session);
  return session;
}

export function getHomeRoute(role: Role): string {
  if (role === "technician") return "/tech/dashboard";
  return "/ops/dashboard";
}
