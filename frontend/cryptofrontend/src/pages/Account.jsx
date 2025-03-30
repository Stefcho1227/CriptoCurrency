import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Outlet, useNavigate } from 'react-router';

function Account() {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');
    //const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch current user on mount
    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setUser(currentUser);
        // Optionally refresh user data here
    }, [navigate]);

    // Example reset function
    const handleReset = async () => {
        try {
            setMessage('');
            const response = await axios.post(`http://localhost:8080/api/transactions/reset/${user.userId}`);
            setMessage(response.data);
            const updatedUser = await axios.get(`http://localhost:8080/api/users/${user.userId}`);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser.data));
            setUser(updatedUser.data);
        } catch (error) {
            setMessage(`Reset failed: ${error.response?.data?.message || error.message}`);
        }
    };

    if (!user) return <div>Redirecting to login...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => navigate('/')} style={{ marginBottom: '20px' }}>
                Back to Dashboard
            </button>

            <h1>My Account</h1>

            <div style={{ marginBottom: '20px' }}>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Balance:</strong> ${user.balance.toFixed(2)}</p>
            </div>

            {/* Primary actions */}
            <div style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
                <button onClick={() => navigate('/buy')}>Buy Crypto</button>
                <button onClick={() => navigate('/sell')}>Sell Crypto</button>
                <button onClick={handleReset}>Reset Balance</button>
            </div>

            {/* Navigation to detail pages */}
            <div style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
                <button onClick={() => navigate('/transactions')}>Transactions</button>
                <button onClick={() => navigate('/holdings')}>Holdings</button>
            </div>

            {message && (
                <div style={{
                    padding: '10px',
                    margin: '10px 0',
                    backgroundColor: message.includes('failed') ? '#ffebee' : '#e8f5e9',
                    borderRadius: '4px'
                }}>
                    {message}
                </div>
            )}

            <Outlet />
        </div>
    );
}

export default Account;
