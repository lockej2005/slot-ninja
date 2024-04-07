import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import './SearchResults.scss';
import { Link } from 'react-router-dom';
import { geocodeAddress, calculateDistance } from '../../utils/helpers';

function SearchResults() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState([]);
  const [featuredResults, setFeaturedResults] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [range, setRange] = useState(10); // Default range in kilometers

  useEffect(() => {
    // Get user's location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
  
        // Reverse geocode user's location to get suburb and postcode
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=YOUR_API_KEY`
        );
        const data = await response.json();
        if (data.results.length > 0) {
          const addressComponents = data.results[0].address_components;
          const suburb = addressComponents.find((component) =>
            component.types.includes('locality')
          )?.long_name;
          const postcode = addressComponents.find((component) =>
            component.types.includes('postal_code')
          )?.long_name;
          setLocation(`${suburb} ${postcode}`);
        }
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      let query = supabase.from('listings').select('*');
  
      if (!searchTerm && selectedCategories.length === 0 && !time && !location) {
        query = query.eq('tag', 'featured').limit(3);
      } else {
        if (selectedCategories.length > 0) {
          query = query.in('category', selectedCategories);
        }
  
        if (time) {
          const selectedDate = new Date(time);
          const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
          const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);
          query = query.gte('startTime', startOfDay.toISOString()).lt('startTime', endOfDay.toISOString());
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
  
          if (!searchTerm && selectedCategories.length === 0 && !time && !location) {
            setFeaturedResults(resultsWithUserData);
          } else {
            setResults(resultsWithUserData);
          }
        }
      }
    };
  
    fetchListings();
  }, [searchTerm, selectedCategories, time, location, userLocation, range]);
  

  const handleSearch = (event) => {
    event.preventDefault();
    console.log(searchTerm, selectedCategories, time, location);
  };

  const handleCategoryClick = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
// This assumes that the time you're formatting is already in AEST.
function displayAEST(timeString) {
    const aestTime = new Date(timeString);
    return aestTime.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true });
  }
  
  const isSearchActive = searchTerm || selectedCategories.length > 0 || time || location;

  const categories = [
    'Health and Wellness',  // This can include doctor's appointments, therapy, chiropractic, etc.
    'Beauty and Personal Care',  // Encompasses services like haircuts, manicures, spa treatments, etc.
    'Home Maintenance',  // Broad category for plumbing, electrical, HVAC, etc.
    'Lawn and Garden Care',  // Landscaping, gardening, tree services, etc.
    'Cleaning Services',  // Home cleaning, window cleaning, pool maintenance, etc.
    'Pet Services',  // Veterinary appointments, grooming, pet sitting, etc.
    'Fitness and Training',  // Personal trainers, yoga classes, gym appointments, etc.
    'Automotive Services',  // Car repair, detailing, inspections, etc.
    'Legal Consultation',  // Legal advice, notary services, etc.
    'Tattoo and Piercing',  // Includes all services related to tattooing and piercings.
    'Moving and Storage',  // Encompasses moving companies, self-storage, etc.
    'Tech Support',  // IT help, device repair, software assistance, etc.
    'Educational Services',  // Tutoring, workshops, music lessons, etc.
    'Event Planning',  // Catering, party planning, event rentals, etc.
    'Financial Services',  // Tax prep, financial advising, insurance consultation, etc.
  ];
  
  
  
  return (
    <div className="search-results">
      <h1 className="results-title">{isSearchActive ? 'Search Results' : 'Find Last Minute Appointments'}</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input type="text" placeholder="Custom Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
      <div className="category-bubbles">
        {categories.map((category) => (
          <div
            key={category}
            className={`category-bubble ${selectedCategories.includes(category) ? 'selected' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </div>
        ))}
      </div>
      <div className={isSearchActive ? 'search-results-list' : 'featured-results'}>
        <h2 className="featured-title">{isSearchActive ? '' : 'Featured Services'}</h2>
        <ul className="results-list">
  {(isSearchActive ? results : featuredResults).map((result) => (
    <Link key={result.id} to={`/singleListing/${result.id}`} className="result-item-link">
      <li className="result-item">
        <h3>{result.title}</h3>
        <p className="price">
          ${result.price}
          {' '}
          <span className="discount">
            {result.original_price && result.price < result.original_price &&
              `${((1 - result.price / result.original_price) * 100).toFixed(0)}% off`}
          </span>
        </p>
        <p>
          {displayAEST(result.startTime)} to {displayAEST(result.endTime)}
        </p>
        <div className='softText'>
          <p>{result.business_name}</p>
          <p>{result.phone}</p>
          <p>{result.location}</p>
        </div>
      </li>
    </Link>
  ))}
</ul>


      </div>
    </div>
  );
}

export default SearchResults;