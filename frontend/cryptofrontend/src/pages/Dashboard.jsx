import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { PulseLoader } from 'react-spinners';
import WaveBackground from './WaveBackground';

function Dashboard() {
    const [topCryptos, setTopCryptos] = useState({});
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedSymbol, setSelectedSymbol] = useState('');
    const [selectedPrice, setSelectedPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(() => {
        const stored = localStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : null;
    });

    const fetchTop20 = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/cryptos/top20');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setTopCryptos(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching top 20 cryptos:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTop20();
        const intervalId = setInterval(fetchTop20, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const handleGoToAccount = () => {
        navigate('/account');
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                const errMsg = await response.text();
                throw new Error(errMsg || 'Logout failed');
            }
        } catch (err) {
            console.error('Error during logout:', err);
        } finally {
            localStorage.removeItem('currentUser');
            navigate('/login');
        }
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const handleCryptoClick = (symbol, price) => {
        setSelectedSymbol(symbol);
        setSelectedPrice(price);
        setShowModal(true);
    };

    const getCryptoIdBySymbol = async (symbol) => {
        const res = await fetch(`http://localhost:8080/api/cryptos/symbol?symbol=${encodeURIComponent(symbol)}`);
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || 'Failed to find crypto by symbol');
        }
        return await res.json();
    };

    const handleBuy = async () => {
        if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
            alert('Please enter a valid quantity');
            return;
        }
        if (!currentUser) {
            alert('User not found. Please log in.');
            return;
        }
        try {
            const cryptoData = await getCryptoIdBySymbol(selectedSymbol);
            const numericId = cryptoData.id;
            const payload = {
                userId: currentUser.userId,
                cryptoId: numericId,
                quantity: Number(quantity)
            };
            const response = await fetch('http://localhost:8080/api/transactions/buy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Buy failed');
            }

            const updatedUserResponse = await axios.get(`http://localhost:8080/api/users/${currentUser.userId}`);
            const updatedUser = updatedUserResponse.data;
            setCurrentUser(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));

            alert('Purchase successful!');
            setShowModal(false);
            setQuantity('');
        } catch (error) {
            console.error('Error during purchase:', error);
            alert(error.message);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setQuantity('');
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <PulseLoader color="#9F65FF" size={15} />
                <p style={styles.loadingText}>Fetching Crypto Data...</p>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            {/* Animated Background Particles */}
            <div style={styles.particles}>
                {[...Array(15)].map((_, i) => (
                    <div key={i} style={styles.particle}></div>
                ))}
            </div>

            {/* Wave Background */}
            <WaveBackground />

            {/* Enhanced Navbar */}
            <nav style={styles.navbar}>
                <div style={styles.navLeft}>
                    <div style={styles.brand}>
                        <span style={styles.brandGradient}>Crypto</span>Pro
                    </div>
                </div>
                <div style={styles.navRight}>
                    {currentUser ? (
                        <>
                            <button
                                onClick={handleGoToAccount}
                                style={styles.navButton}
                            >
                                <i className="fas fa-wallet"></i> Account
                            </button>
                            <button
                                onClick={handleLogout}
                                style={styles.navButton}
                            >
                                <i className="fas fa-sign-out-alt"></i> Logout
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleLogin}
                            style={styles.navButton}
                        >
                            <i className="fas fa-sign-in-alt"></i> Login
                        </button>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <div style={styles.container}>
                <div style={styles.card}>
                    <h1 style={styles.title}>
                        <i className="fas fa-coins"></i> Top Cryptocurrencies
                    </h1>

                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                            <tr>
                                <th style={styles.th}>Asset</th>
                                <th style={styles.th}>Price</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.entries(topCryptos).map(([symbol, price]) => {
                                const displaySymbol = symbol.includes('/')
                                    ? symbol.substring(0, symbol.indexOf('/'))
                                    : symbol;
                                return (
                                    <tr
                                        key={symbol}
                                        style={styles.tr}
                                        onClick={() => handleCryptoClick(symbol, price)}
                                    >
                                        <td style={styles.td}>
                                            <div style={styles.cryptoBadge}>
                                                <div style={styles.cryptoIcon}>
                                                    {displaySymbol[0]}
                                                </div>
                                                {displaySymbol}
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                                <span style={styles.price}>
                                                    ${parseFloat(price).toLocaleString()}
                                                </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Enhanced Buy Modal */}
            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h2 style={styles.modalTitle}>
                            <i className="fas fa-shopping-cart"></i> Buy {selectedSymbol}
                        </h2>
                        <div style={styles.modalContent}>
                            <div style={styles.priceTag}>
                                ${parseFloat(selectedPrice).toLocaleString()}
                            </div>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="Enter quantity"
                                style={styles.modalInput}
                            />
                            <div style={styles.buttonGroup}>
                                <button onClick={handleBuy} style={styles.buyButton}>
                                    <i className="fas fa-check"></i> Confirm
                                </button>
                                <button onClick={handleCancel} style={styles.cancelButton}>
                                    <i className="fas fa-times"></i> Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
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
        zIndex: 1,
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
        position: 'relative',
        zIndex: 2,
    },
    card: {
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        padding: '2rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.1)',
        position: 'relative',
        zIndex: 2,
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
    tableContainer: {
        borderRadius: '15px',
        overflow: 'hidden',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        padding: '1.2rem',
        background: 'rgba(159,101,255,0.1)',
        textAlign: 'left',
        fontWeight: '600',
        fontSize: '0.9rem',
    },
    tr: {
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        ':hover': {
            background: 'rgba(255,255,255,0.03)',
            transform: 'translateX(10px)',
        },
    },
    td: {
        padding: '1.2rem',
        fontSize: '0.95rem',
    },
    cryptoBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    cryptoIcon: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'linear-gradient(45deg, #7D49FF, #9F65FF)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
    },
    price: {
        color: '#7D49FF',
        fontWeight: '600',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(5px)',
        zIndex: 2000,
    },
    modal: {
        background: 'rgba(45,45,72,0.95)',
        borderRadius: '20px',
        padding: '2rem',
        width: '400px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    },
    modalTitle: {
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    modalInput: {
        width: '100%',
        padding: '1rem',
        borderRadius: '10px',
        border: 'none',
        background: 'rgba(255,255,255,0.1)',
        color: '#fff',
        fontSize: '1rem',
        margin: '1rem 0',
        '::placeholder': {
            color: '#rgba(255,255,255,0.5)',
        },
    },
    buttonGroup: {
        display: 'flex',
        gap: '1rem',
        marginTop: '1.5rem',
    },
    buyButton: {
        background: 'linear-gradient(45deg, #7D49FF, #9F65FF)',
        border: 'none',
        borderRadius: '10px',
        padding: '1rem 2rem',
        color: '#fff',
        cursor: 'pointer',
        flex: 1,
        fontWeight: '600',
        transition: 'transform 0.2s ease',
        ':hover': {
            transform: 'scale(1.05)',
        },
    },
    cancelButton: {
        background: 'rgba(255,255,255,0.1)',
        border: 'none',
        borderRadius: '10px',
        padding: '1rem 2rem',
        color: '#fff',
        cursor: 'pointer',
        flex: 1,
        transition: 'transform 0.2s ease',
        ':hover': {
            transform: 'scale(1.05)',
        },
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

// Add global animations
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% { transform: translateY(0) translateX(0); opacity: 0; }
        50% { transform: translateY(-100vh) translateX(100vw); opacity: 1; }
        100% { transform: translateY(0) translateX(0); opacity: 0; }
    }
    
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
`;
document.head.appendChild(style);

export default Dashboard;