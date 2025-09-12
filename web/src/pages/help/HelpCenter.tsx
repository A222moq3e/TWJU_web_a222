import React from 'react';
import Card from '../../components/Card';

const HelpCenter: React.FC = () => {
  return (
    <div className="min-h-screen bg-photography-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-photography-900 mb-8">
          📸 Studio Support
        </h1>

        <div className="space-y-6">
          <Card title="Embracing Vulnerability">
            <div className="prose prose-photography max-w-none">
              <p className="text-photography-700">
                Welcome to Vulnerability University! This platform helps you grow as a photographer through creative challenges that embrace vulnerability.
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2 text-photography-700">
                <li>Participate in vulnerability-based photography challenges</li>
                <li>Build your artistic portfolio through authentic expression</li>
                <li>Connect with mentors and fellow photographers</li>
                <li>Track your creative growth and artistic journey</li>
              </ul>
            </div>
          </Card>

          <Card title="Frequently Asked Questions">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-photography-900">How do I start a vulnerability challenge?</h4>
                <p className="text-photography-600 mt-1">
                  Click "Start New Challenge" in your studio dashboard. Each challenge is designed to help you explore vulnerability through photography.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-photography-900">How do I update my portfolio?</h4>
                <p className="text-photography-600 mt-1">
                  You can update your portfolio by clicking on the "Update Portfolio" button in your studio dashboard.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-photography-900">I'm having trouble accessing the studio</h4>
                <p className="text-photography-600 mt-1">
                  Make sure you're using the correct artist email and studio access code. If you've forgotten your access code, contact support.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-photography-900">Is my creative work secure?</h4>
                <p className="text-photography-600 mt-1">
                  Yes, your creative work is secure. We use the latest security practices to protect your artistic data, including encryption and authentication. Our security team regularly tests the platform, and you can contact our support team if you have any concerns about your creative work's safety.
                </p>
              </div>
            </div>
          </Card>

          <Card title="Contact Creative Support">
            <div className="text-photography-700">
              <p>If you need additional help with your creative journey, please contact our support team:</p>
              <ul className="mt-2 space-y-1">
                <li>Email: support@vulnerability.edu</li>
                <li>Phone: (555) ART-HELP</li>
                <li>Studio Hours: Sunday-Thursday, 7:00 AM - 3:00 PM</li>
              </ul>
            </div>
          </Card>

          <Card title="Creative Requirements">
            <div className="text-photography-700">
              <p>For the best creative experience, please ensure you have:</p>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>A modern web browser (Chrome, Firefox, Safari, Edge)</li>
                <li>JavaScript enabled for interactive features</li>
                <li>A stable internet connection for uploading your art</li>
                <li>An open heart ready to embrace vulnerability</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
