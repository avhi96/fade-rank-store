import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

// Create the context
const AuthContext = createContext();

// ✅ Define admin emails (you can move this to Firestore for dynamic access later)
const ADMIN_EMAILS = ["nyxu013@gmail.com", "avhi5949@gmail.com"]; // Add your admins here

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Utility function to check if a user is admin
export const isAdmin = (user) => {
  return user?.email && ADMIN_EMAILS.includes(user.email);
};

// Provider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup the listener
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
        <div className="text-center mt-10 text-gray-500">Loading...</div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
