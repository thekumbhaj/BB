import { Bug } from '@/lib/types';

interface SeverityBadgeProps {
  severity: Bug['severity'];
}

const severityConfig: Record<Bug['severity'], { label: string; className: string }> = {
  low: {
    label: 'Low',
    className: 'bg-green-100 text-green-700 border border-green-200',
  },
  medium: {
    label: 'Medium',
    className: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  },
  high: {
    label: 'High',
    className: 'bg-orange-100 text-orange-700 border border-orange-200',
  },
  critical: {
    label: 'Critical',
    className: 'bg-red-100 text-red-700 border border-red-200',
  },
};

export default function SeverityBadge({ severity }: SeverityBadgeProps) {
  const config = severityConfig[severity] ?? {
    label: severity,
    className: 'bg-gray-100 text-gray-700 border border-gray-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
}
