// BusinessDashboard.js
import React, { useState, useEffect, useContext } from 'react';
import BusinessListings from '../components/business/BusinessListings';
import NewListingForm from '../components/business/NewListingForm';
import BusinessProfile from '../components/business/BusinessProfile';
import { AuthContext } from '../App';
import { supabase } from '../supabaseClient';
import './BusinessDashboard.scss';

function BusinessDashboard() {
  const [userName, setUserName] = useState('');
  const [listings, setListings] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState('dashboard');
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserDataAndListings = async () => {
      if (!currentUser) return;

      // Fetch user data
      let { data: userData, error: userError } = await supabase
        .from('users')
        .select('name')
        .eq('id', currentUser.id)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError.message);
      } else {
        setUserName(userData.name);
      }

      // Fetch listings data
      let { data: listingsData, error: listingsError } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', currentUser.id);

      if (listingsError) {
        console.error('Error fetching listings:', listingsError.message);
      } else {
        setListings(listingsData);
      }
    };

    fetchUserDataAndListings();
  }, [currentUser]);

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case 'listings':
        return <BusinessListings listings={listings} />;
      case 'newListing':
        return <NewListingForm />;
      case 'profile':
        return <BusinessProfile />;
      case 'payments':
        return <div>Payments component goes here</div>;
      default:
        return <div>You have no notifications.</div>;
    }
  };

  return (
    <div className="business-dashboard">
      <div className="side-panel">
        <nav className="dashboard-navigation">
          <button className="dashboard-link" onClick={() => setSelectedComponent('dashboard')}>
            Dashboard
          </button>
          <button className="dashboard-link" onClick={() => setSelectedComponent('listings')}>
            Active Listings
          </button>
          <button className="dashboard-link" onClick={() => setSelectedComponent('history')}>
            History
          </button>
          <button className="dashboard-link" onClick={() => setSelectedComponent('newListing')}>
            Create New Listing
          </button>
          <button className="dashboard-link" onClick={() => setSelectedComponent('profile')}>
            Update Profile
          </button>
          <button className="dashboard-link" onClick={() => setSelectedComponent('payments')}>
            Payments
          </button>
        </nav>
      </div>
      <div className="dashboard-content">{renderSelectedComponent()}</div>
    </div>
  );
}

export default BusinessDashboard;