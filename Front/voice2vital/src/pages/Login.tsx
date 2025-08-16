import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);

const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErr("");

  if (!email || !password) {
    setErr("Enter email and password.");
    return;
  }

  setIsLoading(true);
  try {
    const res = await fetch("http://127.0.0.1:5000/signin/doctor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email_address: email, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      setErr(data.error || "Login failed");
      setIsLoading(false);
      return;
    }

    // Store token + doctor info in localStorage
    const userData = {
      email: data.doctor.email_address,
      token: data.access_token,
    };
    localStorage.setItem("authUser", JSON.stringify(userData));

    setIsLoading(false);
    
    // Pass the email through navigation state
    nav("/dashboard", { 
      state: { 
        userEmail: data.doctor.email_address 
      } 
    });

  } catch (error) {
    console.error("Login error:", error);
    setErr("Something went wrong. Please try again.");
    setIsLoading(false);
  }
};


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
        padding: '48px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08), 0 8px 16px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.9)',
        width: '100%',
        maxWidth: '440px',
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

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #3fb6a8, #319795)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 0 8px 0',
            letterSpacing: '-0.5px'
          }}>
            Voice2Vitals
          </h1>
          <p style={{
            color: '#718096',
            fontSize: '16px',
            margin: '0',
            fontWeight: '500'
          }}>
            From doctor-patient conversations to organized clinical notes.
          </p>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#2d3748',
            margin: '0 0 8px 0',
            textAlign: 'center'
          }}>
            Welcome Back
          </h2>
          <p style={{
            color: '#718096',
            fontSize: '16px',
            textAlign: 'center',
            margin: '0 0 32px 0'
          }}>
            Sign in to your account to continue
          </p>

          <div style={{ position: 'relative' }}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '16px 20px',
                fontSize: '16px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
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
                e.target.style.transform = 'translateY(-1px)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
                e.target.style.transform = 'translateY(0)';
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '16px 20px',
                fontSize: '16px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
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
                e.target.style.transform = 'translateY(-1px)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
                e.target.style.transform = 'translateY(0)';
              }}
            />
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

          {/* <button
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
            Sign In
          </button> */}

          <button
              type="submit"
              onClick={onSubmit}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '18px',
                fontSize: '16px',
                fontWeight: '600',
                border: 'none',
                borderRadius: '12px',
                background: isLoading
                  ? '#a0aec0'
                  : 'linear-gradient(135deg, #3fb6a8, #319795)',
                color: 'white',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
                marginTop: '16px'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(63, 182, 168, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{ color: '#718096', fontSize: '15px', margin: '0' }}>
              New to Voice2Vitals?{' '}
              <a
                href="/doctor-register"
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
                Create your account
              </a>
            </p>
          </div>
        </form>

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
};

export default Login;
