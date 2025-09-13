import React, { useEffect, useState } from 'react';
import { authApi, User } from '../../api/auth';
import Card from '../../components/Card';

const UpdateProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [grade] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const me = await authApi.getMe();
        setUser(me);
        setDisplayName(me.displayName || '');
        setEmail(me.email);
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
      // Send partial updates in multiple PATCH requests
      if (displayName !== (user?.displayName || '')) {
        const updated = await authApi.patchName(displayName);
        setUser(updated);
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          parsed.displayName = updated.displayName;
          localStorage.setItem('user', JSON.stringify(parsed));
        }
      }
      if (email && email !== user?.email) {
        const updated = await authApi.patchEmail(email);
        setUser(updated);
        const savedUser2 = localStorage.getItem('user');
        if (savedUser2) {
          const parsed = JSON.parse(savedUser2);
          parsed.email = updated.email;
          localStorage.setItem('user', JSON.stringify(parsed));
        }
      }
      if (grade) {
        const updated = await authApi.patchGrade(grade);
        setUser(updated);
      }
      if (avatarFile) {
        // Generate unique filename
        const timestamp = Date.now();
        const fileExtension = avatarFile.name.split('.').pop();
        const avatarName = `avatar-${timestamp}.${fileExtension}`;
        
        // Step 1: Update avatar name
        await authApi.updateAvatarName(avatarName);
        
        // Step 2: Upload avatar file
        const updated = await authApi.uploadAvatar(avatarFile);
        setUser(updated);
        
        // Update localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          parsed.avatar = avatarName;
          localStorage.setItem('user', JSON.stringify(parsed));
        }
      }
      setMessage('Profile updated');
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
            <div>
              <label className="block text-sm font-medium text-photography-700">Email</label>
              <input
                type="email"
                className="mt-1 block w-full rounded-md border-photography-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.edu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-photography-700">Avatar</label>
              <input
                type="file"
                accept="image/png,image/jpeg"
                className="mt-1 block w-full text-sm text-gray-700"
                onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              />
              <p className="text-xs text-gray-500 mt-1">PNG or JPG. Recommended 256x256.</p>
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


