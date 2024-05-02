import React from 'react';
import './Footer.scss';
import logo from '../../logo.png'; // Replace with your logo file path
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="links-container">
        <ul className="footer-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/business/dashboard">Business Dashboard</Link></li>
          <li><Link to="/">Search Listings</Link></li>
          <li><Link to="/help">Help</Link></li>
          <li><Link to="/terms-conditions">Terms &amp; Conditions</Link></li>
          <li><Link to="/how-it-works">How it Works</Link></li>

      </ul>
        </div>  
        <div className="disclaimer-container">
          <p className="disclaimer">
            Slot Ninja is a subsidary of Intelligent Installations (ABN 12 280 598 739) and reserves the right to create, manage, promote and forward data displayed on this page on behalf of the businesses that agree to share their data with us.
          </p>
          <div className="copyright-container">
          <p>&copy; 2024 Slot Ninja. All rights reserved.</p>
        </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;