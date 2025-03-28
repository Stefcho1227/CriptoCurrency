import React, { useState } from 'react';
import { useNavigate } from 'react-router';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/login', { username, password });
            localStorage.setItem('currentUser', JSON.stringify(response.data));
            navigate('/account');
        } catch (err) {
            setError(err.response?.data || "Login failed");
        }
    };

    return (
        <div>
            <h1>Login</h1>
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
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
