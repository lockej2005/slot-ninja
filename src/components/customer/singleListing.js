// singleListing.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import './singleListing.scss';
import { useParams } from 'react-router-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const SingleListing = () => {
  const [listing, setListing] = useState({});
  const [user, setUser] = useState({});
  const [selectedTime, setSelectedTime] = useState(null);
  const { id: listingId } = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      let { data: listingData, error: listingError } = await supabase
        .from('listings')
        .select('*')
        .eq('id', listingId)
        .single();

      if (listingError) {
        console.error('Error fetching listing:', listingError.message);
      } else {
        setListing(listingData);

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', listingData.user_id)
          .single();

        if (userError) {
          console.error('Error fetching user:', userError.message);
        } else {
          setUser(userData);
        }
      }
    };

    if (listingId) {
      fetchListing();
    }
  }, [listingId]);

  const discountPercentage = listing.original_price && listing.price
    ? (((listing.original_price - listing.price) / listing.original_price) * 100).toFixed(2)
    : 0;

  const getTimeSlots = () => {
    const startTime = new Date(listing.start_time);
    const endTime = new Date(listing.end_time);
    const timeSlots = [];

    while (startTime < endTime) {
      timeSlots.push(new Date(startTime));
      startTime.setMinutes(startTime.getMinutes() + 30);
    }

    return timeSlots;
  };

  function displayAEST(timeString) {
    const aestTime = new Date(timeString);
    return aestTime.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  const handleBooking = () => {
    if (selectedTime) {
      // Implement your booking logic here
      console.log('Booking time:', selectedTime);
    }
  };
  const mapUrl = listing.location
    ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyDyOq0aaiK74kyH68XE_7VKp7GeJbMc90w&q=${encodeURIComponent(listing.location)}`
    : '';
  return (
    <div className="single-listing">
      <div className="listing-details">
        <h1>{listing.title}</h1>
        <p className='description'>{listing.description}</p>
        <p>{listing.location}</p>
        <p>Category: {listing.category}</p>
        <p>
        🕒{displayAEST(listing.startTime)} to {displayAEST(listing.endTime)}
        </p>
        <div className="business-info">
          <h3>Business Information</h3>
          <p>{user.business_name}</p>
          <p>{user.phone}</p>
          <p>{user.email}</p>
          <p>{user.description}</p>
        </div>
      </div>

      <div className="booking-section">
      <div className="map-container">
        {mapUrl && (
          <iframe
            title="Location Map"
            src={mapUrl}
            width="100%"
            height="200"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
          ></iframe>
        )}
      </div>
      <p className="price">Price: ${listing.price}</p>
      {listing.original_price && (
          <p className="original-price">
            Original Price: ${listing.original_price} ({discountPercentage}% off)
          </p>
        )}

        <button onClick={handleBooking} >
          Book Now
        </button>
      </div>

    </div>
  );
};

export default SingleListing;