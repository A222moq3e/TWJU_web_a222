import React from 'react';
import Card from '../../components/Card';

const HelpCenter: React.FC = () => {
  return (
    <div className="min-h-screen bg-academic-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-academic-900 mb-8">
          Help Center
        </h1>

        <div className="space-y-6">
          <Card title="Getting Started">
            <div className="prose prose-academic max-w-none">
              <p className="text-academic-700">
                Welcome to the Student Dashboard! This platform helps you manage your academic journey.
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2 text-academic-700">
                <li>View your enrolled courses and track your progress</li>
                <li>Update your profile information and avatar</li>
                <li>Access important academic resources</li>
                <li>Stay updated with announcements and notifications</li>
              </ul>
            </div>
          </Card>

          <Card title="Frequently Asked Questions">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-academic-900">How do I enroll in a course?</h4>
                <p className="text-academic-600 mt-1">
                  Course enrollment is typically handled through your academic advisor or the course registration system.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-academic-900">How do I update my profile?</h4>
                <p className="text-academic-600 mt-1">
                  You can update your profile information by clicking on the "Update Profile" button in your dashboard.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-academic-900">I'm having trouble logging in</h4>
                <p className="text-academic-600 mt-1">
                  Make sure you're using the correct email and password. If you've forgotten your password, contact support.
                </p>
              </div>
            </div>
          </Card>

          <Card title="Contact Support">
            <div className="text-academic-700">
              <p>If you need additional help, please contact our support team:</p>
              <ul className="mt-2 space-y-1">
                <li>Email: support@studentdashboard.edu</li>
                <li>Phone: (555) 123-4567</li>
                <li>Office Hours: Monday-Friday, 9:00 AM - 5:00 PM</li>
              </ul>
            </div>
          </Card>

          <Card title="System Requirements">
            <div className="text-academic-700">
              <p>For the best experience, please ensure you're using:</p>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>A modern web browser (Chrome, Firefox, Safari, Edge)</li>
                <li>JavaScript enabled</li>
                <li>A stable internet connection</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
