import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import BusinessDashboard from './containers/BusinessDashboard';
import CustomerDashboardContainer from './containers/CustomerDashboardContainer';
import BusinessProfile from './components/business/BusinessProfile';
import BusinessListings from './components/business/BusinessListings';
import CustomerDashboard from './components/customer/CustomerDashboard';
import BookingForm from './components/customer/BookingForm';
import SearchResults from './components/customer/SearchResults';
import NewListingForm from './components/business/NewListingForm';
import UpcomingListings from './components/business/UpcomingListings';
import SingleListing from './components/customer/singleListing'
import './App.css';
import { supabase } from './supabaseClient';

export const AuthContext = createContext(null);

function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null);
    });

    return () => {
      if (listener && typeof listener.unsubscribe === 'function') {
        listener.unsubscribe();
      }
    };
  }, []);

  return <AuthContext.Provider value={{ currentUser, setCurrentUser }}>{children}</AuthContext.Provider>;
}

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<SearchResults />} />
            <Route path="/singleListing/:id" element={<SingleListing />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route
              path="/business/dashboard"
              element={
                <PrivateRoute>
                  <BusinessDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/business/profile"
              element={
                <PrivateRoute>
                  <BusinessProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/business/listings"
              element={
                <PrivateRoute>
                  <BusinessListings />
                </PrivateRoute>
              }
            />
            <Route
              path="/business/uppcominglistings"
              element={
                <PrivateRoute>
                  <UpcomingListings />
                </PrivateRoute>
              }
            />
            <Route
              path="/business/listings/new"
              element={
                <PrivateRoute>
                  <NewListingForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer/dashboard"
              element={
                <PrivateRoute>
                  <CustomerDashboardContainer />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer/explore"
              element={
                <PrivateRoute>
                  <CustomerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer/book"
              element={
                <PrivateRoute>
                  <BookingForm />
                </PrivateRoute>
              }
            />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;