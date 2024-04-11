import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import PlacesAutocomplete from 'react-places-autocomplete';
import './EditListing.scss';

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

function EditListing() {
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
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };
  useEffect(() => {
    const fetchListing = async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        setIsError(true);
        setMessage(`Error fetching listing: ${error.message}`);
      } else {
        setTitle(data.title);
        setLocation(data.location);
        setStartTime(formatDateTime(data.startTime));
        setEndTime(formatDateTime(data.endTime));
        setPrice(data.price);
        setOriginalPrice(data.original_price);
        setCategory(data.category);
        setDescription(data.description);
        setInPerson(data.inPerson);
      }
    };

    fetchListing();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { data, error } = await supabase
      .from('listings')
      .update({
        title,
        location,
        startTime,
        endTime,
        price,
        original_price: originalPrice,
        category,
        description,
        inPerson,
      })
      .eq('id', id);

    if (error) {
      setIsError(true);
      setMessage(`Error updating listing: ${error.message}. Please try again.`);
    } else {
      setIsError(false);
      setMessage('Listing successfully updated');
        handleBack()
    }
  };

  const handleLocationSelect = (address) => {
    setLocation(address);
  };
  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    return dateTime.toISOString().slice(0, 16);
  };
  return (
    <div className="edit-listing-container">
      <button className="back-button" onClick={handleBack}>
        Back
      </button>
      <h1 className="edit-listing-title">Edit Listing</h1>

      <form onSubmit={handleSubmit} className="edit-listing-form">
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
        {/* <div className="form-group">
          <p>Will this booking be paid for in person?</p>
          <input
            type="checkbox"
            id="inPerson"
            checked={inPerson}
            onChange={(e) => setInPerson(e.target.checked)}
          />
        </div> */}
        <button type="submit" className="submit-button">Update Listing</button>
        {message && (
          <div className={isError ? 'error-message' : 'success-message'}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default EditListing;