import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../App';  // Ensure this path points to where AuthContext is defined
import { supabase } from '../../supabaseClient';  // Adjust the path as necessary
import './Header.scss';
import logo from '../../logo.png'; // Adjust this path to where your logo is stored

function Header() {
  const { currentUser, setCurrentUser } = useContext(AuthContext);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setCurrentUser(null);  // This will now work correctly
    } else {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <header className="app-header">
      <h1 className="header-title">
        {/* Replace text with logo image */}
        <Link to="/" className="header-link">
          <img src={logo} alt="Booking Platform Logo" />
        </Link>
      </h1>
      <nav className="header-nav">
        {currentUser ? (
          <button onClick={handleLogout} className="nav-link">Logout</button>
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
