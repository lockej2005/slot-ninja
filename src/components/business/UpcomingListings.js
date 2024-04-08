// UpcomingListings.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import './UpcomingListings.scss';

function UpcomingListings({ listings, onListingDeleted }) {
  const [users, setUsers] = useState({});

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
      {listings.length > 0 ? (
        listings.map((listing) => (
          <div key={listing.id} className="upcoming-listing">
            <div className="listing-info">
              <h3 className="listing-title">{listing.title}</h3>
              <p className="listing-description">{listing.description}</p>
              <div className="listing-details">
                <p className="listing-price">${listing.price}</p>
                <p className="listing-location">Location: {listing.location}</p>
                <p className="listing-time">Start Time: {new Date(listing.time).toLocaleString()}</p>
                <p className="listing-originalPrice">Original Price: ${listing.original_price}</p>
                <p className="listing-discount">
                  Discount: {listing.original_price && `${((1 - listing.price / listing.original_price) * 100).toFixed(2)}%`}
                </p>
              </div>
            </div>
            <div className="user-info">
              <p className="user-name">Name: {users[listing.user_id]?.name}</p>
              <p className="user-phone">Phone: {users[listing.user_id]?.phone}</p>
            </div>
            <div className="listing-actions">
              <button className="action-button edit">Edit</button>
              <button className="action-button delete" onClick={() => handleDelete(listing.id)}>Delete</button>
            </div>
          </div>
        ))
      ) : (
        <p>No upcoming listings found.</p>
      )}
    </div>
  );
}

export default UpcomingListings;