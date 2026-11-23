import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { X, Lock, Mail, User, Shield, Sparkles } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  if (!isOpen) return null;

  const { login, register, quickDemoLogin } = useAuth();
  const { showToast } = useCart();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let res;
      if (isSignUp) {
        res = await register(name, email, password);
        showToast('Welcome to NIKK AURA! Account created & saved.');
      } else {
        res = await login(email, password);
        showToast('Welcome back to NIKK AURA!');
      }
      if (res?.success && onLoginSuccess) {
        onLoginSuccess(res.user);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role) => {
    setError('');
    setLoading(true);
    try {
      const res = await quickDemoLogin(role);
      showToast(`Logged in as ${role === 'admin' ? 'Store Administrator' : 'Demo Customer'}`);
      if (res?.success && onLoginSuccess) {
        onLoginSuccess(res.user);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-zinc-200 relative animate-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="p-8 pb-4 text-center">
          <div className="w-12 h-12 bg-zinc-900 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg font-serif font-black text-xl">
            NA
          </div>
          <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">
            {isSignUp ? 'Create your NIKK AURA Account' : 'Sign in to NIKK AURA'}
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Access order history, receipts, and fast checkout
          </p>
        </div>

        {/* 1-Click Demo Logins Banner */}
        <div className="px-8 pb-4">
          <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Instant 1-Click Evaluation Logins</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemo('customer')}
                disabled={loading}
                className="p-2 bg-white hover:bg-zinc-100 rounded-xl border border-zinc-200 text-left transition-all text-xs"
              >
                <div className="font-bold text-zinc-900">👤 Customer</div>
                <div className="text-[10px] text-zinc-400">demo@aura.com</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemo('admin')}
                disabled={loading}
                className="p-2 bg-white hover:bg-zinc-100 rounded-xl border border-zinc-200 text-left transition-all text-xs"
              >
                <div className="font-bold text-amber-700">👑 Admin</div>
                <div className="text-[10px] text-zinc-400">admin@aura.com</div>
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-600 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sophia Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-zinc-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-zinc-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-zinc-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-98"
          >
            {loading ? 'Authenticating...' : isSignUp ? 'Create My Account' : 'Sign In to Aura'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-xs text-zinc-500 hover:text-zinc-900 font-medium"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Register now"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
