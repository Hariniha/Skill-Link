import React, {  Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import MainLayout from './layouts/MainLayout';

// Pages - Auth
import LandingPage from './pages/LandingPage';
import RoleSelectionPage from './pages/auth/RoleSelectionPage';
import LoginPage from './pages/auth/LoginPage';
import OtpVerificationPage from './pages/auth/OtpVerificationPage';

// Client Profile Setup
const ClientProfileSetupPage = React.lazy(() => import('./pages/auth/client/ProfileSetupPage'));

// Worker Profile Setup
const WorkerProfileSetupPage = React.lazy(() => import('./pages/auth/worker/ProfileSetupPage'));

// Client Pages
const ClientDashboardPage = React.lazy(() => import('./pages/client/DashboardPage'));
const SearchWorkersPage = React.lazy(() => import('./pages/client/SearchWorkersPage'));
const WorkerDetailPage =React. lazy(() => import('./pages/client/WorkerDetailPage'));
const BookingPage = React.lazy(() => import('./pages/client/BookingPage'));
const ClientBookingsPage =React. lazy(() => import('./pages/client/BookingsPage'));
// const ClientMessagesPage =React. lazy(() => import('./pages/client/MessagesPage'));

// // Worker Pages
// const WorkerDashboardPage =React.lazy(() => import('./pages/worker/DashboardPage'));
// const WorkerBookingsPage =React.lazy(() => import('./pages/worker/BookingsPage'));
// const WorkerEarningsPage = React.lazy(() => import('./pages/worker/EarningsPage'));
// const WorkerProfilePage = React.lazy(() => import('./pages/worker/ProfilePage'));
// const WorkerMessagesPage = React.lazy(() => import('./pages/worker/MessagesPage'));

// // Common Pages
// const MessageChatPage =React.lazy(() => import('./pages/common/MessageChatPage'));
// const PaymentPage = React.lazy(() => import('./pages/common/PaymentPage'));
// const ReceiptPage = React.lazy(() => import('./pages/common/ReceiptPage'));
// const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Loading Component
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
          </Route>

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/select-role" element={<RoleSelectionPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify-otp" element={<OtpVerificationPage />} />
            <Route path="/client/setup-profile" element={<ClientProfileSetupPage />} />
            <Route path="/worker/setup-profile" element={<WorkerProfileSetupPage />} />
          </Route>

          {/* Client Routes */}
          <Route path="/client" element={<DashboardLayout userRole="client" />}>
            <Route index element={<Navigate to="/client/dashboard\" replace />} />
            <Route path="dashboard" element={<ClientDashboardPage />} />
            <Route path="search" element={<SearchWorkersPage />} />
            <Route path="worker/:id" element={<WorkerDetailPage />} />
            <Route path="book/:id" element={<BookingPage />} />
            <Route path="bookings" element={<ClientBookingsPage />} />
            {/* <Route path="messages" element={<ClientMessagesPage />} />
            <Route path="messages/:id" element={<MessageChatPage />} />
            <Route path="payment/:bookingId" element={<PaymentPage />} />
            <Route path="receipt/:bookingId" element={<ReceiptPage />} /> */}
          </Route>

          {/* Worker Routes */}
          <Route path="/worker" element={<DashboardLayout userRole="worker" />}>
            <Route index element={<Navigate to="/worker/dashboard\" replace />} />
            {/* <Route path="dashboard" element={<WorkerDashboardPage />} />
            <Route path="bookings" element={<WorkerBookingsPage />} />
            <Route path="earnings" element={<WorkerEarningsPage />} />
            <Route path="profile" element={<WorkerProfilePage />} />
            <Route path="messages" element={<WorkerMessagesPage />} />
            <Route path="messages/:id" element={<MessageChatPage />} /> */}
          </Route>

          {/* 404 Route */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </Suspense>
    </>
  );
}

export default App;