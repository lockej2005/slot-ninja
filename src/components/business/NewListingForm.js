import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import PlacesAutocomplete from 'react-places-autocomplete';
import './NewListingForm.scss';

const categories = [
  'Health and Wellness',
  'Beauty and Personal Care',
  'Home Maintenance',
  'Lawn and Garden Care',
  'Cleaning Services',
  'Pet Services',
  'Fitness and Training',
  'Automotive Services',
  'Legal Consultation',
  'Tattoo and Piercing',
  // Add more categories as needed
];

function NewListingForm() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const toAEST = (dateString) => {
    const date = new Date(dateString);
    const userOffset = date.getTimezoneOffset() * 60000; // User's timezone offset in milliseconds
    const aestOffset = 10 * 60 * 60 * 1000; // AEST offset in milliseconds
    return new Date(date.getTime() + userOffset + aestOffset).toISOString();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let user = await supabase.auth.getUser();
  
    // Function to convert local time to AEST and format as ISO string
    const toAEST = (dateString) => {
      const localDate = new Date(dateString);
      const utcDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
      const aestOffset = 10 * 60 * 60 * 1000; // AEST offset in milliseconds
      return new Date(utcDate.getTime() + aestOffset).toISOString();
    };
  
    const startTimeAEST = toAEST(startTime);
    const endTimeAEST = toAEST(endTime);
  
    const { data, error } = await supabase.from('listings').insert([
      {
        title,
        location,
        startTime: startTimeAEST,
        endTime: endTimeAEST,
        price,
        original_price: originalPrice,
        category,
        user_id: user.data.user.id,
        description: description,
      },
    ]);
  
    if (error) {
      console.error('Error creating listing:', error.message);
    } else {
      console.log('Listing created successfully:', data);
      navigate('/business/dashboard');
    }
  };
  

  const handleLocationSelect = (address) => {
    setLocation(address);
  };

  return (
    <div className="new-listing-container">
      <h1 className="new-listing-title">Create New Listing</h1>
      <form onSubmit={handleSubmit} className="new-listing-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <PlacesAutocomplete value={location} onChange={setLocation} onSelect={handleLocationSelect}>
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div>
                <input {...getInputProps({ placeholder: 'Search places...', className: 'location-search-input' })} />
                <div className="autocomplete-dropdown-container">
                  {loading && <div>Loading...</div>}
                  {suggestions.map((suggestion) => {
                    const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
                    return (
                      <div {...getSuggestionItemProps(suggestion, { className })}>
                        <span>{suggestion.description}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
        </div>
          <div className="form-group">
            <label htmlFor="startTime">Start Time</label>
            <input type="datetime-local" id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="endTime">End Time</label>
            <input type="datetime-local" id="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
          </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="originalPrice">Original Price</label>
            <input type="number" id="originalPrice" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} required />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Select a category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <button type="submit" className="submit-button">Create Listing</button>
      </form>
    </div>
  );
}

export default NewListingForm;