/**
 * Supabase database type definitions — JDR Operations
 *
 * These types mirror the schema in supabase/migrations/001_initial_schema.sql.
 * They are used to type-check all Supabase client queries.
 *
 * Column naming: snake_case in Postgres → camelCase conversion is done at
 * the db-layer (src/lib/db/*) before values reach UI components.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // ── profiles ────────────────────────────────────────────────────────────
      profiles: {
        Row: {
          id: string;                      // references auth.users.id
          name: string;
          email: string;
          role: "owner" | "manager" | "technician";
          phone: string | null;
          certifications: string[] | null;
          join_date: string | null;
          zone: string | null;
          bio: string | null;
          emergency_contact: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };

      // ── customers ───────────────────────────────────────────────────────────
      customers: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          street: string;
          city: string;
          state: string;
          zip: string;
          member_since: string;
          tier: "standard" | "premium" | "vip";
          notes: string | null;
          hcp_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["customers"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["customers"]["Insert"]>;
      };

      // ── appliances ──────────────────────────────────────────────────────────
      appliances: {
        Row: {
          id: string;
          type: string;
          brand: string;
          model: string;
          serial: string;
          install_date: string;
          warranty_expiry: string | null;
          last_serviced: string | null;
          purchase_date: string | null;
          voltage: string | null;
          amperage: string | null;
          refrigerant: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["appliances"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["appliances"]["Insert"]>;
      };

      // ── jobs ────────────────────────────────────────────────────────────────
      jobs: {
        Row: {
          id: string;
          title: string;
          status: "scheduled" | "en_route" | "in_progress" | "pending_approval" | "completed" | "cancelled";
          priority: "low" | "normal" | "high" | "urgent";
          customer_id: string;
          technician_id: string;
          appliance_id: string;
          scheduled_at: string;
          estimated_duration: number;
          street: string;
          city: string;
          state: string;
          zip: string;
          description: string;
          customer_complaint: string | null;
          diagnosis: string | null;
          resolution: string | null;
          estimate_id: string | null;
          completed_at: string | null;
          tags: string[] | null;
          reported_error_codes: string[] | null;
          hcp_job_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["jobs"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["jobs"]["Insert"]>;
      };

      // ── estimates ───────────────────────────────────────────────────────────
      estimates: {
        Row: {
          id: string;
          job_id: string;
          labor_hours: number;
          labor_rate: number;
          parts: Json;              // LineItem[]
          total: number;
          status: "draft" | "pending_approval" | "approved" | "rejected";
          notes: string | null;
          approved_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["estimates"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["estimates"]["Insert"]>;
      };

      // ── approvals ───────────────────────────────────────────────────────────
      approvals: {
        Row: {
          id: string;
          type: "estimate" | "part_order" | "warranty_claim";
          job_id: string;
          requested_by: string;
          requested_at: string;
          amount: number | null;
          description: string;
          status: "pending" | "approved" | "rejected" | "returned";
          reviewed_by: string | null;
          reviewed_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["approvals"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["approvals"]["Insert"]>;
      };

      // ── job_workflow ─────────────────────────────────────────────────────────
      job_workflow: {
        Row: {
          job_id: string;
          technician_id: string;
          symptoms_recorded: boolean;
          diagnostic_completed: boolean;
          readings_recorded: boolean;
          photos_added: boolean;
          report_completed: boolean;
          estimate_built: boolean;
          submitted: boolean;
          last_updated: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["job_workflow"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["job_workflow"]["Insert"]>;
      };

      // ── job_readings ─────────────────────────────────────────────────────────
      job_readings: {
        Row: {
          id: string;
          job_id: string;
          technician_id: string;
          template_id: string | null;
          type: "voltage" | "resistance" | "continuity" | "temperature" | "pressure";
          component: string;
          expected_value: string;
          measured_value: string;
          unit: string;
          result: "pass" | "fail" | "marginal" | "pending";
          notes: string;
          timestamp: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["job_readings"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["job_readings"]["Insert"]>;
      };

      // ── job_photos ───────────────────────────────────────────────────────────
      job_photos: {
        Row: {
          id: string;
          job_id: string;
          technician_id: string;
          storage_path: string;       // path in Supabase Storage bucket
          filename: string;
          caption: string;
          category: "before" | "after" | "defect" | "parts" | "serial_number" | "meter_reading" | "other";
          file_size: number | null;
          timestamp: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["job_photos"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["job_photos"]["Insert"]>;
      };

      // ── job_reports ──────────────────────────────────────────────────────────
      job_reports: {
        Row: {
          id: string;
          job_id: string;
          technician_id: string;
          repair_type: "diagnosis_only" | "parts_replaced" | "adjustment_cleaning" | "warranty_repair" | "no_fault_found" | "refer_to_manager";
          work_performed: string;
          parts_replaced: string[] | null;
          start_time: string;
          end_time: string;
          labor_minutes: number | null;
          travel_time_minutes: number | null;
          outcome: string;
          customer_informed: boolean;
          follow_up_required: boolean;
          follow_up_notes: string | null;
          tech_notes: string | null;
          safety_concerns: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["job_reports"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["job_reports"]["Insert"]>;
      };

      // ── job_estimates (tech draft) ────────────────────────────────────────────
      job_estimates: {
        Row: {
          id: string;
          job_id: string;
          technician_id: string;
          lines: Json;              // EstimateLine[]
          notes: string | null;
          subtotal: number;
          tax: number;
          total: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["job_estimates"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["job_estimates"]["Insert"]>;
      };

      // ── job_symptoms ─────────────────────────────────────────────────────────
      job_symptoms: {
        Row: {
          id: string;
          job_id: string;
          technician_id: string;
          customer_complaint: string;
          observed_symptoms: string[];
          error_codes: string[];
          appliance_age: string;
          frequency_of_issue: string;
          when_occurs: string;
          additional_notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["job_symptoms"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["job_symptoms"]["Insert"]>;
      };

      // ── job_diagnostics ──────────────────────────────────────────────────────
      job_diagnostics: {
        Row: {
          id: string;
          job_id: string;
          technician_id: string;
          guide_id: string;
          confirmed_diagnosis: string;
          tech_notes: string;
          completed_tests: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["job_diagnostics"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["job_diagnostics"]["Insert"]>;
      };

      // ── oem_parts ────────────────────────────────────────────────────────────
      oem_parts: {
        Row: {
          id: string;
          brand: string;
          part_number: string;
          oem_part_number: string | null;
          description: string;
          category: string;
          appliance_types: string[];
          compatible_models: string[];
          unit_cost: number;
          availability: "in_stock" | "order_2_3_days" | "order_1_week" | "special_order";
          weight: string | null;
          notes: string | null;
          superseded_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["oem_parts"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["oem_parts"]["Insert"]>;
      };

      // ── audit_log ────────────────────────────────────────────────────────────
      audit_log: {
        Row: {
          id: string;
          timestamp: string;
          actor_id: string;
          actor_name: string;
          action: "created" | "approved" | "rejected" | "returned_for_info" | "edited" | "status_changed" | "submitted" | "updated" | "connected" | "disconnected";
          entity_type: "approval" | "job" | "estimate" | "pricing" | "integration" | "user";
          entity_id: string;
          entity_label: string;
          before_value: string | null;
          after_value: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["audit_log"]["Row"], "created_at">;
        Update: never;  // audit log is append-only
      };

      // ── pricing_config ───────────────────────────────────────────────────────
      pricing_config: {
        Row: {
          id: string;           // always 'default'
          labor_rate_per_hour: number;
          diagnostic_fee: number;
          travel_fee_standard: number;
          travel_fee_premium: number;
          minimum_service_charge: number;
          after_hours_surcharge_percent: number;
          tier_multiplier_standard: number;
          tier_multiplier_premium: number;
          tier_multiplier_vip: number;
          tax_rate_percent: number;
          warranty_labor_rate: number;
          updated_at: string;
          updated_by: string;
        };
        Insert: Database["public"]["Tables"]["pricing_config"]["Row"];
        Update: Partial<Database["public"]["Tables"]["pricing_config"]["Row"]>;
      };

      // ── integration_configs ──────────────────────────────────────────────────
      integration_configs: {
        Row: {
          id: string;
          name: string;
          description: string;
          category: "field_service" | "payments" | "ai" | "communications" | "warranty";
          status: "connected" | "disconnected" | "pending" | "error";
          logo_initials: string;
          logo_color: string;
          features: string[];
          config_fields: Json;        // { key, label, placeholder, masked? }[]
          config_values: Json | null; // stored values (masked at rest)
          notes: string | null;
          last_synced: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["integration_configs"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["integration_configs"]["Insert"]>;
      };
    };

    Views: {
      [_ in never]: never;
    };

    Functions: {
      [_ in never]: never;
    };

    Enums: {
      [_ in never]: never;
    };
  };
}
