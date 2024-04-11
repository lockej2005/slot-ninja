// UpcomingListings.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './UpcomingListings.scss';
function UpcomingListings({ listings, onListingDeleted }) {
  const [customers, setCustomers] = useState({});
  const navigate = useNavigate();

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString('en-US', {
      timeZone: 'UTC',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };
  const handleEdit = (listingId) => {
    navigate(`/business/edit-listing/${listingId}`);
  };
  useEffect(() => {
    const fetchCustomers = async () => {
      const customerIds = [...new Set(listings.map(listing => listing.customer_id))];
      const { data: customersData, error } = await supabase
        .from('users')
        .select('id, name, phone')
        .in('id', customerIds);

      if (error) {
        console.error('Error fetching customers:', error.message);
      } else {
        const customersMap = customersData.reduce((map, customer) => {
          map[customer.id] = customer;
          return map;
        }, {});
        setCustomers(customersMap);
      }
    };

    fetchCustomers();
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
                <p className="listing-description">{listing.description} Location: {listing.location} <span style={{ fontWeight: "800"}}>{formatDateTime(listing.startTime)}</span></p>
                <p className="listing-price">${listing.price}</p>
                <p className="listing-location"></p>
                <p className="listing-time"></p>
              </div>
            </div>
            <div className="customer-info">
              <div className="customer-details">
                <p className="customer-name">Name: {customers[listing.customer_id]?.name}</p>
                <p className="customer-phone">Phone: {customers[listing.customer_id]?.phone}</p>
              </div>
              <div className="listing-actions">
                <button className="action-button edit" onClick={() => handleEdit(listing.id)}>Edit</button>
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