import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import './SearchResults.scss';
import { geocodeAddress, calculateDistance } from '../../utils/helpers';

function SearchResults() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState([]);
  const [featuredResults, setFeaturedResults] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [range, setRange] = useState(10); // Default range in kilometers

  useEffect(() => {
    // Get user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      let query = supabase.from('listings').select('*');

      if (!searchTerm && !category && !time && !location) {
        query = query.eq('tag', 'featured').limit(3);
      } else {
        if (category) {
          query = query.eq('category', category);
        }
      }

      const { data: listingsData, error: listingsError } = await query;
      if (listingsError) {
        console.error('Error fetching listings:', listingsError.message);
      } else {
        // Geocode listing addresses
        const listingsWithCoordinates = await Promise.all(
          listingsData.map(async (listing) => {
            const coordinates = await geocodeAddress(listing.location);
            return { ...listing, ...coordinates };
          })
        );

        // Filter listings within the specified range
        const filteredListings = listingsWithCoordinates.filter((listing) => {
          if (userLocation) {
            const distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              listing.latitude,
              listing.longitude
            );
            return distance <= range;
          }
          return true;
        });

        const userIds = filteredListings.map((listing) => listing.user_id);
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, business_name, phone')
          .in('id', userIds);

        if (usersError) {
          console.error('Error fetching users:', usersError.message);
        } else {
          const resultsWithUserData = filteredListings.map((listing) => {
            const user = usersData.find((user) => user.id === listing.user_id);
            return { ...listing, business_name: user?.business_name, phone: user?.phone };
          });

          if (!searchTerm && !category && !time && !location) {
            setFeaturedResults(resultsWithUserData);
          } else {
            setResults(resultsWithUserData);
          }
        }
      }
    };

    fetchListings();
  }, [searchTerm, category, time, location, userLocation, range]);

  const handleSearch = (event) => {
    event.preventDefault();
    console.log(searchTerm, category, time, location);
  };

  const isSearchActive = searchTerm || category || time || location;

  return (
    <div className="search-results">
      <h1 className="results-title">{isSearchActive ? 'Search Results' : 'Featured Services'}</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input type="text" placeholder="Search by name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Haircut">Haircut</option>
          <option value="Doctors">Doctors</option>
          <option value="Tattoos">Tattoos</option>
        </select>
        <input type="date" value={time} onChange={(e) => setTime(e.target.value)} />
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <div>
          <label htmlFor="range">Range:</label>
          <select id="range" value={range} onChange={(e) => setRange(Number(e.target.value))}>
          <option value={1}>1 km</option>
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={20}>20 km</option>
          </select>
        </div>
        <button type="submit">Search</button>
      </form>
      <div className={isSearchActive ? 'search-results-list' : 'featured-results'}>
        <h2 className="featured-title">{isSearchActive ? '' : 'Featured Services'}</h2>
        <ul className="results-list">
          {(isSearchActive ? results : featuredResults).map((result) => (
            <li key={result.id} className="result-item">
              <h3>{result.title}</h3>
              <p>{result.description}</p>
              <p className="price">
                ${result.price} -{' '}
                <span className="discount">
                  {result.original_price && `${((1 - result.price / result.original_price) * 100).toFixed(0)}%`} off
                </span>
              </p>
              <br />
              <p>
                <b>{result.business_name}</b>
              </p>
              <p>{result.phone}</p>
              <p>{result.location}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SearchResults;