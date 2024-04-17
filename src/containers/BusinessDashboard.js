import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import BusinessListings from '../components/business/BusinessListings';
import NewListingForm from '../components/business/NewListingForm';
import BusinessProfile from '../components/business/BusinessProfile';
import ListingHistory from '../components/business/ListingHistory';
import { supabase } from '../supabaseClient';
import './BusinessDashboard.scss';
import UpcomingListings from '../components/business/UpcomingListings';
import Loading from '../components/ui/Loading';
import { AuthContext } from '../App';

function BusinessDashboard() {
  const [userName, setUserName] = useState('');
  const [listings, setListings] = useState([]);
  const [futureListings, setFutureListings] = useState([]);
  const [pastListings, setPastListings] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [validAccount, setValidAccount] = useState(false);
  const { logout } = useContext(AuthContext);


  useEffect(() => {
    const fetchUserDataAndListings = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Error getting session:', sessionError.message);
        return;
      }

      if (!session || !session.user) {
        return;
      }

      const userId = session.user.id;

      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError.message);
        } else {
          if (userData.accountType === 'Business' && userData.paid === true) {
            console.log(userData)
            setUserName(userData.business_name);
            setValidAccount(true);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }

      const currentDate = new Date().toISOString();

      // Fetch active listings that are in the future and have a customer_id value of null
      let { data: activeListingsData, error: activeListingsError } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', userId)
        .gt('startTime', currentDate)
        .or('customer_id.is.null,customer_id.eq.""');

      if (activeListingsError) {
        console.error('Error fetching active listings:', activeListingsError.message);
      } else {
        setListings(activeListingsData);
      }

      // Fetch future listings
      let { data: futureListingsData, error: futureListingsError } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', userId)
        .gt('startTime', currentDate)
        .neq('customer_email', null)
        .neq('customer_email', '');

      if (futureListingsError) {
        console.error('Error fetching future listings:', futureListingsError.message);
      } else {
        setFutureListings(futureListingsData);
      }

      // Fetch past listings separately
      let { data: pastListingsData, error: pastListingsError } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', userId)
        .lt('startTime', currentDate);

      if (pastListingsError) {
        console.error('Error fetching past listings:', pastListingsError.message);
      } else {
        setPastListings(pastListingsData);
      }

      setLoading(false);
    };

    fetchUserDataAndListings();
  }, []);

  const handleListingDeleted = (listingId) => {
    setListings(listings.filter(listing => listing.id !== listingId));
    setFutureListings(futureListings.filter(listing => listing.id !== listingId));
    setPastListings(pastListings.filter(listing => listing.id !== listingId));
  };

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case 'listings':
        return (
          <div>
          <h1>Active Listings</h1>    
          <UpcomingListings listings={listings} onListingDeleted={handleListingDeleted} />
          </div>
        )
      case 'newListing':
        return <NewListingForm />
      case 'profile':
        return <BusinessProfile />
      case 'history':
        return (
          <div>
            <h1>History</h1>  
            <UpcomingListings listings={pastListings} />
          </div>
        )
      case 'payments':
        return <div><h1>Payments are Coming Soon...</h1></div>
      default:
        return (
          <div>
            <h1>Welcome {userName}.</h1>
            <br />
            <h4>Your upcoming bookings</h4>
            <UpcomingListings listings={futureListings} />
          </div>
        );
    }
  };

  if (loading) {
    // Show a loading indicator while fetching user data and listings
    return <Loading />;
  }

  if (!validAccount) {
    // Redirect to login page if the user doesn't have a valid account
    console.log("account invalid")
    logout();
  }

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