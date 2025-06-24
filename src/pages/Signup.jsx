import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    username: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      });

      toast.success('Account created successfully!');
      navigate('/');
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
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-100 to-blue-100 dark:from-gray-900 dark:to-gray-900 transition-all duration-300">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl rounded-2xl p-8 z-10">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Create Your Account
        </h2>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            name="username"
            onChange={handleChange}
            value={form.username}
            required
            placeholder="Username"
            onKeyDown={(e) => e.key === 'Enter' && handleSignup(e)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="email"
            type="email"
            onChange={handleChange}
            value={form.email}
            required
            placeholder="Email Address"
            onKeyDown={(e) => e.key === 'Enter' && handleSignup(e)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="password"
            type="password"
            onChange={handleChange}
            value={form.password}
            required
            placeholder="Password (min 6 characters)"
            onKeyDown={(e) => e.key === 'Enter' && handleSignup(e)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition-all duration-200"
          >
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
