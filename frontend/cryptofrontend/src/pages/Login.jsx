import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { PulseLoader } from 'react-spinners';
import WaveBackground from './WaveBackground';
import styles from './css/Login.module.css';
function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                const errMsg = await response.text();
                throw new Error(errMsg || 'Login failed');
            }

            const data = await response.json();
            localStorage.setItem('currentUser', JSON.stringify(data));
            navigate('/');
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
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

            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>
                            <i className="fas fa-sign-in-alt"></i> Welcome Back
                        </h1>
                        <p className={styles.subtitle}>Sign in to your CryptoPro account</p>
                    </div>

                    {error && (
                        <div className={styles.errorBox}>
                            <i className="fas fa-exclamation-circle"></i> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <i className="fas fa-user"></i> Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className={styles.input}
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <i className="fas fa-lock"></i> Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className={styles.input}
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <PulseLoader color="#fff" size={8} />
                            ) : (
                                <>
                                    <i className="fas fa-sign-in-alt"></i> Sign In
                                </>
                            )}
                        </button>
                    </form>

                    <div className={styles.footer}>
                        <p className={styles.registerText}>
                            Don't have an account?{' '}
                            <span
                                className={styles.registerLink}
                                onClick={() => navigate('/register')}
                            >
                                Create one
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
