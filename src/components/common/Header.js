import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';  // Ensure this path points to where AuthContext is defined
import { supabase } from '../../supabaseClient';  // Adjust the path as necessary
import './Header.scss';
import logo from '../../logo.png'; // Adjust this path to where your logo is stored

function Header() {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setCurrentUser(null);  // This will now work correctly
    } else {
      console.error('Logout error:', error.message);
    }
  };
  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

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
          <button onClick={handleLogout} className="button">Logout</button>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
