import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FaLock, FaEnvelope, FaCheckCircle } from 'react-icons/fa';

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
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Floating Elements - Homepage Style */}
      <div className="absolute top-20 left-10 w-12 h-12 bg-green-500 rounded-sm opacity-20 animate-bounce" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-32 right-20 w-8 h-8 bg-blue-500 rounded-sm opacity-30 animate-bounce" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 left-1/4 w-10 h-10 bg-yellow-500 rounded-sm opacity-25 animate-bounce" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-60 right-1/3 w-6 h-6 bg-purple-500 rounded-sm opacity-20 animate-bounce" style={{ animationDelay: '3s' }}></div>
      
      {/* Perfectly Centered Container */}
      <div className="w-full max-w-md mx-auto px-6 py-8">
        <div className="text-center animate-fade-in-up">
          {/* Badge - Homepage Style */}
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-6 border border-blue-200 dark:border-blue-700">
            <FaLock className="text-blue-600" />
            <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">Password Recovery</span>
          </div>

          {/* Title - Homepage Style */}
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-6 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
            Reset Your{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent relative">
              Password
            </span>
          </h1>

          {/* Subtitle - Homepage Style */}
          <p className="text-lg sm:text-xl mb-8 text-gray-600 dark:text-gray-300 leading-relaxed">
            {sent ? 'Check your email for the reset link' : 'Enter your email to receive a reset link'}
          </p>

          {/* Form Card - Glassmorphism */}
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-300 p-8">
            {sent ? (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
                    <FaCheckCircle className="text-4xl text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Reset Link Sent!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    We've sent a password reset link to:
                  </p>
                  <p className="font-bold text-blue-600 dark:text-blue-400 mb-6">
                    {email}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Check your inbox and click the link to reset your password. The link will expire in 1 hour.
                  </p>
                </div>
                <Link
                  to="/login"
                  className="btn-primary w-full"
                >
                  Back to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-6">
                <div className="group">
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:shadow-lg transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-sm font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Primary Button - Homepage Style */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
                </button>
              </form>
            )}

            {!sent && (
              <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Remember your password?{' '}
                  <Link 
                    to="/login" 
                    className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-500 hover:to-purple-500 transition-all duration-200"
                  >
                    Back to Login
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
