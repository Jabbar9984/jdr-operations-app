"use client";

import { useEffect, useState } from "react";
import { INITIAL_INTEGRATIONS } from "@/lib/mock-data";
import { addAuditEntry } from "@/lib/audit-store";
import { getSession } from "@/lib/auth";
import PageHeader from "@/components/ui/PageHeader";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Settings,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
import { clsx } from "clsx";
import type { IntegrationConfig, IntegrationStatus } from "@/types";

const STORAGE_KEY = "jdr_integrations";

function loadIntegrations(): IntegrationConfig[] {
  if (typeof window === "undefined") return INITIAL_INTEGRATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_INTEGRATIONS;
    const stored = JSON.parse(raw) as IntegrationConfig[];
    return INITIAL_INTEGRATIONS.map(init => stored.find(s => s.id === init.id) ?? init);
  } catch {
    return INITIAL_INTEGRATIONS;
  }
}

function saveIntegrations(integrations: IntegrationConfig[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(integrations));
}

const STATUS_CONFIG: Record<IntegrationStatus, { label: string; color: string; Icon: typeof CheckCircle }> = {
  connected:    { label: "Connected",     color: "bg-green-50 text-green-700 border-green-200",   Icon: CheckCircle },
  disconnected: { label: "Disconnected",  color: "bg-gray-50 text-gray-600 border-gray-200",      Icon: XCircle },
  pending:      { label: "Pending",       color: "bg-amber-50 text-amber-700 border-amber-200",   Icon: AlertCircle },
  error:        { label: "Error",         color: "bg-red-50 text-red-700 border-red-200",          Icon: XCircle },
};

const CATEGORY_LABELS = {
  field_service: "Field Service",
  payments: "Payments",
  ai: "AI & Automation",
  communications: "Communications",
  warranty: "Warranty",
};

function IntegrationCard({ integration, onUpdate }: { integration: IntegrationConfig; onUpdate: (updated: IntegrationConfig) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [maskedFields, setMaskedFields] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const cfg = STATUS_CONFIG[integration.status];
  const StatusIcon = cfg.Icon;

  function handleConnect() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      // Stay disconnected — mocked
      setTimeout(() => setSaved(false), 2000);
    }, 1200);
  }

  function handleDisconnect() {
    const updated = { ...integration, status: "disconnected" as IntegrationStatus, lastSynced: undefined };
    onUpdate(updated);
  }

  return (
    <div className={clsx("jdr-card overflow-hidden", integration.status === "connected" && "border-green-200")}>
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center gap-4 p-4 text-left">
        <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm", integration.logoColor)}>
          {integration.logoInitials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className="text-jdr-navy font-bold text-sm">{integration.name}</p>
            <span className={clsx("jdr-badge border flex items-center gap-1 text-xs", cfg.color)}>
              <StatusIcon className="w-3 h-3" />{cfg.label}
            </span>
            <span className="jdr-badge bg-gray-50 text-gray-600 border border-gray-200 text-xs">{CATEGORY_LABELS[integration.category]}</span>
          </div>
          <p className="text-jdr-slate text-xs leading-snug">{integration.description}</p>
          {integration.lastSynced && (
            <p className="text-jdr-slate text-xs mt-0.5">Last synced: {new Date(integration.lastSynced).toLocaleString()}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {integration.status === "connected" && (
            <button onClick={e => { e.stopPropagation(); handleDisconnect(); }} className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded">
              Disconnect
            </button>
          )}
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-5 border-t border-gray-100 space-y-4">
          {/* Features */}
          <div className="pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-jdr-slate mb-2">Features</p>
            <div className="flex flex-wrap gap-2">
              {integration.features.map(f => (
                <span key={f} className="jdr-badge bg-jdr-cream border border-gray-200 text-jdr-navy text-xs">{f}</span>
              ))}
            </div>
          </div>

          {integration.notes && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
              <p className="text-amber-800 text-sm">{integration.notes}</p>
            </div>
          )}

          {/* Config fields */}
          {integration.status !== "connected" && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-jdr-slate mb-3">Configuration</p>
              <div className="space-y-3">
                {integration.configFields.map(field => (
                  <div key={field.key}>
                    <label className="jdr-label">{field.label}</label>
                    <div className="relative">
                      <input
                        type={field.masked && !maskedFields[field.key] ? "password" : "text"}
                        value={fieldValues[field.key] ?? ""}
                        onChange={e => setFieldValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className={clsx("jdr-input text-sm", field.masked && "pr-10")}
                      />
                      {field.masked && (
                        <button
                          type="button"
                          onClick={() => setMaskedFields(prev => ({ ...prev, [field.key]: !prev[field.key] }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {maskedFields[field.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleConnect}
                disabled={saving}
                className={clsx(
                  "mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all",
                  saved ? "bg-green-600 text-white" :
                  saving ? "bg-jdr-navy/50 text-white cursor-wait" : "jdr-btn-primary"
                )}
              >
                {saving ? <><RefreshCw className="w-4 h-4 animate-spin" /> Connecting…</> :
                 saved ? <><CheckCircle className="w-4 h-4" /> Saved (Demo Mode)</> :
                 <><Settings className="w-4 h-4" /> Save & Connect</>}
              </button>
              <p className="text-jdr-slate text-xs mt-2">Integration is mocked — no real connection will be made in demo mode.</p>
            </div>
          )}

          {integration.status === "connected" && (
            <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Connected and syncing
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([]);

  useEffect(() => {
    setIntegrations(loadIntegrations());
  }, []);

  function handleUpdate(updated: IntegrationConfig) {
    const newList = integrations.map(i => i.id === updated.id ? updated : i);
    setIntegrations(newList);
    saveIntegrations(newList);
  }

  const connectedCount = integrations.filter(i => i.status === "connected").length;
  const pendingCount = integrations.filter(i => i.status === "pending").length;

  const grouped = Object.entries(CATEGORY_LABELS) as [string, string][];

  return (
    <div className="space-y-8 max-w-2xl">
      <PageHeader title="Integrations" subtitle="Connect external services and platforms" />

      {/* Status overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="jdr-card p-4 text-center">
          <p className="text-green-700 font-bold text-2xl">{connectedCount}</p>
          <p className="text-jdr-slate text-xs mt-1">Connected</p>
        </div>
        <div className="jdr-card p-4 text-center">
          <p className="text-amber-600 font-bold text-2xl">{pendingCount}</p>
          <p className="text-jdr-slate text-xs mt-1">Pending</p>
        </div>
        <div className="jdr-card p-4 text-center">
          <p className="text-jdr-navy font-bold text-2xl">{integrations.length}</p>
          <p className="text-jdr-slate text-xs mt-1">Total</p>
        </div>
      </div>

      {/* Integration cards grouped by category */}
      {grouped.map(([cat, catLabel]) => {
        const items = integrations.filter(i => i.category === cat);
        if (!items.length) return null;
        return (
          <div key={cat}>
            <p className="text-xs font-semibold uppercase tracking-widest text-jdr-slate mb-3">{catLabel}</p>
            <div className="space-y-3">
              {items.map(integration => (
                <IntegrationCard key={integration.id} integration={integration} onUpdate={handleUpdate} />
              ))}
            </div>
          </div>
        );
      })}

      <p className="text-center text-jdr-slate text-xs pb-4">All integrations are mocked in demo mode. No real connections are made.</p>
    </div>
  );
}
