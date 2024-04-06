import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthForm.scss';
import { supabase } from '../../supabaseClient';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    
    let navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        let data = await supabase.auth.signInWithPassword({
            email: username,
            password: password,
        });

        if (data.error) {
            console.error('Login error:', data.error.message);
            setLoginError(data.error.message);
            return;
        } 
        
        console.log('Login successful!');
        navigateBasedOnAccountType(data.data.user.id);
    };

    const navigateBasedOnAccountType = async (userId) => {
        const { data, error } = await supabase
            .from('users')
            .select('accountType')
            .eq('id', userId)
            .single();

        if (error || !data) {
            console.error('Error fetching account type:', error?.message);
            setLoginError('Failed to determine account type.');
        } else {
            console.log('Account type:', data.accountType);
            if (data.accountType === 'business') {
                navigate('/business/dashboard');
            } else if (data.accountType === 'customer') {
                navigate('/customer/dashboard');
            } else {
                setLoginError('Invalid or unknown account type.');
            }
        }
    };

    return (
        <div className="form-container">
            <h1 className="form-title">Login</h1>
            <form onSubmit={handleSubmit} className="auth-form">
                {loginError && <p className="login-error">{loginError}</p>}
                <div className="form-group">
                    <label htmlFor="username">Username (actually email)</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                <button type="submit" className="form-button">Login</button>
            </form>
        </div>
    );
}

export default LoginForm;
