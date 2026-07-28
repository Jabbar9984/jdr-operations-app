-- ============================================================================
-- JDR Operations — Initial Database Schema
-- Migration: 001_initial_schema.sql
--
-- Apply via Supabase Dashboard → SQL Editor
-- Run schema first, then supabase/seed.sql
-- ============================================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";


-- ============================================================================
-- PROFILES
-- Extends auth.users with role and field-service profile data.
-- id must match auth.users.id for the user.
-- ============================================================================
create table if not exists public.profiles (
  id                 text        primary key,   -- matches auth.users.id (or demo id like 'u1')
  name               text        not null,
  email              text        not null unique,
  role               text        not null check (role in ('owner','manager','technician')),
  phone              text,
  certifications     text[],
  join_date          date,
  zone               text,
  bio                text,
  emergency_contact  text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "profiles_open" on public.profiles for all using (true) with check (true);


-- ============================================================================
-- CUSTOMERS
-- ============================================================================
create table if not exists public.customers (
  id               text        primary key,
  name             text        not null,
  email            text        not null,
  phone            text        not null,
  street           text        not null,
  city             text        not null,
  state            text        not null,
  zip              text        not null,
  member_since     date        not null,
  tier             text        not null check (tier in ('standard','premium','vip')),
  notes            text,
  hcp_customer_id  text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.customers enable row level security;
create policy "customers_open" on public.customers for all using (true) with check (true);


-- ============================================================================
-- APPLIANCES
-- ============================================================================
create table if not exists public.appliances (
  id               text        primary key,
  type             text        not null,
  brand            text        not null,
  model            text        not null,
  serial           text        not null,
  install_date     date        not null,
  warranty_expiry  date,
  last_serviced    date,
  purchase_date    date,
  voltage          text,
  amperage         text,
  refrigerant      text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.appliances enable row level security;
create policy "appliances_open" on public.appliances for all using (true) with check (true);


-- ============================================================================
-- JOBS
-- ============================================================================
create table if not exists public.jobs (
  id                     text        primary key,
  title                  text        not null,
  status                 text        not null check (status in ('scheduled','en_route','in_progress','pending_approval','completed','cancelled')),
  priority               text        not null check (priority in ('low','normal','high','urgent')),
  customer_id            text        not null references public.customers(id),
  technician_id          text        not null references public.profiles(id),
  appliance_id           text        not null references public.appliances(id),
  scheduled_at           timestamptz not null,
  estimated_duration     int         not null,  -- minutes
  street                 text        not null,
  city                   text        not null,
  state                  text        not null,
  zip                    text        not null,
  description            text        not null,
  customer_complaint     text,
  diagnosis              text,
  resolution             text,
  estimate_id            text,
  completed_at           timestamptz,
  tags                   text[],
  reported_error_codes   text[],
  hcp_job_id             text        unique,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index if not exists jobs_technician_idx    on public.jobs(technician_id);
create index if not exists jobs_customer_idx      on public.jobs(customer_id);
create index if not exists jobs_status_idx        on public.jobs(status);
create index if not exists jobs_scheduled_at_idx  on public.jobs(scheduled_at);

alter table public.jobs enable row level security;
create policy "jobs_open" on public.jobs for all using (true) with check (true);


-- ============================================================================
-- ESTIMATES
-- ============================================================================
create table if not exists public.estimates (
  id           text        primary key,
  job_id       text        not null references public.jobs(id),
  labor_hours  numeric     not null,
  labor_rate   numeric     not null,
  parts        jsonb       not null default '[]',  -- LineItem[]
  total        numeric     not null,
  status       text        not null check (status in ('draft','pending_approval','approved','rejected')),
  notes        text,
  approved_by  text        references public.profiles(id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.estimates enable row level security;
create policy "estimates_open" on public.estimates for all using (true) with check (true);


-- ============================================================================
-- APPROVALS
-- ============================================================================
create table if not exists public.approvals (
  id            text        primary key,
  type          text        not null check (type in ('estimate','part_order','warranty_claim')),
  job_id        text        not null references public.jobs(id),
  requested_by  text        not null references public.profiles(id),
  requested_at  timestamptz not null,
  amount        numeric,
  description   text        not null,
  status        text        not null check (status in ('pending','approved','rejected','returned')) default 'pending',
  reviewed_by   text        references public.profiles(id),
  reviewed_at   timestamptz,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists approvals_status_idx   on public.approvals(status);
create index if not exists approvals_job_id_idx   on public.approvals(job_id);

alter table public.approvals enable row level security;
create policy "approvals_open" on public.approvals for all using (true) with check (true);


-- ============================================================================
-- JOB WORKFLOW STATE
-- One row per job per technician — tracks checklist completion.
-- ============================================================================
create table if not exists public.job_workflow (
  job_id               text        not null references public.jobs(id),
  technician_id        text        not null references public.profiles(id),
  symptoms_recorded    boolean     not null default false,
  diagnostic_completed boolean     not null default false,
  readings_recorded    boolean     not null default false,
  photos_added         boolean     not null default false,
  report_completed     boolean     not null default false,
  estimate_built       boolean     not null default false,
  submitted            boolean     not null default false,
  last_updated         timestamptz not null default now(),
  created_at           timestamptz not null default now(),
  primary key (job_id, technician_id)
);

alter table public.job_workflow enable row level security;
create policy "job_workflow_open" on public.job_workflow for all using (true) with check (true);


-- ============================================================================
-- JOB READINGS (meter readings)
-- ============================================================================
create table if not exists public.job_readings (
  id             text        primary key default gen_random_uuid()::text,
  job_id         text        not null references public.jobs(id),
  technician_id  text        not null references public.profiles(id),
  template_id    text,
  type           text        not null check (type in ('voltage','resistance','continuity','temperature','pressure')),
  component      text        not null,
  expected_value text        not null,
  measured_value text        not null,
  unit           text        not null,
  result         text        not null check (result in ('pass','fail','marginal','pending')),
  notes          text        not null default '',
  timestamp      timestamptz not null default now(),
  created_at     timestamptz not null default now()
);

create index if not exists job_readings_job_id_idx on public.job_readings(job_id);

alter table public.job_readings enable row level security;
create policy "job_readings_open" on public.job_readings for all using (true) with check (true);


-- ============================================================================
-- JOB PHOTOS
-- Metadata only — actual files live in Supabase Storage bucket 'job-photos'.
-- ============================================================================
create table if not exists public.job_photos (
  id             text        primary key default gen_random_uuid()::text,
  job_id         text        not null references public.jobs(id),
  technician_id  text        not null references public.profiles(id),
  storage_path   text        not null,  -- path in 'job-photos' bucket
  filename       text        not null,
  caption        text        not null default '',
  category       text        not null check (category in ('before','after','defect','parts','serial_number','meter_reading','other')),
  file_size      int,                   -- bytes
  timestamp      timestamptz not null default now(),
  created_at     timestamptz not null default now()
);

create index if not exists job_photos_job_id_idx on public.job_photos(job_id);

alter table public.job_photos enable row level security;
create policy "job_photos_open" on public.job_photos for all using (true) with check (true);


-- ============================================================================
-- JOB REPORTS (service reports)
-- ============================================================================
create table if not exists public.job_reports (
  id                    text        primary key default gen_random_uuid()::text,
  job_id                text        not null references public.jobs(id),
  technician_id         text        not null references public.profiles(id),
  repair_type           text        not null check (repair_type in ('diagnosis_only','parts_replaced','adjustment_cleaning','warranty_repair','no_fault_found','refer_to_manager')),
  work_performed        text        not null,
  parts_replaced        text[],
  start_time            timestamptz not null,
  end_time              timestamptz not null,
  labor_minutes         int,
  travel_time_minutes   int,
  outcome               text        not null,
  customer_informed     boolean     not null default false,
  follow_up_required    boolean     not null default false,
  follow_up_notes       text,
  tech_notes            text,
  safety_concerns       text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists job_reports_job_id_idx on public.job_reports(job_id);

alter table public.job_reports enable row level security;
create policy "job_reports_open" on public.job_reports for all using (true) with check (true);


-- ============================================================================
-- JOB ESTIMATES (tech draft — separate from manager-approved estimates table)
-- ============================================================================
create table if not exists public.job_estimates (
  id             text        primary key default gen_random_uuid()::text,
  job_id         text        not null references public.jobs(id),
  technician_id  text        not null references public.profiles(id),
  lines          jsonb       not null default '[]',  -- EstimateLine[]
  notes          text,
  subtotal       numeric     not null default 0,
  tax            numeric     not null default 0,
  total          numeric     not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists job_estimates_job_id_idx on public.job_estimates(job_id);

alter table public.job_estimates enable row level security;
create policy "job_estimates_open" on public.job_estimates for all using (true) with check (true);


-- ============================================================================
-- JOB SYMPTOMS
-- ============================================================================
create table if not exists public.job_symptoms (
  id                   text        primary key default gen_random_uuid()::text,
  job_id               text        not null references public.jobs(id),
  technician_id        text        not null references public.profiles(id),
  customer_complaint   text        not null default '',
  observed_symptoms    text[]      not null default '{}',
  error_codes          text[]      not null default '{}',
  appliance_age        text        not null default '',
  frequency_of_issue   text        not null default '',
  when_occurs          text        not null default '',
  additional_notes     text        not null default '',
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists job_symptoms_job_id_idx on public.job_symptoms(job_id);

alter table public.job_symptoms enable row level security;
create policy "job_symptoms_open" on public.job_symptoms for all using (true) with check (true);


-- ============================================================================
-- JOB DIAGNOSTICS
-- ============================================================================
create table if not exists public.job_diagnostics (
  id                    text        primary key default gen_random_uuid()::text,
  job_id                text        not null references public.jobs(id),
  technician_id         text        not null references public.profiles(id),
  guide_id              text        not null,
  confirmed_diagnosis   text        not null,
  tech_notes            text        not null default '',
  completed_tests       text[]      not null default '{}',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists job_diagnostics_job_id_idx on public.job_diagnostics(job_id);

alter table public.job_diagnostics enable row level security;
create policy "job_diagnostics_open" on public.job_diagnostics for all using (true) with check (true);


-- ============================================================================
-- OEM PARTS
-- ============================================================================
create table if not exists public.oem_parts (
  id                text        primary key,
  brand             text        not null,
  part_number       text        not null,
  oem_part_number   text,
  description       text        not null,
  category          text        not null,
  appliance_types   text[]      not null default '{}',
  compatible_models text[]      not null default '{}',
  unit_cost         numeric     not null,
  availability      text        not null check (availability in ('in_stock','order_2_3_days','order_1_week','special_order')),
  weight            text,
  notes             text,
  superseded_by     text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.oem_parts enable row level security;
create policy "oem_parts_open" on public.oem_parts for all using (true) with check (true);


-- ============================================================================
-- AUDIT LOG (append-only)
-- ============================================================================
create table if not exists public.audit_log (
  id            text        primary key default gen_random_uuid()::text,
  timestamp     timestamptz not null default now(),
  actor_id      text        not null,
  actor_name    text        not null,
  action        text        not null check (action in ('created','approved','rejected','returned_for_info','edited','status_changed','submitted','updated','connected','disconnected')),
  entity_type   text        not null check (entity_type in ('approval','job','estimate','pricing','integration','user')),
  entity_id     text        not null,
  entity_label  text        not null,
  before_value  text,
  after_value   text,
  notes         text,
  created_at    timestamptz not null default now()
);

create index if not exists audit_log_timestamp_idx    on public.audit_log(timestamp desc);
create index if not exists audit_log_entity_type_idx  on public.audit_log(entity_type);
create index if not exists audit_log_actor_id_idx     on public.audit_log(actor_id);

alter table public.audit_log enable row level security;
create policy "audit_log_select_open"  on public.audit_log for select using (true);
create policy "audit_log_insert_open"  on public.audit_log for insert with check (true);
-- No update/delete policy — audit log is append-only


-- ============================================================================
-- PRICING CONFIG (single-row table — id is always 'default')
-- ============================================================================
create table if not exists public.pricing_config (
  id                              text    primary key default 'default',
  labor_rate_per_hour             numeric not null,
  diagnostic_fee                  numeric not null,
  travel_fee_standard             numeric not null,
  travel_fee_premium              numeric not null,
  minimum_service_charge          numeric not null,
  after_hours_surcharge_percent   numeric not null,
  tier_multiplier_standard        numeric not null,
  tier_multiplier_premium         numeric not null,
  tier_multiplier_vip             numeric not null,
  tax_rate_percent                numeric not null,
  warranty_labor_rate             numeric not null,
  updated_at                      timestamptz not null default now(),
  updated_by                      text        not null
);

alter table public.pricing_config enable row level security;
create policy "pricing_config_open" on public.pricing_config for all using (true) with check (true);


-- ============================================================================
-- INTEGRATION CONFIGS
-- Stores connection metadata. Actual secrets are in Replit Secrets / env vars,
-- never in this table.
-- ============================================================================
create table if not exists public.integration_configs (
  id             text        primary key,
  name           text        not null,
  description    text        not null,
  category       text        not null check (category in ('field_service','payments','ai','communications','warranty')),
  status         text        not null check (status in ('connected','disconnected','pending','error')) default 'disconnected',
  logo_initials  text        not null,
  logo_color     text        not null,
  features       text[]      not null default '{}',
  config_fields  jsonb       not null default '[]',
  config_values  jsonb,      -- non-secret config values only (e.g. company_id, model name)
  notes          text,
  last_synced    timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.integration_configs enable row level security;
create policy "integration_configs_open" on public.integration_configs for all using (true) with check (true);


-- ============================================================================
-- UPDATED_AT TRIGGER (auto-update updated_at on row changes)
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$ begin
  create trigger trg_profiles_updated_at          before update on public.profiles          for each row execute function public.set_updated_at();
  create trigger trg_customers_updated_at         before update on public.customers         for each row execute function public.set_updated_at();
  create trigger trg_appliances_updated_at        before update on public.appliances        for each row execute function public.set_updated_at();
  create trigger trg_jobs_updated_at              before update on public.jobs              for each row execute function public.set_updated_at();
  create trigger trg_estimates_updated_at         before update on public.estimates         for each row execute function public.set_updated_at();
  create trigger trg_approvals_updated_at         before update on public.approvals         for each row execute function public.set_updated_at();
  create trigger trg_job_reports_updated_at       before update on public.job_reports       for each row execute function public.set_updated_at();
  create trigger trg_job_estimates_updated_at     before update on public.job_estimates     for each row execute function public.set_updated_at();
  create trigger trg_job_symptoms_updated_at      before update on public.job_symptoms      for each row execute function public.set_updated_at();
  create trigger trg_job_diagnostics_updated_at   before update on public.job_diagnostics   for each row execute function public.set_updated_at();
  create trigger trg_oem_parts_updated_at         before update on public.oem_parts         for each row execute function public.set_updated_at();
  create trigger trg_pricing_config_updated_at    before update on public.pricing_config    for each row execute function public.set_updated_at();
  create trigger trg_integration_configs_updated_at before update on public.integration_configs for each row execute function public.set_updated_at();
exception when duplicate_object then null;
end $$;
