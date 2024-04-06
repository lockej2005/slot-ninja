import React, { useState } from 'react';
import './AuthForm.scss'; // Shared CSS file for both forms
import { supabase } from '../../supabaseClient'; // Adjust the path as necessary

function SignupForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signupError, setSignupError] = useState(''); // To display any signup errors

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { error } = await supabase.auth.signUp({
            email: email,
            password: password,
        }, {
            data: {
                username: username, // Optional: capture additional data during signup
            }
        });

        if (error) {
            console.error('Signup error', error.message);
            setSignupError(error.message);
        } else {
            console.log('Signup successful! Verification email sent.');
            // Redirect or perform additional actions on successful signup
        }
    };

    return (
        <div className="form-container">
            <h1 className="form-title">Sign Up</h1>
            {signupError && <p className="signup-error">{signupError}</p>}
            <form onSubmit={handleSubmit} className="auth-form">
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
