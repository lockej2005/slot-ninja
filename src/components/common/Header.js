import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import { supabase } from '../../supabaseClient';
import './Header.scss';
import logo from '../../logo.png';

function Header() {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setCurrentUser(null);
      navigate('/login');  // Navigate to login page after logout
    } else {
      console.error('Logout error:', error.message);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      // Reference to the dropdown button or content
      const dropdownElement = document.querySelector(".dropdown");
      if (dropdownElement && !dropdownElement.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Clean up the event listener
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);  // Empty dependency array means this effect runs once on mount and cleanup on unmount

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="button" onClick={handleBack}>
          Back
        </button>
        <Link to="/" className="header-link">
          <img src={logo} alt="Booking Platform Logo" />
        </Link>
      </div>
      <h1 className="header-title">Slot Ninja</h1>
      <nav className="header-nav">
        {currentUser ? (
          <button onClick={handleLogout} className="button1">
            Logout
          </button>
        ) : (
          <div className="dropdown">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              Are you a business? &#8595;
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/login" className="dropdown-link">
                  Log in
                </Link>
                <Link to="/signup" className="dropdown-link">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
