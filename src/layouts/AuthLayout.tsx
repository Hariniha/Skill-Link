import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const AuthLayout: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  // If user is authenticated, redirect to appropriate dashboard
  if (isAuthenticated && user) {
    const dashboardPath = user.role === 'client' 
      ? '/client/dashboard' 
      : '/worker/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="p-4">
        <div className="container-custom">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center text-neutral-700 hover:text-primary-500 transition-colors">
              <ArrowLeft size={20} className="mr-2" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center">
              <div className="text-primary-500 font-bold text-xl mr-1">Skill</div>
              <div className="text-secondary-500 font-bold text-xl">Link</div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
      <footer className="py-4 text-center text-neutral-500 text-sm">
        &copy; {new Date().getFullYear()} SkillLink. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLayout;