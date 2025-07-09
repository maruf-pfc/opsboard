'use client'

import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import api from '@/lib/api';

export default function ProfilePage() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.post('/users/change-password', {
        currentPassword,
        newPassword,
      });
      setMessage('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
        </div>
        {message && <div className="mb-4 text-sm text-red-500">{message}</div>}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}