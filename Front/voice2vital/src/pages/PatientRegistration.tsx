import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type Patient = {
  firstName: string;
  lastName: string;
  dob: string;
  idNumber: string;
  email: string;
  phone: string;
  sex: string;
  medicalAidProvider: string;
  medicalAidNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  knownAllergies: string;
  primaryPhysician: string;
  preferredLanguage: string;
};

const PatientRegistration: React.FC = () => {
  const [p, setP] = useState<Patient>({
    firstName: "",
    lastName: "",
    dob: "",
    idNumber: "",
    email: "",
    phone: "",
    sex: "",
    medicalAidProvider: "",
    medicalAidNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    knownAllergies: "",
    primaryPhysician: "",
    preferredLanguage: "English",
  });
  const nav = useNavigate();

  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const update = (k: keyof Patient, v: string) => setP((s) => ({ ...s, [k]: v }));

  const validateForm = (): string[] => {
    const newErrors: string[] = [];
    if (!p.firstName.trim()) newErrors.push("First name is required");
    if (!p.lastName.trim()) newErrors.push("Last name is required");
    if (!p.dob) newErrors.push("Date of birth is required");
    if (!p.sex) newErrors.push("Sex is required");
    if (!p.idNumber.trim()) newErrors.push("ID/Passport number is required");
    if (!p.email.trim()) newErrors.push("Email is required");
    if (!p.phone.trim()) newErrors.push("Phone number is required");
    if (!p.emergencyContactName.trim()) newErrors.push("Emergency contact name is required");
    if (!p.emergencyContactPhone.trim()) newErrors.push("Emergency contact phone number is required");
    if (!p.primaryPhysician.trim()) newErrors.push("Primary physician is required");
    if (p.email && !/\S+@\S+\.\S+/.test(p.email)) {
      newErrors.push("Please enter a valid email address");
    }
    return newErrors;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();
    setErrors(formErrors);

    if (formErrors.length > 0) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Note: localStorage removed for Claude.ai compatibility
    // In your actual app: 
    // const list: Patient[] = JSON.parse(localStorage.getItem("patients") || "[]");
    // list.push(p);
    // localStorage.setItem("patients", JSON.stringify(list));

    setSaved(true);
    setIsLoading(false);

    // Auto-hide success message and navigate
    setTimeout(() => {
      console.log("Navigate to /dashboard");
      nav("/dashboard")
    }, 2000);
    nav("/dashboard")
  };

  const goBack = () => {
    console.log("Navigate to /dashboard");
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <div style={{
      minHeight: '100vh',
      minWidth: '100vw',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
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
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
                From doctor-patient conversations to organized clinical notes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: isMobile ? '20px' : '32px'
      }}>
        {/* Form Container */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: isMobile ? '24px 20px' : '40px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08), 0 8px 16px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Top accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, #3fb6a8, #319795)',
            borderRadius: '16px 16px 0 0'
          }} />

          {/* Form Header */}
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <h2 style={{
              fontSize: isMobile ? '24px' : '28px',
              fontWeight: '600',
              color: '#2d3748',
              margin: '0 0 8px 0'
            }}>
              Register New Patient
            </h2>
            <p style={{
              color: '#718096',
              fontSize: isMobile ? '14px' : '16px',
              margin: '0'
            }}>
              Please provide the patient's basic information
            </p>
          </div>

          {/* Success Message */}
          {saved && (
            <div style={{
              padding: '16px',
              backgroundColor: '#d4edda',
              border: '1px solid #c3e6cb',
              borderRadius: '12px',
              color: '#155724',
              fontSize: '14px',
              fontWeight: '500',
              textAlign: 'center',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              Patient registered successfully! Redirecting to dashboard...
            </div>
          )}

          {/* Error Messages */}
          {errors.length > 0 && (
            <div style={{
              padding: '16px',
              backgroundColor: '#fed7d7',
              border: '1px solid #feb2b2',
              borderRadius: '12px',
              color: '#c53030',
              fontSize: '14px',
              marginBottom: '24px'
            }}>
              <div style={{ fontWeight: '600', marginBottom: '8px' }}>Please correct the following errors:</div>
              <ul style={{ margin: '0', paddingLeft: '20px' }}>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Personal Information */}
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#2d3748',
                margin: '0 0 16px 0',
                paddingBottom: '8px',
                borderBottom: '2px solid #e2e8f0'
              }}>
                Personal Information
              </h3>
              <div style={{
                display: 'grid',
                gap: '16px',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr'
              }}>
                <input
                  type="text"
                  placeholder="First name *"
                  value={p.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
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
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <input
                  type="text"
                  placeholder="Last name *"
                  value={p.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
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
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <input
                  type="date"
                  placeholder="Date of birth *"
                  value={p.dob}
                  onChange={(e) => update("dob", e.target.value)}
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
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <select
                  value={p.sex}
                  onChange={(e) => update("sex", e.target.value)}
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
                    color: p.sex ? '#2d3748' : '#a0aec0',
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
                >
                  <option value="">Select sex *</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <input
                  type="text"
                  placeholder="ID/Passport number *"
                  value={p.idNumber}
                  onChange={(e) => update("idNumber", e.target.value)}
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
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />

                <div>
                  <select
                    value={p.preferredLanguage}
                    onChange={(e) => update("preferredLanguage", e.target.value)}
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
                      color: p.preferredLanguage ? '#2d3748' : '#a0aec0',
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
                  >
                    <option value="">Select preferred language *</option>
                    <option value="English">English</option>
                    <option value="Afrikaans">Spanish</option>
                    <option value="Zulu">Mandarin</option>
                    <option value="Xhosa">Tagalog</option>
                    <option value="Other">Other (please specify below)</option>
                  </select>
                </div>

                {/* Custom Language Input (if Other is selected) */}
                {p.preferredLanguage === "Other" && (
                  <div>
                    <input
                      type="text"
                      placeholder="Please specify your preferred language *"
                      onChange={(e) => update("preferredLanguage", e.target.value)}
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
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                )}

              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#2d3748',
                margin: '0 0 16px 0',
                paddingBottom: '8px',
                borderBottom: '2px solid #e2e8f0'
              }}>
                Contact Information
              </h3>
              <div style={{
                display: 'grid',
                gap: '16px',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr'
              }}>
                <input
                  type="email"
                  placeholder="Email address *"
                  value={p.email}
                  onChange={(e) => update("email", e.target.value)}
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
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <input
                  type="tel"
                  placeholder="Phone number *"
                  value={p.phone}
                  onChange={(e) => update("phone", e.target.value)}
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
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <input
                  type="text"
                  placeholder="Emergency contact name *"
                  value={p.emergencyContactName}
                  onChange={(e) => update("emergencyContactName", e.target.value)}
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
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <input
                  type="tel"
                  placeholder="Emergency contact phone *"
                  value={p.emergencyContactPhone}
                  onChange={(e) => update("emergencyContactPhone", e.target.value)}
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
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Medical Information */}
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#2d3748',
                margin: '0 0 16px 0',
                paddingBottom: '8px',
                borderBottom: '2px solid #e2e8f0'
              }}>
                Medical Information
              </h3>
              <div style={{
                display: 'grid',
                gap: '16px',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr'
              }}>
                <input
                  type="text"
                  placeholder="Medical aid provider"
                  value={p.medicalAidProvider}
                  onChange={(e) => update("medicalAidProvider", e.target.value)}
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
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <input
                  type="text"
                  placeholder="Medical aid number"
                  value={p.medicalAidNumber}
                  onChange={(e) => update("medicalAidNumber", e.target.value)}
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
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <input
                  type="text"
                  placeholder="Primary physician *"
                  value={p.primaryPhysician}
                  onChange={(e) => update("primaryPhysician", e.target.value)}
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
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <textarea
                  placeholder="Known allergies"
                  value={p.knownAllergies}
                  onChange={(e) => update("knownAllergies", e.target.value)}
                  rows={3}
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
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    minHeight: '56px'
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

                <textarea
                  placeholder="Known medical conditions"
                  value={p.knownAllergies}
                  onChange={(e) => update("knownAllergies", e.target.value)}
                  rows={3}
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
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    minHeight: '56px'
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

            {/* Submit Button */}
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
                  Saving Patient...
                </span>
              ) : (
                'Save Patient'
              )}
            </button>
          </div>
        </div>
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

export default PatientRegistration;