import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const OtpVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedRole, verifyOtp, loading, error, isAuthenticated, user } = useAuthStore();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const inputRefs = Array(4).fill(0).map(() => React.createRef<HTMLInputElement>());

  // Redirect if no role selected
  useEffect(() => {
    if (!selectedRole) {
      navigate('/select-role');
    }
  }, [selectedRole, navigate]);

  // Redirect after successful verification
  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if user has completed profile setup
      const hasCompletedProfile = user.name && (
        (user.role === 'client' && (user as any).address) || 
        (user.role === 'worker' && (user as any).skills)
      );
      
      if (hasCompletedProfile) {
        // User has completed profile, redirect to dashboard
        const dashboardPath = user.role === 'client' 
          ? '/client/dashboard' 
          : '/worker/dashboard';
        navigate(dashboardPath);
      } else {
        // User needs to complete profile setup
        const profileSetupPath = user.role === 'client' 
          ? '/client/setup-profile' 
          : '/worker/setup-profile';
        navigate(profileSetupPath);
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Timer for resend OTP
  useEffect(() => {
    let interval: number | undefined;
    if (timer > 0) {
      interval = window.setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedOtp = pastedData.slice(0, 4).split('');
    
    // Only proceed if pasted content contains digits only
    if (!/^\d+$/.test(pastedData)) return;
    
    const newOtp = [...otp];
    pastedOtp.forEach((digit, index) => {
      if (index < 4) {
        newOtp[index] = digit;
      }
    });
    
    setOtp(newOtp);
    
    // Focus the appropriate input after paste
    if (pastedOtp.length < 4) {
      inputRefs[pastedOtp.length].current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 4) return;
    
    try {
      await verifyOtp({ otp: otpString });
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleResendOtp = () => {
    // In a real app, this would trigger the OTP send API again
    setTimer(30);
  };

  return (
    <div className="card fade-in p-8">
      <h1 className="text-2xl font-bold text-center mb-2">Verify OTP</h1>
      <p className="text-neutral-600 text-center mb-6">
        Enter the 4-digit code we sent to your {selectedRole === 'phone' ? 'phone' : 'email'}
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="otp-input" className="sr-only">
            OTP Input
          </label>
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="input w-14 h-14 text-center text-xl font-semibold"
                required
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-error-50 text-error-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn-primary w-full flex items-center justify-center"
          disabled={loading || otp.some((digit) => !digit)}
        >
          {loading ? (
            <LoadingSpinner size="small\" color="#ffffff" />
          ) : (
            <>
              Verify OTP
              <ArrowRight size={18} className="ml-2" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        {timer > 0 ? (
          <p className="text-neutral-600">
            Resend OTP in <span className="font-semibold">{timer}s</span>
          </p>
        ) : (
          <button
            onClick={handleResendOtp}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default OtpVerificationPage;