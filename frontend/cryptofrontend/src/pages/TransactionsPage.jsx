import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { PulseLoader } from 'react-spinners';
import WaveBackground from './WaveBackground';

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

        // Just read the name directly off the transaction's crypto field
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
                        <i className="fas fa-exchange-alt"></i> Transaction History
                    </h1>

                    {/* Search and Filter Controls */}
                    <div style={styles.controls}>
                        <div style={styles.searchContainer}>
                            <div style={styles.searchInner}>
                                <i className="fas fa-search"></i>
                                <input
                                    type="text"
                                    placeholder="Search transactions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={styles.searchInput}
                                />
                            </div>
                        </div>
                        <div style={styles.filterGroup}>
                            <label style={styles.filterLabel}>Filter by:</label>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                style={styles.filterSelect}
                                className="custom-select" // Add this
                            >
                                <option value="ALL" style={styles.selectOption}>All Types</option>
                                <option value="BUY" style={styles.selectOption}>Buy</option>
                                <option value="SELL" style={styles.selectOption}>Sell</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div style={styles.loadingContainer}>
                            <PulseLoader color="#9F65FF" size={15}/>
                            <p style={styles.loadingText}>Loading transactions...</p>
                        </div>
                    ) : filteredTransactions.length > 0 ? (
                        <div style={styles.tableContainer}>
                            <table style={styles.table}>
                                <thead>
                                <tr>
                                    <th style={styles.th}>Date</th>
                                    <th style={styles.th}>Type</th>
                                    <th style={styles.th}>Crypto</th>
                                    <th style={styles.th}>Amount</th>
                                    <th style={styles.th}>Price</th>
                                    <th style={styles.th}>Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredTransactions.map(tx => {
                                    // again, read off of tx.crypto.name
                                    const cryptoName = tx.crypto?.name || 'N/A';
                                    const displayName = cryptoName.includes('/')
                                        ? cryptoName.substring(0, cryptoName.indexOf('/'))
                                        : cryptoName;
                                    const totalValue = tx.quantity * tx.transactionPrice;
                                    const isBuy = tx.transactionType === 'BUY';

                                    return (
                                        <tr key={tx.transactionId} style={styles.tr}>
                                            <td style={styles.td}>
                                                {new Date(tx.transactionTime).toLocaleString()}
                                            </td>
                                            <td style={{
                                                ...styles.td,
                                                color: isBuy ? '#4CAF50' : '#F44336',
                                                fontWeight: '600'
                                            }}>
                                                <div style={styles.typeBadge}>
                                                    {isBuy ? (
                                                        <i className="fas fa-arrow-up" style={{marginRight: '8px'}}></i>
                                                    ) : (
                                                        <i className="fas fa-arrow-down" style={{marginRight: '8px'}}></i>
                                                    )}
                                                    {tx.transactionType}
                                                </div>
                                            </td>
                                            <td style={styles.td}>
                                                <div style={styles.cryptoCell}>
                                                    <div style={styles.cryptoIcon}>
                                                        {displayName[0]}
                                                    </div>
                                                    {displayName}
                                                </div>
                                            </td>
                                            <td style={styles.td}>{tx.quantity}</td>
                                            <td style={styles.td}>
                                                ${tx.transactionPrice?.toFixed(2) || '0.00'}
                                            </td>
                                            <td style={{
                                                ...styles.td,
                                                fontWeight: '600',
                                                color: isBuy ? '#4CAF50' : '#F44336'
                                            }}>
                                                ${totalValue.toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={styles.emptyState}>
                            <i className="fas fa-exchange-alt" style={styles.emptyIcon}></i>
                            <p style={styles.emptyText}>No transactions found</p>
                            <button
                                style={styles.browseButton}
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
    controls: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    searchContainer: {
        flex: 1,
        minWidth: '300px',
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
    filterGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    filterLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: '0.9rem',
    },
    filterSelect: {
        background: 'rgba(255,255,255,0.1)',
        border: 'none',
        borderRadius: '8px',
        padding: '0.8rem 1rem',
        color: '#fff', // Ensure text is white
        fontSize: '0.9rem',
        cursor: 'pointer',
        '&:focus': {
            outline: '2px solid #7D49FF',
        },
        // Add this to style the options in the dropdown
        '& option': {
            background: '#1a1a2e', // Dark background for options
            color: '#fff', // White text for options
        }
    },
    selectOption: {
        backgroundColor: '#1a1a2e',
        color: '#fff',
        padding: '0.5rem',
    }
    ,
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
    typeBadge: {
        display: 'flex',
        alignItems: 'center',
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

export default TransactionsPage;