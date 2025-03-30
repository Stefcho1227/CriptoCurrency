import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

function HoldingsPage() {
    const [holdings, setHoldings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            navigate('/login');
            return;
        }
        fetchHoldings(currentUser.userId);
    }, [navigate]);

    const fetchHoldings = async (userId) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/api/users/${userId}/holdings`);
            setHoldings(response.data);
        } catch (error) {
            console.error("Error fetching holdings:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '20px' }}>
                <h1>My Holdings</h1>
                <p>Loading holdings...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>My Holdings</h1>
            <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
                Back
            </button>
            {holdings.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {holdings.map(holding => (
                        <li key={holding.id} style={{
                            padding: '10px',
                            margin: '10px 0',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '4px'
                        }}>
                            <div>
                                <strong>{holding.crypto.name.substring(0, holding.crypto.name.indexOf("/"))}</strong>
                            </div>
                            <div>Quantity: {holding.quantity}</div>
                            {holding.crypto.currentPrice && (
                                <div>Price: ${holding.crypto.currentPrice}</div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No holdings found</p>
            )}
        </div>
    );
}

export default HoldingsPage;
