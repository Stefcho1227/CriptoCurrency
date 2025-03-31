import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { PulseLoader } from 'react-spinners';
import WaveBackground from './WaveBackground';
import styles from './css/Register.module.css';
function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password, confirmPassword })
            });

            if (!response.ok) {
                const errMsg = await response.text();
                throw new Error(errMsg || 'Registration failed');
            }

            const data = await response.json();
            localStorage.setItem('currentUser', JSON.stringify(data));
            navigate('/login');
        } catch (err) {
            setError(err.message || "Registration failed. Please try again.");
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
                            <i className="fas fa-user-plus"></i> Create Account
                        </h1>
                        <p className={styles.subtitle}>Join the CryptoPro community</p>
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
                                <i className="fas fa-envelope"></i> Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className={styles.input}
                                placeholder="Enter your email"
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
                                placeholder="Create a password"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <i className="fas fa-lock"></i> Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className={styles.input}
                                placeholder="Confirm your password"
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
                                    <i className="fas fa-user-plus"></i> Register
                                </>
                            )}
                        </button>
                    </form>

                    <div className={styles.footer}>
                        <p className={styles.loginText}>
                            Already have an account?{' '}
                            <span
                                className={styles.loginLink}
                                onClick={() => navigate('/login')}
                            >
                                Sign in
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
