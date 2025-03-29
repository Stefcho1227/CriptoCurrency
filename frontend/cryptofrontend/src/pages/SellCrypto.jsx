import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from "axios";

// Optional helper for trimming "/..." from crypto name
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

function SellCrypto() {
    const [cryptos, setCryptos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCrypto, setSelectedCrypto] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const navigate = useNavigate();

    const [currentUser] = useState(() => {
        const stored = localStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : null;
    });

    if (!currentUser) {
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

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        fetchCryptos();
    }, []);

    const handleCryptoClick = (crypto) => {
        setSelectedCrypto(crypto);
        setShowModal(true);
        setErrorMessage(''); // Clear any old errors
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
                cryptoId: selectedCrypto.id, // numeric ID
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
                    // eslint-disable-next-line no-unused-vars
                } catch (err) {
                    // If parsing fails, fallback to raw text
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

    // Cancel the modal
    const handleCancel = () => {
        setShowModal(false);
        setQuantity('');
        setErrorMessage('');
    };

    const handleBack = () => {
        navigate(-1);
    };

    // Pagination
    const totalPages = Math.ceil(cryptos.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = cryptos.slice(indexOfFirstItem, indexOfLastItem);
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

    if (loading) {
        return <div>Loading cryptocurrency data...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Sell Cryptocurrency</h1>
            <button onClick={handleBack} style={{ marginBottom: '20px' }}>Back</button>

            {/* Grid display: 6 items per row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '20px'
            }}>
                {currentItems.map((crypto) => (
                    <div
                        key={crypto.id}
                        onClick={() => handleCryptoClick(crypto)}
                        style={{
                            border: '1px solid #ccc',
                            padding: '10px',
                            cursor: 'pointer',
                            textAlign: 'center'
                        }}
                    >
                        <h3>{safeSubstring(crypto.name)}</h3>
                        <p>Symbol: {safeSubstring(crypto.symbol)}</p>
                        <p>Price: ${crypto.currentPrice}</p>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div style={{ marginTop: '20px' }}>
                    <button onClick={handlePrev} disabled={currentPage === 1} style={{ marginRight: '5px' }}>
                        &lt;
                    </button>
                    {pageNumbers.map((page, index) => (
                        page === '...' ? (
                            <span key={index} style={{ margin: '0 5px' }}>...</span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                style={{
                                    marginRight: '5px',
                                    backgroundColor: currentPage === page ? '#ddd' : '#fff'
                                }}
                            >
                                {page}
                            </button>
                        )
                    ))}
                    <button onClick={handleNext} disabled={currentPage === totalPages}>
                        &gt;
                    </button>
                </div>
            )}

            {/* Sell Modal */}
            {showModal && selectedCrypto && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '5px',
                        width: '300px'
                    }}>
                        <h2>Sell {safeSubstring(selectedCrypto.name)}</h2>
                        <p>Price: ${selectedCrypto.currentPrice}</p>

                        {/* If there's an error, display it in normal text (no background) */}
                        {errorMessage && (
                            <div style={{
                                color: '#c62828',
                                marginBottom: '10px'
                            }}>
                                {errorMessage}
                            </div>
                        )}

                        <div style={{ marginBottom: '10px' }}>
                            <label>Quantity: </label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                min="1"
                            />
                        </div>
                        <div>
                            <button onClick={handleSell} style={{ marginRight: '10px' }}>
                                Sell
                            </button>
                            <button onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SellCrypto;
