import React, { useState } from 'react';
import './SearchResults.scss';

function SearchResults() {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');

    const handleSearch = (event) => {
        event.preventDefault();
        console.log(searchTerm, category, time, location);
    };

    const results = new Array(20).fill(null).map((_, index) => ({
        id: index + 1,
        title: `Service ${index + 1}`,
        description: 'This is a description of the service.',
        price: `$${(index + 10) * 5}`,
        category: ['Haircut', 'Doctors', 'Tattoos'][index % 3],
        time: `2023-04-${(10 + index).toString().padStart(2, '0')}T10:00`,
        location: ['New York', 'Los Angeles', 'Chicago'][index % 3]
    }));

    const isSearchActive = searchTerm || category || time || location;
    const filteredResults = isSearchActive ? results.filter(result => {
        return result.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
               result.category.includes(category) &&
               result.time.includes(time) &&
               result.location.includes(location);
    }) : [];

    return (
        <div className="search-results">
            <h1 className="results-title">{isSearchActive ? 'Search Results' : 'Find Last Minute Appointments'}</h1>
            <form onSubmit={handleSearch} className="search-form">
                <input type="text" placeholder="Search by name" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                <select value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="Haircut">Haircut</option>
                    <option value="Doctors">Doctors</option>
                    <option value="Tattoos">Tattoos</option>
                </select>
                <input type="date" value={time} onChange={e => setTime(e.target.value)} />
                <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
                <button type="submit">Search</button>
            </form>
            {isSearchActive ? (
                <ul className="results-list">
                    {filteredResults.length > 0 ? (
                        filteredResults.map((result) => (
                            <li key={result.id} className="result-item">
                                <h3>{result.title}</h3>
                                <p>{result.description}</p>
                                <p className="price">{result.price}</p>
                            </li>
                        ))
                    ) : (
                        <p>No results found.</p>
                    )}
                </ul>
            ) : (
                <div className="featured-results">
                    <h2 className="featured-title">Featured Services</h2>
                    <ul className="results-list">
                        {results.slice(0, 3).map((result) => (
                            <li key={result.id} className="result-item">
                                <h3>{result.title}</h3>
                                <p>{result.description}</p>
                                <p className="price">{result.price}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default SearchResults;
