import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DoctorRegistration: React.FC = () => {
  const nav = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    practiceNumber: "",
    specialty: "",
    hospital: "",
    phoneNumber: "",
  });
  const [err, setErr] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    // Basic validation
    if (!form.firstName || !form.lastName || !form.idNumber || !form.email || !form.password) {
      setErr("Please fill in all required fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErr("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      setErr("Password must be at least 6 characters long.");
      return;
    }

    // Save locally (mock). Replace with API call later.
    localStorage.setItem("doctorProfile", JSON.stringify(form));
    
    // Show success message
    setIsRegistered(true);
    
    // Navigate back to login after 2 seconds
    setTimeout(() => {
      nav("/");
    }, 2000);
  };

  const isMobile = window.innerWidth <= 768;

  if (isRegistered) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        position: 'relative'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '48px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08), 0 8px 16px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          width: '100%',
          maxWidth: '440px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, #3fb6a8, #319795)',
            borderRadius: '16px 16px 0 0'
          }} />
          
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3fb6a8, #319795)',
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: 'white'
          }}>
            ✓
          </div>
          
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#2d3748',
            margin: '0 0 16px 0'
          }}>
            Registration Successful!
          </h2>
          
          <p style={{
            color: '#718096',
            fontSize: '16px',
            margin: '0 0 24px 0',
            lineHeight: '1.5'
          }}>
            Your doctor account has been created successfully. You will be redirected to the login page shortly.
          </p>
          
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(63, 182, 168, 0.2)',
            borderTop: '3px solid #3fb6a8',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
        </div>
        
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
      minWidth: '100vw',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Header Bar */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        padding: isMobile ? '16px 20px' : '20px 32px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div>
            <h1 style={{
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #3fb6a8, #319795)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: '0',
              letterSpacing: '-0.5px'
            }}>
              Voice2Vitals
            </h1>
            <p style={{
              color: '#718096',
              fontSize: isMobile ? '12px' : '14px',
              margin: '2px 0 0 0',
              fontWeight: '500'
            }}>
              Healthcare insights through voice analysis
            </p>
          </div>
          <button
            onClick={() => nav('/')}
            style={{
              padding: isMobile ? '8px 16px' : '10px 20px',
              fontSize: isMobile ? '13px' : '14px',
              fontWeight: '600',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              background: 'white',
              color: '#4a5568',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3fb6a8';
              e.currentTarget.style.color = '#3fb6a8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.color = '#4a5568';
            }}
          >
            Back to Login
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        minHeight: 'calc(100vh - 84px)',
        position: 'relative'
      }}>
        {/* Professional geometric background pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 25% 25%, rgba(63, 182, 168, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(45, 55, 72, 0.02) 0%, transparent 50%),
            linear-gradient(45deg, transparent 48%, rgba(63, 182, 168, 0.01) 49%, rgba(63, 182, 168, 0.01) 51%, transparent 52%)
          `,
          backgroundSize: '400px 400px, 600px 600px, 100px 100px'
        }} />

        {/* Subtle professional accent elements */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '15%',
          width: '200px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(63, 182, 168, 0.1) 50%, transparent 100%)',
          transform: 'rotate(15deg)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '30%',
          right: '20%',
          width: '150px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(45, 55, 72, 0.05) 50%, transparent 100%)',
          transform: 'rotate(-15deg)'
        }} />

        <div style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: isMobile ? '32px' : '48px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08), 0 8px 16px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          width: '100%',
          maxWidth: '520px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Professional top accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, #3fb6a8, #319795)',
            borderRadius: '16px 16px 0 0'
          }} />

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{
              fontSize: isMobile ? '24px' : '28px',
              fontWeight: '600',
              color: '#2d3748',
              margin: '0 0 8px 0'
            }}>
              Doctor Registration
            </h2>
            <p style={{
              color: '#718096',
              fontSize: '16px',
              margin: '0',
              lineHeight: '1.5'
            }}>
              Create your professional account to get started
            </p>
          </div>

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Name Fields Row */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="First Name *"
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '15px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    backgroundColor: '#ffffff',
                    color: '#2d3748',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3fb6a8';
                    e.target.style.boxShadow = '0 0 0 3px rgba(63, 182, 168, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="Last Name *"
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '15px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    backgroundColor: '#ffffff',
                    color: '#2d3748',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3fb6a8';
                    e.target.style.boxShadow = '0 0 0 3px rgba(63, 182, 168, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <input
              type="text"
              placeholder="ID Number *"
              value={form.idNumber}
              onChange={(e) => update("idNumber", e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '15px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                outline: 'none',
                transition: 'all 0.2s ease',
                backgroundColor: '#ffffff',
                color: '#2d3748',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3fb6a8';
                e.target.style.boxShadow = '0 0 0 3px rgba(63, 182, 168, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />

            <input
              type="email"
              placeholder="Email Address *"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '15px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                outline: 'none',
                transition: 'all 0.2s ease',
                backgroundColor: '#ffffff',
                color: '#2d3748',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3fb6a8';
                e.target.style.boxShadow = '0 0 0 3px rgba(63, 182, 168, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={form.phoneNumber}
              onChange={(e) => update("phoneNumber", e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '15px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                outline: 'none',
                transition: 'all 0.2s ease',
                backgroundColor: '#ffffff',
                color: '#2d3748',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3fb6a8';
                e.target.style.boxShadow = '0 0 0 3px rgba(63, 182, 168, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />

            {/* Professional Fields Row */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="Practice Number"
                  value={form.practiceNumber}
                  onChange={(e) => update("practiceNumber", e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '15px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    backgroundColor: '#ffffff',
                    color: '#2d3748',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3fb6a8';
                    e.target.style.boxShadow = '0 0 0 3px rgba(63, 182, 168, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="Specialty"
                  value={form.specialty}
                  onChange={(e) => update("specialty", e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '15px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    backgroundColor: '#ffffff',
                    color: '#2d3748',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3fb6a8';
                    e.target.style.boxShadow = '0 0 0 3px rgba(63, 182, 168, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <input
              type="text"
              placeholder="Hospital/Clinic"
              value={form.hospital}
              onChange={(e) => update("hospital", e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '15px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                outline: 'none',
                transition: 'all 0.2s ease',
                backgroundColor: '#ffffff',
                color: '#2d3748',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3fb6a8';
                e.target.style.boxShadow = '0 0 0 3px rgba(63, 182, 168, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />

            {/* Password Fields Row */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <input
                  type="password"
                  placeholder="Password *"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '15px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    backgroundColor: '#ffffff',
                    color: '#2d3748',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3fb6a8';
                    e.target.style.boxShadow = '0 0 0 3px rgba(63, 182, 168, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="password"
                  placeholder="Confirm Password *"
                  value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '15px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    backgroundColor: '#ffffff',
                    color: '#2d3748',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3fb6a8';
                    e.target.style.boxShadow = '0 0 0 3px rgba(63, 182, 168, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {err && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#fed7d7',
                border: '1px solid #feb2b2',
                borderRadius: '8px',
                color: '#c53030',
                fontSize: '14px',
                fontWeight: '500',
                textAlign: 'center'
              }}>
                {err}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '600',
                border: 'none',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3fb6a8, #319795)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
                boxShadow: '0 8px 20px rgba(63, 182, 168, 0.2)',
                marginTop: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(63, 182, 168, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(63, 182, 168, 0.2)';
              }}
            >
              Create Doctor Account
            </button>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <p style={{ color: '#718096', fontSize: '14px', margin: '0' }}>
                Already have an account?{' '}
                <a
                  href="/"
                  style={{
                    color: '#3fb6a8',
                    textDecoration: 'none',
                    fontWeight: '600',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#319795';
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#3fb6a8';
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  Sign in here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegistration;