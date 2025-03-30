import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
// import WaveBackground from '../components/WaveBackground'; // If you have a wave

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

    useEffect(() => {
        fetchTransactions(currentUser.userId);
        fetchCryptoMapping();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser.userId]);

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div style={styles.page}>
            {/* Optionally add a wave background here */}
            {/* <WaveBackground /> */}

            {/* Navbar */}
            <nav style={styles.navbar}>
                <div style={styles.navLeft}>
                    <div style={styles.brand} onClick={() => navigate('/')}>
                        CryptoPro
                    </div>
                </div>
                <div style={styles.navRight}>
                    <button style={styles.navButton} onClick={() => navigate('/')}>
                        Dashboard
                    </button>
                    <button
                        style={styles.navButton}
                        onClick={() => {
                            localStorage.removeItem('currentUser');
                            navigate('/login');
                        }}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div style={styles.container}>
                <div style={styles.card}>
                    <button onClick={handleBack} style={styles.backBtn}>Back</button>
                    <h1 style={styles.title}>Transaction History</h1>

                    {loading ? (
                        <p style={{ color: '#fff' }}>Loading transactions...</p>
                    ) : transactions.length > 0 ? (
                        <table style={styles.table}>
                            <thead>
                            <tr>
                                <th style={styles.th}>Date</th>
                                <th style={styles.th}>Type</th>
                                <th style={styles.th}>Amount</th>
                                <th style={styles.th}>Name</th>
                                <th style={styles.th}>Price</th>
                            </tr>
                            </thead>
                            <tbody>
                            {transactions.map(tx => {
                                const cryptoId = tx.crypto && tx.crypto.id ? tx.crypto.id : null;
                                const cryptoName = cryptoId && cryptoMap[cryptoId] ? cryptoMap[cryptoId] : 'N/A';
                                const displayName = cryptoName.includes('/')
                                    ? cryptoName.substring(0, cryptoName.indexOf('/'))
                                    : cryptoName;

                                // Optional color highlight for BUY vs SELL
                                const typeColor = tx.transactionType === 'BUY' ? '#4caf50' : '#e91e63';

                                return (
                                    <tr key={tx.transactionId} style={styles.tr}>
                                        <td style={styles.td}>{new Date(tx.transactionTime).toLocaleString()}</td>
                                        <td style={{ ...styles.td, color: typeColor, fontWeight: 'bold' }}>
                                            {tx.transactionType ? tx.transactionType.toUpperCase() : 'UNKNOWN'}
                                        </td>
                                        <td style={styles.td}>{tx.quantity}</td>
                                        <td style={styles.td}>{displayName}</td>
                                        <td style={styles.td}>
                                            {tx.transactionPrice ? `$${tx.transactionPrice.toFixed(2)}` : 'N/A'}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    ) : (
                        <p style={{ color: '#fff' }}>No transactions found</p>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        position: 'relative',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2c2c2c 0%, #343434 100%)',
        color: '#E5E5E5',
        fontFamily: 'sans-serif',
        overflow: 'hidden'
    },
    navbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 30px',
        backgroundColor: '#121212',
        borderBottom: '1px solid #333',
        zIndex: 2
    },
    navLeft: {
        display: 'flex',
        alignItems: 'center'
    },
    brand: {
        fontSize: '1.3rem',
        fontWeight: 'bold',
        cursor: 'pointer'
    },
    navRight: {
        display: 'flex',
        gap: '10px'
    },
    navButton: {
        backgroundColor: 'transparent',
        color: '#E5E5E5',
        border: '1px solid #444',
        borderRadius: '4px',
        padding: '8px 12px',
        cursor: 'pointer',
        transition: 'background 0.2s ease',
        fontSize: '0.9rem'
    },
    container: {
        position: 'relative',
        maxWidth: '1000px',
        margin: '140px auto 0 auto',
        padding: '40px 20px',
        zIndex: 2
    },
    card: {
        backgroundColor: '#3a3a3a',
        borderRadius: '6px',
        padding: '30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.4)'
    },
    backBtn: {
        backgroundColor: '#2A2A2A',
        color: '#E5E5E5',
        border: '1px solid #444',
        borderRadius: '4px',
        padding: '8px 12px',
        cursor: 'pointer',
        marginBottom: '20px'
    },
    title: {
        marginBottom: '20px'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#2A2A2A',
        borderRadius: '6px',
        overflow: 'hidden'
    },
    th: {
        padding: '12px',
        borderBottom: '1px solid #444',
        textAlign: 'left',
        backgroundColor: '#2A2A2A',
        color: '#E5E5E5',
        fontWeight: 'bold'
    },
    tr: {
        borderBottom: '1px solid #444'
    },
    td: {
        padding: '12px',
        color: '#E5E5E5'
    }
};

export default TransactionsPage;
