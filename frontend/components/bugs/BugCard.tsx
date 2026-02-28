import Link from 'next/link';
import { Bug } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';
import SeverityBadge from '@/components/ui/SeverityBadge';

interface BugCardProps {
  bug: Bug;
}

export default function BugCard({ bug }: BugCardProps) {
  const excerpt =
    bug.description.length > 120 ? bug.description.slice(0, 120) + '…' : bug.description;

  const formattedDate = new Date(bug.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3 mb-2">
        <Link
          href={`/bugs/${bug._id}`}
          className="text-base font-semibold text-gray-900 hover:text-blue-600 transition line-clamp-1"
        >
          {bug.title}
        </Link>
        <div className="flex items-center gap-2 flex-shrink-0">
          <SeverityBadge severity={bug.severity} />
          <StatusBadge status={bug.status} />
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{excerpt}</p>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>Reported by {bug.createdBy?.name ?? 'Unknown'}</span>
        <span>{formattedDate}</span>
      </div>
    </div>
  );
}
