-- ============================================================================
-- JDR Operations — Seed Data
-- File: supabase/seed.sql
--
-- Run AFTER 001_initial_schema.sql in the Supabase Dashboard SQL Editor.
-- This populates the database with all mock data from the app's current state.
-- Safe to re-run: all inserts use ON CONFLICT DO NOTHING.
-- ============================================================================


-- ============================================================================
-- PROFILES (users)
-- Note: These ids (u1–u6) are used as demo auth ids.
-- When Supabase Auth is wired up (Task #4), each profile id must match
-- the corresponding auth.users.id. For now they use the demo short ids.
-- ============================================================================
insert into public.profiles (id, name, email, role, phone, certifications, join_date, zone, bio, emergency_contact) values
  ('u1', 'Michael Reeves', 'owner@jdrluxury.com',   'owner',      '(310) 555-0101', null,                                                                                         '2019-03-15', null,                          null, null),
  ('u2', 'Sandra Kim',     'manager@jdrluxury.com',  'manager',    '(310) 555-0102', null,                                                                                         '2020-06-01', null,                          null, null),
  ('u3', 'Carlos Mendez',  'tech@jdrluxury.com',     'technician', '(323) 555-0201', array['Sub-Zero Certified','Wolf Appliances Pro','EPA 608 Universal','NATE Certified'],     '2021-02-14', 'West LA / Beverly Hills',    '12+ years in luxury appliance service. Specializes in Sub-Zero refrigeration systems and Wolf cooking appliances.', '(323) 555-0999 – Maria Mendez'),
  ('u4', 'Jasmine Patel',  'jasmine@jdrluxury.com',  'technician', '(323) 555-0202', array['Miele Certified Elite','Gaggenau Pro','EPA 608'],                                     '2021-08-22', 'Brentwood / Santa Monica',   'Miele and Gaggenau specialist with deep expertise in European appliance systems.', null),
  ('u5', 'Derek Thompson', 'derek@jdrluxury.com',    'technician', '(818) 555-0203', array['Thermador Certified','Bosch Pro Series','EPA 608'],                                   '2022-01-10', 'Sherman Oaks / Studio City', null, null),
  ('u6', 'Alicia Fontaine','alicia@jdrluxury.com',   'technician', '(310) 555-0204', array['Sub-Zero Certified','Viking Pro'],                                                    '2022-09-05', 'Malibu / Pacific Palisades', null, null)
on conflict (id) do nothing;


-- ============================================================================
-- CUSTOMERS
-- ============================================================================
insert into public.customers (id, name, email, phone, street, city, state, zip, member_since, tier, notes) values
  ('c1', 'Eleanor Hartwell', 'ehartwell@email.com', '(310) 555-1001', '1420 Crescent Dr',      'Beverly Hills',   'CA', '90210', '2021-04-10', 'vip',      'Prefers morning appointments. Do not park in driveway.'),
  ('c2', 'Robert Ashton',    'rashton@email.com',   '(310) 555-1002', '889 Sunset Blvd',        'West Hollywood',  'CA', '90069', '2020-11-22', 'premium',  null),
  ('c3', 'Diana Whitmore',   'dwhitmore@email.com', '(310) 555-1003', '2245 Pacific Coast Hwy', 'Malibu',          'CA', '90265', '2019-07-08', 'vip',      'Has two large dogs. Ring doorbell twice.'),
  ('c4', 'Thomas Brennan',   'tbrennan@email.com',  '(310) 555-1004', '560 N Carolwood Dr',     'Los Angeles',     'CA', '90077', '2022-02-14', 'standard', null),
  ('c5', 'Catherine Voss',   'cvoss@email.com',     '(310) 555-1005', '18 Via Condotti',         'Santa Monica',    'CA', '90402', '2021-09-30', 'premium',  null),
  ('c6', 'James Lattimore',  'jlattimore@email.com','(818) 555-1006', '4401 Ventura Blvd',       'Sherman Oaks',    'CA', '91423', '2023-01-15', 'standard', null)
on conflict (id) do nothing;


-- ============================================================================
-- APPLIANCES
-- ============================================================================
insert into public.appliances (id, type, brand, model, serial, install_date, warranty_expiry, last_serviced, voltage, amperage, refrigerant) values
  ('a1', 'Refrigerator', 'Sub-Zero',  'PRO 48',       'SZ-PRO48-221047',  '2021-06-20', '2024-06-20', '2023-11-10', '115V',       '15A', 'R-134a'),
  ('a2', 'Range',        'Wolf',      'GR486G',        'WF-GR486-190832',  '2020-03-12', '2023-03-12', '2023-08-22', '120/240V',   '50A', null),
  ('a3', 'Dishwasher',   'Miele',     'G 7966 SCVi',   'MI-G7966-220491',  '2022-01-08', '2025-01-08', '2024-02-14', '120V',       '15A', null),
  ('a4', 'Wine Cooler',  'Sub-Zero',  '424G',          'SZ-424G-230186',   '2023-04-15', '2026-04-15', null,          '115V',       '15A', 'R-600a'),
  ('a5', 'Wall Oven',    'Thermador', 'ME302WS',       'TH-ME302-181223',  '2019-09-22', '2022-09-22', '2023-12-05', '240V',       '30A', null),
  ('a6', 'Cooktop',      'Gaggenau',  'VG 295 214',    'GG-VG295-210774',  '2021-11-30', '2024-11-30', '2024-01-18', '240V',       '40A', null)
on conflict (id) do nothing;


-- ============================================================================
-- JOBS
-- ============================================================================
insert into public.jobs (id, title, status, priority, customer_id, technician_id, appliance_id, scheduled_at, estimated_duration, street, city, state, zip, description, customer_complaint, diagnosis, resolution, estimate_id, completed_at, tags, reported_error_codes, created_at) values
  ('j1', 'Sub-Zero Refrigerator – Cooling Issue',          'in_progress',      'urgent', 'c1', 'u3', 'a1', '2026-07-27T09:00:00Z', 120, '1420 Crescent Dr',      'Beverly Hills',  'CA', '90210', 'Customer reports refrigerator not maintaining temperature below 45°F. Ice maker also not producing ice.', 'Fridge won''t get cold. Everything is warm and the ice maker stopped working two days ago. We have a dinner party this weekend and this is urgent.', null, null, 'e1', null, array['warranty','urgent'], array[]::text[], '2026-07-25T14:30:00Z'),
  ('j2', 'Wolf Range – Igniter Replacement',               'scheduled',        'normal', 'c2', 'u3', 'a2', '2026-07-27T13:00:00Z',  90, '889 Sunset Blvd',        'West Hollywood', 'CA', '90069', 'Two burners failing to ignite consistently. Customer reports clicking sound but no flame.', 'The front two burners keep clicking but won''t light. Sometimes after 20–30 clicks they catch, but most of the time nothing. Back burners work fine.', null, null, null, null, array['igniter'], array[]::text[], '2026-07-26T09:00:00Z'),
  ('j3', 'Miele Dishwasher – Error Code E62',              'pending_approval', 'high',   'c3', 'u4', 'a3', '2026-07-27T10:30:00Z',  75, '2245 Pacific Coast Hwy', 'Malibu',         'CA', '90265', 'Dishwasher displaying E62 error code, not completing wash cycles.', 'Dishwasher shows E62 and stops mid-cycle. The dishes come out wet and dirty. This started happening every other cycle, now every cycle.', 'Heating element failed. Water inlet valve also shows reduced flow.', null, 'e2', null, array['error_code'], array['E62'], '2026-07-26T11:00:00Z'),
  ('j4', 'Sub-Zero Wine Cooler – Temperature Fluctuation', 'scheduled',        'normal', 'c4', 'u5', 'a4', '2026-07-27T14:30:00Z',  60, '560 N Carolwood Dr',     'Los Angeles',    'CA', '90077', 'Wine cooler temperature swinging ±8°F. Customer concerned about wine collection.', 'The temperature display shows 58°F but it goes up to 66°F and sometimes down to 50°F. I have a $40,000 wine collection in here.', null, null, null, null, null, null, '2026-07-26T15:00:00Z'),
  ('j5', 'Thermador Oven – Calibration & Maintenance',     'completed',        'low',    'c5', 'u4', 'a5', '2026-07-27T08:00:00Z',  60, '18 Via Condotti',         'Santa Monica',   'CA', '90402', 'Annual calibration and preventive maintenance per service contract.', null, 'Oven calibrated. Gaskets replaced. Door spring tension adjusted.', 'All systems nominal. Calibration confirmed within spec.', null, '2026-07-27T09:12:00Z', null, null, '2026-07-24T10:00:00Z'),
  ('j6', 'Gaggenau Cooktop – Induction Zone Failure',      'en_route',         'high',   'c6', 'u6', 'a6', '2026-07-27T11:00:00Z',  90, '4401 Ventura Blvd',       'Sherman Oaks',   'CA', '91423', 'Front-left induction zone not responding. Unit shows F1 fault code.', 'Left front burner completely dead. Shows F1 on display. Other zones work fine.', null, null, null, null, array['induction','fault_code'], array['F1'], '2026-07-26T16:30:00Z'),
  ('j7', 'Sub-Zero Refrigerator – Annual Maintenance',     'scheduled',        'low',    'c1', 'u3', 'a1', '2026-07-28T10:00:00Z',  45, '1420 Crescent Dr',        'Beverly Hills',  'CA', '90210', 'Annual maintenance visit per VIP service contract.', null, null, null, null, null, null, null, '2026-07-20T08:00:00Z'),
  ('j8', 'Wolf Range – Deep Clean & Burner Service',       'scheduled',        'normal', 'c5', 'u4', 'a2', '2026-07-29T09:00:00Z', 120, '18 Via Condotti',          'Santa Monica',   'CA', '90402', 'Premium deep clean service with full burner disassembly and cleaning.', null, null, null, null, null, null, null, '2026-07-22T14:00:00Z')
on conflict (id) do nothing;


-- ============================================================================
-- ESTIMATES
-- ============================================================================
insert into public.estimates (id, job_id, labor_hours, labor_rate, parts, total, status, notes, created_at) values
  ('e1', 'j1', 3, 185,
   '[{"description":"Sub-Zero Evaporator Fan Motor (4204490)","qty":1,"unitPrice":320},{"description":"Compressor Start Relay (4211614)","qty":1,"unitPrice":48},{"description":"Refrigerant R-134a (1lb)","qty":2,"unitPrice":35}]'::jsonb,
   993, 'pending_approval', 'Fan motor is in stock. Compressor relay available next-day.', '2026-07-27T10:30:00Z'),
  ('e2', 'j3', 2, 185,
   '[{"description":"Miele Heating Element (10289840)","qty":1,"unitPrice":210},{"description":"Water Inlet Valve (07119570)","qty":1,"unitPrice":95}]'::jsonb,
   675, 'pending_approval', 'Parts must be ordered. Lead time 2–3 business days.', '2026-07-27T11:45:00Z')
on conflict (id) do nothing;


-- ============================================================================
-- APPROVALS
-- ============================================================================
insert into public.approvals (id, type, job_id, requested_by, requested_at, amount, description, status, reviewed_by, reviewed_at, notes) values
  ('ap1', 'estimate',       'j1', 'u3', '2026-07-27T10:35:00Z', 993, 'Estimate for Sub-Zero PRO 48 evaporator fan motor replacement + relay',                   'pending',  null, null, null),
  ('ap2', 'estimate',       'j3', 'u4', '2026-07-27T11:50:00Z', 675, 'Estimate for Miele G7966 heating element + water inlet valve replacement',                  'pending',  null, null, null),
  ('ap3', 'part_order',     'j6', 'u6', '2026-07-27T08:20:00Z', 480, 'Emergency order: Gaggenau induction zone PCB module (11021752)',                            'pending',  null, null, null),
  ('ap4', 'warranty_claim', 'j3', 'u4', '2026-07-26T16:00:00Z', 210, 'Warranty claim for Miele heating element',                                                  'approved', 'u2', '2026-07-26T17:30:00Z', 'Approved. Submitted to Miele warranty portal.'),
  ('ap5', 'part_order',     'j4', 'u5', '2026-07-26T14:00:00Z', 155, 'Sub-Zero Wine Cooler thermostat assembly replacement (7021186)',                            'rejected', 'u2', '2026-07-26T15:45:00Z', 'Incorrect part number. Re-submit with correct SKU.')
on conflict (id) do nothing;


-- ============================================================================
-- AUDIT LOG (seed entries)
-- ============================================================================
insert into public.audit_log (id, timestamp, actor_id, actor_name, action, entity_type, entity_id, entity_label, before_value, after_value, notes) values
  ('al1',  '2026-07-26T17:30:00Z', 'u2', 'Sandra Kim',     'approved',       'approval', 'ap4', 'Warranty claim – Miele heating element',                       'pending',    'approved', 'Approved. Submitted to Miele warranty portal.'),
  ('al2',  '2026-07-26T15:45:00Z', 'u2', 'Sandra Kim',     'rejected',       'approval', 'ap5', 'Part order – Sub-Zero wine cooler thermostat',                  'pending',    'rejected', 'Incorrect part number. Re-submit with correct SKU.'),
  ('al3',  '2026-07-27T10:35:00Z', 'u3', 'Carlos Mendez',  'submitted',      'approval', 'ap1', 'Estimate – Sub-Zero PRO 48 evaporator fan motor',               'draft',      'pending',  null),
  ('al4',  '2026-07-27T11:50:00Z', 'u4', 'Jasmine Patel',  'submitted',      'approval', 'ap2', 'Estimate – Miele G7966 heating element + inlet valve',          'draft',      'pending',  null),
  ('al5',  '2026-07-27T08:20:00Z', 'u6', 'Alicia Fontaine','submitted',      'approval', 'ap3', 'Emergency part order – Gaggenau induction zone PCB',            'draft',      'pending',  null),
  ('al6',  '2026-07-27T09:00:00Z', 'u3', 'Carlos Mendez',  'status_changed', 'job',      'j1',  'Sub-Zero Refrigerator – Cooling Issue',                          'scheduled',  'in_progress', null),
  ('al7',  '2026-07-27T08:00:00Z', 'u4', 'Jasmine Patel',  'status_changed', 'job',      'j5',  'Thermador Oven – Calibration & Maintenance',                     'in_progress','completed',    null),
  ('al8',  '2026-07-26T14:00:00Z', 'u5', 'Derek Thompson', 'submitted',      'approval', 'ap5', 'Part order – Sub-Zero wine cooler thermostat (7021186)',         'draft',      'pending',  null),
  ('al9',  '2026-07-25T16:00:00Z', 'u1', 'Michael Reeves', 'updated',        'pricing',  'pricing_config', 'Pricing: Labor Rate per Hour',                         '$175/hr',    '$185/hr',  null),
  ('al10', '2026-07-24T10:00:00Z', 'u2', 'Sandra Kim',     'created',        'job',      'j8',  'Wolf Range – Deep Clean & Burner Service',                       null,         null,       'Scheduled per VIP service contract for Catherine Voss.')
on conflict (id) do nothing;


-- ============================================================================
-- PRICING CONFIG
-- ============================================================================
insert into public.pricing_config (id, labor_rate_per_hour, diagnostic_fee, travel_fee_standard, travel_fee_premium, minimum_service_charge, after_hours_surcharge_percent, tier_multiplier_standard, tier_multiplier_premium, tier_multiplier_vip, tax_rate_percent, warranty_labor_rate, updated_at, updated_by) values
  ('default', 185, 125, 45, 65, 185, 25, 1.0, 1.1, 1.2, 10.25, 95, '2026-07-25T16:00:00Z', 'Michael Reeves')
on conflict (id) do nothing;


-- ============================================================================
-- INTEGRATION CONFIGS
-- ============================================================================
insert into public.integration_configs (id, name, description, category, status, logo_initials, logo_color, features, config_fields, notes, last_synced) values
  ('int_hcp',    'Housecall Pro',         'Field service management — jobs, dispatch, invoicing, and customer portal.',                   'field_service',  'disconnected', 'HCP', 'bg-blue-600',    array['Two-way job sync','Invoice generation','Customer notifications','Dispatch board','GPS tracking'],                      '[{"key":"api_key","label":"API Key","placeholder":"hcp_live_xxxxxxxxxxxxxxxx","masked":true},{"key":"company_id","label":"Company ID","placeholder":"your-company-id"},{"key":"webhook_url","label":"Webhook URL","placeholder":"https://yourapp.com/webhooks/hcp"}]'::jsonb,         'Connect your Housecall Pro account to sync jobs, estimates, and invoices automatically.', null),
  ('int_stripe', 'Stripe',                'Payment processing — accept cards, ACH, and digital wallets on estimates and invoices.',        'payments',       'disconnected', 'STR', 'bg-violet-600',  array['Card & ACH payments','Digital invoices','Automatic receipts','Refund management','Revenue reporting'],                   '[{"key":"publishable_key","label":"Publishable Key","placeholder":"pk_live_xxxxxxxx"},{"key":"secret_key","label":"Secret Key","placeholder":"sk_live_xxxxxxxx","masked":true},{"key":"webhook_secret","label":"Webhook Secret","placeholder":"whsec_xxxxxxxx","masked":true}]'::jsonb, null, null),
  ('int_openai', 'OpenAI',                'AI-powered diagnostic suggestions, report drafting, and customer communication.',               'ai',             'disconnected', 'AI',  'bg-emerald-600', array['Diagnostic AI assistant','Report auto-drafting','Customer message drafting','Knowledge base search'],                    '[{"key":"api_key","label":"API Key","placeholder":"sk-proj-xxxxxxxx","masked":true},{"key":"model","label":"Model","placeholder":"gpt-4o"}]'::jsonb,                                                                                                                                 'Enables AI diagnostic assistant and auto-draft features for service reports.', null),
  ('int_twilio', 'Twilio',                'SMS and voice notifications — appointment reminders, tech ETA alerts, and approval requests.',  'communications', 'disconnected', 'TWL', 'bg-red-600',     array['SMS appointment reminders','Tech ETA notifications','Manager approval alerts','Two-way SMS'],                             '[{"key":"account_sid","label":"Account SID","placeholder":"ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"},{"key":"auth_token","label":"Auth Token","placeholder":"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx","masked":true},{"key":"from_number","label":"From Number","placeholder":"+13105550100"}]'::jsonb, null, null),
  ('int_miele',  'Miele Warranty Portal', 'Direct warranty claim submission and status tracking with Miele Professional.',                'warranty',       'pending',      'MWP', 'bg-gray-700',    array['Online warranty claim submission','Claim status tracking','Parts pre-authorization','Labor rate confirmation'],           '[{"key":"dealer_id","label":"Dealer ID","placeholder":"JDR-LUXURY-001"},{"key":"portal_username","label":"Portal Username","placeholder":"your@email.com"},{"key":"portal_password","label":"Portal Password","placeholder":"••••••••","masked":true}]'::jsonb,                           'Registration pending Miele dealer approval. Expected activation within 5–7 business days.', null)
on conflict (id) do nothing;
