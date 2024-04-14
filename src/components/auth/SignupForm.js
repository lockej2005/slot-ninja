import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_live_51P4eASP1v3Dm1cKPvctekur3arCo5DAO0Bdgk9cHm1V4i3MPJWnFTS94UsfF45bUUlilPdShd2TdpLNht3IZBhXI00lZTdbwPr');

function SignupForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [signupError, setSignupError] = useState('');

  const handleSignup = async (event) => {
    event.preventDefault();
  
    // Attempt to sign up the user
    const user = await supabase.auth.signUp({
      email: email,
      password: password,
    }, {
      data: {
        username: username,
        paid: false, // Set paid to false by default
      }
    });
  
    if (user.error) {
      console.error('Signup error:', user.error.message);
      setSignupError(user.error.message);
      return;
    }
  
    console.log('User signed up:', user);
  
    // Add additional user info to the users table
    const { data, error: insertError } = await supabase.from('users').insert([{
      id: user.data.user.id, // Correctly access the user ID
      business_name: businessName,
      accountType: 'Business',
      phone: phone,
      email: email
    }]);
  
    if (insertError) {
      console.error('Error adding user info:', insertError.message);
      setSignupError(insertError.message);
      return;
    }
  
    // User created successfully, proceed to payment
    const stripe = await stripePromise;
    const response = await fetch('http://localhost:3000/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: user.data.user.id }) // Correctly pass the user ID
    });
  
    const session = await response.json();
  
    if (response.ok && session.id) {
      const result = await stripe.redirectToCheckout({ sessionId: session.id });
      if (result.error) {
        alert(result.error.message);
      }
    } else {
      console.error('Failed to create checkout session:', session.error || 'No session ID returned');
      alert('Failed to initiate payment process.');
    }
  };
  

  return (
    <div className="form-container">
      <h1 className="form-title">Sign Up</h1>
      {signupError && <p className="signup-error">{signupError}</p>}
      <form onSubmit={handleSignup} className="auth-form">
        <div className="form-group">
          <label htmlFor="businessName">Business Name</label>
          <small>This is the name displayed on your Listings.</small>
          <input type="text" id="businessName" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <small>Customers will be able to see this number on your Listings.</small>
          <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <small>Your booking notifications and admin info will be sent to this email.</small>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <small>Must be at least 6 Characters.</small>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <p>Our Business plan is one flat rate of $10/Month.</p>
        <button type="submit" className="form-button">Continue to Payment</button>
      </form>
    </div>
  );
}

export default SignupForm;
