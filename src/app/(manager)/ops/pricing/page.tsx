"use client";

import { useEffect, useState } from "react";
import { INITIAL_PRICING_CONFIG } from "@/lib/mock-data";
import { logPricingUpdate } from "@/lib/audit-store";
import { getSession } from "@/lib/auth";
import PageHeader from "@/components/ui/PageHeader";
import { DollarSign, Save, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { clsx } from "clsx";
import type { PricingConfig } from "@/types";

const STORAGE_KEY = "jdr_pricing_config";

function loadConfig(): PricingConfig {
  if (typeof window === "undefined") return INITIAL_PRICING_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...INITIAL_PRICING_CONFIG, ...JSON.parse(raw) } : INITIAL_PRICING_CONFIG;
  } catch {
    return INITIAL_PRICING_CONFIG;
  }
}

function saveConfig(config: PricingConfig) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

interface FieldConfig {
  key: keyof PricingConfig;
  label: string;
  description: string;
  prefix?: string;
  suffix?: string;
  min?: number;
  step?: number;
}

const FIELD_GROUPS: { title: string; description: string; fields: FieldConfig[] }[] = [
  {
    title: "Labor & Service",
    description: "Standard rates applied to all service calls",
    fields: [
      { key: "laborRatePerHour", label: "Labor Rate", description: "Standard hourly labor rate", prefix: "$", suffix: "/hr", min: 0, step: 5 },
      { key: "diagnosticFee", label: "Diagnostic Fee", description: "Flat fee for diagnosis-only visits", prefix: "$", min: 0, step: 5 },
      { key: "minimumServiceCharge", label: "Minimum Service Charge", description: "Minimum billable amount per job", prefix: "$", min: 0, step: 5 },
      { key: "warrantyLaborRate", label: "Warranty Labor Rate", description: "Hourly rate for warranty repair claims", prefix: "$", suffix: "/hr", min: 0, step: 5 },
    ],
  },
  {
    title: "Travel & Surcharges",
    description: "Travel fees and after-hours pricing",
    fields: [
      { key: "travelFeeStandard", label: "Standard Travel Fee", description: "Travel fee for standard zone jobs", prefix: "$", min: 0, step: 5 },
      { key: "travelFeePremium", label: "Premium Travel Fee", description: "Travel fee for extended/VIP zones", prefix: "$", min: 0, step: 5 },
      { key: "afterHoursSurchargePercent", label: "After-Hours Surcharge", description: "Percentage added for after-hours calls", suffix: "%", min: 0, step: 1 },
      { key: "taxRatePercent", label: "Tax Rate", description: "Sales tax rate applied to parts", suffix: "%", min: 0, step: 0.25 },
    ],
  },
];

export default function PricingPage() {
  const [config, setConfig] = useState<PricingConfig>(INITIAL_PRICING_CONFIG);
  const [original, setOriginal] = useState<PricingConfig>(INITIAL_PRICING_CONFIG);
  const [session, setSession] = useState<{ userId: string; name: string } | null>(null);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const loaded = loadConfig();
    setConfig(loaded);
    setOriginal(loaded);
    const s = getSession();
    if (s) setSession(s);
  }, []);

  function handleChange(key: keyof PricingConfig, value: string | number) {
    setConfig(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  }

  function handleTierChange(tier: keyof PricingConfig["tierMultipliers"], value: string) {
    setConfig(prev => ({
      ...prev,
      tierMultipliers: { ...prev.tierMultipliers, [tier]: parseFloat(value) || 1 },
    }));
    setHasChanges(true);
  }

  function handleSave() {
    const updatedConfig = {
      ...config,
      updatedAt: new Date().toISOString(),
      updatedBy: session?.name ?? "Unknown",
    };
    saveConfig(updatedConfig);
    setOriginal(updatedConfig);
    setHasChanges(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);

    // Log changes to audit trail
    if (session) {
      const numericFields: (keyof PricingConfig)[] = ["laborRatePerHour", "diagnosticFee", "travelFeeStandard", "travelFeePremium", "minimumServiceCharge", "afterHoursSurchargePercent", "taxRatePercent", "warrantyLaborRate"];
      for (const field of numericFields) {
        if (original[field] !== config[field]) {
          logPricingUpdate({
            actorId: session.userId,
            actorName: session.name,
            field: FIELD_GROUPS.flatMap(g => g.fields).find(f => f.key === field)?.label ?? field,
            before: `${original[field]}`,
            after: `${config[field]}`,
          });
        }
      }
    }
  }

  function handleReset() {
    setConfig(original);
    setHasChanges(false);
  }

  const estimatedCallValue = Math.round(
    (config.laborRatePerHour * 2.5) + config.diagnosticFee + config.travelFeeStandard
  );

  return (
    <div className="space-y-8 max-w-2xl">
      <PageHeader title="Pricing Configuration" subtitle="Labor rates, fees, and multipliers" />

      {/* Live estimate preview */}
      <div className="jdr-card p-5 bg-jdr-navy">
        <div className="flex items-center gap-3 mb-3">
          <DollarSign className="w-5 h-5 text-jdr-gold" />
          <p className="text-white font-bold">Estimated Average Job Value</p>
        </div>
        <p className="text-white text-3xl font-bold">${estimatedCallValue.toLocaleString()}</p>
        <p className="text-white/50 text-xs mt-1">Based on 2.5 hrs labor + diagnostic fee + standard travel</p>
      </div>

      {/* Field groups */}
      {FIELD_GROUPS.map(group => (
        <div key={group.title}>
          <div className="mb-4">
            <h2 className="font-bold text-jdr-navy">{group.title}</h2>
            <p className="text-jdr-slate text-sm mt-0.5">{group.description}</p>
          </div>
          <div className="jdr-card p-5 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {group.fields.map(field => (
                <div key={String(field.key)}>
                  <label className="jdr-label">{field.label}</label>
                  <p className="text-jdr-slate text-xs mb-1.5">{field.description}</p>
                  <div className="relative">
                    {field.prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-jdr-slate text-sm">{field.prefix}</span>}
                    <input
                      type="number"
                      min={field.min}
                      step={field.step ?? 1}
                      value={config[field.key] as number}
                      onChange={e => handleChange(field.key, parseFloat(e.target.value) || 0)}
                      className={clsx("jdr-input", field.prefix && "pl-7", field.suffix && "pr-8")}
                    />
                    {field.suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-jdr-slate text-sm">{field.suffix}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Tier multipliers */}
      <div>
        <div className="mb-4">
          <h2 className="font-bold text-jdr-navy">Customer Tier Multipliers</h2>
          <p className="text-jdr-slate text-sm mt-0.5">Applied to total job cost based on customer tier</p>
        </div>
        <div className="jdr-card p-5">
          <div className="grid grid-cols-3 gap-4">
            {(["standard", "premium", "vip"] as const).map(tier => (
              <div key={tier}>
                <label className="jdr-label capitalize">{tier}</label>
                <div className="relative">
                  <input
                    type="number"
                    min={0.5}
                    max={3}
                    step={0.05}
                    value={config.tierMultipliers[tier]}
                    onChange={e => handleTierChange(tier, e.target.value)}
                    className="jdr-input pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-jdr-slate text-sm">×</span>
                </div>
                <p className="text-jdr-slate text-xs mt-1">
                  {tier === "standard" ? "Base rate" : `+${Math.round((config.tierMultipliers[tier] - 1) * 100)}% premium`}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-blue-800 text-xs">Tier multipliers apply to the total labor + parts before tax. Standard = 1.0× (no adjustment).</p>
          </div>
        </div>
      </div>

      {/* Change warning + Save */}
      {hasChanges && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-amber-800 text-sm flex-1">You have unsaved changes. Save to apply these rates to new estimates.</p>
          <button onClick={handleReset} className="text-amber-700 text-sm font-medium hover:underline">Reset</button>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={!hasChanges && !saved}
          className={clsx(
            "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all",
            saved ? "bg-green-600 text-white" :
            hasChanges ? "jdr-btn-primary" : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved!" : "Save Pricing"}
        </button>
      </div>

      <p className="text-jdr-slate text-xs pb-4">
        Last updated: {new Date(config.updatedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })} by {config.updatedBy} · Changes are logged to the audit trail.
      </p>
    </div>
  );
}
