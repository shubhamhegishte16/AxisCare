import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const PharmacyForgotPassword = () => {
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailOrPhone) { setError('Email or phone is required'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/pharmacy/reset-password');
    }, 700);
  };

  return (
    <AuthLayout illustration="forgot">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">Forgot password?</h2>
      <p className="text-sm text-gray-500 text-center mb-8">Enter your registered email and we'll send you reset link</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email or Phone</label>
          <input
            type="text"
            placeholder="Enter email or phone"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-lg border bg-white text-sm outline-none focus:ring-2 focus:ring-blue-200 ${error ? 'border-red-400' : 'border-gray-200'}`}
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm"
        >
          {loading ? 'Sending…' : 'Send reset link'}
        </button>

        <p className="text-center text-sm text-gray-500">
          Remember your password?{' '}
          <Link to="/pharmacy/login" className="text-blue-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default PharmacyForgotPassword;