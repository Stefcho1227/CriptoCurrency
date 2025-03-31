import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { PulseLoader } from 'react-spinners';
import WaveBackground from './WaveBackground';
import styles from './css/Dashboard.module.css';

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
            <div className={styles.loadingContainer}>
                <PulseLoader color="#9F65FF" size={15} />
                <p className={styles.loadingText}>Fetching Crypto Data...</p>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            {/* Animated Background Particles */}
            <div className={styles.particles}>
                {[...Array(15)].map((_, i) => (
                    <div key={i} className={styles.particle}></div>
                ))}
            </div>

            {/* Wave Background */}
            <WaveBackground />

            {/* Enhanced Navbar */}
            <nav className={styles.navbar}>
                <div className={styles.navLeft}>
                    <div className={styles.brand}>
                        <span className={styles.brandGradient}>Crypto</span>Pro
                    </div>
                </div>
                <div className={styles.navRight}>
                    {currentUser ? (
                        <>
                            <button
                                onClick={handleGoToAccount}
                                className={styles.navButton}
                            >
                                <i className="fas fa-wallet"></i> Account
                            </button>
                            <button
                                onClick={handleLogout}
                                className={styles.navButton}
                            >
                                <i className="fas fa-sign-out-alt"></i> Logout
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleLogin}
                            className={styles.navButton}
                        >
                            <i className="fas fa-sign-in-alt"></i> Login
                        </button>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <div className={styles.container}>
                <div className={styles.card}>
                    <h1 className={styles.title}>
                        <i className="fas fa-coins"></i> Top Cryptocurrencies
                    </h1>

                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                <th className={styles.th}>Asset</th>
                                <th className={styles.th}>Price</th>
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
                                        className={styles.tr}
                                        onClick={() => handleCryptoClick(symbol, price)}
                                    >
                                        <td className={styles.td}>
                                            <div className={styles.cryptoBadge}>
                                                <div className={styles.cryptoIcon}>
                                                    {displaySymbol[0]}
                                                </div>
                                                {displaySymbol}
                                            </div>
                                        </td>
                                        <td className={styles.td}>
                                            <span className={styles.price}>
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
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2 className={styles.modalTitle}>
                            <i className="fas fa-shopping-cart"></i> Buy {selectedSymbol}
                        </h2>
                        <div className={styles.modalContent}>
                            <div className={styles.priceTag}>
                                ${parseFloat(selectedPrice).toLocaleString()}
                            </div>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="Enter quantity"
                                className={styles.modalInput}
                            />
                            <div className={styles.buttonGroup}>
                                <button onClick={handleBuy} className={styles.buyButton}>
                                    <i className="fas fa-check"></i> Confirm
                                </button>
                                <button onClick={handleCancel} className={styles.cancelButton}>
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

export default Dashboard;