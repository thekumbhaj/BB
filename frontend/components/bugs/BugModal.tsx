'use client';

import { useState } from 'react';
import { Bug } from '@/lib/types';
import axiosInstance from '@/lib/api/axiosInstance';
import StatusBadge from '@/components/ui/StatusBadge';
import SeverityBadge from '@/components/ui/SeverityBadge';

interface BugModalProps {
  bug: Bug;
  onClose: () => void;
  onUpdate: (updated: Bug) => void;
}

const statusOptions: Bug['status'][] = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];

export default function BugModal({ bug, onClose, onUpdate }: BugModalProps) {
  const [status, setStatus] = useState<Bug['status']>(bug.status);
  const [assignedTo, setAssignedTo] = useState(bug.assignedTo?.id ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async () => {
    setLoading(true);
    setError('');
    try {
      // Update status
      const statusRes = await axiosInstance.patch(`/bugs/${bug._id}/status`, { status });
      let updated: Bug = statusRes.data.bug ?? statusRes.data;

      // Assign if provided
      if (assignedTo) {
        const assignRes = await axiosInstance.patch(`/bugs/${bug._id}/assign`, { userId: assignedTo });
        updated = assignRes.data.bug ?? assignRes.data;
      }

      onUpdate(updated);
      onClose();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Failed to update bug.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{bug.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <SeverityBadge severity={bug.severity} />
              <StatusBadge status={bug.status} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-5">{bug.description}</p>

        {error && (
          <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Status select */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Bug['status'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Assign user ID */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assign to (User ID, optional)
          </label>
          <input
            type="text"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            placeholder="Leave blank to unassign"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60 flex items-center gap-2"
          >
            {loading && (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
