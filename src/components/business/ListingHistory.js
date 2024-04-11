import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../App';
import { supabase } from '../../supabaseClient';
import './ListingHistory.scss';

function ListingHistory({ pastListings }) {
  const { currentUser } = useContext(AuthContext);
  const [customers, setCustomers] = useState({});

  useEffect(() => {
    if (!currentUser) return;

    const fetchCustomerDetails = async () => {
      // Get unique customer IDs from the listings
      const customerIds = [...new Set(pastListings.map(listing => listing.customer_id))];

      // Fetch details for each customer
      let { data: customerData, error } = await supabase
        .from('users')
        .select('id, name, phone')
        .in('id', customerIds);

      if (error) {
        console.error('Error fetching customer data:', error.message);
      } else {
        // Normalize customer data for easy access
        const customerMap = customerData.reduce((acc, customer) => ({
          ...acc,
          [customer.id]: customer,
        }), {});

        setCustomers(customerMap);
      }
    };

    fetchCustomerDetails();
  }, [currentUser, pastListings]);

  return (
    <div className="listing-history">
      <h2>History</h2>
      {pastListings ? (
        pastListings.map((listing) => (
          <div key={listing.id} className="past-listing">
            <div className="listing-details">
              <h3>{listing.title}</h3>
              <p>{listing.description}</p>
              <p>Location: {listing.location}</p>
              <p>Price: ${listing.price}</p>
              <p>End Time: {new Date(listing.endTime).toLocaleString()}</p>
            </div>
            <div className="customer-info">
              {customers[listing.customer_id] && (
                <div>
                  <p>Customer Name: {customers[listing.customer_id].name}</p>
                  <p>Customer Phone: {customers[listing.customer_id].phone}</p>
                </div>
              )}
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
