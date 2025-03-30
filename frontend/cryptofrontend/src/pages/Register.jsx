import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { PulseLoader } from 'react-spinners';
import WaveBackground from './WaveBackground';

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
        <div style={styles.page}>
            {/* Animated Background Elements */}
            <div style={styles.particles}>
                {[...Array(15)].map((_, i) => (
                    <div key={i} style={styles.particle}></div>
                ))}
            </div>

            <WaveBackground />

            <div style={styles.container}>
                <div style={styles.card}>
                    <div style={styles.header}>
                        <h1 style={styles.title}>
                            <i className="fas fa-user-plus"></i> Create Account
                        </h1>
                        <p style={styles.subtitle}>Join the CryptoPro community</p>
                    </div>

                    {error && (
                        <div style={styles.errorBox}>
                            <i className="fas fa-exclamation-circle"></i> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <i className="fas fa-user"></i> Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                style={styles.input}
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <i className="fas fa-envelope"></i> Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                style={styles.input}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <i className="fas fa-lock"></i> Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                style={styles.input}
                                placeholder="Create a password"
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <i className="fas fa-lock"></i> Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                style={styles.input}
                                placeholder="Confirm your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            style={styles.submitButton}
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

                    <div style={styles.footer}>
                        <p style={styles.loginText}>
                            Already have an account?{' '}
                            <span
                                style={styles.loginLink}
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
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '2rem',
    },
    card: {
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.1)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    title: {
        fontSize: '2rem',
        marginBottom: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
    },
    subtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: '1rem',
    },
    errorBox: {
        background: 'rgba(255, 71, 71, 0.1)',
        border: '1px solid rgba(255, 71, 71, 0.3)',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1.5rem',
        color: '#FF6347',
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontSize: '0.9rem',
        color: 'rgba(255,255,255,0.7)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    input: {
        width: '100%',
        padding: '1rem',
        borderRadius: '12px',
        border: 'none',
        background: 'rgba(255,255,255,0.1)',
        color: '#fff',
        fontSize: '1rem',
        transition: 'all 0.3s ease',
        '&:focus': {
            outline: '2px solid #7D49FF',
            background: 'rgba(255,255,255,0.15)',
        },
        '&::placeholder': {
            color: 'rgba(255,255,255,0.5)',
        }
    },
    submitButton: {
        background: 'linear-gradient(45deg, #7D49FF, #9F65FF)',
        border: 'none',
        borderRadius: '12px',
        padding: '1.2rem',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '1rem',
        transition: 'transform 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.8rem',
        marginTop: '1rem',
        '&:hover': {
            transform: 'translateY(-2px)',
        },
        '&:disabled': {
            background: 'rgba(125, 73, 255, 0.5)',
            cursor: 'not-allowed',
        }
    },
    footer: {
        marginTop: '2rem',
        textAlign: 'center',
    },
    loginText: {
        color: 'rgba(255,255,255,0.7)',
    },
    loginLink: {
        color: '#9F65FF',
        cursor: 'pointer',
        fontWeight: '600',
        '&:hover': {
            textDecoration: 'underline',
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

export default Register;