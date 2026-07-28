/**
 * Supabase client module — JDR Operations
 *
 * Browser client:  uses NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
 * Server client:   uses SUPABASE_SERVICE_ROLE_KEY (never exposed to the browser)
 *
 * Usage:
 *   import { supabase } from '@/lib/supabase'          // browser (client components)
 *   import { supabaseAdmin } from '@/lib/supabase'     // server only (API routes / Server Actions)
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// ─── Environment ──────────────────────────────────────────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ─── Browser / client-component client ────────────────────────────────────────

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// ─── Server-only admin client (service role — full access, bypasses RLS) ──────
// Only import this in API routes, Server Actions, or server-only lib files.

export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export type { Database };
