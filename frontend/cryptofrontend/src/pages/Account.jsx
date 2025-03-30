import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Outlet, useNavigate } from 'react-router';
import WaveBackground from './WaveBackground'; // <-- import the wave

function Account() {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setUser(currentUser);
    }, [navigate]);

    const handleReset = async () => {
        if (!user) return;
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

    if (!user) {
        return (
            <div style={styles.page}>
                <div style={styles.container}>
                    <p>Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            {/* The wave behind everything */}
            <WaveBackground />

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
                    <h1 style={styles.title}>My Account</h1>
                    <div style={{ marginBottom: '20px' }}>
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Balance:</strong> ${user.balance.toFixed(2)}</p>
                    </div>

                    <div style={styles.buttonGroup}>
                        <button style={styles.primaryBtn} onClick={() => navigate('/buy')}>
                            Buy Crypto
                        </button>
                        <button style={styles.primaryBtn} onClick={() => navigate('/sell')}>
                            Sell Crypto
                        </button>
                        <button style={styles.primaryBtn} onClick={handleReset}>
                            Reset Balance
                        </button>
                    </div>

                    <div style={styles.buttonGroup}>
                        <button style={styles.secondaryBtn} onClick={() => navigate('/transactions')}>
                            Transactions
                        </button>
                        <button style={styles.secondaryBtn} onClick={() => navigate('/holdings')}>
                            Holdings
                        </button>
                    </div>

                    {message && (
                        <div
                            style={{
                                ...styles.messageBox,
                                backgroundColor: message.includes('failed') ? styles.colors.errorBg : styles.colors.card
                            }}
                        >
                            {message}
                        </div>
                    )}
                </div>
            </div>

            <Outlet />
        </div>
    );
}

const styles = {
    colors: {
        backgroundStart: '#2c2c2c',
        backgroundEnd: '#343434',
        card: '#3a3a3a',
        text: '#E5E5E5',
        primary: '#8A56FF',
        secondary: '#4c4c4c',
        border: '#3e3e3e',
        errorBg: '#4D1B1B'
    },
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
        margin: '180px auto 0 auto',
        padding: '40px 20px',
        zIndex: 2 // ensure content is above wave
    },
    card: {
        position: 'relative',
        backgroundColor: '#3a3a3a',
        borderRadius: '6px',
        padding: '30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.4)'
    },
    title: {
        marginBottom: '20px'
    },
    buttonGroup: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '15px',
        marginBottom: '20px'
    },
    primaryBtn: {
        background: 'linear-gradient(135deg, #9F65FF 0%, #7D49FF 100%)',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '6px',
        padding: '10px 18px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '0.95rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    },
    secondaryBtn: {
        backgroundColor: '#2A2A2A',
        color: '#E0E0E0',
        border: '1px solid #444',
        borderRadius: '6px',
        padding: '10px 18px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '0.95rem',
        transition: 'background-color 0.2s ease, box-shadow 0.2s ease'
    },
    messageBox: {
        marginTop: '20px',
        padding: '10px',
        borderRadius: '4px'
    }
};

export default Account;
