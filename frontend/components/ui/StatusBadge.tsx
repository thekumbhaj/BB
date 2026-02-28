import { Bug } from '@/lib/types';

interface StatusBadgeProps {
  status: Bug['status'];
}

const statusConfig: Record<Bug['status'], { label: string; className: string }> = {
  OPEN: {
    label: 'Open',
    className: 'bg-red-100 text-red-700 border border-red-200',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  },
  RESOLVED: {
    label: 'Resolved',
    className: 'bg-green-100 text-green-700 border border-green-200',
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    className: 'bg-gray-100 text-gray-700 border border-gray-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
}
