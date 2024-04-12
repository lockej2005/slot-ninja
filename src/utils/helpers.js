// utils.js
import axios from 'axios';

const GOOGLE_MAPS_API_KEY = 'AIzaSyA_TweEG73UFIuTyiMhxsy5KF6eoQe2U5I';

export const geocodeAddress = async (address) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    if (response.data.status === 'OK') {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } else if (response.data.status === 'ZERO_RESULTS') {
      console.warn('Geocoding returned zero results for address:', address);
      return { latitude: null, longitude: null };
    } else {
      console.error('Geocoding failed:', response.data.status);
      return { latitude: null, longitude: null };
    }
  } catch (error) {
    console.error('Error geocoding address:', error);
    return { latitude: null, longitude: null };
  }
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};