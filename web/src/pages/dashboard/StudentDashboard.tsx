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

  const totalCourses = dashboardData?.courses?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {dashboardData?.user.role === 'admin' ? 'University Admin Dashboard' : 'Student Dashboard'}
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome{dashboardData?.user.displayName ? `, ${dashboardData.user.displayName}` : ''}. Here's an overview of your account.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Role</div>
            <div className="mt-2 text-2xl font-semibold text-gray-900 capitalize">{dashboardData?.user.role === 'admin' ? 'Admin' : 'Student'}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Active Courses</div>
            <div className="mt-2 text-2xl font-semibold text-gray-900">{totalCourses}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Email</div>
            <div className="mt-2 text-lg font-medium text-gray-900 break-all">{dashboardData?.user.email}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Profile</div>
            <div className="mt-2 text-lg font-medium text-gray-900">{dashboardData?.user.displayName || 'Not set'}</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile */}
            <Card title="Profile">
              <div className="flex items-center space-x-4">
                <Avatar 
                  displayName={dashboardData?.user.displayName}
                  avatarSet={dashboardData?.user.avatarSet}
                  className="w-16 h-16"
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {dashboardData?.user.displayName || 'Student'}
                  </h3>
                  <p className="text-gray-600">{dashboardData?.user.email}</p>
                  <a href="/update" className="inline-flex items-center mt-2 text-sm text-primary-700">Edit Profile</a>
                </div>
              </div>
            </Card>

            {/* Courses */}
            <Card title="My Courses">
              <div className="space-y-3">
                {dashboardData?.courses && dashboardData.courses.length > 0 ? (
                  dashboardData.courses.map((course) => (
                    <div key={course.id} className="border rounded-md p-4 bg-white">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{course.title}</h4>
                          {course.description && (
                            <p className="text-sm text-gray-600">{course.description}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Enrolled: {new Date(course.enrolledAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          Active
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-2">You are not enrolled in any courses yet.</p>
                    <p className="text-sm text-gray-400">Please check back later.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Quick actions */}
            <Card title="Quick Actions">
              <div className="space-y-3">
                <button className="w-full btn-primary text-sm">Browse Courses</button>
                <a href="/update" className="w-full btn-secondary text-sm inline-block text-center">Update Profile</a>
                <button className="w-full btn-secondary text-sm">View Transcript</button>
              </div>
            </Card>

            {/* Announcements */}
            <Card title="Announcements">
              <ul className="space-y-3">
                <li className="text-sm text-gray-700">Welcome to the semester! Check your course pages for syllabi.</li>
                <li className="text-sm text-gray-700">Maintenance window this weekend, brief downtime expected.</li>
              </ul>
            </Card>

            {dashboardData?.adminPanel && (
              <Card title="Admin Panel">
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 font-medium">
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
                        <h3 className="text-sm font-medium text-green-800">Challenge Complete!</h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p className="font-mono text-lg break-all">{dashboardData.adminPanel.flag}</p>
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
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
