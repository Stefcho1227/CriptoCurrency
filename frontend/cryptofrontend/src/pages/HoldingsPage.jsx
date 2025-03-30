import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { PulseLoader } from 'react-spinners';
import WaveBackground from './WaveBackground';

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
                    <button onClick={handleBack} style={styles.backBtn}>
                        <i className="fas fa-arrow-left"></i> Back
                    </button>
                    <h1 style={styles.title}>
                        <i className="fas fa-wallet"></i> My Portfolio
                    </h1>

                    {/* Portfolio Summary */}
                    <div style={styles.summaryCard}>
                        <div style={styles.summaryItem}>
                            <div style={styles.summaryLabel}>Total Holdings</div>
                            <div style={styles.summaryValue}>{holdings.length}</div>
                        </div>
                        <div style={styles.summaryItem}>
                            <div style={styles.summaryLabel}>Total Value</div>
                            <div style={styles.summaryValue}>
                                ${getTotalValue().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div style={styles.searchContainer}>
                        <div style={styles.searchInner}>
                            <i className="fas fa-search"></i>
                            <input
                                type="text"
                                placeholder="Search holdings..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={styles.searchInput}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div style={styles.loadingContainer}>
                            <PulseLoader color="#9F65FF" size={15} />
                            <p style={styles.loadingText}>Loading your portfolio...</p>
                        </div>
                    ) : filteredHoldings.length > 0 ? (
                        <div style={styles.tableContainer}>
                            <table style={styles.table}>
                                <thead>
                                <tr>
                                    <th style={styles.th} onClick={() => handleSort('name')}>
                                        Crypto {getSortIndicator('name')}
                                    </th>
                                    <th style={styles.th} onClick={() => handleSort('symbol')}>
                                        Symbol {getSortIndicator('symbol')}
                                    </th>
                                    <th style={styles.th} onClick={() => handleSort('quantity')}>
                                        Amount {getSortIndicator('quantity')}
                                    </th>
                                    <th style={styles.th} onClick={() => handleSort('currentPrice')}>
                                        Price {getSortIndicator('currentPrice')}
                                    </th>
                                    <th style={styles.th} onClick={() => handleSort('value')}>
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
                                        <tr key={holding.id} style={styles.tr}>
                                            <td style={styles.td}>
                                                <div style={styles.cryptoCell}>
                                                    <div style={styles.cryptoIcon}>
                                                        {displayName[0]}
                                                    </div>
                                                    {displayName}
                                                </div>
                                            </td>
                                            <td style={styles.td}>
                                                {holding.crypto?.symbol || 'N/A'}
                                            </td>
                                            <td style={styles.td}>
                                                {holding.quantity.toLocaleString(undefined, { maximumFractionDigits: 8 })}
                                            </td>
                                            <td style={styles.td}>
                                                ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td style={styles.td}>
                                                <div style={styles.valueCell}>
                                                    ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    <div style={styles.valueChange}>
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
                        <div style={styles.emptyState}>
                            <i className="fas fa-coins" style={styles.emptyIcon}></i>
                            <p style={styles.emptyText}>No holdings found</p>
                            <button
                                style={styles.browseButton}
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
    summaryCard: {
        display: 'flex',
        justifyContent: 'space-around',
        background: 'rgba(159,101,255,0.1)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem',
        border: '1px solid rgba(255,255,255,0.1)',
    },
    summaryItem: {
        textAlign: 'center',
    },
    summaryLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: '0.9rem',
        marginBottom: '0.5rem',
    },
    summaryValue: {
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#9F65FF',
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
    tableContainer: {
        overflowX: 'auto',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.1)',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '800px',
    },
    th: {
        padding: '1.2rem',
        background: 'rgba(159,101,255,0.1)',
        textAlign: 'left',
        fontWeight: '600',
        fontSize: '0.9rem',
        color: 'rgba(255,255,255,0.9)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
            background: 'rgba(159,101,255,0.2)',
        }
    },
    tr: {
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        transition: 'all 0.2s ease',
        '&:hover': {
            background: 'rgba(255,255,255,0.03)',
        }
    },
    td: {
        padding: '1.2rem',
        fontSize: '0.95rem',
        color: 'rgba(255,255,255,0.8)',
    },
    cryptoCell: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    cryptoIcon: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'linear-gradient(45deg, #7D49FF, #9F65FF)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
    },
    valueCell: {
        display: 'flex',
        flexDirection: 'column',
    },
    valueChange: {
        fontSize: '0.8rem',
        color: '#4CAF50', // Would change to red if negative
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
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        textAlign: 'center',
    },
    emptyIcon: {
        fontSize: '3rem',
        color: 'rgba(255,255,255,0.2)',
        marginBottom: '1.5rem',
    },
    emptyText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: '1.2rem',
        marginBottom: '2rem',
    },
    browseButton: {
        background: 'linear-gradient(45deg, #7D49FF, #9F65FF)',
        border: 'none',
        borderRadius: '12px',
        padding: '1rem 2rem',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'transform 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        '&:hover': {
            transform: 'translateY(-2px)',
        }
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

export default HoldingsPage;