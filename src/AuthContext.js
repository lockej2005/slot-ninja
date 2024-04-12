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
    const session = supabase.auth.session();
    setCurrentUser(session?.user || null);

    const subscription = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null);
    });

    return () => {
      if (subscription.data) {
        subscription.data.unsubscribe();
      }
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    setCurrentUser,
    isAuthenticated: !!currentUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export default AuthProvider;