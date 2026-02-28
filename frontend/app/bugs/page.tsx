'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/lib/context/AuthContext';
import axiosInstance from '@/lib/api/axiosInstance';
import { Bug } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';
import SeverityBadge from '@/components/ui/SeverityBadge';
import BugModal from '@/components/bugs/BugModal';

type StatusFilter = 'ALL' | Bug['status'];
type SeverityFilter = 'ALL' | Bug['severity'];

export default function BugsPage() {
  const { user } = useAuth();
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('ALL');
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);

  const fetchBugs = useCallback(() => {
    const endpoint = user?.role === 'admin' ? '/bugs' : '/bugs/my';
    setLoading(true);
    axiosInstance
      .get(endpoint)
      .then((res) => {
        const data: Bug[] = res.data.bugs ?? res.data;
        setBugs(Array.isArray(data) ? data : []);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load bugs.'))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    fetchBugs();
  }, [fetchBugs]);

  const filtered = bugs.filter((b) => {
    if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
    if (severityFilter !== 'ALL' && b.severity !== severityFilter) return false;
    return true;
  });

  const handleBugUpdate = (updated: Bug) => {
    setBugs((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bugs</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {user?.role === 'admin' ? 'All bugs in the system' : 'Your reported bugs'}
            </p>
          </div>
          <Link
            href="/bugs/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
          >
            + Report New Bug
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="ALL">All</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Severity:</label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as SeverityFilter)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="ALL">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          {(statusFilter !== 'ALL' || severityFilter !== 'ALL') && (
            <button
              onClick={() => { setStatusFilter('ALL'); setSeverityFilter('ALL'); }}
              className="text-xs text-blue-600 hover:underline font-medium self-center"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-7 h-7 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="px-6 py-10 text-center text-red-500 text-sm">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-gray-400 text-sm mb-2">No bugs match your filters.</p>
              <Link href="/bugs/new" className="text-blue-600 text-sm font-medium hover:underline">
                + Report a bug
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <tr>
                    <th className="px-6 py-3 text-left">Title</th>
                    <th className="px-6 py-3 text-left">Severity</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    {user?.role === 'admin' && (
                      <th className="px-6 py-3 text-left">Reporter</th>
                    )}
                    <th className="px-6 py-3 text-left">Created</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((bug) => (
                    <tr key={bug._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900 max-w-xs">
                        <span className="line-clamp-1">{bug.title}</span>
                      </td>
                      <td className="px-6 py-4">
                        <SeverityBadge severity={bug.severity} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={bug.status} />
                      </td>
                      {user?.role === 'admin' && (
                        <td className="px-6 py-4 text-gray-500">
                          {bug.createdBy?.name ?? '—'}
                        </td>
                      )}
                      <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                        {new Date(bug.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {user?.role === 'admin' && (
                            <button
                              onClick={() => setSelectedBug(bug)}
                              className="text-xs text-blue-600 hover:underline font-medium"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {selectedBug && (
        <BugModal
          bug={selectedBug}
          onClose={() => setSelectedBug(null)}
          onUpdate={handleBugUpdate}
        />
      )}
    </div>
  );
}
