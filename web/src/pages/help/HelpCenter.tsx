import React from 'react';
import Card from '../../components/Card';

const HelpCenter: React.FC = () => {
  return (
    <div className="min-h-screen bg-photography-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">University Help Center</h1>
          <p className="text-gray-600 mt-1">Find answers, resources, and support for students and staff.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            <Card title="Frequently Asked Questions">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">How do I register?</h4>
                  <p className="text-gray-600 mt-1">Go to the Register page, use your university email, and create a password.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Why don’t I see any courses?</h4>
                  <p className="text-gray-600 mt-1">New students are automatically enrolled in core courses within minutes. If you still see none, refresh or contact support.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">How do I update my name, email, grade, or avatar?</h4>
                  <p className="text-gray-600 mt-1">Navigate to Update Profile. Each change is saved individually for reliability.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Who can access the admin panel?</h4>
                  <p className="text-gray-600 mt-1">Only staff with admin roles. Students will be redirected to their dashboard.</p>
                </div>
              </div>
            </Card>

            <Card title="Resources">
              <ul className="space-y-2 text-gray-700">
                <li>Academic Calendar</li>
                <li>Student Handbook</li>
                <li>IT Support Portal</li>
              </ul>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Contact Support">
              <div className="text-gray-700">
                <p>If you need assistance, reach out:</p>
                <ul className="mt-2 space-y-1">
                  <li>Email: support@utwj.local</li>
                  <li>Phone: (555) 123-4567</li>
                  <li>Hours: Sun–Thu, 7:00 AM – 3:00 PM</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
