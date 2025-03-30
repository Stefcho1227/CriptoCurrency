import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Outlet, useNavigate } from 'react-router';
import { PulseLoader } from 'react-spinners';
import WaveBackground from './WaveBackground';

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
            <div style={styles.loadingContainer}>
                <PulseLoader color="#9F65FF" size={15} />
                <p style={styles.loadingText}>Redirecting to login...</p>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            {/* Animated Background Elements */}
            <div style={styles.particles}>
                {[...Array(15)].map((_, i) => (
                    <div key={i} style={styles.particle}></div>
                ))}
            </div>

            <WaveBackground />

            {/* Glassmorphism Navbar */}
            <nav style={styles.navbar}>
                <div style={styles.navLeft}>
                    <div style={styles.brand} onClick={() => navigate('/')}>
                        <span style={styles.brandGradient}>Crypto</span>Pro
                    </div>
                </div>
                <div style={styles.navRight}>
                    <button
                        style={styles.navButton}
                        onClick={() => navigate('/')}
                    >
                        <i className="fas fa-chart-line"></i> Dashboard
                    </button>
                    <button
                        style={styles.navButton}
                        onClick={() => {
                            localStorage.removeItem('currentUser');
                            navigate('/login');
                        }}
                    >
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </nav>

            <div style={styles.container}>
                <div style={styles.card}>
                    <h1 style={styles.title}>
                        <i className="fas fa-user-circle"></i> My Account
                    </h1>

                    <div style={styles.userInfo}>
                        <div style={styles.infoItem}>
                            <i className="fas fa-user-tag"></i>
                            <span>{user.username}</span>
                        </div>
                        <div style={styles.infoItem}>
                            <i className="fas fa-wallet"></i>
                            <span>${user.balance.toFixed(2)}</span>
                        </div>
                    </div>

                    <div style={styles.buttonGrid}>
                        <button
                            style={styles.primaryBtn}
                            onClick={() => navigate('/buy')}
                        >
                            <i className="fas fa-coins"></i> Buy Crypto
                        </button>
                        <button
                            style={styles.primaryBtn}
                            onClick={() => navigate('/sell')}
                        >
                            <i className="fas fa-money-bill-wave"></i> Sell Crypto
                        </button>
                        <button
                            style={styles.primaryBtn}
                            onClick={handleReset}
                        >
                            <i className="fas fa-sync-alt"></i> Reset Balance
                        </button>
                        <button
                            style={styles.secondaryBtn}
                            onClick={() => navigate('/transactions')}
                        >
                            <i className="fas fa-exchange-alt"></i> Transactions
                        </button>
                        <button
                            style={styles.secondaryBtn}
                            onClick={() => navigate('/holdings')}
                        >
                            <i className="fas fa-chart-pie"></i> Holdings
                        </button>
                    </div>

                    {message && (
                        <div style={{
                            ...styles.messageBox,
                            background: message.includes('failed')
                                ? styles.colors.errorBg
                                : 'rgba(125, 73, 255, 0.15)'
                        }}>
                            <i className={`fas ${message.includes('failed') ? 'fa-times-circle' : 'fa-check-circle'}`}></i>
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
        errorBg: 'rgba(77, 27, 27, 0.8)',
        successBg: 'rgba(46, 125, 50, 0.8)'
    },
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: '#fff',
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden',
        position: 'relative',
    },
    particles: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
    },
    particle: {
        position: 'absolute',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        animation: 'float 20s infinite linear',
        width: '8px',
        height: '8px',
    },
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 5%',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
    },
    brand: {
        fontSize: '1.8rem',
        fontWeight: '700',
        letterSpacing: '1px',
        cursor: 'pointer',
    },
    brandGradient: {
        background: 'linear-gradient(45deg, #9F65FF, #7D49FF)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    navButton: {
        background: 'rgba(255,255,255,0.1)',
        border: 'none',
        borderRadius: '8px',
        padding: '0.8rem 1.5rem',
        color: '#fff',
        marginLeft: '1rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.9rem',
        '&:hover': {
            background: 'rgba(255,255,255,0.2)',
        },
    },
    container: {
        maxWidth: '1200px',
        margin: '4rem auto',
        padding: '0 2rem',
    },
    card: {
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        padding: '2rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.1)',
    },
    title: {
        textAlign: 'center',
        marginBottom: '2rem',
        fontSize: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
    },
    userInfo: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem',
    },
    infoItem: {
        background: 'rgba(159,101,255,0.1)',
        borderRadius: '12px',
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        fontSize: '1.1rem',
        '& i': {
            fontSize: '1.5rem',
            color: '#7D49FF',
        }
    },
    buttonGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
    },
    primaryBtn: {
        background: 'linear-gradient(45deg, #7D49FF, #9F65FF)',
        border: 'none',
        borderRadius: '12px',
        padding: '1.5rem',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'transform 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.8rem',
        fontSize: '1rem',
        '&:hover': {
            transform: 'translateY(-3px)',
        },
        '& i': {
            fontSize: '1.8rem',
        }
    },
    secondaryBtn: {
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '12px',
        padding: '1.5rem',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.8rem',
        fontSize: '1rem',
        '&:hover': {
            background: 'rgba(255,255,255,0.2)',
            transform: 'translateY(-3px)',
        },
        '& i': {
            fontSize: '1.8rem',
        }
    },
    messageBox: {
        padding: '1.2rem',
        borderRadius: '12px',
        marginTop: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        backdropFilter: 'blur(5px)',
        border: '1px solid rgba(255,255,255,0.1)',
        animation: 'slideIn 0.3s ease',
        '& i': {
            fontSize: '1.5rem',
        }
    },
    loadingContainer: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#16213e',
    },
    loadingText: {
        marginTop: '1rem',
        color: '#9F65FF',
        fontSize: '1.2rem',
    },
};

const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% { transform: translateY(0) translateX(0); opacity: 0; }
        50% { transform: translateY(-100vh) translateX(100vw); opacity: 1; }
        100% { transform: translateY(0) translateX(0); opacity: 0; }
    }
    
    @keyframes slideIn {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

export default Account;
