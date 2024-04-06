// BusinessDashboard.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import BusinessListings from '../components/business/BusinessListings';
import { AuthContext } from '../App';
import { supabase } from '../supabaseClient';
import './BusinessDashboard.scss';

function BusinessDashboard() {
  const [userName, setUserName] = useState('');
  const [listings, setListings] = useState([]);
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

  return (
    <div className="business-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome, {userName}!</h1>
        <div className="dashboard-navigation">
          <Link className="dashboard-link" to="/business/profile">Update Profile</Link>
          <Link className="dashboard-link" to="/business/listings/new">Create New Listing</Link>
        </div>
      </div>
      <div className="dashboard-content">
        <section className="listings-section">
          <h2 className="section-title">Your Listings</h2>
          <BusinessListings listings={listings} />
        </section>
      </div>
    </div>
  );
}

export default BusinessDashboard;