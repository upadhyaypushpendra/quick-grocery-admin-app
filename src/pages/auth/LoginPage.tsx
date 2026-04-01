import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useLogin, useVerifyOtp, useResendOtp } from '../../hooks/useAuth';
import { useAuthStore } from '../../stores/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'identifier' | 'otp'>('identifier');
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const { error, setError } = useAuthStore();
  const login = useLogin();
  const verifyOtp = useVerifyOtp();
  const resendOtp = useResendOtp();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    login.mutate(
      { identifier },
      {
        onSuccess: (data) => {
          setDevOtp(data.otp ?? null);
          setStep('otp');
          toast.success('OTP sent successfully');
        },
      },
    );
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    verifyOtp.mutate(
      { identifier, otp },
      {
        onSuccess: (data) => {
          if (data.user.role !== 'admin') return; // error set by hook
          toast.success('Welcome back!');
          navigate('/');
        },
      },
    );
  };

  const handleResend = () => {
    resendOtp.mutate(
      { identifier },
      {
        onSuccess: (data) => {
          setDevOtp(data.otp ?? null);
          toast.success('OTP resent');
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-brand-400">QuickGrocery</h1>
          <p className="text-slate-400 mt-1 text-sm">Admin Panel</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
          {step === 'identifier' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Sign In</h2>
                <p className="text-slate-400 text-sm">Enter your phone number to receive an OTP</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  placeholder="9874XX3434"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              <button
                type="submit"
                disabled={login.isPending}
                className="w-full py-2 px-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors text-sm"
              >
                {login.isPending ? 'Sending…' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Enter OTP</h2>
                <p className="text-slate-400 text-sm">
                  OTP sent to <span className="text-slate-300">{identifier}</span>
                </p>
              </div>
              {devOtp && (
                <div className="bg-amber-900/30 border border-amber-700 rounded-lg px-3 py-2 text-sm text-amber-300">
                  Dev OTP: <span className="font-mono font-bold">{devOtp}</span>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  6-digit OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  placeholder="123456"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-mono tracking-widest"
                />
              </div>
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              <button
                type="submit"
                disabled={verifyOtp.isPending}
                className="w-full py-2 px-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors text-sm"
              >
                {verifyOtp.isPending ? 'Verifying…' : 'Verify OTP'}
              </button>
              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => { setStep('identifier'); setError(null); }}
                  className="text-slate-400 hover:text-slate-200"
                >
                  ← Change identifier
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendOtp.isPending}
                  className="text-brand-400 hover:text-brand-300 disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
