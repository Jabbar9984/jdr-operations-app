import type {
  User,
  Customer,
  Appliance,
  Job,
  Estimate,
  Approval,
  TechnicianStats,
  DemoAccount,
  DiagnosticGuide,
  MeterReadingTemplate,
  OEMPart,
  ServiceManual,
  AuditLogEntry,
  ReviewPacket,
  PricingConfig,
  IntegrationConfig,
} from "@/types";

// ─── Demo Accounts ────────────────────────────────────────────────────────────
export const DEMO_ACCOUNTS: DemoAccount[] = [
  { id: "u1", name: "Michael Reeves", role: "owner", email: "owner@jdrluxury.com", description: "Full access to all operations, financials & settings" },
  { id: "u2", name: "Sandra Kim", role: "manager", email: "manager@jdrluxury.com", description: "Manage jobs, approvals, technicians & reports" },
  { id: "u3", name: "Carlos Mendez", role: "technician", email: "tech@jdrluxury.com", description: "Field jobs, diagnostics & work orders" },
];

// ─── Users ────────────────────────────────────────────────────────────────────
export const USERS: User[] = [
  { id: "u1", name: "Michael Reeves", email: "owner@jdrluxury.com", role: "owner", phone: "(310) 555-0101", joinDate: "2019-03-15" },
  { id: "u2", name: "Sandra Kim", email: "manager@jdrluxury.com", role: "manager", phone: "(310) 555-0102", joinDate: "2020-06-01" },
  {
    id: "u3", name: "Carlos Mendez", email: "tech@jdrluxury.com", role: "technician",
    phone: "(323) 555-0201", certifications: ["Sub-Zero Certified", "Wolf Appliances Pro", "EPA 608 Universal", "NATE Certified"],
    joinDate: "2021-02-14", zone: "West LA / Beverly Hills",
    bio: "12+ years in luxury appliance service. Specializes in Sub-Zero refrigeration systems and Wolf cooking appliances.",
    emergencyContact: "(323) 555-0999 – Maria Mendez",
  },
  {
    id: "u4", name: "Jasmine Patel", email: "jasmine@jdrluxury.com", role: "technician",
    phone: "(323) 555-0202", certifications: ["Miele Certified Elite", "Gaggenau Pro", "EPA 608"],
    joinDate: "2021-08-22", zone: "Brentwood / Santa Monica",
    bio: "Miele and Gaggenau specialist with deep expertise in European appliance systems.",
  },
  {
    id: "u5", name: "Derek Thompson", email: "derek@jdrluxury.com", role: "technician",
    phone: "(818) 555-0203", certifications: ["Thermador Certified", "Bosch Pro Series", "EPA 608"],
    joinDate: "2022-01-10", zone: "Sherman Oaks / Studio City",
  },
  {
    id: "u6", name: "Alicia Fontaine", email: "alicia@jdrluxury.com", role: "technician",
    phone: "(310) 555-0204", certifications: ["Sub-Zero Certified", "Viking Pro"],
    joinDate: "2022-09-05", zone: "Malibu / Pacific Palisades",
  },
];

// ─── Customers ────────────────────────────────────────────────────────────────
export const CUSTOMERS: Customer[] = [
  { id: "c1", name: "Eleanor Hartwell", email: "ehartwell@email.com", phone: "(310) 555-1001", address: { street: "1420 Crescent Dr", city: "Beverly Hills", state: "CA", zip: "90210" }, memberSince: "2021-04-10", tier: "vip", notes: "Prefers morning appointments. Do not park in driveway." },
  { id: "c2", name: "Robert Ashton", email: "rashton@email.com", phone: "(310) 555-1002", address: { street: "889 Sunset Blvd", city: "West Hollywood", state: "CA", zip: "90069" }, memberSince: "2020-11-22", tier: "premium" },
  { id: "c3", name: "Diana Whitmore", email: "dwhitmore@email.com", phone: "(310) 555-1003", address: { street: "2245 Pacific Coast Hwy", city: "Malibu", state: "CA", zip: "90265" }, memberSince: "2019-07-08", tier: "vip", notes: "Has two large dogs. Ring doorbell twice." },
  { id: "c4", name: "Thomas Brennan", email: "tbrennan@email.com", phone: "(310) 555-1004", address: { street: "560 N Carolwood Dr", city: "Los Angeles", state: "CA", zip: "90077" }, memberSince: "2022-02-14", tier: "standard" },
  { id: "c5", name: "Catherine Voss", email: "cvoss@email.com", phone: "(310) 555-1005", address: { street: "18 Via Condotti", city: "Santa Monica", state: "CA", zip: "90402" }, memberSince: "2021-09-30", tier: "premium" },
  { id: "c6", name: "James Lattimore", email: "jlattimore@email.com", phone: "(818) 555-1006", address: { street: "4401 Ventura Blvd", city: "Sherman Oaks", state: "CA", zip: "91423" }, memberSince: "2023-01-15", tier: "standard" },
];

// ─── Appliances ───────────────────────────────────────────────────────────────
export const APPLIANCES: Appliance[] = [
  { id: "a1", type: "Refrigerator", brand: "Sub-Zero", model: "PRO 48", serial: "SZ-PRO48-221047", installDate: "2021-06-20", warrantyExpiry: "2024-06-20", lastServiced: "2023-11-10", voltage: "115V", amperage: "15A", refrigerant: "R-134a" },
  { id: "a2", type: "Range", brand: "Wolf", model: "GR486G", serial: "WF-GR486-190832", installDate: "2020-03-12", warrantyExpiry: "2023-03-12", lastServiced: "2023-08-22", voltage: "120/240V", amperage: "50A" },
  { id: "a3", type: "Dishwasher", brand: "Miele", model: "G 7966 SCVi", serial: "MI-G7966-220491", installDate: "2022-01-08", warrantyExpiry: "2025-01-08", lastServiced: "2024-02-14", voltage: "120V", amperage: "15A" },
  { id: "a4", type: "Wine Cooler", brand: "Sub-Zero", model: "424G", serial: "SZ-424G-230186", installDate: "2023-04-15", warrantyExpiry: "2026-04-15", voltage: "115V", amperage: "15A", refrigerant: "R-600a" },
  { id: "a5", type: "Wall Oven", brand: "Thermador", model: "ME302WS", serial: "TH-ME302-181223", installDate: "2019-09-22", warrantyExpiry: "2022-09-22", lastServiced: "2023-12-05", voltage: "240V", amperage: "30A" },
  { id: "a6", type: "Cooktop", brand: "Gaggenau", model: "VG 295 214", serial: "GG-VG295-210774", installDate: "2021-11-30", warrantyExpiry: "2024-11-30", lastServiced: "2024-01-18", voltage: "240V", amperage: "40A" },
];

// ─── Jobs ─────────────────────────────────────────────────────────────────────
export const JOBS: Job[] = [
  { id: "j1", title: "Sub-Zero Refrigerator – Cooling Issue", status: "in_progress", priority: "urgent", customerId: "c1", technicianId: "u3", applianceId: "a1", scheduledAt: "2026-07-27T09:00:00", estimatedDuration: 120, address: { street: "1420 Crescent Dr", city: "Beverly Hills", state: "CA", zip: "90210" }, description: "Customer reports refrigerator not maintaining temperature below 45°F. Ice maker also not producing ice.", customerComplaint: "Fridge won't get cold. Everything is warm and the ice maker stopped working two days ago. We have a dinner party this weekend and this is urgent.", estimateId: "e1", createdAt: "2026-07-25T14:30:00", tags: ["warranty", "urgent"], reportedErrorCodes: [] },
  { id: "j2", title: "Wolf Range – Igniter Replacement", status: "scheduled", priority: "normal", customerId: "c2", technicianId: "u3", applianceId: "a2", scheduledAt: "2026-07-27T13:00:00", estimatedDuration: 90, address: { street: "889 Sunset Blvd", city: "West Hollywood", state: "CA", zip: "90069" }, description: "Two burners failing to ignite consistently. Customer reports clicking sound but no flame.", customerComplaint: "The front two burners keep clicking but won't light. Sometimes after 20–30 clicks they catch, but most of the time nothing. Back burners work fine.", createdAt: "2026-07-26T09:00:00", tags: ["igniter"], reportedErrorCodes: [] },
  { id: "j3", title: "Miele Dishwasher – Error Code E62", status: "pending_approval", priority: "high", customerId: "c3", technicianId: "u4", applianceId: "a3", scheduledAt: "2026-07-27T10:30:00", estimatedDuration: 75, address: { street: "2245 Pacific Coast Hwy", city: "Malibu", state: "CA", zip: "90265" }, description: "Dishwasher displaying E62 error code, not completing wash cycles.", customerComplaint: "Dishwasher shows E62 and stops mid-cycle. The dishes come out wet and dirty. This started happening every other cycle, now every cycle.", diagnosis: "Heating element failed. Water inlet valve also shows reduced flow.", estimateId: "e2", createdAt: "2026-07-26T11:00:00", tags: ["error_code"], reportedErrorCodes: ["E62"] },
  { id: "j4", title: "Sub-Zero Wine Cooler – Temperature Fluctuation", status: "scheduled", priority: "normal", customerId: "c4", technicianId: "u5", applianceId: "a4", scheduledAt: "2026-07-27T14:30:00", estimatedDuration: 60, address: { street: "560 N Carolwood Dr", city: "Los Angeles", state: "CA", zip: "90077" }, description: "Wine cooler temperature swinging ±8°F. Customer concerned about wine collection.", customerComplaint: "The temperature display shows 58°F but it goes up to 66°F and sometimes down to 50°F. I have a $40,000 wine collection in here.", createdAt: "2026-07-26T15:00:00" },
  { id: "j5", title: "Thermador Oven – Calibration & Maintenance", status: "completed", priority: "low", customerId: "c5", technicianId: "u4", applianceId: "a5", scheduledAt: "2026-07-27T08:00:00", estimatedDuration: 60, address: { street: "18 Via Condotti", city: "Santa Monica", state: "CA", zip: "90402" }, description: "Annual calibration and preventive maintenance per service contract.", diagnosis: "Oven calibrated. Gaskets replaced. Door spring tension adjusted.", resolution: "All systems nominal. Calibration confirmed within spec.", createdAt: "2026-07-24T10:00:00", completedAt: "2026-07-27T09:12:00" },
  { id: "j6", title: "Gaggenau Cooktop – Induction Zone Failure", status: "en_route", priority: "high", customerId: "c6", technicianId: "u6", applianceId: "a6", scheduledAt: "2026-07-27T11:00:00", estimatedDuration: 90, address: { street: "4401 Ventura Blvd", city: "Sherman Oaks", state: "CA", zip: "91423" }, description: "Front-left induction zone not responding. Unit shows F1 fault code.", customerComplaint: "Left front burner completely dead. Shows F1 on display. Other zones work fine.", createdAt: "2026-07-26T16:30:00", tags: ["induction", "fault_code"], reportedErrorCodes: ["F1"] },
  { id: "j7", title: "Sub-Zero Refrigerator – Annual Maintenance", status: "scheduled", priority: "low", customerId: "c1", technicianId: "u3", applianceId: "a1", scheduledAt: "2026-07-28T10:00:00", estimatedDuration: 45, address: { street: "1420 Crescent Dr", city: "Beverly Hills", state: "CA", zip: "90210" }, description: "Annual maintenance visit per VIP service contract.", createdAt: "2026-07-20T08:00:00" },
  { id: "j8", title: "Wolf Range – Deep Clean & Burner Service", status: "scheduled", priority: "normal", customerId: "c5", technicianId: "u4", applianceId: "a2", scheduledAt: "2026-07-29T09:00:00", estimatedDuration: 120, address: { street: "18 Via Condotti", city: "Santa Monica", state: "CA", zip: "90402" }, description: "Premium deep clean service with full burner disassembly and cleaning.", createdAt: "2026-07-22T14:00:00" },
];

// ─── Estimates ────────────────────────────────────────────────────────────────
export const ESTIMATES: Estimate[] = [
  { id: "e1", jobId: "j1", laborHours: 3, laborRate: 185, parts: [{ description: "Sub-Zero Evaporator Fan Motor (4204490)", qty: 1, unitPrice: 320 }, { description: "Compressor Start Relay (4211614)", qty: 1, unitPrice: 48 }, { description: "Refrigerant R-134a (1lb)", qty: 2, unitPrice: 35 }], total: 993, status: "pending_approval", createdAt: "2026-07-27T10:30:00", notes: "Fan motor is in stock. Compressor relay available next-day." },
  { id: "e2", jobId: "j3", laborHours: 2, laborRate: 185, parts: [{ description: "Miele Heating Element (10289840)", qty: 1, unitPrice: 210 }, { description: "Water Inlet Valve (07119570)", qty: 1, unitPrice: 95 }], total: 675, status: "pending_approval", createdAt: "2026-07-27T11:45:00", notes: "Parts must be ordered. Lead time 2–3 business days." },
];

// ─── Approvals ────────────────────────────────────────────────────────────────
export const APPROVALS: Approval[] = [
  { id: "ap1", type: "estimate", jobId: "j1", requestedBy: "u3", requestedAt: "2026-07-27T10:35:00", amount: 993, description: "Estimate for Sub-Zero PRO 48 evaporator fan motor replacement + relay", status: "pending" },
  { id: "ap2", type: "estimate", jobId: "j3", requestedBy: "u4", requestedAt: "2026-07-27T11:50:00", amount: 675, description: "Estimate for Miele G7966 heating element + water inlet valve replacement", status: "pending" },
  { id: "ap3", type: "part_order", jobId: "j6", requestedBy: "u6", requestedAt: "2026-07-27T08:20:00", amount: 480, description: "Emergency order: Gaggenau induction zone PCB module (11021752)", status: "pending" },
  { id: "ap4", type: "warranty_claim", jobId: "j3", requestedBy: "u4", requestedAt: "2026-07-26T16:00:00", amount: 210, description: "Warranty claim for Miele heating element", status: "approved", reviewedBy: "u2", reviewedAt: "2026-07-26T17:30:00", notes: "Approved. Submitted to Miele warranty portal." },
  { id: "ap5", type: "part_order", jobId: "j4", requestedBy: "u5", requestedAt: "2026-07-26T14:00:00", amount: 155, description: "Sub-Zero Wine Cooler thermostat assembly replacement (7021186)", status: "rejected", reviewedBy: "u2", reviewedAt: "2026-07-26T15:45:00", notes: "Incorrect part number. Re-submit with correct SKU." },
];

// ─── Technician Stats ─────────────────────────────────────────────────────────
export const TECHNICIAN_STATS: TechnicianStats[] = [
  { technicianId: "u3", completedToday: 0, completedThisWeek: 8, avgRating: 4.9, pendingJobs: 3, revenue: 6840 },
  { technicianId: "u4", completedToday: 1, completedThisWeek: 7, avgRating: 4.7, pendingJobs: 2, revenue: 5970 },
  { technicianId: "u5", completedToday: 0, completedThisWeek: 5, avgRating: 4.8, pendingJobs: 2, revenue: 4250 },
  { technicianId: "u6", completedToday: 0, completedThisWeek: 6, avgRating: 4.6, pendingJobs: 1, revenue: 5100 },
];

// ─── Diagnostic Guides ────────────────────────────────────────────────────────
export const DIAGNOSTIC_GUIDES: DiagnosticGuide[] = [
  {
    id: "dg1",
    brand: "Sub-Zero",
    applianceType: "Refrigerator",
    primarySymptom: "Not cooling / warm compartment",
    matchKeywords: ["warm", "not cooling", "temperature", "45", "ice maker", "cooling issue"],
    safetyWarnings: [
      "DISCONNECT POWER before accessing evaporator or compressor components.",
      "Refrigerant R-134a — EPA 608 certification required to handle. Do not vent to atmosphere.",
      "Capacitor may hold charge up to 5 minutes after power disconnection. Discharge before touching.",
      "Evaporator coils may have sharp edges — wear cut-resistant gloves.",
    ],
    missingInfo: [
      "Confirm whether the compressor is running (listen for hum/vibration at back of unit).",
      "Check condenser coil for dust/debris buildup — photograph before cleaning.",
      "Note ambient room temperature — unit specs for 60°F–90°F ambient.",
      "Verify freezer section temperature with calibrated thermometer.",
    ],
    confirmedDiagnosis: undefined,
    suspectedDiagnoses: [
      { diagnosis: "Evaporator fan motor failure", confidence: 88, reason: "Both refrigerator and freezer warm simultaneously, ice maker stopped — classic evaporator fan symptom. Fan failure prevents cold air circulation to fridge section.", status: "suspected" },
      { diagnosis: "Defrost system failure causing ice blockage", confidence: 72, reason: "If defrost heater or thermostat failed, evaporator coils ice over and restrict airflow, causing gradual temperature rise over 2–3 days.", status: "suspected" },
      { diagnosis: "Refrigerant leak (low charge)", confidence: 45, reason: "Gradual warming could indicate low refrigerant, but ice maker failure coinciding suggests mechanical airflow issue more likely.", status: "suspected" },
      { diagnosis: "Condenser fan motor failure", confidence: 30, reason: "Condenser fan failure causes heat buildup at compressor but typically less severe on fresh-food side than evap fan failure.", status: "suspected" },
    ],
    additionalTestsRequired: [
      "Confirm evaporator fan is spinning — open freezer door, depress door switch, listen/feel for air movement.",
      "Check for frost/ice buildup on evaporator coils (access rear freezer panel).",
      "Test defrost heater resistance: expected 15–30Ω.",
      "Test defrost thermostat continuity — should be closed at room temperature.",
      "Measure compressor start and run winding resistance.",
      "Record suction and discharge pressures if low refrigerant suspected.",
    ],
    possibleCauses: [
      { cause: "Evaporator fan motor seized or open-circuit", priority: 1, likelihood: "very_likely", evidence: "No airflow from vents, both sections warming simultaneously, ice maker failure correlates with fan failure" },
      { cause: "Defrost heater open circuit — evaporator iced over", priority: 2, likelihood: "likely", evidence: "Gradual onset over 2–3 days, ice buildup on rear evaporator panel" },
      { cause: "Defrost limit thermostat failed-open (stuck OFF)", priority: 3, likelihood: "likely", evidence: "Would prevent defrost cycle, causing same ice blockage as above" },
      { cause: "Low refrigerant charge / refrigerant leak", priority: 4, likelihood: "possible", evidence: "Warm compartment, possibly short-cycling compressor" },
      { cause: "Compressor start relay failure", priority: 5, likelihood: "possible", evidence: "Compressor won't start, clicking sound from relay area" },
      { cause: "Main control board failure", priority: 6, likelihood: "unlikely", evidence: "Multiple simultaneous failures without error codes suggest mechanical over electronic" },
    ],
    tests: [
      {
        id: "t1", name: "Evaporator Fan Voltage Test",
        tool: "Digital Multimeter (VAC)",
        procedure: [
          "Remove food from freezer. Remove rear interior freezer panel (4 screws).",
          "Locate evaporator fan motor connector (2-wire, near top of evaporator).",
          "With unit powered, measure AC voltage across fan motor terminals.",
          "Depress door switch manually to simulate closed door.",
        ],
        expectedReading: "115V AC ± 10%",
        normalRange: "103V – 127V AC",
        passResult: "Voltage present → fan motor has failed (replace motor). Voltage absent → check wiring harness and control board output.",
        failResult: "No voltage → trace circuit back to control board. Check door switch continuity first.",
        safetyNote: "Keep hands clear of fan blades. Power is live during this test.",
      },
      {
        id: "t2", name: "Evaporator Fan Motor Resistance Test",
        tool: "Digital Multimeter (Ω)",
        procedure: [
          "Disconnect power to unit.",
          "Unplug fan motor harness connector.",
          "Set meter to resistance (Ω) mode.",
          "Measure resistance across motor winding terminals.",
        ],
        expectedReading: "200–400Ω",
        normalRange: "180Ω – 450Ω",
        passResult: "Reading within range — motor windings are intact. Proceed to voltage test.",
        failResult: "OL (open) = winding open-circuit, motor failed. 0Ω = winding shorted, motor failed. Replace motor.",
      },
      {
        id: "t3", name: "Defrost Heater Resistance Test",
        tool: "Digital Multimeter (Ω)",
        procedure: [
          "Disconnect power.",
          "Access evaporator by removing rear freezer panel.",
          "Disconnect heater wires (typically red and white).",
          "Measure resistance across heater terminals.",
        ],
        expectedReading: "15–30Ω",
        normalRange: "12Ω – 35Ω",
        passResult: "Heater intact — defrost failure not the primary cause.",
        failResult: "OL = heater open-circuit, replace defrost heater assembly.",
      },
      {
        id: "t4", name: "Defrost Thermostat Continuity Test",
        tool: "Digital Multimeter (Continuity)",
        procedure: [
          "Disconnect power.",
          "Locate defrost thermostat (bi-metal disc clipped to evaporator coils).",
          "Disconnect thermostat leads.",
          "Test continuity at room temperature (>32°F).",
        ],
        expectedReading: "Continuity (beep / 0Ω)",
        normalRange: "Closed circuit at room temp. Opens at ~47°F during defrost.",
        passResult: "Continuity present — thermostat is good.",
        failResult: "No continuity at room temperature — thermostat stuck open, replace.",
      },
      {
        id: "t5", name: "Compressor Winding Resistance",
        tool: "Digital Multimeter (Ω)",
        procedure: [
          "Disconnect power. Wait 5 minutes for capacitor discharge.",
          "Remove compressor access cover at rear bottom.",
          "Pull compressor start relay. Shake it — rattling indicates failed relay.",
          "Measure S-to-C, R-to-C, and S-to-R terminal resistance.",
        ],
        expectedReading: "S-to-C: 4–12Ω | R-to-C: 2–8Ω | S-to-R: sum of above",
        normalRange: "Values vary by compressor model — consult Sub-Zero tech data.",
        passResult: "All readings within spec — compressor windings intact.",
        failResult: "Any OL reading = open winding, compressor failed. 0Ω = short to ground.",
        safetyNote: "Capacitor discharge required. Do not skip the 5-minute wait.",
      },
    ],
    likelyParts: [
      { partNumber: "4204490", description: "Sub-Zero Evaporator Fan Motor Assembly", estimatedCost: 320, priority: "required", availability: "in_stock" },
      { partNumber: "4211614", description: "Compressor Start Relay", estimatedCost: 48, priority: "likely", availability: "in_stock" },
      { partNumber: "4204555", description: "Defrost Heater Assembly (240V)", estimatedCost: 95, priority: "possible", availability: "order_2_3_days" },
      { partNumber: "4201754", description: "Defrost Thermostat (Bi-Metal)", estimatedCost: 28, priority: "possible", availability: "in_stock" },
      { partNumber: "7016856", description: "Refrigerant R-134a (1 lb can)", estimatedCost: 35, priority: "possible", availability: "in_stock" },
    ],
    recommendedNextAction: "Perform evaporator fan voltage test immediately. If no voltage at fan → trace to control board. If voltage present and fan not spinning → replace fan motor (4204490). Simultaneously inspect evaporator coils for ice blockage to determine if defrost system has also failed.",
    techNotes: "Sub-Zero PRO 48 uses a dual-evaporator system. The fresh food evaporator fan (upper unit) is separate from the freezer evaporator. Test both sections independently. Reference Sub-Zero Service Manual 9009025 Section 7 for evaporator access procedure.",
  },
  {
    id: "dg2",
    brand: "Wolf",
    applianceType: "Range",
    primarySymptom: "Igniter clicking but no ignition",
    matchKeywords: ["clicking", "won't light", "igniter", "no flame", "burner", "spark"],
    safetyWarnings: [
      "VERIFY GAS IS SHUT OFF before removing any burner components.",
      "If you smell gas — evacuate immediately, do not use any switches, call gas company.",
      "Allow unit to cool fully before touching igniter or burner parts — ceramic can cause burns.",
      "Check for gas leak with approved detector solution after any gas line work.",
    ],
    missingInfo: [
      "Confirm which specific burners are affected (front-left, front-right, etc.).",
      "Ask customer: did symptoms start suddenly or gradually?",
      "Check if igniter sparks visibly but flame won't establish vs. no spark at all.",
      "Inspect igniter ceramic insulators for cracks or food debris.",
      "Confirm gas supply pressure is adequate (test with manometer if possible).",
    ],
    suspectedDiagnoses: [
      { diagnosis: "Igniter contamination (food debris / grease)", confidence: 75, reason: "Most common cause on front burners which see the most use. Grease or food debris on igniter tip prevents proper spark arc to burner head.", status: "suspected" },
      { diagnosis: "Failed igniter module (open circuit)", confidence: 65, reason: "Clicking sound (spark module working) but no visible spark on specific burners indicates igniter electrode failure, not module.", status: "suspected" },
      { diagnosis: "Igniter module (spark module) failure", confidence: 25, reason: "If clicking affects multiple burners or no clicking present — module failure possible. Less likely given customer reports normal clicking.", status: "suspected" },
      { diagnosis: "Gas valve or orifice issue", confidence: 15, reason: "If spark is present and visible but gas doesn't ignite — gas valve or burner orifice blockage possible.", status: "suspected" },
    ],
    additionalTestsRequired: [
      "Visual inspection: remove burner caps and heads on affected burners. Check for debris, cracks, or moisture.",
      "Test igniter resistance with power OFF — measure ohms across igniter terminals.",
      "Observe spark quality with power ON: strong blue spark (good) vs. weak/orange spark (igniter fouled/failing).",
      "Check igniter wire harness for damage, corrosion, or loose connections at module.",
      "Test gas pressure at manifold with manometer if available.",
    ],
    possibleCauses: [
      { cause: "Contaminated igniter tip (grease/food carbonized on ceramic)", priority: 1, likelihood: "very_likely", evidence: "Front burners most used, gradual onset, clicking present but no ignition" },
      { cause: "Cracked igniter ceramic insulator", priority: 2, likelihood: "likely", evidence: "Spark shorts to ground through crack rather than jumping to burner head" },
      { cause: "Failed igniter electrode (open winding)", priority: 3, likelihood: "likely", evidence: "Resistance test will confirm — OL reading = failed igniter" },
      { cause: "Loose igniter wire harness connection", priority: 4, likelihood: "possible", evidence: "Intermittent ignition failure, sometimes works after many clicks" },
      { cause: "Gas valve or orifice restriction", priority: 5, likelihood: "unlikely", evidence: "Would affect gas flow but visible spark present — less likely without gas smell" },
    ],
    tests: [
      {
        id: "t1", name: "Igniter Spark Visual Test",
        tool: "Visual inspection (dim ambient light)",
        procedure: [
          "Remove burner grate and burner cap from affected burner.",
          "Darken room or dim lights for better spark visibility.",
          "Turn burner knob to LITE/ignite position.",
          "Observe spark quality at igniter tip.",
        ],
        expectedReading: "Strong blue spark, 3–5mm arc length",
        normalRange: "Blue spark, consistent 6–8 sparks/second",
        passResult: "Strong blue spark — igniter is generating spark. Gas delivery issue suspected.",
        failResult: "No spark = igniter failed or wire disconnected. Weak/orange spark = igniter contaminated or ceramic cracked.",
      },
      {
        id: "t2", name: "Igniter Resistance Test",
        tool: "Digital Multimeter (Ω)",
        procedure: [
          "TURN OFF GAS and DISCONNECT POWER.",
          "Remove burner assembly to access igniter wiring.",
          "Disconnect igniter wire connector.",
          "Measure resistance across igniter terminals.",
        ],
        expectedReading: "Wolf igniters: 1,000–2,000Ω (1kΩ–2kΩ)",
        normalRange: "800Ω – 2,500Ω",
        passResult: "Within range — igniter element intact. Clean ceramic tip.",
        failResult: "OL = igniter open-circuit, replace. <100Ω = shorted, replace.",
      },
      {
        id: "t3", name: "Spark Module Output Voltage",
        tool: "Digital Multimeter (VAC, high voltage)",
        procedure: [
          "With power ON and burner knob at LITE, measure voltage at spark module output terminal for affected burner.",
          "Use high-voltage probe attachment — output is typically 6kV–15kV pulsed.",
          "Note: standard meters cannot safely measure this voltage. Use visual spark test instead.",
        ],
        expectedReading: "Pulsed high-voltage output present",
        normalRange: "Visible spark from module output terminal",
        passResult: "Spark at module output — module working. Fault is in igniter or wire.",
        failResult: "No output from module — replace spark module (804706).",
        safetyNote: "High voltage output — do not touch output terminals with hands. Use visual method.",
      },
    ],
    likelyParts: [
      { partNumber: "804706", description: "Wolf Spark/Igniter Module Assembly", estimatedCost: 185, priority: "likely", availability: "in_stock" },
      { partNumber: "804712", description: "Wolf Burner Igniter Electrode (Single)", estimatedCost: 45, priority: "required", availability: "in_stock" },
      { partNumber: "804715", description: "Wolf Igniter Wire Harness (4-burner)", estimatedCost: 68, priority: "possible", availability: "order_2_3_days" },
      { partNumber: "804692", description: "Wolf Burner Cap (Standard)", estimatedCost: 22, priority: "possible", availability: "in_stock" },
    ],
    recommendedNextAction: "Perform visual spark test first. If spark present but weak/orange — clean igniter ceramic with fine-grit abrasive cloth and compressed air. If no spark — resistance test to determine if igniter or module has failed. Do not order parts until spark test and resistance test completed.",
  },
  {
    id: "dg3",
    brand: "Miele",
    applianceType: "Dishwasher",
    primarySymptom: "E62 error code – heating failure",
    matchKeywords: ["E62", "error", "won't heat", "wet dishes", "heating", "cold water"],
    safetyWarnings: [
      "DISCONNECT POWER at breaker before accessing heating element or electrical components.",
      "Water may be present in base tray — place towels and have wet/dry vac ready.",
      "240V appliance — verify power off with meter before touching any terminals.",
      "Allow unit to cool and drain fully before internal access.",
    ],
    missingInfo: [
      "Confirm E62 appears consistently or intermittently.",
      "Check if dishes are cold AND wet (heating failure) vs. wet only (drying system).",
      "Verify water supply temperature entering unit — should be ≥120°F.",
      "Check if unit completes any portion of cycle before fault.",
    ],
    confirmedDiagnosis: "Heating element failure (E62 confirmed — NTC temperature sensor not detecting heat rise during wash cycle)",
    suspectedDiagnoses: [
      { diagnosis: "Heating element failure (primary)", confidence: 92, reason: "E62 specifically indicates NTC sensor detects no temperature rise during heating phase. Heating element open circuit is primary cause. Unit stops cycle when target temp not reached in time window.", status: "confirmed" },
      { diagnosis: "NTC temperature sensor failure", confidence: 35, reason: "If NTC reads incorrectly (always cold), unit will fault E62 even with functional heater. Test NTC resistance vs. temperature curve.", status: "suspected" },
      { diagnosis: "Control board relay failure (heater relay)", confidence: 20, reason: "Board fails to energize heater relay — heater never receives power. Rare but possible after moisture damage.", status: "suspected" },
    ],
    additionalTestsRequired: [
      "Measure heating element resistance — expect 15–25Ω for 120V Miele element.",
      "Test NTC sensor resistance at room temperature — should read ~10kΩ at 77°F (25°C).",
      "Check water inlet temperature with thermometer.",
      "Inspect heater element for visible damage, corrosion, or lime scale buildup.",
    ],
    possibleCauses: [
      { cause: "Heating element open circuit (burnt out)", priority: 1, likelihood: "very_likely", evidence: "E62 code + dishes cold and wet + cycle stops during wash" },
      { cause: "NTC temperature sensor out of calibration or failed", priority: 2, likelihood: "possible", evidence: "If NTC resistance at room temp is not ~10kΩ, sensor is faulty" },
      { cause: "Water supply below minimum temperature", priority: 3, likelihood: "possible", evidence: "If incoming water is <90°F, element cannot achieve target temp in allotted time" },
      { cause: "Heater relay on control board", priority: 4, likelihood: "unlikely", evidence: "Rare failure mode — only suspect after heater and NTC test as normal" },
    ],
    tests: [
      {
        id: "t1", name: "Heating Element Resistance",
        tool: "Digital Multimeter (Ω)",
        procedure: [
          "Disconnect power at breaker. Confirm with meter.",
          "Remove lower access kick panel.",
          "Locate heating element leads (usually 2 wires at bottom-rear of tub).",
          "Disconnect element leads.",
          "Measure resistance across element terminals.",
        ],
        expectedReading: "15–25Ω",
        normalRange: "12Ω – 28Ω",
        passResult: "Reading in range — element intact. Test NTC sensor next.",
        failResult: "OL = element open-circuit, replace (Part: 10289840). 0Ω = shorted, replace.",
      },
      {
        id: "t2", name: "NTC Temperature Sensor Resistance",
        tool: "Digital Multimeter (kΩ)",
        procedure: [
          "Disconnect power.",
          "Locate NTC sensor in sump area (2-wire connector, small cylindrical probe).",
          "Disconnect NTC connector.",
          "Measure resistance at room temperature (~70°F / 21°C).",
        ],
        expectedReading: "~10kΩ at 77°F (25°C)",
        normalRange: "8kΩ – 12kΩ at room temp (decreases as temperature rises)",
        passResult: "~10kΩ — NTC sensor is functioning. Heater element is the fault.",
        failResult: "OL = NTC open-circuit, replace. <1kΩ or 0Ω = NTC short, replace. Wrong value = sensor out of spec, replace.",
      },
      {
        id: "t3", name: "Inlet Water Temperature",
        tool: "Calibrated thermometer",
        procedure: [
          "Run kitchen hot water tap for 2 full minutes.",
          "Measure water temperature at tap with calibrated thermometer.",
          "Note: Miele recommends minimum 120°F (49°C) inlet temp for optimal performance.",
        ],
        expectedReading: "≥120°F (49°C)",
        normalRange: "120°F – 140°F",
        passResult: "Water temp adequate — not a contributing factor.",
        failResult: "Below 120°F — advise customer to increase water heater setting. Will cause E62 on marginal heater elements.",
      },
    ],
    likelyParts: [
      { partNumber: "10289840", description: "Miele Heating Element 120V (G7966)", estimatedCost: 210, priority: "required", availability: "order_2_3_days" },
      { partNumber: "07119570", description: "Miele Water Inlet Valve Assembly", estimatedCost: 95, priority: "likely", availability: "order_2_3_days" },
      { partNumber: "06467902", description: "Miele NTC Temperature Sensor", estimatedCost: 38, priority: "possible", availability: "in_stock" },
      { partNumber: "07736391", description: "Miele Control PCB (G7966)", estimatedCost: 385, priority: "possible", availability: "order_1_week" },
    ],
    recommendedNextAction: "Resistance test heating element immediately — E62 with cold/wet dishes strongly indicates element failure. If element measures OL, order Part 10289840 and NTC sensor 06467902 simultaneously (NTC inexpensive, replace preventively). Obtain manager approval for estimate before ordering.",
  },
];

// ─── Meter Reading Templates ──────────────────────────────────────────────────
export const METER_TEMPLATES: MeterReadingTemplate[] = [
  // Sub-Zero Refrigerator
  { id: "mt1", brand: "Sub-Zero", applianceType: "Refrigerator", component: "Evaporator Fan Motor", type: "voltage", expectedValue: "115V AC", normalRange: "103–127V AC", unit: "VAC", testProcedure: "Measure at motor terminals with door switch depressed. Power ON.", failureIndication: "<103V or >127V or 0V" },
  { id: "mt2", brand: "Sub-Zero", applianceType: "Refrigerator", component: "Evaporator Fan Motor Winding", type: "resistance", expectedValue: "200–400Ω", normalRange: "180–450Ω", unit: "Ω", testProcedure: "Power OFF. Disconnect motor harness. Measure across winding terminals.", failureIndication: "OL (open) or <10Ω (shorted)" },
  { id: "mt3", brand: "Sub-Zero", applianceType: "Refrigerator", component: "Defrost Heater", type: "resistance", expectedValue: "15–30Ω", normalRange: "12–35Ω", unit: "Ω", testProcedure: "Power OFF. Disconnect heater leads. Measure across terminals.", failureIndication: "OL = open circuit, replace" },
  { id: "mt4", brand: "Sub-Zero", applianceType: "Refrigerator", component: "Defrost Thermostat", type: "continuity", expectedValue: "Continuity (closed)", normalRange: "0–1Ω at room temp", unit: "Continuity", testProcedure: "Power OFF. Disconnect thermostat leads at room temp (>32°F).", failureIndication: "No continuity at room temp = stuck open, replace" },
  { id: "mt5", brand: "Sub-Zero", applianceType: "Refrigerator", component: "Freezer Compartment", type: "temperature", expectedValue: "0°F (–18°C)", normalRange: "–5°F to +5°F", unit: "°F", testProcedure: "Place calibrated thermometer in center of freezer. Wait 10 min with door closed.", failureIndication: ">10°F indicates cooling problem" },
  { id: "mt6", brand: "Sub-Zero", applianceType: "Refrigerator", component: "Fresh Food Compartment", type: "temperature", expectedValue: "37°F (3°C)", normalRange: "34°F–40°F", unit: "°F", testProcedure: "Place calibrated thermometer mid-shelf. Wait 10 min with door closed.", failureIndication: ">45°F indicates airflow or cooling failure" },
  // Wolf Range
  { id: "mt7", brand: "Wolf", applianceType: "Range", component: "Igniter Electrode", type: "resistance", expectedValue: "1,000–2,000Ω", normalRange: "800–2,500Ω", unit: "Ω", testProcedure: "Power OFF, gas OFF. Disconnect igniter wire. Measure across electrode terminals.", failureIndication: "OL = open, <100Ω = shorted — replace igniter" },
  { id: "mt8", brand: "Wolf", applianceType: "Range", component: "Bake Element", type: "resistance", expectedValue: "25–55Ω", normalRange: "20–60Ω", unit: "Ω", testProcedure: "Power OFF. Remove oven racks. Access element terminals at rear oven wall.", failureIndication: "OL = open element, replace" },
  { id: "mt9", brand: "Wolf", applianceType: "Range", component: "Oven Cavity", type: "temperature", expectedValue: "Set temp ±25°F", normalRange: "Within 25°F of setpoint", unit: "°F", testProcedure: "Preheat to 350°F. Place calibrated oven thermometer center rack. Wait 20 min.", failureIndication: ">25°F offset indicates calibration needed or probe failure" },
  // Miele Dishwasher
  { id: "mt10", brand: "Miele", applianceType: "Dishwasher", component: "Heating Element", type: "resistance", expectedValue: "15–25Ω", normalRange: "12–28Ω", unit: "Ω", testProcedure: "Power OFF at breaker. Access from below kick panel. Disconnect element leads.", failureIndication: "OL = failed element, replace (10289840)" },
  { id: "mt11", brand: "Miele", applianceType: "Dishwasher", component: "NTC Temperature Sensor", type: "resistance", expectedValue: "~10kΩ at 77°F", normalRange: "8–12kΩ at room temp", unit: "kΩ", testProcedure: "Power OFF. Locate NTC in sump. Disconnect 2-wire connector. Measure.", failureIndication: "OL or <1kΩ = failed sensor, replace (06467902)" },
  { id: "mt12", brand: "Miele", applianceType: "Dishwasher", component: "Supply Voltage", type: "voltage", expectedValue: "120V AC", normalRange: "108–132V AC", unit: "VAC", testProcedure: "Measure at unit power terminals with power ON. Use caution.", failureIndication: "<108V or >132V — check circuit and breaker" },
  // Gaggenau Cooktop
  { id: "mt13", brand: "Gaggenau", applianceType: "Cooktop", component: "Induction Zone Supply Voltage", type: "voltage", expectedValue: "240V AC", normalRange: "216–264V AC", unit: "VAC", testProcedure: "Measure at unit terminal block with power ON. Caution: 240V.", failureIndication: "<216V or >264V — check circuit breaker and supply" },
  { id: "mt14", brand: "Gaggenau", applianceType: "Cooktop", component: "Induction Coil Resistance", type: "resistance", expectedValue: "1–5Ω", normalRange: "0.5–8Ω", unit: "Ω", testProcedure: "Power OFF. Access induction coil PCB. Measure coil winding resistance.", failureIndication: "OL = coil open, replace PCB module (11021752)" },
];

// ─── OEM Parts Database ───────────────────────────────────────────────────────
export const OEM_PARTS: OEMPart[] = [
  // Sub-Zero
  { id: "p1", brand: "Sub-Zero", partNumber: "4204490", description: "Evaporator Fan Motor Assembly", category: "Motors & Fans", applianceTypes: ["Refrigerator"], compatibleModels: ["PRO 48", "PRO 42", "PRO 36", "BI-36U", "BI-42U"], unitCost: 320, availability: "in_stock", weight: "2.1 lbs", notes: "OEM replacement. Includes mounting bracket." },
  { id: "p2", brand: "Sub-Zero", partNumber: "4211614", description: "Compressor Start Relay", category: "Compressor & Refrigeration", applianceTypes: ["Refrigerator", "Wine Cooler"], compatibleModels: ["PRO 48", "PRO 42", "424G", "430", "448"], unitCost: 48, availability: "in_stock" },
  { id: "p3", brand: "Sub-Zero", partNumber: "4204555", description: "Defrost Heater Assembly 240V", category: "Defrost System", applianceTypes: ["Refrigerator"], compatibleModels: ["PRO 48", "PRO 42"], unitCost: 95, availability: "order_2_3_days" },
  { id: "p4", brand: "Sub-Zero", partNumber: "4201754", description: "Defrost Thermostat (Bi-Metal)", category: "Defrost System", applianceTypes: ["Refrigerator"], compatibleModels: ["PRO 48", "PRO 42", "PRO 36"], unitCost: 28, availability: "in_stock" },
  { id: "p5", brand: "Sub-Zero", partNumber: "7021186", description: "Wine Cooler Thermostat Assembly", category: "Controls & Thermostats", applianceTypes: ["Wine Cooler"], compatibleModels: ["424G", "430", "448", "424FS"], unitCost: 155, availability: "order_2_3_days", notes: "Verify exact model before ordering — multiple versions exist." },
  { id: "p6", brand: "Sub-Zero", partNumber: "7016856", description: "Refrigerant R-134a (1 lb)", category: "Refrigerants", applianceTypes: ["Refrigerator"], compatibleModels: ["All R-134a models"], unitCost: 35, availability: "in_stock", notes: "EPA 608 certification required to purchase and handle." },
  { id: "p7", brand: "Sub-Zero", partNumber: "7021432", description: "Door Gasket Set (Refrigerator, PRO 48)", category: "Seals & Gaskets", applianceTypes: ["Refrigerator"], compatibleModels: ["PRO 48"], unitCost: 145, availability: "order_2_3_days" },
  { id: "p8", brand: "Sub-Zero", partNumber: "4204495", description: "Main Control Board", category: "Electronics & Control Boards", applianceTypes: ["Refrigerator"], compatibleModels: ["PRO 48", "PRO 42"], unitCost: 480, availability: "order_1_week", notes: "Must be programmed after installation. See service manual." },
  // Wolf
  { id: "p9", brand: "Wolf", partNumber: "804706", description: "Spark/Igniter Module (6-burner)", category: "Ignition System", applianceTypes: ["Range"], compatibleModels: ["GR486G", "GR366G", "GR606G"], unitCost: 185, availability: "in_stock" },
  { id: "p10", brand: "Wolf", partNumber: "804712", description: "Burner Igniter Electrode (Single)", category: "Ignition System", applianceTypes: ["Range"], compatibleModels: ["GR486G", "GR366G", "GR606G", "IR", "RT"], unitCost: 45, availability: "in_stock" },
  { id: "p11", brand: "Wolf", partNumber: "804715", description: "Igniter Wire Harness (4-burner)", category: "Ignition System", applianceTypes: ["Range"], compatibleModels: ["GR486G"], unitCost: 68, availability: "order_2_3_days" },
  { id: "p12", brand: "Wolf", partNumber: "804748", description: "Gas Valve Assembly", category: "Gas System", applianceTypes: ["Range"], compatibleModels: ["GR486G", "GR366G"], unitCost: 248, availability: "order_1_week" },
  { id: "p13", brand: "Wolf", partNumber: "804769", description: "Oven Temperature Probe", category: "Sensors & Probes", applianceTypes: ["Range"], compatibleModels: ["GR486G", "GR366G", "DF486G"], unitCost: 65, availability: "in_stock" },
  // Miele
  { id: "p14", brand: "Miele", partNumber: "10289840", description: "Heating Element 120V (Dishwasher)", category: "Heating Elements", applianceTypes: ["Dishwasher"], compatibleModels: ["G 7966 SCVi", "G 7966 SCVi SF", "G 7565 SCVi"], unitCost: 210, availability: "order_2_3_days" },
  { id: "p15", brand: "Miele", partNumber: "07119570", description: "Water Inlet Valve Assembly", category: "Water System", applianceTypes: ["Dishwasher"], compatibleModels: ["G 7966 SCVi", "G 7565 SCVi", "G 7000 series"], unitCost: 95, availability: "order_2_3_days" },
  { id: "p16", brand: "Miele", partNumber: "06467902", description: "Circulation Pump Motor", category: "Pumps & Motors", applianceTypes: ["Dishwasher"], compatibleModels: ["G 7966 SCVi", "G 7000 series"], unitCost: 285, availability: "order_1_week" },
  { id: "p17", brand: "Miele", partNumber: "06467811", description: "NTC Temperature Sensor", category: "Sensors & Probes", applianceTypes: ["Dishwasher"], compatibleModels: ["G 7000 series", "G 6000 series"], unitCost: 38, availability: "in_stock" },
  // Gaggenau
  { id: "p18", brand: "Gaggenau", partNumber: "11021752", description: "Induction Zone PCB Module (Front-Left)", category: "Electronics & Control Boards", applianceTypes: ["Cooktop"], compatibleModels: ["VG 295 214", "VG 295 114", "CX 480 101"], unitCost: 480, availability: "order_1_week", notes: "Must match exact zone position (FL/FR/RL/RR)." },
  { id: "p19", brand: "Gaggenau", partNumber: "11037952", description: "Safety Thermostat (Induction)", category: "Sensors & Probes", applianceTypes: ["Cooktop"], compatibleModels: ["VG 295 series", "CX 480 series"], unitCost: 55, availability: "order_2_3_days" },
  { id: "p20", brand: "Gaggenau", partNumber: "11025423", description: "Touch Interface / Control Panel", category: "Electronics & Control Boards", applianceTypes: ["Cooktop"], compatibleModels: ["VG 295 214"], unitCost: 320, availability: "order_1_week" },
  // Thermador
  { id: "p21", brand: "Thermador", partNumber: "14-35-935", description: "Oven Door Gasket Seal", category: "Seals & Gaskets", applianceTypes: ["Wall Oven"], compatibleModels: ["ME302WS", "ME301JS", "MED272JS"], unitCost: 78, availability: "in_stock" },
  { id: "p22", brand: "Thermador", partNumber: "14-40-043", description: "Oven Temperature Probe (NTC)", category: "Sensors & Probes", applianceTypes: ["Wall Oven"], compatibleModels: ["ME302WS", "ME301JS"], unitCost: 48, availability: "in_stock" },
];

// ─── Service Manuals ──────────────────────────────────────────────────────────
export const SERVICE_MANUALS: ServiceManual[] = [
  {
    id: "sm1", brand: "Sub-Zero", modelFamily: "PRO Series", applicableModels: ["PRO 48", "PRO 42", "PRO 36"],
    title: "Sub-Zero PRO Series Built-In Refrigerator — Complete Service Manual", type: "service_manual",
    pages: 248, lastRevision: "2023-09",
    sections: ["Safety & Warning Notices", "Specifications & Wiring Diagrams", "Installation Requirements", "Refrigeration System", "Evaporator & Defrost System", "Electrical Components", "Control System & Diagnostics", "Error Codes & Fault Trees", "Disassembly Procedures", "Refrigerant Charging Procedures", "Parts Diagrams"],
    highlights: ["Complete fault code table with diagnostic trees", "Refrigerant charge specifications by model", "Wiring schematics for all control board versions", "Torque specs for compressor service"],
  },
  {
    id: "sm2", brand: "Sub-Zero", modelFamily: "PRO Series", applicableModels: ["PRO 48", "PRO 42"],
    title: "Sub-Zero PRO 48/42 Evaporator & Defrost System — Technical Sheet", type: "tech_sheet",
    pages: 18, lastRevision: "2022-03",
    sections: ["Evaporator Access Procedure", "Fan Motor Specs", "Defrost Heater Data", "Thermostat Data", "Ice Maker System"],
    highlights: ["Step-by-step evaporator panel removal", "Fan motor spec sheet with resistance values", "Defrost cycle timing chart"],
  },
  {
    id: "sm3", brand: "Sub-Zero", modelFamily: "PRO Series", applicableModels: ["PRO 48", "PRO 42", "PRO 36"],
    title: "Sub-Zero PRO Series Wiring Diagram — All Variants", type: "wiring_diagram",
    pages: 12, lastRevision: "2023-09",
    sections: ["Main Power Circuit", "Compressor Circuit", "Defrost Circuit", "Fan Motor Circuit", "Ice Maker Circuit", "Control Board Pinout"],
    highlights: ["Color-coded wiring diagrams", "Control board connector identification", "Grounding locations"],
  },
  {
    id: "sm4", brand: "Wolf", modelFamily: "GR Gas Range", applicableModels: ["GR486G", "GR366G", "GR606G"],
    title: "Wolf GR Series Gas Range — Service Manual", type: "service_manual",
    pages: 186, lastRevision: "2023-01",
    sections: ["Safety Information", "Technical Specifications", "Gas System Components", "Ignition System", "Oven System", "Electrical Schematics", "Diagnostic Procedures", "Burner Disassembly", "Parts Index"],
    highlights: ["Gas valve testing procedures", "Igniter resistance specifications", "Oven calibration procedure", "Burner BTU settings"],
  },
  {
    id: "sm5", brand: "Miele", modelFamily: "G 7000 Series Dishwasher", applicableModels: ["G 7966 SCVi", "G 7565 SCVi", "G 7000 series"],
    title: "Miele G 7000 Series Dishwasher — Service Manual", type: "service_manual",
    pages: 312, lastRevision: "2024-02",
    sections: ["Safety Instructions", "Technical Data", "Error Code Directory (E01–E99)", "Water System", "Heating System", "Electrical System", "Control Electronics", "Pump System", "Disassembly & Assembly", "Spare Parts"],
    highlights: ["Complete E-code error directory with root causes", "Heating element test procedures", "NTC resistance-temperature table", "Pump flow rate specifications"],
  },
  {
    id: "sm6", brand: "Gaggenau", modelFamily: "VG 200 Induction", applicableModels: ["VG 295 214", "VG 295 114"],
    title: "Gaggenau VG 295 Induction Cooktop — Technical Reference", type: "tech_sheet",
    pages: 42, lastRevision: "2023-06",
    sections: ["Error Code Matrix", "Induction Zone Specifications", "PCB Module Identification", "Power Supply Requirements", "Testing Procedures", "PCB Replacement Procedure"],
    highlights: ["F-code fault matrix with zone identification", "PCB module part number guide by zone", "Power measurement points"],
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────
export const getCustomer = (id: string) => CUSTOMERS.find(c => c.id === id);
export const getTechnician = (id: string) => USERS.find(u => u.id === id);
export const getAppliance = (id: string) => APPLIANCES.find(a => a.id === id);
export const getJob = (id: string) => JOBS.find(j => j.id === id);
export const getEstimate = (id: string) => ESTIMATES.find(e => e.id === id);
export const getJobsByTechnician = (techId: string) => JOBS.filter(j => j.technicianId === techId);
export const getTechnicianStats = (techId: string) => TECHNICIAN_STATS.find(s => s.technicianId === techId);
export const getPendingApprovals = () => APPROVALS.filter(a => a.status === "pending");
export const getActiveJobs = () => JOBS.filter(j => ["scheduled", "en_route", "in_progress", "pending_approval"].includes(j.status));

export function getTodaysJobs(techId: string) {
  const today = new Date().toISOString().split("T")[0];
  // For demo: also include "2026-07-27" jobs as today's jobs
  return JOBS.filter(j => j.technicianId === techId && (j.scheduledAt.startsWith(today) || j.scheduledAt.startsWith("2026-07-27")));
}

export function getDiagnosticGuide(brand: string, applianceType: string, keywords: string[]): DiagnosticGuide | null {
  const brandGuides = DIAGNOSTIC_GUIDES.filter(g => g.brand === brand && g.applianceType === applianceType);
  if (brandGuides.length === 0) return DIAGNOSTIC_GUIDES.find(g => g.brand === brand) ?? null;
  // Score by keyword match
  const scored = brandGuides.map(g => ({
    guide: g,
    score: keywords.filter(kw => g.matchKeywords.some(mk => mk.toLowerCase().includes(kw.toLowerCase()) || kw.toLowerCase().includes(mk.toLowerCase()))).length,
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.guide ?? brandGuides[0] ?? null;
}

export function getMeterTemplates(brand: string, applianceType: string): MeterReadingTemplate[] {
  return METER_TEMPLATES.filter(t => t.brand === brand && t.applianceType === applianceType);
}

export function getPartsForBrand(brand: string, applianceType?: string): OEMPart[] {
  return OEM_PARTS.filter(p => p.brand === brand && (!applianceType || p.applianceTypes.includes(applianceType)));
}

export function searchParts(query: string): OEMPart[] {
  const q = query.toLowerCase();
  return OEM_PARTS.filter(p =>
    p.partNumber.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.compatibleModels.some(m => m.toLowerCase().includes(q))
  );
}

export function getManualsForAppliance(brand: string, model: string): ServiceManual[] {
  return SERVICE_MANUALS.filter(m => m.brand === brand && m.applicableModels.some(am => model.includes(am) || am.includes(model.split(" ")[0])));
}

// ─── Phase 2: Audit Log Seed Data ─────────────────────────────────────────────
export const INITIAL_AUDIT_LOG: AuditLogEntry[] = [
  { id: "al1", timestamp: "2026-07-26T17:30:00Z", actorId: "u2", actorName: "Sandra Kim", action: "approved", entityType: "approval", entityId: "ap4", entityLabel: "Warranty claim – Miele heating element", before: "pending", after: "approved", notes: "Approved. Submitted to Miele warranty portal." },
  { id: "al2", timestamp: "2026-07-26T15:45:00Z", actorId: "u2", actorName: "Sandra Kim", action: "rejected", entityType: "approval", entityId: "ap5", entityLabel: "Part order – Sub-Zero wine cooler thermostat", before: "pending", after: "rejected", notes: "Incorrect part number. Re-submit with correct SKU." },
  { id: "al3", timestamp: "2026-07-27T10:35:00Z", actorId: "u3", actorName: "Carlos Mendez", action: "submitted", entityType: "approval", entityId: "ap1", entityLabel: "Estimate – Sub-Zero PRO 48 evaporator fan motor", before: "draft", after: "pending" },
  { id: "al4", timestamp: "2026-07-27T11:50:00Z", actorId: "u4", actorName: "Jasmine Patel", action: "submitted", entityType: "approval", entityId: "ap2", entityLabel: "Estimate – Miele G7966 heating element + inlet valve", before: "draft", after: "pending" },
  { id: "al5", timestamp: "2026-07-27T08:20:00Z", actorId: "u6", actorName: "Alicia Fontaine", action: "submitted", entityType: "approval", entityId: "ap3", entityLabel: "Emergency part order – Gaggenau induction zone PCB", before: "draft", after: "pending" },
  { id: "al6", timestamp: "2026-07-27T09:00:00Z", actorId: "u3", actorName: "Carlos Mendez", action: "status_changed", entityType: "job", entityId: "j1", entityLabel: "Sub-Zero Refrigerator – Cooling Issue", before: "scheduled", after: "in_progress" },
  { id: "al7", timestamp: "2026-07-27T08:00:00Z", actorId: "u4", actorName: "Jasmine Patel", action: "status_changed", entityType: "job", entityId: "j5", entityLabel: "Thermador Oven – Calibration & Maintenance", before: "in_progress", after: "completed" },
  { id: "al8", timestamp: "2026-07-26T14:00:00Z", actorId: "u5", actorName: "Derek Thompson", action: "submitted", entityType: "approval", entityId: "ap5", entityLabel: "Part order – Sub-Zero wine cooler thermostat (7021186)", before: "draft", after: "pending" },
  { id: "al9", timestamp: "2026-07-25T16:00:00Z", actorId: "u1", actorName: "Michael Reeves", action: "updated", entityType: "pricing", entityId: "pricing_config", entityLabel: "Pricing: Labor Rate per Hour", before: "$175/hr", after: "$185/hr" },
  { id: "al10", timestamp: "2026-07-24T10:00:00Z", actorId: "u2", actorName: "Sandra Kim", action: "created", entityType: "job", entityId: "j8", entityLabel: "Wolf Range – Deep Clean & Burner Service", notes: "Scheduled per VIP service contract for Catherine Voss." },
];

// ─── Phase 2: Review Packets ──────────────────────────────────────────────────
export const REVIEW_PACKETS: ReviewPacket[] = [
  {
    approvalId: "ap1",
    jobId: "j1",
    symptoms: {
      customerComplaint: "Fridge won't get cold. Everything is warm and the ice maker stopped working two days ago. We have a dinner party this weekend.",
      observedSymptoms: ["Not cooling", "Ice maker not working", "Warm fresh food section", "No airflow from vents"],
      errorCodes: [],
      frequencyOfIssue: "Constant – ongoing for 3 days",
      additionalNotes: "Ambient room temp is 72°F. Compressor hum audible from rear. No frost visible on exterior.",
    },
    diagnostic: {
      confirmedDiagnosis: "Evaporator fan motor failure — voltage present at motor terminals (115V), motor not spinning. No airflow to fresh food section.",
      suspectedDiagnoses: [
        { diagnosis: "Evaporator fan motor failure", confidence: 88, status: "confirmed" },
        { diagnosis: "Defrost system failure", confidence: 30, status: "ruled_out" },
      ],
      completedTests: ["Evaporator Fan Voltage Test", "Evaporator Fan Motor Resistance Test", "Defrost Heater Resistance Test"],
      techNotes: "Voltage test: 115.2V AC at motor terminals — board output is good. Motor resistance: OL (open winding) — motor is failed. Defrost heater: 18Ω — within spec, not the primary cause. Recommend replacing fan motor immediately. Defrost system OK.",
    },
    readings: [
      { component: "Evaporator Fan Motor", type: "voltage", expectedValue: "115V AC", measuredValue: "115.2", unit: "VAC", result: "pass" },
      { component: "Evaporator Fan Motor Winding", type: "resistance", expectedValue: "200–400Ω", measuredValue: "OL", unit: "Ω", result: "fail" },
      { component: "Defrost Heater", type: "resistance", expectedValue: "15–30Ω", measuredValue: "18.4", unit: "Ω", result: "pass" },
      { component: "Freezer Compartment", type: "temperature", expectedValue: "0°F", measuredValue: "38", unit: "°F", result: "fail" },
      { component: "Fresh Food Compartment", type: "temperature", expectedValue: "37°F", measuredValue: "52", unit: "°F", result: "fail" },
    ],
    photos: [
      { id: "ph1", category: "before", caption: "Evaporator coils — minimal frost buildup, consistent with airflow failure", timestamp: "2026-07-27T09:45:00Z" },
      { id: "ph2", category: "defect", caption: "Fan motor — seized, winding OL confirmed on meter", timestamp: "2026-07-27T09:52:00Z" },
      { id: "ph3", category: "meter_reading", caption: "Meter showing OL on motor winding resistance test", timestamp: "2026-07-27T09:55:00Z" },
      { id: "ph4", category: "serial_number", caption: "Unit serial plate — SZ-PRO48-221047", timestamp: "2026-07-27T09:30:00Z" },
    ],
    serviceReport: {
      repairType: "parts_replaced",
      workPerformed: "Diagnosed evaporator fan motor failure via voltage test (115V confirmed at terminals) and resistance test (motor winding OL). Removed rear freezer panel per Sub-Zero service manual Section 7. Confirmed motor seizure. Defrost heater tested and confirmed within spec (18.4Ω). Estimate submitted for manager approval before ordering parts.",
      partsReplaced: [],
      laborMinutes: 95,
      outcome: "Diagnosis complete. Fan motor 4204490 required. Awaiting approval to order and complete repair.",
      followUpRequired: true,
      safetyConcerns: "R-134a system intact — no leak detected at this time. EPA 608 precautions maintained.",
    },
    estimateLines: [
      { type: "labor", description: "Diagnostic + Fan Motor Replacement (3 hrs @ $185/hr)", quantity: 3, unitPrice: 185 },
      { type: "part", description: "Sub-Zero Evaporator Fan Motor Assembly (4204490)", quantity: 1, unitPrice: 320 },
      { type: "part", description: "Compressor Start Relay (4211614) — preventive replacement", quantity: 1, unitPrice: 48 },
      { type: "part", description: "Refrigerant R-134a 1 lb (precautionary)", quantity: 2, unitPrice: 35 },
    ],
    estimateTotal: 993,
    proposedHcpChanges: [
      { field: "Job Status", currentValue: "In Progress", proposedValue: "Awaiting Parts", reason: "Fan motor must be ordered; cannot complete repair until part arrives" },
      { field: "Diagnosis", currentValue: "(blank)", proposedValue: "Evaporator fan motor failure — winding OL, voltage supply confirmed normal", reason: "Document confirmed diagnosis in HCP job record" },
      { field: "Next Appointment", currentValue: "(none)", proposedValue: "Schedule return visit after part delivery (est. same day — in stock)", reason: "Part 4204490 is in stock; return visit can be scheduled for next day" },
    ],
  },
  {
    approvalId: "ap2",
    jobId: "j3",
    symptoms: {
      customerComplaint: "Dishwasher shows E62 and stops mid-cycle. The dishes come out wet and dirty. Started every other cycle, now every cycle.",
      observedSymptoms: ["E62 error code", "Dishes wet and cold", "Cycle stops mid-wash", "No heated water"],
      errorCodes: ["E62"],
      frequencyOfIssue: "Every cycle — 100% failure rate",
      additionalNotes: "E62 confirmed on both Quick-Wash and Normal cycles. Customer has not changed detergent or load patterns.",
    },
    diagnostic: {
      confirmedDiagnosis: "Heating element failure (E62 confirmed). Element measures OL — open circuit. Water inlet valve also showing reduced flow (pressure test low). Both components require replacement.",
      suspectedDiagnoses: [
        { diagnosis: "Heating element failure", confidence: 92, status: "confirmed" },
        { diagnosis: "Water inlet valve reduced flow", confidence: 75, status: "confirmed" },
        { diagnosis: "NTC temperature sensor", confidence: 20, status: "ruled_out" },
      ],
      completedTests: ["Heating Element Resistance Test", "NTC Temperature Sensor Test", "Inlet Water Temperature Check"],
      techNotes: "Element resistance: OL — confirmed failed. NTC: 9.8kΩ at 70°F — within spec, not the fault. Inlet water temp: 121°F — adequate. However, water fill volume appeared low during cycle observation; inlet valve screen partially blocked with debris. Both heating element and inlet valve replacement recommended.",
    },
    readings: [
      { component: "Heating Element", type: "resistance", expectedValue: "15–25Ω", measuredValue: "OL", unit: "Ω", result: "fail" },
      { component: "NTC Temperature Sensor", type: "resistance", expectedValue: "~10kΩ", measuredValue: "9.8", unit: "kΩ", result: "pass" },
      { component: "Supply Voltage", type: "voltage", expectedValue: "120V AC", measuredValue: "119.4", unit: "VAC", result: "pass" },
    ],
    photos: [
      { id: "ph5", category: "defect", caption: "Heating element — visually intact but OL on resistance test", timestamp: "2026-07-27T11:20:00Z" },
      { id: "ph6", category: "meter_reading", caption: "Multimeter showing OL on heating element", timestamp: "2026-07-27T11:25:00Z" },
      { id: "ph7", category: "before", caption: "Interior base — water pooling, inlet flow restricted", timestamp: "2026-07-27T11:10:00Z" },
    ],
    serviceReport: {
      repairType: "parts_replaced",
      workPerformed: "E62 error code confirmed. Disconnected power at breaker. Accessed heating element via lower kick panel. Resistance test confirmed element OL — failed. NTC sensor tested 9.8kΩ (in spec). Inlet water temperature 121°F (adequate). Observed reduced inlet flow during live cycle; inlet valve screen blocked. Both components require replacement. Estimate submitted for approval.",
      partsReplaced: [],
      laborMinutes: 75,
      outcome: "Diagnosis confirmed. Parts ordered pending approval. Unit not operational — customer advised.",
      followUpRequired: true,
      safetyConcerns: "240V circuit — power confirmed off before all internal testing.",
    },
    estimateLines: [
      { type: "labor", description: "Diagnostic + Heating Element + Inlet Valve Replacement (2 hrs @ $185/hr)", quantity: 2, unitPrice: 185 },
      { type: "part", description: "Miele Heating Element 120V — 10289840", quantity: 1, unitPrice: 210 },
      { type: "part", description: "Water Inlet Valve Assembly — 07119570", quantity: 1, unitPrice: 95 },
    ],
    estimateTotal: 675,
    proposedHcpChanges: [
      { field: "Diagnosis", currentValue: "Heating element failed. Water inlet valve also shows reduced flow.", proposedValue: "E62 confirmed — heating element OL (failed). Inlet valve flow restricted (partially blocked screen). Both replaced.", reason: "Update with confirmed test results and both components replaced" },
      { field: "Parts Status", currentValue: "(blank)", proposedValue: "Miele 10289840 + 07119570 on order — 2–3 business day lead time", reason: "Inform dispatch of parts lead time for scheduling return visit" },
    ],
  },
  {
    approvalId: "ap3",
    jobId: "j6",
    symptoms: {
      customerComplaint: "Left front burner completely dead. Shows F1 on display. Other zones work fine.",
      observedSymptoms: ["F1 fault code", "Front-left induction zone dead", "No heat output", "Error persists after restart"],
      errorCodes: ["F1"],
      frequencyOfIssue: "Constant — zone non-functional since fault appeared",
      additionalNotes: "Customer reports fault appeared suddenly. No unusual noise or burning smell reported.",
    },
    diagnostic: {
      confirmedDiagnosis: "Front-left induction zone PCB module failure. F1 fault indicates power module fault on that zone. PCB module 11021752 requires emergency replacement.",
      suspectedDiagnoses: [
        { diagnosis: "Induction zone PCB module failure", confidence: 90, status: "confirmed" },
        { diagnosis: "Safety thermostat failure", confidence: 15, status: "ruled_out" },
      ],
      completedTests: ["Induction Zone Supply Voltage Test", "Induction Coil Resistance Test"],
      techNotes: "Supply voltage at terminal block: 240V confirmed. Safety thermostat continuity: intact. Induction coil resistance (FL zone): OL — coil open circuit consistent with PCB module internal failure. F1 on Gaggenau VG 295 = power module fault for affected zone. Emergency part order required — part availability order_1_week (special order scenario). Customer advised unit partially operable on 3 remaining zones.",
    },
    readings: [
      { component: "Induction Zone Supply Voltage", type: "voltage", expectedValue: "240V AC", measuredValue: "241.2", unit: "VAC", result: "pass" },
      { component: "Induction Coil Resistance (FL zone)", type: "resistance", expectedValue: "1–5Ω", measuredValue: "OL", unit: "Ω", result: "fail" },
    ],
    photos: [
      { id: "ph8", category: "defect", caption: "Front-left zone — F1 fault displayed, zone inactive", timestamp: "2026-07-27T08:10:00Z" },
      { id: "ph9", category: "meter_reading", caption: "Coil resistance test showing OL on FL zone", timestamp: "2026-07-27T08:15:00Z" },
    ],
    serviceReport: {
      repairType: "parts_replaced",
      workPerformed: "F1 fault confirmed on front-left induction zone. Supply voltage tested at 241.2V — adequate. Safety thermostat continuity intact. Induction coil resistance (FL zone): OL — confirms PCB module internal failure. Emergency part order 11021752 submitted. Customer informed 3 remaining zones fully operational.",
      partsReplaced: [],
      laborMinutes: 55,
      outcome: "Diagnosis confirmed. Emergency part order pending approval. Unit partially operational.",
      followUpRequired: true,
    },
    estimateLines: [
      { type: "labor", description: "Diagnostic labor (1 hr @ $185/hr)", quantity: 1, unitPrice: 185 },
      { type: "part", description: "Gaggenau Induction Zone PCB Module FL — 11021752 (emergency order)", quantity: 1, unitPrice: 480 },
    ],
    estimateTotal: 480,
    proposedHcpChanges: [
      { field: "Job Status", currentValue: "En Route", proposedValue: "Awaiting Parts", reason: "PCB module 11021752 on emergency order — 1 week lead time" },
      { field: "Diagnosis", currentValue: "(blank)", proposedValue: "F1 fault — front-left PCB module coil OL. Module 11021752 required.", reason: "Document confirmed diagnosis" },
    ],
  },
];

// ─── Phase 2: Pricing Config ───────────────────────────────────────────────────
export const INITIAL_PRICING_CONFIG: PricingConfig = {
  laborRatePerHour: 185,
  diagnosticFee: 125,
  travelFeeStandard: 45,
  travelFeePremium: 65,
  minimumServiceCharge: 185,
  afterHoursSurchargePercent: 25,
  tierMultipliers: { standard: 1.0, premium: 1.1, vip: 1.2 },
  taxRatePercent: 10.25,
  warrantyLaborRate: 95,
  updatedAt: "2026-07-25T16:00:00Z",
  updatedBy: "Michael Reeves",
};

// ─── Phase 2: Integrations ─────────────────────────────────────────────────────
export const INITIAL_INTEGRATIONS: IntegrationConfig[] = [
  {
    id: "int_hcp",
    name: "Housecall Pro",
    description: "Field service management — jobs, dispatch, invoicing, and customer portal.",
    category: "field_service",
    status: "disconnected",
    logoInitials: "HCP",
    logoColor: "bg-blue-600",
    features: ["Two-way job sync", "Invoice generation", "Customer notifications", "Dispatch board", "GPS tracking"],
    configFields: [
      { key: "api_key", label: "API Key", placeholder: "hcp_live_xxxxxxxxxxxxxxxx", masked: true },
      { key: "company_id", label: "Company ID", placeholder: "your-company-id" },
      { key: "webhook_url", label: "Webhook URL", placeholder: "https://yourapp.com/webhooks/hcp" },
    ],
    notes: "Connect your Housecall Pro account to sync jobs, estimates, and invoices automatically.",
  },
  {
    id: "int_stripe",
    name: "Stripe",
    description: "Payment processing — accept cards, ACH, and digital wallets on estimates and invoices.",
    category: "payments",
    status: "disconnected",
    logoInitials: "STR",
    logoColor: "bg-violet-600",
    features: ["Card & ACH payments", "Digital invoices", "Automatic receipts", "Refund management", "Revenue reporting"],
    configFields: [
      { key: "publishable_key", label: "Publishable Key", placeholder: "pk_live_xxxxxxxx" },
      { key: "secret_key", label: "Secret Key", placeholder: "sk_live_xxxxxxxx", masked: true },
      { key: "webhook_secret", label: "Webhook Secret", placeholder: "whsec_xxxxxxxx", masked: true },
    ],
  },
  {
    id: "int_openai",
    name: "OpenAI",
    description: "AI-powered diagnostic suggestions, report drafting, and customer communication.",
    category: "ai",
    status: "disconnected",
    logoInitials: "AI",
    logoColor: "bg-emerald-600",
    features: ["Diagnostic AI assistant", "Report auto-drafting", "Customer message drafting", "Knowledge base search"],
    configFields: [
      { key: "api_key", label: "API Key", placeholder: "sk-proj-xxxxxxxx", masked: true },
      { key: "model", label: "Model", placeholder: "gpt-4o" },
    ],
    notes: "Enables AI diagnostic assistant and auto-draft features for service reports.",
  },
  {
    id: "int_twilio",
    name: "Twilio",
    description: "SMS and voice notifications — appointment reminders, tech ETA alerts, and approval requests.",
    category: "communications",
    status: "disconnected",
    logoInitials: "TWL",
    logoColor: "bg-red-600",
    features: ["SMS appointment reminders", "Tech ETA notifications", "Manager approval alerts", "Two-way SMS"],
    configFields: [
      { key: "account_sid", label: "Account SID", placeholder: "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" },
      { key: "auth_token", label: "Auth Token", placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", masked: true },
      { key: "from_number", label: "From Number", placeholder: "+13105550100" },
    ],
  },
  {
    id: "int_miele",
    name: "Miele Warranty Portal",
    description: "Direct warranty claim submission and status tracking with Miele Professional.",
    category: "warranty",
    status: "pending",
    logoInitials: "MWP",
    logoColor: "bg-gray-700",
    features: ["Online warranty claim submission", "Claim status tracking", "Parts pre-authorization", "Labor rate confirmation"],
    configFields: [
      { key: "dealer_id", label: "Dealer ID", placeholder: "JDR-LUXURY-001" },
      { key: "portal_username", label: "Portal Username", placeholder: "your@email.com" },
      { key: "portal_password", label: "Portal Password", placeholder: "••••••••", masked: true },
    ],
    notes: "Registration pending Miele dealer approval. Expected activation within 5–7 business days.",
    lastSynced: undefined,
  },
];

// ─── Phase 2: Helper Functions ─────────────────────────────────────────────────
export const getReviewPacket = (approvalId: string): ReviewPacket | undefined =>
  REVIEW_PACKETS.find(rp => rp.approvalId === approvalId);
