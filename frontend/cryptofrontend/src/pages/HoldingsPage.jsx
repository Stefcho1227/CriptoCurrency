import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { PulseLoader } from 'react-spinners';
import WaveBackground from './WaveBackground';
import styles from './css/HoldingsPage.module.css'

function HoldingsPage() {
    const [holdings, setHoldings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const navigate = useNavigate();

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        navigate('/login');
        return null;
    }

    const fetchHoldings = async (userId) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/api/users/${userId}/holdings`);
            setHoldings(response.data);
        } catch (error) {
            console.error("Error fetching holdings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHoldings(currentUser.userId);
    }, [currentUser.userId]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedHoldings = [...holdings].sort((a, b) => {
        if (!sortConfig.key) return 0;

        const aValue = sortConfig.key === 'value'
            ? (a.quantity * (a.crypto?.currentPrice || 0))
            : a[sortConfig.key] || a.crypto?.[sortConfig.key];

        const bValue = sortConfig.key === 'value'
            ? (b.quantity * (b.crypto?.currentPrice || 0))
            : b[sortConfig.key] || b.crypto?.[sortConfig.key];

        if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const filteredHoldings = sortedHoldings.filter(holding => {
        const cryptoName = holding.crypto?.name?.toLowerCase() || '';
        const cryptoSymbol = holding.crypto?.symbol?.toLowerCase() || '';
        return cryptoName.includes(searchTerm.toLowerCase()) ||
            cryptoSymbol.includes(searchTerm.toLowerCase());
    });

    const getSortIndicator = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    const getTotalValue = () => {
        return holdings.reduce((total, holding) => {
            return total + (holding.quantity * (holding.crypto?.currentPrice || 0));
        }, 0);
    };

    return (
        <div className={styles.page}>
            {/* Animated Background Elements */}
            <div className={styles.particles}>
                {[...Array(15)].map((_, i) => (
                    <div key={i} className={styles.particle}></div>
                ))}
            </div>

            <WaveBackground />

            {/* Glassmorphism Navbar */}
            <nav className={styles.navbar}>
                <div className={styles.navLeft}>
                    <div className={styles.brand} onClick={() => navigate('/')}>
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
                        <i className="fas fa-wallet"></i> My Portfolio
                    </h1>

                    {/* Portfolio Summary */}
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryItem}>
                            <div className={styles.summaryLabel}>Total Holdings</div>
                            <div className={styles.summaryValue}>{holdings.length}</div>
                        </div>
                        <div className={styles.summaryItem}>
                            <div className={styles.summaryLabel}>Total Value</div>
                            <div className={styles.summaryValue}>
                                ${getTotalValue().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className={styles.searchContainer}>
                        <div className={styles.searchInner}>
                            <i className="fas fa-search"></i>
                            <input
                                type="text"
                                placeholder="Search holdings..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className={styles.loadingContainer}>
                            <PulseLoader color="#9F65FF" size={15} />
                            <p className={styles.loadingText}>Loading your portfolio...</p>
                        </div>
                    ) : filteredHoldings.length > 0 ? (
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                <tr>
                                    <th className={styles.th} onClick={() => handleSort('name')}>
                                        Crypto {getSortIndicator('name')}
                                    </th>
                                    <th className={styles.th} onClick={() => handleSort('symbol')}>
                                        Symbol {getSortIndicator('symbol')}
                                    </th>
                                    <th className={styles.th} onClick={() => handleSort('quantity')}>
                                        Amount {getSortIndicator('quantity')}
                                    </th>
                                    <th className={styles.th} onClick={() => handleSort('currentPrice')}>
                                        Price {getSortIndicator('currentPrice')}
                                    </th>
                                    <th className={styles.th} onClick={() => handleSort('value')}>
                                        Value {getSortIndicator('value')}
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredHoldings.map(holding => {
                                    const cryptoName = holding.crypto?.name || 'N/A';
                                    const displayName = cryptoName.includes('/')
                                        ? cryptoName.substring(0, cryptoName.indexOf('/'))
                                        : cryptoName;
                                    const currentPrice = holding.crypto?.currentPrice || 0;
                                    const value = holding.quantity * currentPrice;

                                    return (
                                        <tr key={holding.id} className={styles.tr}>
                                            <td className={styles.td}>
                                                <div className={styles.cryptoCell}>
                                                    <div className={styles.cryptoIcon}>
                                                        {displayName[0]}
                                                    </div>
                                                    {displayName}
                                                </div>
                                            </td>
                                            <td className={styles.td}>
                                                {holding.crypto?.symbol || 'N/A'}
                                            </td>
                                            <td className={styles.td}>
                                                {holding.quantity.toLocaleString(undefined, { maximumFractionDigits: 8 })}
                                            </td>
                                            <td className={styles.td}>
                                                ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className={styles.td}>
                                                <div className={styles.valueCell}>
                                                    ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    <div className={styles.valueChange}>
                                                        {/* Placeholder for potential 24h change */}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <i className="fas fa-coins" className={styles.emptyIcon}></i>
                            <p className={styles.emptyText}>No holdings found</p>
                            <button
                                className={styles.browseButton}
                                onClick={() => navigate('/buy')}
                            >
                                <i className="fas fa-shopping-cart"></i> Buy Cryptocurrency
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HoldingsPage;