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
            Disclaimer: The information provided on this website is for general informational purposes only. While we strive to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose. Any reliance you place on such information is therefore strictly at your own risk.
          </p>
        </div>
        <div className="copyright-container">
          <p>&copy; 2024 Slot Ninja. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;