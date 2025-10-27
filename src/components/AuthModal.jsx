import React, { useState } from 'react';
import { X, Lock, Mail, User } from 'lucide-react';

function AuthModal({ open, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // No backend calls here; simulate success
    setTimeout(() => {
      setLoading(false);
      if (!email || !password || (mode === 'signup' && !name)) {
        setError('Please fill in all required fields.');
        return;
        }
      onAuthSuccess({ name: name || 'Student', email });
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-800">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h3>
          <button onClick={onClose} className="rounded-full p-1 text-slate-500 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          {mode === 'signup' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
              <div className="flex items-center rounded-lg border bg-white px-3 py-2 shadow-sm focus-within:border-indigo-500">
                <User size={16} className="text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="ml-2 w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <div className="flex items-center rounded-lg border bg-white px-3 py-2 shadow-sm focus-within:border-indigo-500">
              <Mail size={16} className="text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="ml-2 w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <div className="flex items-center rounded-lg border bg-white px-3 py-2 shadow-sm focus-within:border-indigo-500">
              <Lock size={16} className="text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="ml-2 w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
          <p className="text-center text-sm text-slate-600">
            {mode === 'signin' ? (
              <>Don't have an account?{' '}
                <button type="button" className="font-semibold text-indigo-600 hover:underline" onClick={() => setMode('signup')}>Sign up</button></>
            ) : (
              <>Already have an account?{' '}
                <button type="button" className="font-semibold text-indigo-600 hover:underline" onClick={() => setMode('signin')}>Sign in</button></>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;
