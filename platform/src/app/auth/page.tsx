'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, User, Lock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/app/store/useAuthStore';

export default function AuthPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  // --- STATE MANAGEMENT ---
  const [isLoginView, setIsLoginView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // State for Login Form
  const [loginFormData, setLoginFormData] = useState({ email: '', password: '' });
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // State for Register Form
  const [registerFormData, setRegisterFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [showRegPassword, setShowRegPassword] = useState(false);


  // --- HANDLER FUNCTIONS ---

  // Toggles the view and clears any errors/form data
  const switchView = (view: 'login' | 'register') => {
    setError('');
    setIsLoading(false);
    if (view === 'login') {
      setIsLoginView(true);
    } else {
      setIsLoginView(false);
    }
  };

  // Login Handlers
  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginFormData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to login.');
      }
      
      // Use the auth store's setAuth function
      setAuth({ user: data.user, token: data.token });
      
      router.push('/dashboard'); // Redirect to a protected page

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Register Handlers
  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const name = registerFormData.fullName.trim();
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: registerFormData.email, 
          password: registerFormData.password, 
          name 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to register.');
      }

      // On success, show a confirmation and switch to login view
      alert('Registration successful! Please sign in.');
      switchView('login');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  // --- STYLING CONSTANTS ---
  const inputClasses = `
    h-12 text-base bg-[#1D2333] border border-transparent focus:bg-[#101522] 
    text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-0
    transition-all duration-200 rounded-lg`;
  
  const errorInputClasses = `
    border-red-500/50 focus:border-red-500`;


  // --- RENDER ---
  return (
    <div className="min-h-screen bg-[#06080F] text-gray-200 relative overflow-hidden font-sans">
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(#00D4FF 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />
       {/* Background Glow */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-cyan-500/20 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-purple-500/20 blur-[150px] rounded-full"></div>
      

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Card */}
        <div className="w-full max-w-md bg-[#0B101B]/80 backdrop-blur-md rounded-2xl p-8 border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
          
          {isLoginView ? (
            // --- LOGIN VIEW ---
            <div>
              <div className="flex justify-center mb-6">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-1.5 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-cyan-400 text-xs font-mono uppercase tracking-widest">SECURE ACCESS</span>
                </div>
              </div>
              <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-white uppercase">Welcome back to</h1>
                <h2 className="text-4xl font-extrabold tracking-tight text-cyan-400 uppercase">Uncheatable</h2>
                <h2 className="text-4xl font-extrabold tracking-tight text-cyan-400 uppercase">Interview Platform</h2>
              </div>
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-red-400">Authentication Failed</p>
                      <p className="text-sm mt-1 text-red-400/80">{error}</p>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium uppercase text-gray-400 tracking-wider">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                    <Input id="email" name="email" type="email" required value={loginFormData.email} onChange={handleLoginInputChange} className={`${inputClasses} pl-12 ${error ? errorInputClasses : ''}`} placeholder="bibek.dhara15@gmail.com" disabled={isLoading} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium uppercase text-gray-400 tracking-wider">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                    <Input id="password" name="password" type={showLoginPassword ? 'text' : 'password'} required value={loginFormData.password} onChange={handleLoginInputChange} className={`${inputClasses} pl-12 pr-12 ${error ? errorInputClasses : ''}`} placeholder="••••••••••" disabled={isLoading} />
                    <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400 transition-colors" disabled={isLoading}>
                      {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" disabled={isLoading} className="w-full h-12 text-base font-bold text-white uppercase tracking-wider bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 transition-opacity duration-300 rounded-lg disabled:opacity-50">
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-sm font-mono text-gray-400">
                  NEW TO GARURA? <button onClick={() => switchView('register')} className="font-bold text-cyan-400 hover:text-cyan-300 underline">CREATE ACCOUNT</button>
                </p>
              </div>
            </div>
          ) : (
            // --- REGISTER VIEW ---
            <div>
              <div className="flex justify-center mb-6">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-1.5 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-cyan-400 text-xs font-mono uppercase tracking-widest">SECURE REGISTRATION</span>
                </div>
              </div>
              <div className="text-center mb-8">
                 <h1 className="text-4xl font-extrabold tracking-tight text-white uppercase">Join The</h1>
                <h2 className="text-4xl font-extrabold tracking-tight text-cyan-400 uppercase">Uncheatable</h2>
                <h2 className="text-4xl font-extrabold tracking-tight text-cyan-400 uppercase">Interview Platform</h2>
              </div>
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                 {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                    <p className="text-sm font-semibold text-red-400">{error}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium uppercase text-gray-400 tracking-wider">Full Name</Label>
                  <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" /><Input id="fullName" name="fullName" required value={registerFormData.fullName} onChange={handleRegisterInputChange} className={`${inputClasses} pl-12`} placeholder="John Doe" disabled={isLoading}/></div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-sm font-medium uppercase text-gray-400 tracking-wider">Email Address</Label>
                  <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" /><Input id="reg-email" name="email" type="email" required value={registerFormData.email} onChange={handleRegisterInputChange} className={`${inputClasses} pl-12`} placeholder="john.doe@example.com" disabled={isLoading}/></div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password" className="text-sm font-medium uppercase text-gray-400 tracking-wider">Password</Label>
                  <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" /><Input id="reg-password" name="password" type={showRegPassword ? 'text' : 'password'} required value={registerFormData.password} onChange={handleRegisterInputChange} className={`${inputClasses} pl-12 pr-12`} placeholder="Create a strong password" disabled={isLoading}/><button type="button" onClick={() => setShowRegPassword(!showRegPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400"><Eye className="h-5 w-5" /></button></div>
                </div>
                <Button type="submit" disabled={isLoading} className="w-full h-12 text-base font-bold text-white uppercase tracking-wider bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 transition-opacity duration-300 rounded-lg disabled:opacity-50">
                  {isLoading ? 'Creating Account...' : 'Get Started'}
                </Button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-sm font-mono text-gray-400">
                  ALREADY REGISTERED? <button onClick={() => switchView('login')} className="font-bold text-cyan-400 hover:text-cyan-300 underline">SIGN IN</button>
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-sm text-gray-500 font-mono tracking-widest">
            © 2025 GARURA. SECURING INTERVIEWS, EMPOWERING INTERVIEWERS.
          </p>
        </footer>
      </main>
    </div>
  );
}