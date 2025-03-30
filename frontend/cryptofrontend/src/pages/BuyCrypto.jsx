import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { PulseLoader } from 'react-spinners';
import WaveBackground from './WaveBackground';
import Account from "./Account.jsx";

function safeSubstring(str) {
    if (!str) return '';
    const index = str.indexOf('/');
    return index !== -1 ? str.substring(0, index) : str;
}

function generatePageNumbers(currentPage, totalPages) {
    const pages = [];
    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    }
    pages.push(1);
    if (currentPage > 3) {
        pages.push('...');
    }
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    if (currentPage < totalPages - 2) {
        pages.push('...');
    }
    pages.push(totalPages);
    return pages;
}

function BuyCrypto() {
    const [cryptos, setCryptos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCrypto, setSelectedCrypto] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(() => {
        const stored = localStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : null;
    });
    if (!currentUser) {
        alert('Please log in to buy.');
        return null;
    }

    const fetchCryptos = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/cryptos');
            if (!response.ok) throw new Error('Failed to fetch cryptocurrencies');
            const data = await response.json();
            setCryptos(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cryptocurrencies:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCryptos();
    }, []);

    // Filter cryptos by search term
    const filteredCryptos = cryptos.filter(crypto =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredCryptos.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCryptos.slice(indexOfFirstItem, indexOfLastItem);
    const pageNumbers = generatePageNumbers(currentPage, totalPages);

    const handlePageChange = (page) => {
        if (page === '...') return;
        setCurrentPage(page);
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handleCryptoClick = (crypto) => {
        setSelectedCrypto(crypto);
        setShowModal(true);
    };

    const handleBuy = async () => {
        if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
            alert('Please enter a valid quantity');
            return;
        }
        try {
            const payload = {
                userId: currentUser.userId,
                cryptoId: selectedCrypto.id,
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

    const handleBack = () => {
        navigate(-1);
    };

    // Basic navbar for consistency
    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/login');
    };

    return (
        <div style={styles.page}>
            {/* Animated Particles Background */}
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
                        onClick={handleLogout}
                    >
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </nav>

            <div style={styles.container}>
                <div style={styles.card}>
                    <button onClick={handleBack} style={styles.backBtn}>
                        <i className="fas fa-arrow-left"></i> Back
                    </button>
                    <h1 style={styles.title}>
                        <i className="fas fa-shopping-cart"></i> Buy Cryptocurrency
                    </h1>

                    {/* Enhanced Search Bar */}
                    <div style={styles.searchContainer}>
                        <div style={styles.searchInner}>
                            <i className="fas fa-search"></i>
                            <input
                                type="text"
                                placeholder="Search cryptocurrencies..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                style={styles.searchInput}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div style={styles.loadingContainer}>
                            <PulseLoader color="#9F65FF" size={15} />
                            <p style={styles.loadingText}>Loading Cryptocurrencies...</p>
                        </div>
                    ) : (
                        <>
                            {/* Crypto Grid */}
                            <div style={styles.cryptoGrid}>
                                {currentItems.map((crypto) => (
                                    <div
                                        key={crypto.id}
                                        onClick={() => handleCryptoClick(crypto)}
                                        style={styles.cryptoCard}
                                    >
                                        <div style={styles.cryptoHeader}>
                                            <div style={styles.cryptoIcon}>
                                                {safeSubstring(crypto.symbol)[0]}
                                            </div>
                                            <div>
                                                <h3 style={styles.cryptoName}>{safeSubstring(crypto.name)}</h3>
                                                <p style={styles.cryptoSymbol}>{safeSubstring(crypto.symbol)}</p>
                                            </div>
                                        </div>
                                        <div style={styles.priceContainer}>
                                            <span style={styles.priceLabel}>Current Price</span>
                                            <p style={styles.cryptoPrice}>${crypto.currentPrice}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Modern Pagination */}
                            {totalPages > 1 && (
                                <div style={styles.pagination}>
                                    <button
                                        onClick={handlePrev}
                                        disabled={currentPage === 1}
                                        style={styles.pageArrow}
                                    >
                                        <i className="fas fa-chevron-left"></i>
                                    </button>
                                    {pageNumbers.map((page, index) =>
                                        page === '...' ? (
                                            <span key={index} style={styles.pageEllipsis}>...</span>
                                        ) : (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                style={{
                                                    ...styles.pageNumber,
                                                    ...(currentPage === page && styles.activePage)
                                                }}
                                            >
                                                {page}
                                            </button>
                                        )
                                    )}
                                    <button
                                        onClick={handleNext}
                                        disabled={currentPage === totalPages}
                                        style={styles.pageArrow}
                                    >
                                        <i className="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Enhanced Buy Modal */}
            {showModal && selectedCrypto && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h2 style={styles.modalTitle}>
                            <i className="fas fa-coins"></i> Buy {safeSubstring(selectedCrypto.name)}
                        </h2>
                        <div style={styles.modalContent}>
                            <div style={styles.priceDisplay}>
                                ${selectedCrypto.currentPrice} per coin
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.inputLabel}>Quantity:</label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    min="1"
                                    placeholder="Enter amount"
                                    style={styles.modalInput}
                                />
                            </div>
                            <div style={styles.totalPrice}>
                                Total: ${(quantity * selectedCrypto.currentPrice).toFixed(2) || '0.00'}
                            </div>
                            <div style={styles.modalActions}>
                                <button onClick={handleBuy} style={styles.confirmBtn}>
                                    <i className="fas fa-check-circle"></i> Confirm Purchase
                                </button>
                                <button onClick={handleCancel} style={styles.cancelBtn}>
                                    <i className="fas fa-times-circle"></i> Cancel
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
    backBtn: {
        background: 'rgba(255,255,255,0.1)',
        border: 'none',
        borderRadius: '8px',
        padding: '0.8rem 1.5rem',
        color: '#fff',
        marginBottom: '2rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'all 0.3s ease',
        '&:hover': {
            background: 'rgba(255,255,255,0.2)',
        },
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
    searchContainer: {
        marginBottom: '2rem',
    },
    searchInner: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        '& i': {
            position: 'absolute',
            left: '1rem',
            color: 'rgba(255,255,255,0.6)',
        }
    },
    searchInput: {
        width: '100%',
        padding: '1rem 1rem 1rem 3rem',
        borderRadius: '12px',
        border: 'none',
        background: 'rgba(255,255,255,0.1)',
        color: '#fff',
        fontSize: '1rem',
        transition: 'all 0.3s ease',
        '&:focus': {
            outline: '2px solid #7D49FF',
        }
    },
    cryptoGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
    },
    cryptoCard: {
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '16px',
        padding: '1.5rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(255,255,255,0.1)',
        '&:hover': {
            transform: 'translateY(-5px)',
            background: 'rgba(159,101,255,0.1)',
            boxShadow: '0 8px 24px rgba(125,73,255,0.1)',
        }
    },
    cryptoHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.5rem',
    },
    cryptoIcon: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'linear-gradient(45deg, #7D49FF, #9F65FF)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.4rem',
        fontWeight: '600',
    },
    cryptoName: {
        margin: 0,
        fontSize: '1.2rem',
        fontWeight: '600',
    },
    cryptoSymbol: {
        margin: 0,
        color: 'rgba(255,255,255,0.7)',
        fontSize: '0.9rem',
    },
    priceContainer: {
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: '1rem',
    },
    priceLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: '0.9rem',
        marginBottom: '0.5rem',
    },
    cryptoPrice: {
        margin: 0,
        fontSize: '1.4rem',
        fontWeight: '600',
        color: '#9F65FF',
    },
    pagination: {
        marginTop: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
    },
    pageArrow: {
        background: 'rgba(255,255,255,0.1)',
        border: 'none',
        borderRadius: '8px',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: '#fff',
        transition: 'all 0.3s ease',
        '&:hover:not(:disabled)': {
            background: 'rgba(255,255,255,0.2)',
        },
        '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed',
        }
    },
    pageNumber: {
        background: 'rgba(255,255,255,0.1)',
        border: 'none',
        borderRadius: '8px',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: '#fff',
        transition: 'all 0.3s ease',
        '&:hover': {
            background: 'rgba(255,255,255,0.2)',
        }
    },
    activePage: {
        background: 'linear-gradient(45deg, #7D49FF, #9F65FF)',
        fontWeight: '600',
    },
    pageEllipsis: {
        color: 'rgba(255,255,255,0.6)',
        padding: '0 1rem',
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
    modalContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    priceDisplay: {
        background: 'rgba(159,101,255,0.1)',
        borderRadius: '12px',
        padding: '1rem',
        textAlign: 'center',
        fontWeight: '600',
        color: '#9F65FF',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    inputLabel: {
        fontSize: '0.9rem',
        color: 'rgba(255,255,255,0.7)',
    },
    modalInput: {
        width: '100%',
        padding: '1rem',
        borderRadius: '12px',
        border: 'none',
        background: 'rgba(255,255,255,0.1)',
        color: '#fff',
        fontSize: '1.1rem',
        '&:focus': {
            outline: '2px solid #7D49FF',
        }
    },
    totalPrice: {
        textAlign: 'center',
        fontSize: '1.2rem',
        fontWeight: '600',
        color: 'rgba(255,255,255,0.8)',
    },
    modalActions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    confirmBtn: {
        background: 'linear-gradient(45deg, #7D49FF, #9F65FF)',
        border: 'none',
        borderRadius: '12px',
        padding: '1.2rem',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'transform 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.8rem',
        '&:hover': {
            transform: 'scale(1.02)',
        }
    },
    cancelBtn: {
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '12px',
        padding: '1.2rem',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        '&:hover': {
            background: 'rgba(255,255,255,0.2)',
        }
    },
    loadingContainer: {
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
    },
    loadingText: {
        color: 'rgba(255,255,255,0.7)',
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

export default BuyCrypto;