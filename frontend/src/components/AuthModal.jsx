import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { transformAuthData, transformErrorMessage } from '../utils/dataTransformers';

const AuthModal = ({ show, activeTab, onTabSwitch, onSuccess, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('student'); // 'student' or 'provider'
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!show) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData(e.target);
      const credentials = {
        username: formData.get('username'),
        password: formData.get('password')
      };

      const transformedData = transformAuthData(credentials, true);
      const response = await ApiService.login(transformedData);
      
      if (response.user) {
        onSuccess(response.user);
        onClose();
      }
    } catch (err) {
      setError(transformErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData(e.target);
      
      // Validate passwords match
      const password = formData.get('password');
      const confirmPassword = formData.get('confirmPassword');
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      let response;
      if (userType === 'student') {
        const userData = {
          username: formData.get('username'),
          email: formData.get('email'),
          password: password,
          phone_number: formData.get('phone_number'),
          date_of_birth: formData.get('date_of_birth'),
          program: formData.get('program'),
          role: 'student'
        };
        response = await ApiService.registerStudent(userData);
      } else {
        const userData = {
          username: formData.get('username'),
          password: password,
          business_name: formData.get('business_name'),
          contact_person: formData.get('contact_person'),
          email: formData.get('email'),
          phone_number: formData.get('phone_number'),
          address: formData.get('address'),
          bank_details: formData.get('bank_details')
        };
        response = await ApiService.registerProvider(userData);
      }
      
      if (response.user) {
        onSuccess(response.user);
        onClose();
      }
    } catch (err) {
      setError(transformErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Responsive styles
  const getResponsiveStyles = () => ({
    modal: {
      display: 'flex',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.6)',
      zIndex: 1000,
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(4px)',
      padding: isMobile ? '1rem' : '2rem'
    },
    content: {
      background: '#fff',
      padding: isMobile ? '1.5rem 1rem' : '2.5rem 2rem',
      borderRadius: isMobile ? '16px' : '20px',
      maxWidth: isMobile ? '100%' : '480px',
      width: isMobile ? '100%' : '90%',
      maxHeight: isMobile ? '95vh' : '90vh',
      overflowY: 'auto',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      border: '1px solid rgba(255,255,255,0.2)',
      position: 'relative'
    },
    header: {
      textAlign: 'center',
      marginBottom: isMobile ? '1.5rem' : '2rem'
    },
    title: {
      fontSize: isMobile ? '1.5rem' : '2rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '0.5rem',
      background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    subtitle: {
      color: '#64748b',
      fontSize: isMobile ? '0.9rem' : '1rem'
    },
    tabContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: isMobile ? '1.5rem' : '2rem',
      background: '#f8fafc',
      borderRadius: '12px',
      padding: '0.25rem'
    },
    tab: {
      flex: 1,
      borderRadius: '10px',
      border: 'none',
      padding: isMobile ? '0.625rem 0.75rem' : '0.75rem 1rem',
      fontSize: isMobile ? '0.875rem' : '0.95rem',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    },
    userTypeContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: isMobile ? '1.5rem' : '2rem',
      background: '#f1f5f9',
      borderRadius: '12px',
      padding: '0.25rem'
    },
    userTypeButton: {
      flex: 1,
      borderRadius: '10px',
      border: 'none',
      padding: isMobile ? '0.625rem 0.75rem' : '0.75rem 1rem',
      fontSize: isMobile ? '0.875rem' : '0.95rem',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    },
    inputStyle: {
      width: '100%',
      padding: isMobile ? '0.75rem' : '0.875rem 1rem',
      borderRadius: '10px',
      border: '2px solid #e5e7eb',
      fontSize: isMobile ? '0.95rem' : '1rem',
      transition: 'all 0.2s ease',
      background: '#f9fafb',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
      color: '#1f2937'
    },
    labelStyle: {
      display: 'block',
      marginBottom: '0.5rem',
      color: '#374151',
      fontWeight: '500',
      fontSize: isMobile ? '0.875rem' : '0.95rem'
    },
    button: {
      width: '100%',
      padding: isMobile ? '0.75rem' : '0.875rem 1rem',
      borderRadius: '10px',
      border: 'none',
      fontSize: isMobile ? '0.95rem' : '1rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      marginBottom: '1rem'
    },
    formContainer: {
      marginBottom: isMobile ? '1.5rem' : '2rem'
    },
    fieldContainer: {
      marginBottom: '1rem'
    }
  });

  const styles = getResponsiveStyles();

  const handleInputFocus = (e, color = '#2563eb') => {
    e.target.style.borderColor = color;
    e.target.style.background = '#fff';
    e.target.style.boxShadow = `0 0 0 3px ${color === '#2563eb' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(5, 150, 105, 0.1)'}`;
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = '#e5e7eb';
    e.target.style.background = '#f9fafb';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div className="login-modal" style={styles.modal}>
      <div className="login-modal-content" style={styles.content}>
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          style={{
            position: 'absolute',
            top: isMobile ? '0.75rem' : '1rem',
            right: isMobile ? '0.75rem' : '1rem',
            background: 'transparent',
            border: 'none',
            fontSize: isMobile ? '1.25rem' : '1.5rem',
            color: '#64748b',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            padding: '0.5rem',
            borderRadius: '50%',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#f1f5f9';
            e.target.style.color = '#334155';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = '#64748b';
          }}
        >
          ×
        </button>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>
            Welcome to Twelve Hostel
          </h1>
          <p style={styles.subtitle}>
            {activeTab === 'login' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Tab Buttons */}
        <div style={styles.tabContainer}>
          <button
            className={`btn tab-btn${activeTab === 'login' ? ' active' : ''}`}
            type="button"
            style={{
              ...styles.tab,
              marginRight: '0.25rem',
              background: activeTab === 'login' ? 'linear-gradient(135deg, #2563eb, #3b82f6)' : 'transparent',
              color: activeTab === 'login' ? '#fff' : '#64748b',
              boxShadow: activeTab === 'login' ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none'
            }}
            onClick={() => onTabSwitch('login')}
            disabled={isLoading}
          >Login</button>
          <button
            className={`btn tab-btn${activeTab === 'register' ? ' active' : ''}`}
            type="button"
            style={{
              ...styles.tab,
              background: activeTab === 'register' ? 'linear-gradient(135deg, #059669, #10b981)' : 'transparent',
              color: activeTab === 'register' ? '#fff' : '#64748b',
              boxShadow: activeTab === 'register' ? '0 4px 12px rgba(5, 150, 105, 0.3)' : 'none'
            }}
            onClick={() => onTabSwitch('register')}
            disabled={isLoading}
          >Register</button>
        </div>

        {/* User Type Selector for Registration */}
        {activeTab === 'register' && (
          <div style={styles.userTypeContainer}>
            <button
              className={`btn ${userType === 'student' ? 'active' : ''}`}
              type="button"
              style={{
                ...styles.userTypeButton,
                marginRight: '0.25rem',
                background: userType === 'student' ? 'linear-gradient(135deg, #2563eb, #3b82f6)' : 'transparent',
                color: userType === 'student' ? '#fff' : '#64748b',
                boxShadow: userType === 'student' ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none'
              }}
              onClick={() => setUserType('student')}
              disabled={isLoading}
            >
              <span style={{ marginRight: '0.5rem' }}>🎓</span>
              Student
            </button>
            <button
              className={`btn ${userType === 'provider' ? 'active' : ''}`}
              type="button"
              style={{
                ...styles.userTypeButton,
                background: userType === 'provider' ? 'linear-gradient(135deg, #059669, #10b981)' : 'transparent',
                color: userType === 'provider' ? '#fff' : '#64748b',
                boxShadow: userType === 'provider' ? '0 4px 12px rgba(5, 150, 105, 0.3)' : 'none'
              }}
              onClick={() => setUserType('provider')}
              disabled={isLoading}
            >
              <span style={{ marginRight: '0.5rem' }}>🏢</span>
              Provider
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
            color: '#991b1b',
            padding: isMobile ? '0.875rem' : '1rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            fontSize: isMobile ? '0.875rem' : '0.95rem',
            border: '1px solid #fca5a5',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: isMobile ? '1rem' : '1.2rem' }}>⚠️</span>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form
          name="loginForm"
          style={{
            marginBottom: '1.5rem',
            display: activeTab === 'login' ? 'block' : 'none',
            transition: 'all 0.3s'
          }}
          onSubmit={handleLogin}
        >
          <div style={styles.formContainer}>
            <div style={styles.fieldContainer}>
              <label style={styles.labelStyle}>Username or Email</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username or email"
                style={styles.inputStyle}
                onFocus={(e) => handleInputFocus(e)}
                onBlur={handleInputBlur}
                required
                disabled={isLoading}
              />
            </div>
            <div style={{ ...styles.fieldContainer, marginBottom: '1.5rem' }}>
              <label style={styles.labelStyle}>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                style={styles.inputStyle}
                onFocus={(e) => handleInputFocus(e)}
                onBlur={handleInputBlur}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <button
            className="btn"
            type="submit"
            style={{
              ...styles.button,
              background: isLoading ? '#94a3b8' : 'linear-gradient(135deg, #2563eb, #3b82f6)',
              color: '#fff',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: isLoading ? 'none' : '0 4px 12px rgba(37, 99, 235, 0.3)',
              transform: isLoading ? 'none' : 'translateY(0)'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <span style={{
                  width: '1rem',
                  height: '1rem',
                  border: '2px solid transparent',
                  borderTop: '2px solid #fff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></span>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Registration Form */}
        <form
          name="registerForm"
          style={{
            marginBottom: '1.5rem',
            display: activeTab === 'register' ? 'block' : 'none',
            transition: 'all 0.3s'
          }}
          onSubmit={handleRegister}
        >
          <div style={styles.formContainer}>
            <h3 style={{
              marginBottom: '1.5rem',
              color: '#1e293b',
              fontWeight: '600',
              fontSize: isMobile ? '1.125rem' : '1.25rem',
              textAlign: 'center'
            }}>
              Create {userType === 'student' ? 'Student' : 'Provider'} Account
            </h3>
            
            {/* Common fields */}
            <div style={styles.fieldContainer}>
              <label style={styles.labelStyle}>Username *</label>
              <input
                type="text"
                name="username"
                placeholder="Choose a unique username"
                style={styles.inputStyle}
                onFocus={(e) => handleInputFocus(e, userType === 'student' ? '#2563eb' : '#059669')}
                onBlur={handleInputBlur}
                required
                disabled={isLoading}
              />
            </div>

            <div style={styles.fieldContainer}>
              <label style={styles.labelStyle}>Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                style={styles.inputStyle}
                onFocus={(e) => handleInputFocus(e, userType === 'student' ? '#2563eb' : '#059669')}
                onBlur={handleInputBlur}
                required
                disabled={isLoading}
              />
            </div>

            <div style={styles.fieldContainer}>
              <label style={styles.labelStyle}>Phone Number *</label>
              <input
                type="tel"
                name="phone_number"
                placeholder="e.g., 0556661933"
                style={styles.inputStyle}
                onFocus={(e) => handleInputFocus(e, userType === 'student' ? '#2563eb' : '#059669')}
                onBlur={handleInputBlur}
                required
                disabled={isLoading}
              />
            </div>
            
            {/* Student-specific fields */}
            {userType === 'student' && (
              <>
                <div style={styles.fieldContainer}>
                  <label style={styles.labelStyle}>Date of Birth *</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    style={styles.inputStyle}
                    onFocus={(e) => handleInputFocus(e, '#2563eb')}
                    onBlur={handleInputBlur}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div style={styles.fieldContainer}>
                  <label style={styles.labelStyle}>Program of Study *</label>
                  <input
                    type="text"
                    name="program"
                    placeholder="e.g., Computer Engineering"
                    style={styles.inputStyle}
                    onFocus={(e) => handleInputFocus(e, '#2563eb')}
                    onBlur={handleInputBlur}
                    required
                    disabled={isLoading}
                  />
                </div>
              </>
            )}
            
            {/* Provider-specific fields */}
            {userType === 'provider' && (
              <>
                <div style={styles.fieldContainer}>
                  <label style={styles.labelStyle}>Business/Hostel Name *</label>
                  <input
                    type="text"
                    name="business_name"
                    placeholder="e.g., Franco Hostel"
                    style={styles.inputStyle}
                    onFocus={(e) => handleInputFocus(e, '#059669')}
                    onBlur={handleInputBlur}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div style={styles.fieldContainer}>
                  <label style={styles.labelStyle}>Contact Person Name *</label>
                  <input
                    type="text"
                    name="contact_person"
                    placeholder="e.g., John Kwame"
                    style={styles.inputStyle}
                    onFocus={(e) => handleInputFocus(e, '#059669')}
                    onBlur={handleInputBlur}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div style={styles.fieldContainer}>
                  <label style={styles.labelStyle}>Business Address *</label>
                  <textarea
                    name="address"
                    placeholder="e.g., 123 Franco St, Ayeduase"
                    rows={isMobile ? "2" : "3"}
                    style={{
                      ...styles.inputStyle,
                      resize: 'vertical',
                      minHeight: isMobile ? '60px' : '80px'
                    }}
                    onFocus={(e) => handleInputFocus(e, '#059669')}
                    onBlur={handleInputBlur}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div style={styles.fieldContainer}>
                  <label style={styles.labelStyle}>Bank Details *</label>
                  <input
                    type="text"
                    name="bank_details"
                    placeholder="e.g., Fidelity Bank, 99003456789"
                    style={styles.inputStyle}
                    onFocus={(e) => handleInputFocus(e, '#059669')}
                    onBlur={handleInputBlur}
                    required
                    disabled={isLoading}
                  />
                </div>
              </>
            )}
            
            <div style={styles.fieldContainer}>
              <label style={styles.labelStyle}>Password *</label>
              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                style={styles.inputStyle}
                onFocus={(e) => handleInputFocus(e, userType === 'student' ? '#2563eb' : '#059669')}
                onBlur={handleInputBlur}
                required
                disabled={isLoading}
              />
            </div>
            <div style={{ ...styles.fieldContainer, marginBottom: '1.5rem' }}>
              <label style={styles.labelStyle}>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                style={styles.inputStyle}
                onFocus={(e) => handleInputFocus(e, userType === 'student' ? '#2563eb' : '#059669')}
                onBlur={handleInputBlur}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <button
            className="btn"
            type="submit"
            style={{
              ...styles.button,
              background: isLoading ? '#94a3b8' : (userType === 'student' ? 'linear-gradient(135deg, #2563eb, #3b82f6)' : 'linear-gradient(135deg, #059669, #10b981)'),
              color: '#fff',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: isLoading ? 'none' : (userType === 'student' ? '0 4px 12px rgba(37, 99, 235, 0.3)' : '0 4px 12px rgba(5, 150, 105, 0.3)'),
              transform: isLoading ? 'none' : 'translateY(0)'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = userType === 'student' ? '0 6px 20px rgba(37, 99, 235, 0.4)' : '0 6px 20px rgba(5, 150, 105, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = userType === 'student' ? '0 4px 12px rgba(37, 99, 235, 0.3)' : '0 4px 12px rgba(5, 150, 105, 0.3)';
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <span style={{
                  width: '1rem',
                  height: '1rem',
                  border: '2px solid transparent',
                  borderTop: '2px solid #fff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></span>
                Creating Account...
              </span>
            ) : (
              `Create ${userType === 'student' ? 'Student' : 'Provider'} Account`
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p style={{ 
            color: '#64748b', 
            fontSize: isMobile ? '0.8rem' : '0.875rem',
            lineHeight: '1.4'
          }}>
            By {activeTab === 'login' ? 'signing in' : 'creating an account'}, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>

      {/* Add CSS animation for spinner */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .login-modal-content {
            margin: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthModal;
