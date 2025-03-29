import React, { useState } from 'react';
import { useNavigate } from 'react-router';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords should match.");
            return;
        }
        try {
            /*const response = await fetch('/api/auth/register', { username, email, password, confirmPassword });
            localStorage.setItem('currentUser', JSON.stringify(response.data));
            navigate('/register');*/
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password, confirmPassword })
            });
            if (!response.ok) {
                const errMsg = await response.text();
                throw new Error(errMsg || 'Registration failed');
            }

            const data = await response.json();

            localStorage.setItem('currentUser', JSON.stringify(data));

            navigate('/login');
        } catch (err) {
            setError(err.response?.data || "Registration failed");
        }
    };

    return (
        <div>
            <h1>Register</h1>
            {error && <div style={{color:'red'}}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;
