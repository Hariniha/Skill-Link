import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

interface DashboardLayoutProps {
  userRole: 'client' | 'worker';
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ userRole }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login\" state={{ from: location }} replace />;
  }

  // If role doesn't match, redirect to appropriate dashboard
  if (user.role !== userRole) {
    const correctPath = user.role === 'client' ? '/client/dashboard' : '/worker/dashboard';
    return <Navigate to={correctPath} replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header userRole={userRole} />
      <main className="flex-grow bg-neutral-50">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;