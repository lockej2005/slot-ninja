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
    return dateTime.toLocaleString('en-AU', {
      timeZone: 'Australia/Sydney', // Set to Sydney time zone
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
              <h4>Customer Details</h4>
              {/* Check if all customer details are empty and display a message if true */}
              {(!listing.customer_name && !listing.customer_email && !listing.customer_phone) ? (
                <p>No customer has booked yet</p>
              ) : (
                <>
                  <p className="customer-name">{listing.customer_name || 'Name not available'}</p>
                  <p className="customer-email">{listing.customer_email || 'Email not available'}</p>
                  <p className="customer-phone">{listing.customer_phone || 'Phone not available'}</p>
                </>
              )}
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