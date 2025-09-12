import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-photography-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-photography-900">
              Student Dashboard
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-photography-700 hover:text-photography-900">
                  Dashboard
                </Link>
                <Link to="/help" className="text-photography-700 hover:text-photography-900">
                  Help
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-primary-600 hover:text-primary-700 font-medium">
                    Admin Panel
                  </Link>
                )}
                <span className="text-photography-600">
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-photography-700 hover:text-photography-900">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Join as student
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
