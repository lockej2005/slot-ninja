import React, { useState, useEffect, useContext } from 'react';
import { supabase } from '../../supabaseClient';
import './singleListing.scss';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../App';

const SingleListing = () => {
  const [listing, setListing] = useState({});
  const [user, setUser] = useState({});
  const [isBooked, setIsBooked] = useState(false);
  const { id: listingId } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      let { data: listingData, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', listingId);

      if (error) {
        console.error('Error fetching listing:', error.message);
      } else {
        setListing(listingData);
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', listingData.user_id);

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

  const handleBooking = async () => {
    if (!customerName || !customerEmail || !customerPhone) {
      alert('Please fill in all the fields.');
      return;
    }

    const bookingData = {
      customerName,
      customerEmail,
      customerPhone,
      listingId,
      businessEmail: user.email
    };

    try {
      const response = await fetch('http://localhost:3000/confirm-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Booking confirmed:', result.message);
        setIsBooked(true);
      } else {
        console.error('Failed to confirm booking:', result.message);
      }
    } catch (error) {
      console.error('Error booking listing:', error.message);
    }
  };

  function displayAEST(timeString) {
    const aestTime = new Date(timeString);
    return aestTime.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  const mapUrl = listing.location ? `https://www.google.com/maps/embed/v1/place?key=process.env.REACT_APP_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(listing.location)}` : '';

  if (isBooked) {
    return (
      <div className="single-listing">
        <div className="thank-you-message">
          <h2>Thank you for booking!</h2>
          <p>Details have been sent to your email.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="single-listing">
      <div className="listing-details">
        <h1>{listing.title}</h1>
        <p className='description'>{listing.description}</p>
        <p>{listing.location}</p>
        <p>Category: {listing.category}</p>
        <p>🕒{displayAEST(listing.startTime)} to {displayAEST(listing.endTime)}</p>
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
        <p className='original-price'>Enter your Booking Details here</p>
        <div className="customer-inputs">
          <input
            type="text"
            placeholder="Your Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Your Phone Number"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            required
          />
        </div>
        <button onClick={handleBooking} disabled={!customerName || !customerEmail || !customerPhone}>
          Book Now
        </button>
      </div>
    </div>
  );
};

export default SingleListing;
