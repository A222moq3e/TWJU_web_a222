import React, { useState, useEffect } from 'react';
import { adminApi, AdminResponse } from '../../api/admin';
import Card from '../../components/Card';

const Admin: React.FC = () => {
  const [adminData, setAdminData] = useState<AdminResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const data = await adminApi.getAdmin();
        setAdminData(data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-academic-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-academic-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-academic-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-academic-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-academic-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-academic-900 mb-8">
          Admin Panel
        </h1>

        <div className="space-y-6">
          <Card title="System Status">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-academic-700">Server Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-academic-700">Database</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-academic-700">Last Updated</span>
                <span className="text-academic-600">
                  {adminData?.timestamp ? new Date(adminData.timestamp).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>
          </Card>

          <Card title="Admin Message">
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <p className="text-primary-800 font-medium">
                {adminData?.message || 'Welcome to the admin panel'}
              </p>
            </div>
          </Card>

          {adminData?.flag && (
            <Card title="Flag">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Challenge Complete!
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p className="font-mono text-lg break-all">
                        {adminData.flag}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          <Card title="System Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-academic-900 mb-2">Environment</h4>
                <p className="text-academic-600">Production</p>
              </div>
              <div>
                <h4 className="font-medium text-academic-900 mb-2">Version</h4>
                <p className="text-academic-600">1.0.0</p>
              </div>
              <div>
                <h4 className="font-medium text-academic-900 mb-2">Uptime</h4>
                <p className="text-academic-600">24/7</p>
              </div>
              <div>
                <h4 className="font-medium text-academic-900 mb-2">Security</h4>
                <p className="text-academic-600">High</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
