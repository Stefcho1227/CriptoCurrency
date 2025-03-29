import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from "axios";

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

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(() => {
        const stored = localStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : null;
    });
    if (!currentUser) {
        alert('Please log in to buy.');
        return;
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
        if (!currentUser) {
            alert('Please log in to buy.');
            return;
        }
        setSelectedCrypto(crypto);
        setShowModal(true);
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
        return <div>Loading cryptocurrencies...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Buy Cryptocurrency</h1>
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
                    {pageNumbers.map((page, index) => {
                        if (page === '...') {
                            return (
                                <span key={index} style={{ margin: '0 5px' }}>...</span>
                            );
                        } else {
                            return (
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
                            );
                        }
                    })}
                    <button onClick={handleNext} disabled={currentPage === totalPages}>
                        &gt;
                    </button>
                </div>
            )}

            {/* Modal Popup for Buying */}
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
                        <h2>Buy {selectedCrypto.name.substring(0, selectedCrypto.name.indexOf("/"))}</h2>
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
                            <button onClick={handleBuy} style={{ marginRight: '10px' }}>Buy</button>
                            <button onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BuyCrypto;
