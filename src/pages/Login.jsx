import React, { useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

const Login = () => {
  const [form, setForm] = useState({ input: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      let emailToUse = form.input;

      // If input is not email, check by username
      if (!form.input.includes('@')) {
        const q = query(collection(db, 'users'), where('username', '==', form.input.toLowerCase()));
        const snap = await getDocs(q);
        if (snap.empty) {
          toast.error('Username not found');
          return;
        }
        emailToUse = snap.docs[0].data().email;
      }

      await signInWithEmailAndPassword(auth, emailToUse, form.password);

      toast.success('Login successful');
      navigate(from, { replace: true });
    } catch (err) {
      setError('Login failed');
      toast.error('Invalid credentials');
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.displayName) {
        const nameFromEmail = user.email.split('@')[0];
        await updateProfile(user, { displayName: nameFromEmail });
      }

      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          username: user.displayName.toLowerCase() || user.email.split('@')[0],
        });
      }

      toast.success('Logged in with Google');
      navigate('/');
    } catch (err) {
      toast.error('Google login failed');
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
            <FaLock className="text-green-600" />
            <span className="text-sm font-semibold text-green-800 dark:text-green-200">Secure Login</span>
          </div>

          {/* Title - Homepage Style */}
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-6 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
            Welcome Back to{' '}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent relative">
              FADE
            </span>
          </h1>

          {/* Subtitle - Homepage Style */}
          <p className="text-lg sm:text-xl mb-8 text-gray-600 dark:text-gray-300 leading-relaxed">
            Sign in to your FADE account
          </p>

          {/* Login Form - Glassmorphism Card */}
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-300 p-8">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="group">
                <input
                  type="text"
                  name="input"
                  placeholder="Username or Email"
                  value={form.input}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:shadow-lg transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-sm font-medium"
                  required
                />
              </div>
              
              <div className="group relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:shadow-lg transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-sm font-medium"
                  required
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
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Sign In
              </button>
            </form>

            {/* Forgot Password Link - Glowing Text */}
            <div className="text-center mt-4">
              <Link 
                to="/forgot-password" 
                className="text-sm font-medium bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent hover:from-green-500 hover:to-blue-500 transition-all duration-200"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200/50 dark:border-gray-700/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium backdrop-blur-sm">Or continue with</span>
                </div>
              </div>

              {/* Google Button - Clean & Minimal */}
              <button
                onClick={handleGoogleLogin}
                className="mt-4 w-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-green-500 font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
              >
                <FcGoogle size={20} />
                Sign in with Google
              </button>
            </div>

            {/* Sign Up Link - Glowing Text */}
            <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent hover:from-green-500 hover:to-blue-500 transition-all duration-200"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
