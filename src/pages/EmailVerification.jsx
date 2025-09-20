import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { FaEnvelope, FaCheckCircle, FaExclamationTriangle, FaRedo } from 'react-icons/fa';

const EmailVerification = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      navigate('/login');
      return;
    }

    // If user is already verified, redirect to home
    if (user.emailVerified) {
      navigate('/');
      return;
    }

    // Start cooldown timer if there's a stored timestamp
    const lastSent = localStorage.getItem('lastVerificationSent');
    if (lastSent) {
      const timeDiff = Date.now() - parseInt(lastSent);
      const remainingTime = Math.max(0, 60000 - timeDiff); // 60 seconds cooldown
      if (remainingTime > 0) {
        setResendCooldown(Math.ceil(remainingTime / 1000));
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    // Countdown timer
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendVerification = async () => {
    if (!user || resendCooldown > 0) return;

    setLoading(true);
    try {
      // Add action code settings for better email configuration
      const actionCodeSettings = {
        url: window.location.origin + '/email-verification',
        handleCodeInApp: false,
      };
      
      await sendEmailVerification(user, actionCodeSettings);
      console.log('Verification email resent successfully to:', user.email);
      toast.success('Verification email sent! Please check your inbox and spam folder.');
      
      // Set cooldown
      localStorage.setItem('lastVerificationSent', Date.now().toString());
      setResendCooldown(60);
    } catch (error) {
      console.error('Error sending verification email:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      if (error.code === 'auth/too-many-requests') {
        toast.error('Too many requests. Please wait before trying again.');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email address. Please contact support.');
      } else if (error.code === 'auth/user-disabled') {
        toast.error('This account has been disabled. Please contact support.');
      } else {
        toast.error('Failed to send verification email. Please try again or contact support.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!user) return;

    try {
      // Reload user to get updated emailVerified status
      await user.reload();
      
      if (user.emailVerified) {
        toast.success('Email verified successfully!');
        navigate('/');
      } else {
        toast.error('Email not verified yet. Please check your inbox and click the verification link.');
      }
    } catch (error) {
      console.error('Error checking verification:', error);
      toast.error('Failed to check verification status.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out.');
    }
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-12 h-12 bg-yellow-500 rounded-sm opacity-20 animate-bounce" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-32 right-20 w-8 h-8 bg-orange-500 rounded-sm opacity-30 animate-bounce" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 left-1/4 w-10 h-10 bg-red-500 rounded-sm opacity-25 animate-bounce" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-60 right-1/3 w-6 h-6 bg-purple-500 rounded-sm opacity-20 animate-bounce" style={{ animationDelay: '3s' }}></div>
      
      {/* Main Container */}
      <div className="w-full max-w-md mx-auto px-6 py-8">
        <div className="text-center animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 px-4 py-2 rounded-full mb-6 border border-yellow-200 dark:border-yellow-700">
            <FaExclamationTriangle className="text-yellow-600" />
            <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">Email Verification Required</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-6 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
            Verify Your{' '}
            <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent relative">
              Email
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl mb-8 text-gray-600 dark:text-gray-300 leading-relaxed">
            Please verify your email address to continue
          </p>

          {/* Verification Card */}
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-300 p-8">
            
            {/* Email Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <FaEnvelope className="text-3xl text-white" />
              </div>
            </div>

            {/* Message */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Check Your Email
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We've sent a verification link to:
              </p>
              <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg">
                {user.email}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Click the link in the email to verify your account. You may need to check your spam folder.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Check Verification Button */}
              <button
                onClick={handleCheckVerification}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <FaCheckCircle />
                I've Verified My Email
              </button>

              {/* Resend Email Button */}
              <button
                onClick={handleResendVerification}
                disabled={loading || resendCooldown > 0}
                className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                <FaRedo className={loading ? 'animate-spin' : ''} />
                {loading ? 'Sending...' : 
                 resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 
                 'Resend Verification Email'}
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Didn't receive the email?
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Check your spam/junk folder</li>
                <li>• Make sure {user.email} is correct</li>
                <li>• Wait a few minutes and try again</li>
                <li>• Contact support if issues persist</li>
              </ul>
            </div>

            {/* Sign Out Link */}
            <div className="text-center mt-6">
              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
              >
                Sign out and use a different account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
