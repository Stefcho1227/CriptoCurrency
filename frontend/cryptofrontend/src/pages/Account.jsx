import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Outlet, useNavigate } from 'react-router';

function Account() {
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [cryptoMap, setCryptoMap] = useState({}); // maps cryptoId to crypto name
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setUser(currentUser);
        fetchTransactions(currentUser.userId);
    }, [navigate]);

    const fetchTransactions = async (userId) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/api/transactions/user/${userId}`);
            setTransactions(response.data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setMessage("Failed to load transactions");
        } finally {
            setLoading(false);
        }
    };

    const fetchCryptoMapping = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/cryptos');
            const data = response.data;
            const mapping = {};
            data.forEach(crypto => {
                mapping[crypto.id] = crypto.name;
            });
            setCryptoMap(mapping);
        } catch (error) {
            console.error("Error fetching crypto mapping:", error);
        }
    };

    useEffect(() => {
        fetchCryptoMapping();
    }, []);

    const handleTransaction = async (endpoint) => {
        try {
            setMessage('');
            const response = await axios.post(`http://localhost:8080/api/transactions/${endpoint}`, {
                userId: user.userId
            });
            setMessage(response.data.message);
            const updatedUser = await axios.get(`http://localhost:8080/api/users/${user.userId}`);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser.data));
            setUser(updatedUser.data);
            fetchTransactions(user.userId);
        } catch (error) {
            setMessage(`${endpoint} failed: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleReset = () => handleTransaction('reset');

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

            <div style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
                <button onClick={() => navigate('/buy')}>Buy Crypto</button>
                <button onClick={() => navigate('/sell')}>Sell Crypto</button>
                <button onClick={handleReset}>Reset Balance</button>
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

            <h2>Transaction History</h2>
            {loading ? (
                <p>Loading transactions...</p>
            ) : transactions.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {transactions.map(tx => {
                        const cryptoId = tx.crypto && tx.crypto.id ? tx.crypto.id : null;
                        const cryptoName = cryptoId && cryptoMap[cryptoId] ? cryptoMap[cryptoId] : 'N/A';
                        return (
                            <li
                                key={tx.transactionId}
                                style={{
                                    padding: '10px',
                                    margin: '10px 0',
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '15px'
                                }}
                            >
                                <div style={{ flex: '1 1 200px' }}>
                                    {new Date(tx.transactionTime).toLocaleString()}
                                </div>
                                <div style={{ flex: '1 1 100px', fontWeight: 'bold' }}>
                                    {(tx.transactionType ? tx.transactionType.toUpperCase() : "UNKNOWN")}
                                </div>
                                <div style={{ flex: '1 1 100px' }}>
                                    Amount: {tx.quantity}
                                </div>
                                <div style={{ flex: '1 1 150px' }}>
                                    Name: {cryptoName.substring(0, cryptoName.indexOf("/"))}
                                </div>
                                <div style={{ flex: '1 1 100px' }}>
                                    (${tx.transactionPrice ? tx.transactionPrice.toFixed(2) : 'N/A'})
                                </div>
                            </li>
                        );

                    })}
                </ul>
            ) : (
                <p>No transactions found</p>
            )}
        </div>
    );
}

export default Account;
