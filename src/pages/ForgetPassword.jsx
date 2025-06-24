import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
      toast.success('Password reset link sent!');
    } catch (error) {
      console.error('[Reset Error]', error.message);
      if (error.code === 'auth/user-not-found') {
        toast.error('No user found with this email.');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email address.');
      } else {
        toast.error('Failed to send reset email.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-tr from-white to-white dark:from-gray-900 dark:to-gray-900 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl shadow-xl p-8 border border-gray-300 dark:border-gray-700">
        <div className="flex flex-col items-center mb-6">
          <FaLock className="text-4xl text-blue-600 dark:text-blue-400 mb-2" />
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
            Enter your email address below and we’ll send you a link to reset your password.
          </p>
        </div>

        {sent ? (
          <div className="text-center text-green-600 dark:text-green-400">
            <p>Reset link sent to:</p>
            <p className="font-semibold">{email}</p>
            <p className="mt-4">
              <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-400">
                Go back to login
              </Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleReset(e)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white font-semibold rounded transition"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        {!sent && (
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-6">
            Remember your password?{' '}
            <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-400">
              Back to login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
