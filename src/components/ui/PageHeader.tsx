import { clsx } from "clsx";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function PageHeader({ title, subtitle, action, className }: PageHeaderProps) {
  return (
    <div className={clsx("flex items-start justify-between gap-4 mb-6", className)}>
      <div>
        <h1 className="text-xl font-bold text-jdr-navy leading-tight">{title}</h1>
        {subtitle && <p className="text-jdr-slate text-sm mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
