# JDR Operations — Supabase Setup Guide

This folder contains the database schema migration and seed data for JDR Operations.
Apply these files manually via the **Supabase Dashboard SQL Editor** — no CLI required.

---

## Prerequisites

1. A Supabase project created at [supabase.com](https://supabase.com)
2. Your project's URL and API keys (see "Credentials" section below)

---

## Step 1 — Apply the Schema

1. Go to your Supabase project → **SQL Editor** → **New query**
2. Open `supabase/migrations/001_initial_schema.sql` from this repo
3. Paste the entire contents into the editor
4. Click **Run**

You should see: `Success. No rows returned`

This creates all 16 tables, enables Row Level Security (permissive policies for now),
and installs the `set_updated_at` trigger.

---

## Step 2 — Seed the Data

1. In the SQL Editor, open a **New query**
2. Open `supabase/seed.sql` from this repo
3. Paste the entire contents into the editor
4. Click **Run**

This inserts all mock data: 6 profiles, 6 customers, 6 appliances, 8 jobs,
2 estimates, 5 approvals, 10 audit log entries, 1 pricing config, 5 integration configs.

All inserts use `ON CONFLICT DO NOTHING` — safe to re-run.

---

## Step 3 — Create the Photo Storage Bucket

1. Go to **Storage** in the left sidebar
2. Click **New bucket**
3. Name: `job-photos`
4. **Public bucket**: leave OFF (photos are job-specific)
5. Click **Create bucket**

Add a storage policy to allow authenticated reads/writes (will be tightened in Task #4):

```sql
-- Run in SQL Editor
insert into storage.buckets (id, name, public) values ('job-photos', 'job-photos', false)
on conflict (id) do nothing;

create policy "job_photos_all" on storage.objects for all
  using (bucket_id = 'job-photos') with check (bucket_id = 'job-photos');
```

---

## Step 4 — Store Credentials in Replit Secrets

**Never paste credentials into application code.** Use Replit's Secrets tool.

You need three values from your Supabase project → **Settings → API**:

| Secret Name                    | Where to find it                        |
|--------------------------------|-----------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`     | Project URL (e.g. `https://xxxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`| `anon` / `public` key                  |
| `SUPABASE_SERVICE_ROLE_KEY`    | `service_role` / `secret` key — **never expose this client-side** |

The agent will request these via Replit's secure Secrets form.

---

## Demo Accounts (for Task #4 — Auth Migration)

When Supabase Auth is configured, create these 3 accounts in
**Authentication → Users → Add user**:

| Name            | Email                    | Password         | Role        |
|-----------------|--------------------------|------------------|-------------|
| Michael Reeves  | owner@jdrluxury.com      | `JDR-Owner-2026!`   | owner    |
| Sandra Kim      | manager@jdrluxury.com    | `JDR-Manager-2026!` | manager  |
| Carlos Mendez   | tech@jdrluxury.com       | `JDR-Tech-2026!`    | technician |

After creating each user in Auth, run this SQL to link the `auth.users.id` to the
`profiles` table. Replace `<UUID>` with the UUID Supabase assigned:

```sql
-- Example for Michael Reeves — repeat for Sandra and Carlos
update public.profiles
set id = '<UUID-from-auth>'
where email = 'owner@jdrluxury.com';
```

> **Note:** The other 3 technicians (Jasmine, Derek, Alicia) use demo ids `u4`–`u6`
> and do not need Auth accounts until the technician invitation flow is built (future task).

---

## Schema Overview

| Table                | Purpose                                            |
|---------------------|----------------------------------------------------|
| `profiles`           | Users (owners, managers, technicians) + roles      |
| `customers`          | Customer records with address and tier             |
| `appliances`         | Appliance inventory with warranty/serial info      |
| `jobs`               | Work orders with status, address, tech assignment  |
| `estimates`          | Manager-approved estimates (part of job record)    |
| `approvals`          | Approval requests (estimates, parts, warranty)     |
| `job_workflow`       | Technician checklist state per job                 |
| `job_readings`       | Meter readings captured on-site                    |
| `job_photos`         | Photo metadata (files in Supabase Storage)         |
| `job_reports`        | Service reports written by technicians             |
| `job_estimates`      | Tech draft estimates (pre-approval)                |
| `job_symptoms`       | Symptom intake forms                               |
| `job_diagnostics`    | Diagnostic results and confirmed diagnoses         |
| `oem_parts`          | OEM parts catalog (reference data)                 |
| `audit_log`          | Append-only action history (approvals, pricing…)   |
| `pricing_config`     | Single-row pricing configuration                   |
| `integration_configs`| Integration connection state (no secrets stored)   |

---

## Row Level Security

All tables have RLS **enabled** with permissive `USING (true)` policies.
This means all authenticated (and currently unauthenticated) requests can read/write.

When Task #4 (auth migration) is complete, the RLS policies will be tightened:
- Technicians can only see their own jobs
- Managers/owners can see all records
- The audit log is insert-only (no updates or deletes)

---

## Subsequent Migrations

Future schema changes go in numbered files:
- `002_hcp_columns.sql` — adds `hcp_job_id` to jobs and `hcp_customer_id` to customers (Task #6)
- `003_rls_policies.sql` — tightened RLS after auth is live (Task #4)
