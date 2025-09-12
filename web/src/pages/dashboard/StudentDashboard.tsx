import React, { useState, useEffect } from 'react';
import { studentsApi, DashboardData } from '../../api/students';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';

const StudentDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await studentsApi.getDashboard();
        setDashboardData(data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-photography-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-photography-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="h-64 bg-photography-200 rounded-lg"></div>
              <div className="h-64 bg-photography-200 rounded-lg"></div>
              <div className="h-64 bg-photography-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-photography-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-vulnerability-50 border border-vulnerability-200 text-vulnerability-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-photography-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-photography-900 mb-2">
            📸 Your Photography Studio
          </h1>
          <p className="text-photography-600 text-lg">
            Embrace vulnerability through creative challenges. Every photograph tells a story of courage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Artist Profile Card */}
          <Card title="Artist Profile">
            <div className="flex items-center space-x-4">
              <Avatar
                userId={dashboardData?.user.id || 0}
                displayName={dashboardData?.user.displayName}
                className="w-16 h-16"
              />
              <div>
                <h3 className="text-lg font-medium text-photography-900">
                  {dashboardData?.user.displayName || 'Artist'}
                </h3>
                <p className="text-photography-600">{dashboardData?.user.email}</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {dashboardData?.user.role === 'admin' ? 'Mentor' : 'Photographer'}
                </span>
              </div>
            </div>
          </Card>

          {/* Vulnerability Challenges Card */}
          <Card title="Vulnerability Challenges">
            <div className="space-y-3">
              {dashboardData?.courses && dashboardData.courses.length > 0 ? (
                dashboardData.courses.map((course) => (
                  <div key={course.id} className="border-l-4 border-vulnerability-500 pl-4">
                    <h4 className="font-medium text-photography-900">{course.title}</h4>
                    {course.description && (
                      <p className="text-sm text-photography-600">{course.description}</p>
                    )}
                    <p className="text-xs text-photography-500">
                      Started: {new Date(course.enrolledAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-photography-500 mb-2">No challenges yet.</p>
                  <p className="text-sm text-photography-400">Ready to embrace vulnerability?</p>
                </div>
              )}
            </div>
          </Card>

          {/* Studio Actions Card */}
          <Card title="Studio Actions">
            <div className="space-y-3">
              <button className="w-full btn-primary text-sm">
                Start New Challenge
              </button>
              <a href="/update" className="w-full btn-secondary text-sm inline-block text-center">
                Update Profile
              </a>
              <button className="w-full btn-secondary text-sm">
                View Gallery
              </button>
            </div>
          </Card>
          {dashboardData?.adminPanel && (
            <Card title="Admin Panel">
              <div className="space-y-4">
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <p className="text-primary-800 font-medium">
                    {dashboardData.adminPanel.message}
                  </p>
                </div>
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
                          {dashboardData.adminPanel.flag}
                        </p>
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        {new Date(dashboardData.adminPanel.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Creative Journey */}
        <div className="mt-8">
          <Card title="Creative Journey">
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-photography-900 mb-2">
                Your Story Awaits
              </h3>
              <p className="text-photography-600 mb-4">
                Every vulnerability you embrace becomes a masterpiece. Start your next challenge today.
              </p>
              <div className="flex justify-center space-x-4">
                <button className="btn-primary">
                  Begin New Challenge
                </button>
                <button className="btn-secondary">
                  View Past Work
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
