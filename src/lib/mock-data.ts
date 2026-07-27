import type {
  User,
  Customer,
  Appliance,
  Job,
  Estimate,
  Approval,
  TechnicianStats,
  DemoAccount,
} from "@/types";

// ─── Demo Accounts ────────────────────────────────────────────────────────────
export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: "u1",
    name: "Michael Reeves",
    role: "owner",
    email: "owner@jdrluxury.com",
    description: "Full access to all operations, financials & settings",
  },
  {
    id: "u2",
    name: "Sandra Kim",
    role: "manager",
    email: "manager@jdrluxury.com",
    description: "Manage jobs, approvals, technicians & reports",
  },
  {
    id: "u3",
    name: "Carlos Mendez",
    role: "technician",
    email: "tech@jdrluxury.com",
    description: "Field jobs, diagnostics & work orders",
  },
];

// ─── Users / Technicians ──────────────────────────────────────────────────────
export const USERS: User[] = [
  {
    id: "u1",
    name: "Michael Reeves",
    email: "owner@jdrluxury.com",
    role: "owner",
    phone: "(310) 555-0101",
    joinDate: "2019-03-15",
  },
  {
    id: "u2",
    name: "Sandra Kim",
    email: "manager@jdrluxury.com",
    role: "manager",
    phone: "(310) 555-0102",
    joinDate: "2020-06-01",
  },
  {
    id: "u3",
    name: "Carlos Mendez",
    email: "tech@jdrluxury.com",
    role: "technician",
    phone: "(323) 555-0201",
    certifications: ["Sub-Zero Certified", "Wolf Appliances", "EPA 608"],
    joinDate: "2021-02-14",
    zone: "West LA / Beverly Hills",
  },
  {
    id: "u4",
    name: "Jasmine Patel",
    email: "jasmine@jdrluxury.com",
    role: "technician",
    phone: "(323) 555-0202",
    certifications: ["Miele Certified", "Gaggenau", "EPA 608"],
    joinDate: "2021-08-22",
    zone: "Brentwood / Santa Monica",
  },
  {
    id: "u5",
    name: "Derek Thompson",
    email: "derek@jdrluxury.com",
    role: "technician",
    phone: "(818) 555-0203",
    certifications: ["Thermador Certified", "Bosch Pro", "EPA 608"],
    joinDate: "2022-01-10",
    zone: "Sherman Oaks / Studio City",
  },
  {
    id: "u6",
    name: "Alicia Fontaine",
    email: "alicia@jdrluxury.com",
    role: "technician",
    phone: "(310) 555-0204",
    certifications: ["Sub-Zero Certified", "Viking Appliances"],
    joinDate: "2022-09-05",
    zone: "Malibu / Pacific Palisades",
  },
];

// ─── Customers ────────────────────────────────────────────────────────────────
export const CUSTOMERS: Customer[] = [
  {
    id: "c1",
    name: "Eleanor Hartwell",
    email: "ehartwell@email.com",
    phone: "(310) 555-1001",
    address: { street: "1420 Crescent Dr", city: "Beverly Hills", state: "CA", zip: "90210" },
    memberSince: "2021-04-10",
    tier: "vip",
    notes: "Prefers morning appointments. Do not park in driveway.",
  },
  {
    id: "c2",
    name: "Robert Ashton",
    email: "rashton@email.com",
    phone: "(310) 555-1002",
    address: { street: "889 Sunset Blvd", city: "West Hollywood", state: "CA", zip: "90069" },
    memberSince: "2020-11-22",
    tier: "premium",
  },
  {
    id: "c3",
    name: "Diana Whitmore",
    email: "dwhitmore@email.com",
    phone: "(310) 555-1003",
    address: { street: "2245 Pacific Coast Hwy", city: "Malibu", state: "CA", zip: "90265" },
    memberSince: "2019-07-08",
    tier: "vip",
    notes: "Has two large dogs. Ring doorbell twice.",
  },
  {
    id: "c4",
    name: "Thomas Brennan",
    email: "tbrennan@email.com",
    phone: "(310) 555-1004",
    address: { street: "560 N Carolwood Dr", city: "Los Angeles", state: "CA", zip: "90077" },
    memberSince: "2022-02-14",
    tier: "standard",
  },
  {
    id: "c5",
    name: "Catherine Voss",
    email: "cvoss@email.com",
    phone: "(310) 555-1005",
    address: { street: "18 Via Condotti", city: "Santa Monica", state: "CA", zip: "90402" },
    memberSince: "2021-09-30",
    tier: "premium",
  },
  {
    id: "c6",
    name: "James Lattimore",
    email: "jlattimore@email.com",
    phone: "(818) 555-1006",
    address: { street: "4401 Ventura Blvd", city: "Sherman Oaks", state: "CA", zip: "91423" },
    memberSince: "2023-01-15",
    tier: "standard",
  },
];

// ─── Appliances ───────────────────────────────────────────────────────────────
export const APPLIANCES: Appliance[] = [
  {
    id: "a1",
    type: "Refrigerator",
    brand: "Sub-Zero",
    model: "PRO 48",
    serial: "SZ-PRO48-221047",
    installDate: "2021-06-20",
    warrantyExpiry: "2024-06-20",
    lastServiced: "2023-11-10",
  },
  {
    id: "a2",
    type: "Range",
    brand: "Wolf",
    model: "GR486G",
    serial: "WF-GR486-190832",
    installDate: "2020-03-12",
    warrantyExpiry: "2023-03-12",
    lastServiced: "2023-08-22",
  },
  {
    id: "a3",
    type: "Dishwasher",
    brand: "Miele",
    model: "G 7966 SCVi",
    serial: "MI-G7966-220491",
    installDate: "2022-01-08",
    warrantyExpiry: "2025-01-08",
    lastServiced: "2024-02-14",
  },
  {
    id: "a4",
    type: "Wine Cooler",
    brand: "Sub-Zero",
    model: "424G",
    serial: "SZ-424G-230186",
    installDate: "2023-04-15",
    warrantyExpiry: "2026-04-15",
  },
  {
    id: "a5",
    type: "Wall Oven",
    brand: "Thermador",
    model: "ME302WS",
    serial: "TH-ME302-181223",
    installDate: "2019-09-22",
    warrantyExpiry: "2022-09-22",
    lastServiced: "2023-12-05",
  },
  {
    id: "a6",
    type: "Cooktop",
    brand: "Gaggenau",
    model: "VG 295 214",
    serial: "GG-VG295-210774",
    installDate: "2021-11-30",
    warrantyExpiry: "2024-11-30",
    lastServiced: "2024-01-18",
  },
];

// ─── Jobs ─────────────────────────────────────────────────────────────────────
export const JOBS: Job[] = [
  {
    id: "j1",
    title: "Sub-Zero Refrigerator – Cooling Issue",
    status: "in_progress",
    priority: "urgent",
    customerId: "c1",
    technicianId: "u3",
    applianceId: "a1",
    scheduledAt: "2026-07-27T09:00:00",
    estimatedDuration: 120,
    address: { street: "1420 Crescent Dr", city: "Beverly Hills", state: "CA", zip: "90210" },
    description: "Customer reports refrigerator not maintaining temperature below 45°F. Ice maker also not producing ice.",
    diagnosis: "Evaporator fan motor failure. Secondary compressor relay showing signs of wear.",
    estimateId: "e1",
    createdAt: "2026-07-25T14:30:00",
    tags: ["warranty", "urgent"],
  },
  {
    id: "j2",
    title: "Wolf Range – Igniter Replacement",
    status: "scheduled",
    priority: "normal",
    customerId: "c2",
    technicianId: "u3",
    applianceId: "a2",
    scheduledAt: "2026-07-27T13:00:00",
    estimatedDuration: 90,
    address: { street: "889 Sunset Blvd", city: "West Hollywood", state: "CA", zip: "90069" },
    description: "Two burners failing to ignite consistently. Customer reports clicking sound but no flame.",
    createdAt: "2026-07-26T09:00:00",
    tags: ["igniter"],
  },
  {
    id: "j3",
    title: "Miele Dishwasher – Error Code E62",
    status: "pending_approval",
    priority: "high",
    customerId: "c3",
    technicianId: "u4",
    applianceId: "a3",
    scheduledAt: "2026-07-27T10:30:00",
    estimatedDuration: 75,
    address: { street: "2245 Pacific Coast Hwy", city: "Malibu", state: "CA", zip: "90265" },
    description: "Dishwasher displaying E62 error code, not completing wash cycles.",
    diagnosis: "Heating element failed. Water inlet valve also shows reduced flow.",
    estimateId: "e2",
    createdAt: "2026-07-26T11:00:00",
    tags: ["error_code"],
  },
  {
    id: "j4",
    title: "Sub-Zero Wine Cooler – Temperature Fluctuation",
    status: "scheduled",
    priority: "normal",
    customerId: "c4",
    technicianId: "u5",
    applianceId: "a4",
    scheduledAt: "2026-07-27T14:30:00",
    estimatedDuration: 60,
    address: { street: "560 N Carolwood Dr", city: "Los Angeles", state: "CA", zip: "90077" },
    description: "Wine cooler temperature swinging ±8°F. Customer concerned about wine collection.",
    createdAt: "2026-07-26T15:00:00",
  },
  {
    id: "j5",
    title: "Thermador Oven – Calibration & Maintenance",
    status: "completed",
    priority: "low",
    customerId: "c5",
    technicianId: "u4",
    applianceId: "a5",
    scheduledAt: "2026-07-27T08:00:00",
    estimatedDuration: 60,
    address: { street: "18 Via Condotti", city: "Santa Monica", state: "CA", zip: "90402" },
    description: "Annual calibration and preventive maintenance per service contract.",
    diagnosis: "Oven calibrated. Gaskets replaced. Door spring tension adjusted.",
    resolution: "All systems nominal. Calibration confirmed within spec.",
    createdAt: "2026-07-24T10:00:00",
    completedAt: "2026-07-27T09:12:00",
  },
  {
    id: "j6",
    title: "Gaggenau Cooktop – Induction Zone Failure",
    status: "en_route",
    priority: "high",
    customerId: "c6",
    technicianId: "u6",
    applianceId: "a6",
    scheduledAt: "2026-07-27T11:00:00",
    estimatedDuration: 90,
    address: { street: "4401 Ventura Blvd", city: "Sherman Oaks", state: "CA", zip: "91423" },
    description: "Front-left induction zone not responding. Unit shows F1 fault code.",
    createdAt: "2026-07-26T16:30:00",
    tags: ["induction", "fault_code"],
  },
  {
    id: "j7",
    title: "Sub-Zero Refrigerator – Annual Maintenance",
    status: "scheduled",
    priority: "low",
    customerId: "c1",
    technicianId: "u3",
    applianceId: "a1",
    scheduledAt: "2026-07-28T10:00:00",
    estimatedDuration: 45,
    address: { street: "1420 Crescent Dr", city: "Beverly Hills", state: "CA", zip: "90210" },
    description: "Annual maintenance visit per VIP service contract.",
    createdAt: "2026-07-20T08:00:00",
  },
  {
    id: "j8",
    title: "Wolf Range – Deep Clean & Burner Service",
    status: "scheduled",
    priority: "normal",
    customerId: "c5",
    technicianId: "u4",
    applianceId: "a2",
    scheduledAt: "2026-07-29T09:00:00",
    estimatedDuration: 120,
    address: { street: "18 Via Condotti", city: "Santa Monica", state: "CA", zip: "90402" },
    description: "Premium deep clean service with full burner disassembly and cleaning.",
    createdAt: "2026-07-22T14:00:00",
  },
];

// ─── Estimates ────────────────────────────────────────────────────────────────
export const ESTIMATES: Estimate[] = [
  {
    id: "e1",
    jobId: "j1",
    laborHours: 3,
    laborRate: 185,
    parts: [
      { description: "Sub-Zero Evaporator Fan Motor (4204490)", qty: 1, unitPrice: 320 },
      { description: "Compressor Start Relay (4211614)", qty: 1, unitPrice: 48 },
      { description: "Refrigerant R-134a (1lb)", qty: 2, unitPrice: 35 },
    ],
    total: 993,
    status: "pending_approval",
    createdAt: "2026-07-27T10:30:00",
    notes: "Fan motor is in stock. Compressor relay available next-day.",
  },
  {
    id: "e2",
    jobId: "j3",
    laborHours: 2,
    laborRate: 185,
    parts: [
      { description: "Miele Heating Element (10289840)", qty: 1, unitPrice: 210 },
      { description: "Water Inlet Valve (07119570)", qty: 1, unitPrice: 95 },
    ],
    total: 675,
    status: "pending_approval",
    createdAt: "2026-07-27T11:45:00",
    notes: "Parts must be ordered. Lead time 2–3 business days.",
  },
];

// ─── Approvals ────────────────────────────────────────────────────────────────
export const APPROVALS: Approval[] = [
  {
    id: "ap1",
    type: "estimate",
    jobId: "j1",
    requestedBy: "u3",
    requestedAt: "2026-07-27T10:35:00",
    amount: 993,
    description: "Estimate for Sub-Zero PRO 48 evaporator fan motor replacement + relay",
    status: "pending",
  },
  {
    id: "ap2",
    type: "estimate",
    jobId: "j3",
    requestedBy: "u4",
    requestedAt: "2026-07-27T11:50:00",
    amount: 675,
    description: "Estimate for Miele G7966 heating element + water inlet valve replacement",
    status: "pending",
  },
  {
    id: "ap3",
    type: "part_order",
    jobId: "j6",
    requestedBy: "u6",
    requestedAt: "2026-07-27T08:20:00",
    amount: 480,
    description: "Emergency order: Gaggenau induction zone PCB module (11021752)",
    status: "pending",
  },
  {
    id: "ap4",
    type: "warranty_claim",
    jobId: "j3",
    requestedBy: "u4",
    requestedAt: "2026-07-26T16:00:00",
    amount: 210,
    description: "Warranty claim for Miele heating element – unit still under manufacturer warranty",
    status: "approved",
    reviewedBy: "u2",
    reviewedAt: "2026-07-26T17:30:00",
    notes: "Approved. Submitted to Miele warranty portal.",
  },
  {
    id: "ap5",
    type: "part_order",
    jobId: "j4",
    requestedBy: "u5",
    requestedAt: "2026-07-26T14:00:00",
    amount: 155,
    description: "Sub-Zero Wine Cooler thermostat assembly replacement (7021186)",
    status: "rejected",
    reviewedBy: "u2",
    reviewedAt: "2026-07-26T15:45:00",
    notes: "Incorrect part number. Re-submit with correct SKU from Sub-Zero parts catalog.",
  },
];

// ─── Technician Stats ─────────────────────────────────────────────────────────
export const TECHNICIAN_STATS: TechnicianStats[] = [
  { technicianId: "u3", completedToday: 0, completedThisWeek: 8, avgRating: 4.9, pendingJobs: 3, revenue: 6840 },
  { technicianId: "u4", completedToday: 1, completedThisWeek: 7, avgRating: 4.7, pendingJobs: 2, revenue: 5970 },
  { technicianId: "u5", completedToday: 0, completedThisWeek: 5, avgRating: 4.8, pendingJobs: 2, revenue: 4250 },
  { technicianId: "u6", completedToday: 0, completedThisWeek: 6, avgRating: 4.6, pendingJobs: 1, revenue: 5100 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getCustomer(id: string) {
  return CUSTOMERS.find((c) => c.id === id);
}

export function getTechnician(id: string) {
  return USERS.find((u) => u.id === id);
}

export function getAppliance(id: string) {
  return APPLIANCES.find((a) => a.id === id);
}

export function getJob(id: string) {
  return JOBS.find((j) => j.id === id);
}

export function getEstimate(id: string) {
  return ESTIMATES.find((e) => e.id === id);
}

export function getJobsByTechnician(techId: string) {
  return JOBS.filter((j) => j.technicianId === techId);
}

export function getTodaysJobs(techId: string) {
  const today = new Date().toISOString().split("T")[0];
  return JOBS.filter(
    (j) => j.technicianId === techId && j.scheduledAt.startsWith(today)
  );
}

export function getTechnicianStats(techId: string) {
  return TECHNICIAN_STATS.find((s) => s.technicianId === techId);
}

export function getPendingApprovals() {
  return APPROVALS.filter((a) => a.status === "pending");
}

export function getActiveJobs() {
  return JOBS.filter((j) =>
    ["scheduled", "en_route", "in_progress", "pending_approval"].includes(j.status)
  );
}
