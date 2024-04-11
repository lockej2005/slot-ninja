import React, { useState, useEffect, useContext } from 'react';
import BusinessListings from '../components/business/BusinessListings';
import NewListingForm from '../components/business/NewListingForm';
import BusinessProfile from '../components/business/BusinessProfile';
import ListingHistory from '../components/business/ListingHistory';
import { AuthContext } from '../App';
import { supabase } from '../supabaseClient';
import './BusinessDashboard.scss';
import UpcomingListings from '../components/business/UpcomingListings';

function BusinessDashboard() {
  const [userName, setUserName] = useState('');
  const [listings, setListings] = useState([]);
  const [futureListings, setFutureListings] = useState([]);
  const [pastListings, setPastListings] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState('dashboard');
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserDataAndListings = async () => {
      if (!currentUser) return;

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

      const currentDate = new Date().toISOString();

      // Fetch future listings
      let { data: futureListingsData, error: futureListingsError } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', currentUser.id)
        .gt('startTime', currentDate);

      if (futureListingsError) {
        console.error('Error fetching future listings:', futureListingsError.message);
      } else {
        setFutureListings(futureListingsData);
      }

      // Fetch past listings separately
      let { data: pastListingsData, error: pastListingsError } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', currentUser.id)
        .lt('startTime', currentDate);
      console.log(pastListingsData)
      if (pastListingsError) {
        console.error('Error fetching past listings:', pastListingsError.message);
      } else {
        setPastListings(pastListingsData);
      }
    };

    fetchUserDataAndListings();
  }, [currentUser]);

  const handleListingDeleted = (listingId) => {
    setListings(listings.filter(listing => listing.id !== listingId));
    setFutureListings(futureListings.filter(listing => listing.id !== listingId));
    setPastListings(pastListings.filter(listing => listing.id !== listingId));
  };

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case 'listings':
        return <BusinessListings listings={listings} onListingDeleted={handleListingDeleted} />;
      case 'newListing':
        return <NewListingForm />;
      case 'profile':
        return <BusinessProfile />;
      case 'history':
        return <ListingHistory listings={pastListings} />;
      case 'payments':
        return <div>Payments component goes here</div>;
      default:
        return (
          <div>
            <h1>Welcome {userName}.</h1>
            <br />
            <UpcomingListings listings={futureListings} />
          </div>
        );
    }
  };

  return (
    <div className="business-dashboard">
      <div className="side-panel">
        <nav className="dashboard-navigation">
          <button className="dashboard-link" onClick={() => setSelectedComponent('dashboard')}>Dashboard</button>
          <button className="dashboard-link" onClick={() => setSelectedComponent('listings')}>Active Listings</button>
          <button className="dashboard-link" onClick={() => setSelectedComponent('history')}>History</button>
          <button className="dashboard-link" onClick={() => setSelectedComponent('newListing')}>Create New Listing</button>
          <button className="dashboard-link" onClick={() => setSelectedComponent('profile')}>Update Profile</button>
          <button className="dashboard-link" onClick={() => setSelectedComponent('payments')}>Payments</button>
        </nav>
      </div>
      <div className="dashboard-content">
        {renderSelectedComponent()}
      </div>
    </div>
  );
}

export default BusinessDashboard;
