import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { PulseLoader } from 'react-spinners';
import WaveBackground from './WaveBackground';
import styles from './css/SellCrypto.module.css';
function safeSubstring(str) {
    if (!str) return '';
    const index = str.indexOf('/');
    return index !== -1 ? str.substring(0, index) : str;
}

// Helper function to generate pagination numbers
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

function SellCrypto() {
    const [cryptos, setCryptos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCrypto, setSelectedCrypto] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const navigate = useNavigate();

    const [currentUser] = useState(() => {
        const stored = localStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : null;
    });
    if (!currentUser) {
        alert('Please log in to sell.');
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

    // Filter cryptos based on search term (case-insensitive)
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
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const handleCryptoClick = (crypto) => {
        setSelectedCrypto(crypto);
        setShowModal(true);
        setErrorMessage('');
    };

    const handleSell = async () => {
        setErrorMessage('');
        if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
            setErrorMessage('Please enter a valid quantity');
            return;
        }
        try {
            const payload = {
                userId: currentUser.userId,
                cryptoId: selectedCrypto.id,
                quantity: Number(quantity)
            };
            const response = await fetch('http://localhost:8080/api/transactions/sell', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const errorText = await response.text();
                let humanMessage = errorText;
                try {
                    const parsedError = JSON.parse(errorText);
                    if (parsedError.message) {
                        humanMessage = parsedError.message;
                    }
                } catch (err) {
                    // Fallback to raw text if JSON parsing fails
                }
                throw new Error(humanMessage || 'Sell failed');
            }
            const updatedUserResponse = await axios.get(`http://localhost:8080/api/users/${currentUser.userId}`);
            const updatedUser = updatedUserResponse.data;
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            alert('Sell successful!');
            setShowModal(false);
            setQuantity('');
            setErrorMessage('');
        } catch (error) {
            console.error('Error during sell:', error);
            setErrorMessage(error.message);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setQuantity('');
        setErrorMessage('');
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className={styles.page}>
            {/* Particles Background */}
            <div className={styles.particles}>
                {[...Array(15)].map((_, i) => (
                    <div key={i} className={styles.particle}></div>
                ))}
            </div>

            {/* Wave Background */}
            <WaveBackground />

            {/* Glassmorphism Navbar */}
            <nav className={styles.navbar}>
                <div>
                    <div
                        className={styles.brand}
                        onClick={() => navigate('/')}
                    >
                        <span className={styles.brandGradient}>Crypto</span>Pro
                    </div>
                </div>
                <div className={styles.navRight}>
                    <button
                        className={styles.navButton}
                        onClick={() => navigate('/')}
                    >
                        <i className="fas fa-chart-line"></i> Dashboard
                    </button>
                    <button
                        className={styles.navButton}
                        onClick={() => {
                            localStorage.removeItem('currentUser');
                            navigate('/login');
                        }}
                    >
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </nav>

            <div className={styles.container}>
                <div className={styles.card}>
                    <button onClick={handleBack} className={styles.backBtn}>
                        <i className="fas fa-arrow-left"></i> Back
                    </button>
                    <h1 className={styles.title}>
                        <i className="fas fa-cash-register"></i> Sell Cryptocurrency
                    </h1>

                    {/* Enhanced Search Bar */}
                    <div className={styles.searchContainer}>
                        <div className={styles.searchInner}>
                            <i className="fas fa-search"></i>
                            <input
                                type="text"
                                placeholder="Search cryptocurrencies..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className={styles.searchInput}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className={styles.loadingContainer}>
                            <PulseLoader color="#9F65FF" size={15} />
                            <p className={styles.loadingText}>Loading Cryptocurrencies...</p>
                        </div>
                    ) : (
                        <>
                            {/* Crypto Grid */}
                            <div className={styles.cryptoGrid}>
                                {currentItems.map((crypto) => (
                                    <div
                                        key={crypto.id}
                                        onClick={() => handleCryptoClick(crypto)}
                                        className={styles.cryptoCard}
                                    >
                                        <div className={styles.cryptoHeader}>
                                            <div className={styles.cryptoIcon}>
                                                {safeSubstring(crypto.symbol)[0]}
                                            </div>
                                            <div>
                                                <h3 className={styles.cryptoName}>
                                                    {safeSubstring(crypto.name)}
                                                </h3>
                                                <p className={styles.cryptoSymbol}>
                                                    {safeSubstring(crypto.symbol)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={styles.priceContainer}>
                                            <span className={styles.priceLabel}>Current Price</span>
                                            <p className={styles.cryptoPrice}>
                                                ${crypto.currentPrice}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Modern Pagination */}
                            {totalPages > 1 && (
                                <div className={styles.pagination}>
                                    <button
                                        onClick={handlePrev}
                                        disabled={currentPage === 1}
                                        className={styles.pageArrow}
                                    >
                                        <i className="fas fa-chevron-left"></i>
                                    </button>
                                    {pageNumbers.map((page, index) =>
                                        page === '...' ? (
                                            <span key={index} className={styles.pageEllipsis}>...</span>
                                        ) : (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={
                                                    page === currentPage
                                                        ? `${styles.pageNumber} ${styles.activePage}`
                                                        : styles.pageNumber
                                                }
                                            >
                                                {page}
                                            </button>
                                        )
                                    )}
                                    <button
                                        onClick={handleNext}
                                        disabled={currentPage === totalPages}
                                        className={styles.pageArrow}
                                    >
                                        <i className="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Sell Modal */}
            {showModal && selectedCrypto && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2 className={styles.modalTitle}>
                            <i className="fas fa-money-bill-wave"></i>
                            Sell {safeSubstring(selectedCrypto.name)}
                        </h2>
                        <div className={styles.modalContent}>
                            <div className={styles.priceDisplay}>
                                ${selectedCrypto.currentPrice} per coin
                            </div>
                            {errorMessage && (
                                <div className={styles.errorMessage}>
                                    <i className="fas fa-exclamation-circle"></i> {errorMessage}
                                </div>
                            )}
                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Quantity:</label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    min="1"
                                    placeholder="Enter amount"
                                    className={styles.modalInput}
                                />
                            </div>
                            <div className={styles.totalPrice}>
                                Total: ${(quantity * selectedCrypto.currentPrice).toFixed(2) || '0.00'}
                            </div>
                            <div className={styles.modalActions}>
                                <button onClick={handleSell} className={styles.confirmBtn}>
                                    <i className="fas fa-check-circle"></i> Confirm Sale
                                </button>
                                <button onClick={handleCancel} className={styles.cancelBtn}>
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

export default SellCrypto;
