import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  iconColor = "text-jdr-navy",
  iconBg = "bg-jdr-cream",
  trend,
  trendUp,
  className,
}: StatCardProps) {
  return (
    <div className={clsx("jdr-card p-4", className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="text-jdr-slate text-xs font-medium uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-jdr-navy mt-1">{value}</p>
          {trend && (
            <p className={clsx("text-xs mt-1 font-medium", trendUp ? "text-green-600" : "text-red-500")}>
              {trend}
            </p>
          )}
        </div>
        {Icon && (
          <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", iconBg)}>
            <Icon className={clsx("w-5 h-5", iconColor)} />
          </div>
        )}
      </div>
    </div>
  );
}
