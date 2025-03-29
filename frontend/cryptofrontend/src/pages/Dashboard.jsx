import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from "axios";

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

    if (!currentUser) {
        alert('Please log in to buy.');
        return null; // or navigate('/login')
    }

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

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        fetchTop20();
        const intervalId = setInterval(fetchTop20, 60000);
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
        return <div>Loading cryptocurrency data...</div>;
    }

    return (
        <div>
            <h1>Top 20 Cryptocurrencies</h1>
            {currentUser ? (
                <div style={{ marginBottom: '20px' }}>
                    <button onClick={handleGoToAccount} style={{ marginRight: '10px' }}>
                        Go to My Account
                    </button>
                    <button onClick={handleLogout}>Log Out</button>
                </div>
            ) : (
                <div style={{ marginBottom: '20px' }}>
                    <button onClick={handleLogin}>Login</button>
                </div>
            )}

            <table>
                <thead>
                <tr>
                    <th>Symbol</th>
                    <th>Price</th>
                </tr>
                </thead>
                <tbody>
                {Object.entries(topCryptos).map(([symbol, price]) => (
                    <tr
                        key={symbol}
                        onClick={() => handleCryptoClick(symbol, price)}
                        style={{ cursor: 'pointer' }}
                    >
                        <td>
                            {symbol.includes('/')
                                ? symbol.substring(0, symbol.indexOf('/'))
                                : symbol}
                        </td>
                        <td>{price}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Buy Modal */}
            {showModal && (
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
                        <h2>Buy {selectedSymbol}</h2>
                        <p>Price: {selectedPrice}</p>
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
                            <button onClick={handleBuy} style={{ marginRight: '10px' }}>
                                Buy
                            </button>
                            <button onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
