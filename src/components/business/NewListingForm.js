import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import PlacesAutocomplete from 'react-places-autocomplete';
import './NewListingForm.scss';
import Loading from '../ui/Loading';
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
  const [inPerson, setInPerson] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false); // New state to track if the message is an error
  const navigate = useNavigate();

  const resetForm = () => {
    setTitle('');
    setLocation('');
    setStartTime('');
    setEndTime('');
    setPrice('');
    setOriginalPrice('');
    setCategory('');
    setDescription('');
    setInPerson(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let user = await supabase.auth.getUser();
    
    const { data, error } = await supabase.from('listings').insert([
      {
        title,
        location,
        startTime: startTime,
        endTime: endTime,
        price,
        original_price: originalPrice,
        category,
        user_id: user.data.user.id,
        description,
        inPerson,
      },
    ]);

    if (error) {
      setIsError(true);
      setMessage(`Error creating listing: ${error.message}. Please try again.`);
    } else {
      resetForm();
      setIsError(false);
      setMessage('Appointment successfully created');
      // navigate('/business/dashboard'); // Uncomment if redirection is needed after success
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
                  {loading && <Loading />}
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
        {/* <div className="form-group">
          <p>Will this booking be paid for in person?</p>
          <input
            type="checkbox"
            id="inPerson"
            checked={inPerson}
            onChange={(e) => setInPerson(e.target.checked)}
          />
        </div> */}
        <button type="submit" className="submit-button">Create Listing</button>
        {message && (
          <div className={isError ? 'error-message' : 'success-message'}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default NewListingForm;