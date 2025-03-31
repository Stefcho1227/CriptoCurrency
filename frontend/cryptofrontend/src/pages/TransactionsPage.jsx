import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { PulseLoader } from 'react-spinners';
import WaveBackground from './WaveBackground';
import styles from './css/Transaction.module.css';

function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [cryptoMap, setCryptoMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');
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
    }, [currentUser.userId]);

    const handleBack = () => {
        navigate(-1);
    };

    const filteredTransactions = transactions.filter((tx) => {
        if (!tx) return false;

        // Access the name from the transaction's crypto field
        const cryptoName = String(tx.crypto?.name ?? '').toLowerCase();
        const transactionType = String(tx.transactionType ?? '').toLowerCase();
        const safeSearchTerm = String(searchTerm ?? '').toLowerCase();

        const matchesSearch =
            cryptoName.includes(safeSearchTerm) ||
            transactionType.includes(safeSearchTerm);

        // filterType can still be used in the same manner
        const matchesType = filterType === 'ALL' || tx.transactionType === filterType;

        return matchesSearch && matchesType;
    });

    return (
        <div className={styles.page}>
            {/* Background Particles */}
            <div className={styles.particles}>
                {[...Array(15)].map((_, i) => (
                    <div key={i} className={styles.particle}></div>
                ))}
            </div>

            <WaveBackground />

            {/* Glassmorphism Navbar */}
            <nav className={styles.navbar}>
                <div className={styles.navLeft}>
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
                        <i className="fas fa-exchange-alt"></i> Transaction History
                    </h1>

                    {/* Search and Filter Controls */}
                    <div className={styles.controls}>
                        <div className={styles.searchContainer}>
                            <div className={styles.searchInner}>
                                <i className="fas fa-search"></i>
                                <input
                                    type="text"
                                    placeholder="Search transactions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={styles.searchInput}
                                />
                            </div>
                        </div>
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>Filter by:</label>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className={styles.filterSelect}
                            >
                                <option value="ALL">All Types</option>
                                <option value="BUY">Buy</option>
                                <option value="SELL">Sell</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className={styles.loadingContainer}>
                            <PulseLoader color="#9F65FF" size={15} />
                            <p className={styles.loadingText}>Loading transactions...</p>
                        </div>
                    ) : filteredTransactions.length > 0 ? (
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                <tr className={styles.tr}>
                                    <th className={styles.th}>Date</th>
                                    <th className={styles.th}>Type</th>
                                    <th className={styles.th}>Crypto</th>
                                    <th className={styles.th}>Amount</th>
                                    <th className={styles.th}>Price</th>
                                    <th className={styles.th}>Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredTransactions.map(tx => {
                                    const cryptoName = tx.crypto?.name || 'N/A';
                                    const displayName = cryptoName.includes('/')
                                        ? cryptoName.substring(0, cryptoName.indexOf('/'))
                                        : cryptoName;
                                    const totalValue = tx.quantity * tx.transactionPrice;
                                    const isBuy = tx.transactionType === 'BUY';

                                    return (
                                        <tr key={tx.transactionId} className={styles.tr}>
                                            <td className={styles.td}>
                                                {new Date(tx.transactionTime).toLocaleString()}
                                            </td>
                                            <td
                                                className={`${styles.td} ${styles.typeBadge} ${styles.bold} ${
                                                    isBuy ? styles.buyColor : styles.sellColor
                                                }`}
                                            >
                                                {isBuy ? (
                                                    <i className="fas fa-arrow-up" style={{ marginRight: '8px' }}></i>
                                                ) : (
                                                    <i className="fas fa-arrow-down" style={{ marginRight: '8px' }}></i>
                                                )}
                                                {tx.transactionType}
                                            </td>
                                            <td className={styles.td}>
                                                <div className={styles.cryptoCell}>
                                                    <div className={styles.cryptoIcon}>
                                                        {displayName[0]}
                                                    </div>
                                                    {displayName}
                                                </div>
                                            </td>
                                            <td className={styles.td}>
                                                {tx.quantity}
                                            </td>
                                            <td className={styles.td}>
                                                ${tx.transactionPrice?.toFixed(2) || '0.00'}
                                            </td>
                                            <td
                                                className={`${styles.td} ${styles.bold} ${
                                                    isBuy ? styles.buyColor : styles.sellColor
                                                }`}
                                            >
                                                ${totalValue.toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <i className={`fas fa-exchange-alt ${styles.emptyIcon}`}></i>
                            <p className={styles.emptyText}>No transactions found</p>
                            <button
                                className={styles.browseButton}
                                onClick={() => navigate('/')}
                            >
                                <i className="fas fa-coins"></i> Browse Cryptocurrencies
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TransactionsPage;
