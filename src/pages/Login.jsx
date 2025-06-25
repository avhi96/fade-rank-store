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
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

const Login = () => {
  const [form, setForm] = useState({ input: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const from = location.state?.from?.pathname || '/';
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

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
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 px-4">
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-3 mr-5 py-1 rounded-full shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-lg rounded-xl p-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-6">Login to Fade</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            name="input"
            placeholder="Username or Email"
            value={form.input}
            onChange={handleChange}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <div className="text-right text-sm mt-2">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="mt-4 w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white py-2 rounded flex justify-center items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <FcGoogle size={20} /> Sign in with Google
        </button>

        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-4">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
