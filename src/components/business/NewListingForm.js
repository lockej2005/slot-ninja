import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './NewListingForm.scss';

function NewListingForm() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const percentageDifference = ((originalPrice - price) / originalPrice) * 100;
    let user = await supabase.auth.getUser()
    console.log((await supabase.auth.getUser()))
    // Assuming you have a listings table and a user relationship
    const { data, error } = await supabase.from('listings').insert([
      {
        title,
        location,
        time,
        price,
        original_price: originalPrice,
        user_id: user.data.user.id, // Adjust if your user reference is named differently
      },
    ]);

    if (error) {
      console.error('Error creating listing:', error.message);
    } else {
      console.log('Listing created successfully:', data);
      navigate('/business/dashboard'); // Adjust if you want to navigate somewhere else
    }
  };

  return (
    <form onSubmit={handleSubmit} className="listing-form">
      <h1>Create New Listing</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />
      <input
        type="datetime-local"
        placeholder="Time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Original Price"
        value={originalPrice}
        onChange={(e) => setOriginalPrice(e.target.value)}
        required
      />
      <button type="submit">Create Listing</button>
    </form>
  );
}

export default NewListingForm;
