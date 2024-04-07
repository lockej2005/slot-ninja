// BusinessListings.js
import React from 'react';
import { supabase } from '../../supabaseClient';
import './BusinessListings.scss';

function BusinessListings({ listings, onListingDeleted }) {
  const handleDelete = async (listingId) => {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId);

      if (error) {
        console.error('Error deleting listing:', error.message);
      } else {
        // Invoke the onListingDeleted callback with the deleted listing ID
        onListingDeleted(listingId);
      }
    } catch (error) {
      console.error('Error deleting listing:', error.message);
    }
  };

  return (
    <div className="listings-container">
      {listings.length > 0 ? (
        listings.map((listing) => (
          <div key={listing.id} className="listing">
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
            <div className="listing-actions">
              <button className="action-button edit">Edit</button>
              <button className="action-button delete" onClick={() => handleDelete(listing.id)}>Delete</button>
            </div>
          </div>
        ))
      ) : (
        <p>No listings found.</p>
      )}
    </div>
  );
}

export default BusinessListings;