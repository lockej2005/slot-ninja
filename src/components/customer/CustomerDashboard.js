import React from 'react';
import './CustomerDashboard.scss';
import { Link } from 'react-router-dom';

function CustomerDashboard() {
  return (
    <div className="customer-dashboard">
      <h1 className="dashboard-title">Welcome to Your Dashboard</h1>
      <div className="dashboard-content">
        <section className="bookings-overview">
          <div className="overview-header">
            <h2>Your Upcoming Bookings</h2>
          </div>
          <div className="overview-body">
            {/* This section would dynamically list upcoming bookings */}
            <p>No upcoming bookings. Start exploring to find services!</p>
          </div>
        </section>
        <section className="explore-services">
          <div className="explore-header">
            <h2>Explore Services</h2>
          </div>
          <div className="explore-body">
            {/* Link or button to explore services */}
            <p>Discover what's around you!</p>
            <Link className="explore-button" to="/">Start Exploring</Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default CustomerDashboard;