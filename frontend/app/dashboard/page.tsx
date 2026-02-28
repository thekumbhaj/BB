'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/lib/context/AuthContext';
import axiosInstance from '@/lib/api/axiosInstance';
import { Bug } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';
import SeverityBadge from '@/components/ui/SeverityBadge';

interface Stats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 shadow-sm`}>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const endpoint = user?.role === 'admin' ? '/bugs' : '/bugs/my';
    axiosInstance
      .get(endpoint)
      .then((res) => {
        const data: Bug[] = res.data.bugs ?? res.data;
        setBugs(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load bugs.');
      })
      .finally(() => setLoading(false));
  }, [user]);

  const stats: Stats = {
    total: bugs.length,
    open: bugs.filter((b) => b.status === 'OPEN').length,
    inProgress: bugs.filter((b) => b.status === 'IN_PROGRESS').length,
    resolved: bugs.filter((b) => b.status === 'RESOLVED').length,
  };

  const recentBugs = bugs.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name ?? 'there'} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {user?.role === 'admin'
              ? 'Here\'s an overview of all bugs in the system.'
              : 'Here\'s an overview of your reported bugs.'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Bugs" value={stats.total} color="text-gray-900" />
          <StatCard label="Open" value={stats.open} color="text-red-600" />
          <StatCard label="In Progress" value={stats.inProgress} color="text-yellow-600" />
          <StatCard label="Resolved" value={stats.resolved} color="text-green-600" />
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            href="/bugs/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
          >
            + Report Bug
          </Link>
          <Link
            href="/bugs"
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition shadow-sm"
          >
            View All Bugs
          </Link>
          <Link
            href="/support"
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition shadow-sm"
          >
            💬 Support Chat
          </Link>
        </div>

        {/* Recent bugs table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Recent Bugs</h2>
            <Link href="/bugs" className="text-sm text-blue-600 hover:underline font-medium">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-7 h-7 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="px-6 py-8 text-center text-red-500 text-sm">{error}</div>
          ) : recentBugs.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-400 text-sm">No bugs found.</p>
              <Link href="/bugs/new" className="mt-3 inline-block text-blue-600 text-sm font-medium hover:underline">
                Report your first bug →
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
                    <th className="px-6 py-3 text-left">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentBugs.map((bug) => (
                    <tr key={bug._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <Link
                          href={`/bugs/${bug._id}`}
                          className="font-medium text-gray-900 hover:text-blue-600 transition"
                        >
                          {bug.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <SeverityBadge severity={bug.severity} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={bug.status} />
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(bug.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
