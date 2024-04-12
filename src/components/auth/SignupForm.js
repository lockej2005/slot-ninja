import React, { useState } from 'react';
import { supabase } from '../../supabaseClient'; // Adjust the path as necessary
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_live_51P4eASP1v3Dm1cKPvctekur3arCo5DAO0Bdgk9cHm1V4i3MPJWnFTS94UsfF45bUUlilPdShd2TdpLNht3IZBhXI00lZTdbwPr');

function SignupForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signupError, setSignupError] = useState('');

    const handleSignup = async (event) => {
        event.preventDefault();

        const user = await supabase.auth.signUp({
            email: email,
            password: password,
        }, {
            data: {
                username: username,
            }
        });

        if (user.error) {
            console.error('Signup error:', user.error.message);
            setSignupError(user.error.message);
            return;
        }
        console.log(user)
        // User created successfully, proceed to payment
        const stripe = await stripePromise;
        const response = await fetch('http://localhost:3000/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user.data.user.id })  // Send the user ID to the backend
        });

        const session = await response.json();
        const result = await stripe.redirectToCheckout({
            sessionId: session.id
        });

        if (result.error) {
            alert(result.error.message);
        }
    };

    return (
        <div className="form-container">
            <h1 className="form-title">Sign Up</h1>
            {signupError && <p className="signup-error">{signupError}</p>}
            <form onSubmit={handleSignup} className="auth-form">
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="form-button">Sign Up</button>
            </form>
        </div>
    );
}

export default SignupForm;
