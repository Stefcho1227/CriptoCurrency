import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Outlet, useNavigate } from 'react-router';
import { PulseLoader } from 'react-spinners';
import WaveBackground from './WaveBackground';
import styles from './css/Account.module.css';

function Account() {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setUser(currentUser);
    }, [navigate]);

    const handleReset = async () => {
        if (!user) return;
        try {
            setMessage('');
            const response = await axios.post(`http://localhost:8080/api/transactions/reset/${user.userId}`);
            setMessage(response.data);
            const updatedUser = await axios.get(`http://localhost:8080/api/users/${user.userId}`);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser.data));
            setUser(updatedUser.data);
        } catch (error) {
            setMessage(`Reset failed: ${error.response?.data?.message || error.message}`);
        }
    };

    if (!user) {
        return (
            <div className={styles.loadingContainer}>
                <PulseLoader color="#9F65FF" size={15} />
                <p className={styles.loadingText}>Redirecting to login...</p>
            </div>
        );
    }

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
                    <h1 className={styles.title}>
                        <i className="fas fa-user-circle"></i> My Account
                    </h1>

                    <div className={styles.userInfo}>
                        <div className={styles.infoItem}>
                            <i className="fas fa-user-tag"></i>
                            <span>{user.username}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <i className="fas fa-wallet"></i>
                            <span>${user.balance.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className={styles.buttonGrid}>
                        <button
                            className={styles.primaryBtn}
                            onClick={() => navigate('/buy')}
                        >
                            <i className="fas fa-coins"></i> Buy Crypto
                        </button>
                        <button
                            className={styles.primaryBtn}
                            onClick={() => navigate('/sell')}
                        >
                            <i className="fas fa-money-bill-wave"></i> Sell Crypto
                        </button>
                        <button
                            className={styles.primaryBtn}
                            onClick={handleReset}
                        >
                            <i className="fas fa-sync-alt"></i> Reset Balance
                        </button>
                        <button
                            className={styles.secondaryBtn}
                            onClick={() => navigate('/transactions')}
                        >
                            <i className="fas fa-exchange-alt"></i> Transactions
                        </button>
                        <button
                            className={styles.secondaryBtn}
                            onClick={() => navigate('/holdings')}
                        >
                            <i className="fas fa-chart-pie"></i> Holdings
                        </button>
                    </div>

                    {message && (
                        <div className={`${styles.messageBox} ${
                            message.includes('failed') ? styles.errorBg : ''
                        }`}>
                            <i className={`fas ${message.includes('failed') ? 'fa-times-circle' : 'fa-check-circle'}`}></i>
                            {message}
                        </div>
                    )}
                </div>
            </div>

            <Outlet />
        </div>
    );
}

export default Account;