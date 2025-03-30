import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [cryptoMap, setCryptoMap] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        navigate('/login');
        return null;
    }

    const fetchTransactions = async (userId) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/api/transactions/user/${userId}`);
            setTransactions(response.data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
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

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        fetchTransactions(currentUser.userId);
        fetchCryptoMapping();
    }, [currentUser.userId]);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Transaction History</h1>
            <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>Back</button>
            {loading ? (
                <p>Loading transactions...</p>
            ) : transactions.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {transactions.map(tx => {
                        const cryptoId = tx.crypto && tx.crypto.id ? tx.crypto.id : null;
                        const cryptoName = cryptoId && cryptoMap[cryptoId] ? cryptoMap[cryptoId] : 'N/A';
                        const displayName = cryptoName.indexOf("/") !== -1
                            ? cryptoName.substring(0, cryptoName.indexOf("/"))
                            : cryptoName;
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
                                    {tx.transactionType ? tx.transactionType.toUpperCase() : "UNKNOWN"}
                                </div>
                                <div style={{ flex: '1 1 100px' }}>
                                    Amount: {tx.quantity}
                                </div>
                                <div style={{ flex: '1 1 150px' }}>
                                    Name: {displayName}
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

export default TransactionsPage;
