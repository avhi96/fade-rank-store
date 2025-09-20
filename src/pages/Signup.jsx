import React, { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    username: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: form.username });

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        username: form.username.toLowerCase(),
        emailVerified: true, // Set to true to bypass verification
        createdAt: new Date().toISOString()
      });

      toast.success('Account created successfully! You can now login.');
      navigate('/login');
    } catch (err) {
      console.error('[Signup Error]', err.message);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email is already in use.');
        toast.error('Email is already in use.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
        toast.error('Weak password');
      } else {
        setError('Signup failed. Try again.');
        toast.error('Signup failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Floating Elements - Exact same as Homepage */}
      <div className="absolute top-20 left-10 w-12 h-12 bg-green-500 rounded-sm opacity-20 animate-bounce" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-32 right-20 w-8 h-8 bg-blue-500 rounded-sm opacity-30 animate-bounce" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 left-1/4 w-10 h-10 bg-yellow-500 rounded-sm opacity-25 animate-bounce" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-60 right-1/3 w-6 h-6 bg-purple-500 rounded-sm opacity-20 animate-bounce" style={{ animationDelay: '3s' }}></div>
      
      {/* Perfectly Centered Container */}
      <div className="w-full max-w-md mx-auto px-6 py-8">
        <div className="text-center animate-fade-in-up">
          {/* Badge - Homepage Style */}
          <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full mb-6 border border-green-200 dark:border-green-700">
            <FaUserPlus className="text-green-600" />
            <span className="text-sm font-semibold text-green-800 dark:text-green-200">Join FADE</span>
          </div>

          {/* Title - Homepage Style */}
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-6 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
            Join{' '}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent relative">
              FADE
            </span>
            {' '}Today
          </h1>

          {/* Subtitle - Homepage Style */}
          <p className="text-lg sm:text-xl mb-8 text-gray-600 dark:text-gray-300 leading-relaxed">
            Create your account and get started
          </p>

          {/* Signup Form - Glassmorphism Card */}
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-300 p-8">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="group">
                <input
                  name="username"
                  onChange={handleChange}
                  value={form.username}
                  required
                  placeholder="Username"
                  className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:shadow-lg transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-sm font-medium"
                />
              </div>

              <div className="group">
                <input
                  name="email"
                  type="email"
                  onChange={handleChange}
                  value={form.email}
                  required
                  placeholder="Email Address"
                  className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:shadow-lg transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-sm font-medium"
                />
              </div>

              <div className="group relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  onChange={handleChange}
                  value={form.password}
                  required
                  placeholder="Password (min 6 characters)"
                  className="w-full px-4 py-3 pr-12 bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:shadow-lg transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 focus:outline-none"
                >
                  {showPassword ? (
                    <FaEyeSlash className="w-5 h-5" />
                  ) : (
                    <FaEye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {error && (
                <p className="text-red-600 text-center font-bold">{error}</p>
              )}

              {/* Primary Button - Homepage Style */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Sign In Link - Glowing Text */}
            <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent hover:from-green-500 hover:to-blue-500 transition-all duration-200"
              >
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
