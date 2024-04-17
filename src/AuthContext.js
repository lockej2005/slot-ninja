// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for an existing session and set the user accordingly
    const session = supabase.auth.session();
    setUser(session?.user ?? null);
    setIsLoading(false);

    // Listen for authentication state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          navigate('/login'); // Redirect to login after signing out
        }
        setUser(session?.user ?? null);
      }
    );

    // Cleanup the listener when the component unmounts
    return () => {
      listener?.unsubscribe();
    };
  }, [navigate]);

  const logout = async () => {
    // Perform the logout action
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      navigate('/login'); // Optionally navigate to login after logout
    } else {
      console.error('Logout error:', error.message);
    }
  };

  const value = {
    user,
    setUser, // Provide setUser in case you need to manually adjust the user from components
    isLoading,
    logout // Make the logout function available throughout the app
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
