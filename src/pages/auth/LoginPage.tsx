import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, ArrowRight } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedRole, login, loading, error } = useAuthStore();
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  // Redirect if role not selected
  React.useEffect(() => {
    if (!selectedRole) {
      navigate('/select-role');
    }
  }, [selectedRole, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (loginMethod === 'phone') {
        await login({ phone: phoneNumber, role: selectedRole! });
      } else {
        await login({ email, role: selectedRole! });
      }
      navigate('/verify-otp');
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div className="card fade-in p-8">
      <h1 className="text-2xl font-bold text-center mb-2">Login</h1>
      <p className="text-neutral-600 text-center mb-6">
        {selectedRole === 'client' 
          ? 'Login to find skilled professionals for your needs' 
          : 'Login to connect with clients and grow your business'}
      </p>

      <div className="flex justify-center mb-6">
        <div className="bg-neutral-100 rounded-lg p-1 flex">
          <button
            type="button"
            onClick={() => setLoginMethod('phone')}
            className={`px-4 py-2 rounded flex items-center ${
              loginMethod === 'phone' 
                ? 'bg-white shadow-sm text-primary-600' 
                : 'text-neutral-600'
            }`}
          >
            <Phone size={18} className="mr-2" />
            Phone
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod('email')}
            className={`px-4 py-2 rounded flex items-center ${
              loginMethod === 'email' 
                ? 'bg-white shadow-sm text-primary-600' 
                : 'text-neutral-600'
            }`}
          >
            <Mail size={18} className="mr-2" />
            Email
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {loginMethod === 'phone' ? (
          <div className="mb-6">
            <label htmlFor="phone\" className="block text-neutral-700 font-medium mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="+91 98765 43210"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="input"
              required
            />
            <p className="text-neutral-500 text-sm mt-2">
              We'll send a one-time password to this number
            </p>
          </div>
        ) : (
          <div className="mb-6">
            <label htmlFor="email" className="block text-neutral-700 font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
            <p className="text-neutral-500 text-sm mt-2">
              We'll send a one-time password to this email
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-error-50 text-error-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn-primary w-full flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <LoadingSpinner size="small\" color="#ffffff" />
          ) : (
            <>
              Continue
              <ArrowRight size={18} className="ml-2" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-neutral-600 text-sm">
        By continuing, you agree to our{' '}
        <a href="/terms" className="text-primary-600 hover:underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-primary-600 hover:underline">
          Privacy Policy
        </a>
      </div>
    </div>
  );
};

export default LoginPage;