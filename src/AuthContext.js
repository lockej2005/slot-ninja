import React, { createContext, useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// Context to hold authentication status
export const AuthContext = createContext();

export function useAuth() {
  return React.useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null);
    });

    return () => {
      if (subscription.data) {
        subscription.data.unsubscribe();
      }
    };
  }, []);

  // Include setCurrentUser in the context value here
  const value = {
    currentUser,
    setCurrentUser,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;