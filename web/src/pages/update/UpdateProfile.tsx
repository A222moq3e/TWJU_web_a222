import React, { useEffect, useState } from 'react';
import { authApi, User } from '../../api/auth';
import Card from '../../components/Card';

const UpdateProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const me = await authApi.getMe();
        setUser(me);
        setDisplayName(me.displayName || '');
      } catch (e: any) {
        setError(e.response?.data?.error || 'Failed to load profile');
      }
    };
    load();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const updated = await authApi.updateMe({ displayName });
      setUser(updated);
      setMessage('Profile updated');
      // keep localStorage user in sync
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        parsed.displayName = updated.displayName;
        localStorage.setItem('user', JSON.stringify(parsed));
      }
    } catch (e: any) {
      setError(e.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-photography-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card title="Update Profile">
          {error && (
            <div className="bg-vulnerability-50 border border-vulnerability-200 text-vulnerability-600 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
              {message}
            </div>
          )}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-photography-700">Display Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-photography-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
              />
            </div>
            <div className="flex items-center justify-between">
              <a href="/dashboard" className="text-sm text-primary-700">Back to dashboard</a>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default UpdateProfile;


