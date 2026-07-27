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
  bio?: string;
  emergencyContact?: string;
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
  purchaseDate?: string;
  voltage?: string;
  amperage?: string;
  refrigerant?: string;
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
  estimatedDuration: number;
  address: Address;
  description: string;
  customerComplaint?: string;
  diagnosis?: string;
  resolution?: string;
  estimateId?: string;
  createdAt: string;
  completedAt?: string;
  tags?: string[];
  reportedErrorCodes?: string[];
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

// ─── Diagnostic Types ─────────────────────────────────────────────────────────

export interface DiagnosticTest {
  id: string;
  name: string;
  tool: string;
  procedure: string[];
  expectedReading: string;
  normalRange?: string;
  passResult: string;
  failResult: string;
  safetyNote?: string;
}

export interface PossibleCause {
  cause: string;
  priority: number;
  likelihood: "very_likely" | "likely" | "possible" | "unlikely";
  evidence: string;
}

export interface LikelyPart {
  partNumber: string;
  description: string;
  estimatedCost: number;
  priority: "required" | "likely" | "possible";
  availability: "in_stock" | "order_2_3_days" | "order_1_week" | "special_order";
}

export interface DiagnosticGuide {
  id: string;
  brand: string;
  applianceType: string;
  primarySymptom: string;
  matchKeywords: string[];
  safetyWarnings: string[];
  missingInfo: string[];
  confirmedDiagnosis?: string;
  suspectedDiagnoses: {
    diagnosis: string;
    confidence: number;
    reason: string;
    status: "confirmed" | "suspected" | "ruled_out";
  }[];
  additionalTestsRequired: string[];
  possibleCauses: PossibleCause[];
  tests: DiagnosticTest[];
  likelyParts: LikelyPart[];
  recommendedNextAction: string;
  techNotes?: string;
}

// ─── Meter Readings ───────────────────────────────────────────────────────────

export type MeterReadingType = "voltage" | "resistance" | "continuity" | "temperature" | "pressure";

export interface MeterReadingTemplate {
  id: string;
  brand: string;
  applianceType: string;
  component: string;
  type: MeterReadingType;
  expectedValue: string;
  normalRange: string;
  unit: string;
  testProcedure: string;
  failureIndication: string;
}

export interface MeterReading {
  id: string;
  templateId?: string;
  jobId: string;
  type: MeterReadingType;
  component: string;
  expectedValue: string;
  measuredValue: string;
  unit: string;
  result: "pass" | "fail" | "marginal" | "pending";
  notes: string;
  timestamp: string;
}

// ─── Photos ───────────────────────────────────────────────────────────────────

export type PhotoCategory = "before" | "after" | "defect" | "parts" | "serial_number" | "meter_reading" | "other";

export interface JobPhoto {
  id: string;
  jobId: string;
  filename: string;
  caption: string;
  category: PhotoCategory;
  timestamp: string;
  size?: string;
}

// ─── OEM Parts ────────────────────────────────────────────────────────────────

export type PartAvailability = "in_stock" | "order_2_3_days" | "order_1_week" | "special_order";

export interface OEMPart {
  id: string;
  brand: string;
  partNumber: string;
  oemPartNumber?: string;
  description: string;
  category: string;
  applianceTypes: string[];
  compatibleModels: string[];
  unitCost: number;
  availability: PartAvailability;
  weight?: string;
  notes?: string;
  supersededBy?: string;
}

// ─── Service Manuals ──────────────────────────────────────────────────────────

export type ManualType = "service_manual" | "tech_sheet" | "wiring_diagram" | "parts_diagram" | "installation_guide";

export interface ServiceManual {
  id: string;
  brand: string;
  modelFamily: string;
  applicableModels: string[];
  title: string;
  type: ManualType;
  pages: number;
  sections: string[];
  lastRevision: string;
  highlights: string[];
}

// ─── Service Report ───────────────────────────────────────────────────────────

export type RepairType =
  | "diagnosis_only"
  | "parts_replaced"
  | "adjustment_cleaning"
  | "warranty_repair"
  | "no_fault_found"
  | "refer_to_manager";

export interface ServiceReport {
  jobId: string;
  repairType: RepairType;
  workPerformed: string;
  partsReplaced?: string[];
  startTime: string;
  endTime: string;
  laborMinutes?: number;
  travelTimeMinutes?: number;
  outcome: string;
  customerInformed: boolean;
  followUpRequired: boolean;
  followUpNotes?: string;
  techNotes?: string;
  safetyConcerns?: string;
  savedAt: string;
}

// ─── Estimate (local tech draft) ─────────────────────────────────────────────

export interface EstimateLine {
  id: string;
  type: "labor" | "part";
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface LocalEstimate {
  jobId: string;
  lines: EstimateLine[];
  notes?: string;
  subtotal: number;
  tax: number;
  total: number;
  savedAt: string;
}

// ─── Workflow State ───────────────────────────────────────────────────────────

export interface JobWorkflowState {
  jobId: string;
  symptomsRecorded: boolean;
  diagnosticCompleted: boolean;
  readingsRecorded: boolean;
  photosAdded: boolean;
  reportCompleted: boolean;
  estimateBuilt: boolean;
  submitted: boolean;
  lastUpdated: string;
}
