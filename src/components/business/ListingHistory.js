// ListingHistory.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../App';
import { supabase } from '../../supabaseClient';
import './ListingHistory.scss';

function ListingHistory({ pastListings }) {
  const { currentUser } = useContext(AuthContext);
  const [customers, setCustomers] = useState({});

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      console.log(pastListings);
      const customerIds = [...new Set(pastListings.map(listing => listing.customer_id))];
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

    fetchCustomerDetails();
  }, [pastListings]);

  return (
    <div className="listings-container">
      {pastListings && pastListings.length > 0 ? (
        pastListings.map((listing) => (
          <div key={listing.id} className="listing">
            <h3 className="listing-title">{listing.title}</h3>
            <p className="listing-description">{listing.description}</p>
            <div className="listing-details">
              <p className="listing-price">${listing.price}</p>
              <p className="listing-location">Location: {listing.location}</p>
              <p className="listing-time">End Time: {new Date(listing.endTime).toLocaleString()}</p>
              <p className="listing-originalPrice">Original Price: ${listing.original_price}</p>
              <p className="listing-discount">
                Discount: {listing.original_price && `${((1 - listing.price / listing.original_price) * 100).toFixed(2)}%`}
              </p>
              <div className="customer-info">
                <p className="customer-name">Customer Name: {customers[listing.customer_id]?.name}</p>
                <p className="customer-phone">Customer Phone: {customers[listing.customer_id]?.phone}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No past listings found.</p>
      )}
    </div>
  );
}

export default ListingHistory;