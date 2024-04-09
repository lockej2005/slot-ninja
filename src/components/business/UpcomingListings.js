// UpcomingListings.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import './UpcomingListings.scss';

function UpcomingListings({ listings, onListingDeleted }) {
  const [users, setUsers] = useState({});
  function displayAEST(timeString) {
    const aestTime = new Date(timeString);
    return aestTime.toLocaleString('en-AU', {
      weekday: 'long', // Display the day of the week
      year: 'numeric', // Display the year
      month: 'long', // Display the month
      day: '2-digit', // Display the day of the month
      hour: '2-digit', // Display the hour
      minute: '2-digit', // Display the minute
      second: '2-digit', // Optionally, display the second
      hour12: true, // Use 12-hour time
    });
  }
  
  useEffect(() => {
    const fetchUsers = async () => {
      const userIds = [...new Set(listings.map(listing => listing.user_id))];
      const { data: usersData, error } = await supabase
        .from('users')
        .select('id, name, phone')
        .in('id', userIds);

      if (error) {
        console.error('Error fetching users:', error.message);
      } else {
        const usersMap = usersData.reduce((map, user) => {
          map[user.id] = user;
          return map;
        }, {});
        setUsers(usersMap);
      }
    };

    fetchUsers();
  }, [listings]);

  const handleDelete = async (listingId) => {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId);

      if (error) {
        console.error('Error deleting listing:', error.message);
      } else {
        onListingDeleted(listingId);
      }
    } catch (error) {
      console.error('Error deleting listing:', error.message);
    }
  };

  return (
    <div className="upcoming-listings-container">
    <h2>Upcoming Appointments</h2>
      {listings.length > 0 ? (
        listings.map((listing) => (
          <div key={listing.id} className="upcoming-listing">
            <div className="listing-details">
              <div className='listRow'>
              <h3 className="listing-title">{listing.title}</h3>
              <p className="listing-description">{listing.description} Location: {listing.location} <span style={{ fontWeight: "800"}}>{displayAEST(listing.startTime)}</span></p>
              <p className="listing-price">${listing.price}</p>
              <p className="listing-location"></p>
              <p className="listing-time"></p>
              </div>
            </div>
            <div className="customer-info">
              <div className="user-info">
                <p className="user-name">Name: {users[listing.user_id]?.name}</p>
                <p className="user-phone">Phone: {users[listing.user_id]?.phone}</p>
              </div>
              <div className="listing-actions">
                <button className="action-button edit">Edit</button>
                <button className="action-button delete" onClick={() => handleDelete(listing.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>You have no upcoming appointments.</p>
      )}
    </div>
  );
}

export default UpcomingListings;