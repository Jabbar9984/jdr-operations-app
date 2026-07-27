# JDR Operations App

A mobile-first field-service application for **JDR Luxury Appliances**.

## Stack

- **Framework**: Next.js 14 App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS (custom JDR design system)
- **Data**: Mock data (no external APIs at this stage)

## Running the App

```bash
npm run dev   # starts on port 5000
```

The workflow "Start application" handles this automatically.

## Demo Login

Visit `/login` and select one of three demo roles:

| Role | Name | Access |
|---|---|---|
| **Owner** | Michael Reeves | Full access: all ops pages + settings |
| **Manager** | Sandra Kim | All ops pages (dashboard, jobs, approvals, techs, reports, settings) |
| **Technician** | Carlos Mendez | Tech portal (dashboard, jobs, diagnose, reports, profile) |

## Route Structure

### Technician Portal (`/tech/*`)
- `/tech/dashboard` — daily overview, stats, next job
- `/tech/jobs` — all assigned jobs with status filters
- `/tech/jobs/[id]` — full job detail
- `/tech/diagnose` — diagnostic form with fault codes, parts, estimate builder
- `/tech/reports` — personal performance metrics
- `/tech/profile` — profile, certs, settings

### Operations Portal (`/ops/*`)
- `/ops/dashboard` — KPIs, active jobs, approvals, technician overview
- `/ops/jobs` — all jobs with search and filters
- `/ops/jobs/[id]` — full job detail with approve/reject
- `/ops/approvals` — approval queue (estimates, parts orders, warranty claims)
- `/ops/technicians` — team overview with expandable cards
- `/ops/reports` — operations reporting dashboard
- `/ops/settings` — company settings and configuration

## Design System

Custom Tailwind colors defined in `tailwind.config.ts`:

- `jdr-navy` / `jdr-navy-light` — primary brand colors
- `jdr-gold` / `jdr-gold-light` / `jdr-gold-dark` — accent gold
- `jdr-cream` / `jdr-cream-dark` — background tones
- `jdr-slate` — secondary text
- `jdr-charcoal` — labels

Shared CSS classes in `globals.css`: `.jdr-card`, `.jdr-btn-primary`, `.jdr-btn-gold`, `.jdr-badge`, `.jdr-input`

## User Preferences

- Mobile-first layout (bottom nav for techs, collapsible sidebar for managers)
- Mock data only for Checkpoint 1 — no Supabase, no external APIs
