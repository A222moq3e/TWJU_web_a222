import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { studentsApi, DashboardData } from '../../api/students';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
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
      <div className="min-h-screen bg-academic-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-academic-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="h-64 bg-academic-200 rounded-lg"></div>
              <div className="h-64 bg-academic-200 rounded-lg"></div>
              <div className="h-64 bg-academic-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-academic-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-academic-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-academic-900 mb-8">
          Welcome back, {dashboardData?.user.displayName || dashboardData?.user.email}!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card title="Profile">
            <div className="flex items-center space-x-4">
              <Avatar
                userId={dashboardData?.user.id || 0}
                displayName={dashboardData?.user.displayName}
                className="w-16 h-16"
              />
              <div>
                <h3 className="text-lg font-medium text-academic-900">
                  {dashboardData?.user.displayName || 'Student'}
                </h3>
                <p className="text-academic-600">{dashboardData?.user.email}</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {dashboardData?.user.role}
                </span>
              </div>
            </div>
          </Card>

          {/* Courses Card */}
          <Card title="My Courses">
            <div className="space-y-3">
              {dashboardData?.courses && dashboardData.courses.length > 0 ? (
                dashboardData.courses.map((course) => (
                  <div key={course.id} className="border-l-4 border-primary-500 pl-4">
                    <h4 className="font-medium text-academic-900">{course.title}</h4>
                    {course.description && (
                      <p className="text-sm text-academic-600">{course.description}</p>
                    )}
                    <p className="text-xs text-academic-500">
                      Enrolled: {new Date(course.enrolledAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-academic-500">No courses enrolled yet.</p>
              )}
            </div>
          </Card>

          {/* Quick Actions Card */}
          <Card title="Quick Actions">
            <div className="space-y-3">
              <button className="w-full btn-primary text-sm">
                View All Courses
              </button>
              <button className="w-full btn-secondary text-sm">
                Update Profile
              </button>
              <button className="w-full btn-secondary text-sm">
                View Grades
              </button>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card title="Recent Activity">
            <div className="text-academic-500">
              No recent activity to display.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
