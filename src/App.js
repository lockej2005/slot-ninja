
import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import EditListing from './components/business/EditListing'
import PaymentSuccess from './components/auth/PaymentSuccess';
import HelpPage from './static/HelpPage'
import Loading from './components/ui/Loading';
import './App.css';
import { supabase } from './supabaseClient';
import TermsAndConditionsPage from './static/TermsAndConditionsPage';

export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}


function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error.message);
      } else {
        setCurrentUser(data.session?.user || null);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={{ currentUser, setCurrentUser }}>{children}</AuthContext.Provider>;
}
function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkJWT = async () => {
      const { data, error } = await supabase.auth.getSession();
      setIsValid(data.session !== null);
      setIsLoading(false);
    };

    checkJWT();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (!isValid && location.pathname !== '/payment-success') {
    return <Navigate to="/login" replace />;
  }

  return isValid || location.pathname === '/payment-success' ? children : <Navigate to="/login" replace />;
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
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/terms-conditions" element={<TermsAndConditionsPage />} />

            
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
              path="/business/edit-listing/:id"
              element={
                <PrivateRoute>
                  <EditListing />
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