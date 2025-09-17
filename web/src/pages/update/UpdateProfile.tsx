import React, { useEffect, useState } from 'react';
import { authApi, User } from '../../api/auth';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';

const UpdateProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
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

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

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
                placeholder="you@utwj.local"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-photography-700 mb-3">Avatar</label>
              
              <div className="flex items-start space-x-4">
                {/* Current/Preview Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-photography-200">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                      />
                    ) : user ? (
                      <Avatar
                        displayName={user.displayName || user.email}
                        avatar={user.avatar}
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-photography-100 flex items-center justify-center">
                        <span className="text-photography-400 text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* File Input */}
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setAvatarFile(file);
                        
                        // Create preview URL
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setAvatarPreview(e.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        } else {
                          setAvatarPreview(null);
                        }
                      }}
                    />
                    <div className="border-2 border-dashed border-photography-300 rounded-lg p-4 text-center hover:border-primary-400 transition-colors">
                      <div className="space-y-2">
                        <svg className="w-8 h-8 text-photography-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <div className="text-sm">
                          <span className="font-medium text-primary-600 hover:text-primary-500">Upload a file</span>
                          <span className="text-photography-500"> or drag and drop</span>
                        </div>
                        <p className="text-xs text-photography-400">PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                  </div>
                  
                  {avatarFile && (
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-sm text-photography-600">
                        Selected: {avatarFile.name}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarFile(null);
                          setAvatarPreview(null);
                        }}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
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


