export type Role = "owner" | "manager" | "technician";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
  certifications?: string[];
  joinDate?: string;
  zone?: string;
}

export type JobStatus =
  | "scheduled"
  | "en_route"
  | "in_progress"
  | "pending_approval"
  | "completed"
  | "cancelled";

export type JobPriority = "low" | "normal" | "high" | "urgent";

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  memberSince: string;
  tier: "standard" | "premium" | "vip";
  notes?: string;
}

export interface Appliance {
  id: string;
  type: string;
  brand: string;
  model: string;
  serial: string;
  installDate: string;
  warrantyExpiry?: string;
  lastServiced?: string;
}

export interface LineItem {
  description: string;
  qty: number;
  unitPrice: number;
}

export interface Estimate {
  id: string;
  jobId: string;
  laborHours: number;
  laborRate: number;
  parts: LineItem[];
  total: number;
  status: "draft" | "pending_approval" | "approved" | "rejected";
  createdAt: string;
  approvedBy?: string;
  notes?: string;
}

export interface Job {
  id: string;
  title: string;
  status: JobStatus;
  priority: JobPriority;
  customerId: string;
  technicianId: string;
  applianceId: string;
  scheduledAt: string;
  estimatedDuration: number; // minutes
  address: Address;
  description: string;
  diagnosis?: string;
  resolution?: string;
  estimateId?: string;
  createdAt: string;
  completedAt?: string;
  tags?: string[];
}

export interface Approval {
  id: string;
  type: "estimate" | "part_order" | "warranty_claim";
  jobId: string;
  requestedBy: string;
  requestedAt: string;
  amount?: number;
  description: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
}

export interface TechnicianStats {
  technicianId: string;
  completedToday: number;
  completedThisWeek: number;
  avgRating: number;
  pendingJobs: number;
  revenue: number;
}

export interface DemoAccount {
  id: string;
  name: string;
  role: Role;
  email: string;
  description: string;
}
