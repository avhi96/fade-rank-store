import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

// Create Context
const AuthContext = createContext();

// Admin Emails List (Consider moving this to env or Firestore in future)
const ADMIN_EMAILS = ["nyxu013@gmail.com", "avhi5949@gmail.com"];

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Admin check function
export const isAdmin = (user) => {
  return user?.email && ADMIN_EMAILS.includes(user.email);
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, isAdmin: isAdmin(user) }}>
      {loading ? (
        <div className="text-center mt-10 text-gray-400">Loading...</div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
