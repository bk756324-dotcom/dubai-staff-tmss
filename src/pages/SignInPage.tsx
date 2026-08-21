import React, { useState } from 'react';
import { Bus, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button.js';
import { Input } from '../components/ui/Input.js';
import { Alert } from '../components/ui/Alert.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';

interface SignInPageProps {
  navigate: (path: string) => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({ navigate }) => {
  const { signIn, isLoading } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('admin@dubaitransport.ae');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const result = await signIn(email, password);
    if (result.success) {
      toast.success('Authentication Successful', 'Welcome to Dubai Staff Transport Control Center.');
      navigate('/app/dashboard');
    } else {
      setErrorMsg(result.error || 'Invalid credentials.');
      toast.error('Authentication Failed', result.error);
    }
  };

  const quickLogins = [
    { role: 'ADMIN', email: 'admin@dubaitransport.ae', name: 'Tariq Al Mansoori (Lead Admin)' },
    { role: 'MANAGER', email: 'operations@dubaitransport.ae', name: 'Farhan Siddiqui (Operations Mgr)' },
    { role: 'DISPATCHER', email: 'dispatch@dubaitransport.ae', name: 'Rajesh Kumar (Dispatcher)' },
    { role: 'DRIVER', email: 'driver.aslam@dubaitransport.ae', name: 'Muhammad Aslam (Captain)' },
    { role: 'CLIENT', email: 'client@alhabtoorlogistics.ae', name: 'Sarah Jenkins (Client Rep)' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Background Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial from-orange-500/10 via-slate-900/0 to-transparent pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 mb-4 border border-orange-400">
          <Bus className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
          DUBAI STAFF TRANSPORT
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 font-medium">
          Enterprise Operations & Fleet Control Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 sm:px-10 shadow-2xl rounded-2xl">
          {errorMsg && (
            <Alert variant="error" className="mb-6" onClose={() => setErrorMsg(null)}>
              {errorMsg}
            </Alert>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Corporate Email Address
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@dubaitransport.ae"
                leftIcon={<Mail className="w-4 h-4 text-slate-500" />}
                className="bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4 text-slate-500" />}
                className="bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-orange-500"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to TMS Control Room
            </Button>
          </form>

          {/* Persona Quick Login Shortcuts for Verification */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider text-center">
              Quick Role Verification Shortcuts
            </p>
            <div className="grid grid-cols-1 gap-2">
              {quickLogins.map((item) => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => {
                    setEmail(item.email);
                    setPassword('admin123');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    email === item.email
                      ? 'bg-orange-500/10 border-orange-500 text-orange-400'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span className="font-bold">{item.role}</span>
                  <span className="text-[11px] text-slate-400">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="hover:text-white transition-colors"
            >
              ← Back to Website
            </button>
            <div className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TLS 256-Bit Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
