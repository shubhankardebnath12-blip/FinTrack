import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Wallet, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PERKS = [
  'Free forever — no credit card required',
  'JWT-secured authentication',
  'Unlimited expense tracking',
];

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password)
      return toast.error('Please fill in all fields');
    if (form.password.length < 6)
      return toast.error('Password must be at least 6 characters');

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
      toast.success('Welcome to FinTrack! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 100% 80% at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 60%), #060910',
      }}
    >
      {/* Background orbs */}
      <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(99,102,241,0.06)' }} />
      <div className="absolute bottom-20 right-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(139,92,246,0.05)' }} />

      <div className="w-full max-w-[420px] animation-scale-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 0 40px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            <Wallet size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight" style={{ letterSpacing: '-0.03em' }}>
            Create Account
          </h1>
          <p className="text-sm text-white/35 mt-1.5">Start tracking your finances today</p>
        </div>

        {/* Perks */}
        <div className="flex flex-col gap-1.5 mb-6">
          {PERKS.map((p) => (
            <div key={p} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.25)' }}
              >
                <Check size={9} className="text-success-400" strokeWidth={3} />
              </div>
              <span className="text-xs text-white/35">{p}</span>
            </div>
          ))}
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-8 space-y-5"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label">Full Name</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <User size={15} className="text-white/25" />
                </div>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="John Doe"
                  className="input pl-10"
                  autoComplete="name"
                />
              </div>
            </div>

            <div>
              <label className="input-label">Email Address</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Mail size={15} className="text-white/25" />
                </div>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="john@example.com"
                  className="input pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Lock size={15} className="text-white/25" />
                </div>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="Min. 6 characters"
                  className="input pl-10"
                  autoComplete="new-password"
                />
              </div>
              {/* Strength indicator */}
              {form.password && (
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{
                        background: form.password.length >= s * 3
                          ? s === 1 ? '#f43f5e' : s === 2 ? '#fbbf24' : '#4ade80'
                          : 'rgba(255,255,255,0.08)',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 mt-2"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                boxShadow: '0 0 24px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path d="M4 12a8 8 0 018-8V0" stroke="currentColor" strokeWidth="3" className="opacity-75" />
                </svg>
              ) : (
                <> Create Account <ArrowRight size={15} /> </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-white/30">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 font-semibold hover:text-primary-300 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
