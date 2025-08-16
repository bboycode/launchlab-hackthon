import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalendarAlt, faUser, faIdCard, faLanguage, faEnvelope, faPhone, faUserMd, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode';

// Define interfaces for type safety
interface PatientInfo {
  id: number;
  first_name: string;
  last_name: string;
  id_number: string;
  dob: string;
  sex: string;
  language: string;
  email_address?: string;
  phone_number?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  med_aid_provider?: string;
  med_aid_number?: string;
  primary_physician?: string;
  allergies?: string;
  med_conditions?: string;
}

interface ClinicalNote {
  id: number;
  note: string; // This will contain the actual note content from the URL
  created_at: string;
  doctor_id: number;
}

const ClinicalNotes: React.FC = () => {
  const nav = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();

  // Get user data from localStorage (same as Dashboard)
  const user = useMemo(() => {
    let storedUser: any = null;

    try {
      const authUser = localStorage.getItem("authUser");
      if (authUser) {
        const parsed = JSON.parse(authUser);
        const decoded: any = jwtDecode(parsed.token);

        storedUser = {
          email: parsed.email,
          token: parsed.token,
          surname: decoded.last_name,
          id: decoded.doctor_id
        };
      }
    } catch (error) {
      console.error("Error parsing stored user data:", error);
    }

    return {
      email: storedUser?.email || "doctor@voice2vitals.com",
      token: storedUser?.token,
      surname: storedUser?.surname,
      id: storedUser?.id
    };
  }, []);

  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch patient info and notes from backend
  useEffect(() => {
    if (!patientId || !user.token) {
      setLoading(false);
      return;
    }

    const fetchPatientData = async () => {
      try {
        // First, try to fetch from doctor's patients list to get patient info
        let patientFound = false;
        let currentPatientInfo = null;

        try {
          const doctorPatientsResponse = await fetch(`http://127.0.0.1:5000/patient/${patientId}`, {
            headers: {
              // "Authorization": `Bearer ${user.token}`,
              "Content-Type": "application/json"
            }
          });

          console.log("Raw response:", doctorPatientsResponse);

          if (doctorPatientsResponse.ok) {
            const doctorPatientsData = await doctorPatientsResponse.json();
            console.log("Parsed JSON:", doctorPatientsData);
            if (doctorPatientsData.success && doctorPatientsData.patient) {
              currentPatientInfo = doctorPatientsData.patient;

              if (currentPatientInfo) {
                patientFound = true;
                setPatientInfo(currentPatientInfo);

                console.log(currentPatientInfo?.id);
                console.log(currentPatientInfo?.first_name);
                console.log(currentPatientInfo?.last_name);
                console.log(currentPatientInfo?.id_number);
                console.log(currentPatientInfo?.dob);
                console.log(currentPatientInfo?.sex);
                console.log(currentPatientInfo?.language);
                console.log(currentPatientInfo?.email_address);
                console.log(currentPatientInfo?.phone_number);
                console.log(currentPatientInfo?.emergency_contact_name);
                console.log(currentPatientInfo?.emergency_contact_phone);
                console.log(currentPatientInfo?.med_aid_provider);
                console.log(currentPatientInfo?.med_aid_number);
                console.log(currentPatientInfo?.primary_physician);
                console.log(currentPatientInfo?.allergies);
                console.log(currentPatientInfo?.med_conditions);
              }
            }
          }

        } catch (err) {
          console.log("Couldn't fetch from doctor's patients list, trying direct patient endpoint");
        }

        if (!patientFound) {
          throw new Error('Patient not found or you do not have access to this patient');
        }

        // Fetch patient notes
        const notesResponse = await fetch(
          `http://127.0.0.1:5000/patient/${patientId}/doctor/${user.id}/notes`,
          {
            headers: {
              // "Authorization": `Bearer ${user.token}`,
              "Content-Type": "application/json"
            }
          }
        );


        console.log("Raw response:", notesResponse);

        if (!notesResponse.ok) {
          console.warn(`Failed to fetch notes: ${notesResponse.status}`);
          setClinicalNotes([]);
        } else {
          const notesData = await notesResponse.json();
          if (notesData.success) {
            setClinicalNotes(notesData.notes || []);
          } else {
            console.warn('Notes fetch unsuccessful:', notesData.error);
            setClinicalNotes([]);
          }
        }

      } catch (err: any) {
        console.error("Error fetching patient data:", err);
        setError(err.message || 'Failed to load patient data');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId, user.token, user.id]);

  const logout = () => {
    localStorage.removeItem("authUser");
    console.log("Logout and navigate to /");
    nav('/');
  };

  const goBackToDashboard = () => {
    nav('/dashboard');
  };

  const isMobile = window.innerWidth <= 768;

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        minWidth: '100vw',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center', color: '#718096' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>⏳</div>
          <p>Loading patient records...</p>
        </div>
      </div>
    );
  }

  if (error || !patientInfo) {
    return (
      <div style={{
        minHeight: '100vh',
        minWidth: '100vw',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center', color: '#718096' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>❌</div>
          <p>{error || 'Patient not found'}</p>
          <button onClick={goBackToDashboard} style={{
            marginTop: '16px',
            padding: '8px 16px',
            backgroundColor: '#3fb6a8',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      minWidth: '100vw',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Header Bar - Same as Dashboard */}
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
              From doctor-patient conversations to organized clinical notes.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={goBackToDashboard}
              style={{
                padding: isMobile ? '8px 16px' : '10px 20px',
                fontSize: isMobile ? '13px' : '14px',
                fontWeight: '600',
                border: '1px solid #3fb6a8',
                borderRadius: '8px',
                background: 'white',
                color: '#3fb6a8',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#3fb6a8';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#3fb6a8';
              }}
            >
              <FontAwesomeIcon icon={faArrowLeft} size="sm" />
              Dashboard
            </button>
            <button
              onClick={logout}
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
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '20px' : '32px'
      }}>

        {/* Patient Name Header */}
        <div style={{ marginBottom: isMobile ? '24px' : '32px' }}>
          <h2 style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: '600',
            color: '#2d3748',
            margin: '0 0 8px 0'
          }}>
            {patientInfo.first_name} {patientInfo.last_name}
          </h2>
          <p style={{
            color: '#718096',
            fontSize: isMobile ? '14px' : '16px',
            margin: '0'
          }}>
            Clinical Records & Notes
          </p>
        </div>

        {/* PDF-like Document Container */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          minHeight: '800px'
        }}>

          {/* General Information Section */}
          <div style={{
            padding: isMobile ? '24px' : '32px',
            borderBottom: '2px solid #f1f5f9'
          }}>
            <h3 style={{
              fontSize: isMobile ? '18px' : '20px',
              fontWeight: '600',
              color: '#2d3748',
              margin: '0 0 20px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              General Information
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: isMobile ? '12px' : '16px',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
            }}>
              {/* Required Fields */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FontAwesomeIcon icon={faIdCard} style={{ color: '#3fb6a8', width: '16px' }} />
                <span style={{ fontWeight: '600', color: '#4a5568', minWidth: '80px' }}>Patient ID:</span>
                <span style={{ color: '#2d3748' }}>{patientInfo.id}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FontAwesomeIcon icon={faIdCard} style={{ color: '#3fb6a8', width: '16px' }} />
                <span style={{ fontWeight: '600', color: '#4a5568', minWidth: '80px' }}>ID Number:</span>
                <span style={{ color: '#2d3748' }}>{patientInfo.id_number}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#3fb6a8', width: '16px' }} />
                <span style={{ fontWeight: '600', color: '#4a5568', minWidth: '80px' }}>DOB:</span>
                <span style={{ color: '#2d3748' }}>{new Date(patientInfo.dob).toLocaleDateString()}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FontAwesomeIcon icon={faUser} style={{ color: '#3fb6a8', width: '16px' }} />
                <span style={{ fontWeight: '600', color: '#4a5568', minWidth: '80px' }}>Sex:</span>
                <span style={{ color: '#2d3748' }}>{patientInfo.sex}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FontAwesomeIcon icon={faLanguage} style={{ color: '#3fb6a8', width: '16px' }} />
                <span style={{ fontWeight: '600', color: '#4a5568', minWidth: '80px' }}>Language:</span>
                <span style={{ color: '#2d3748' }}>{patientInfo.language}</span>
              </div>

              {/* Optional Fields */}
              {patientInfo.email_address && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FontAwesomeIcon icon={faEnvelope} style={{ color: '#3fb6a8', width: '16px' }} />
                  <span style={{ fontWeight: '600', color: '#4a5568', minWidth: '80px' }}>Email:</span>
                  <span style={{ color: '#2d3748' }}>{patientInfo.email_address}</span>
                </div>
              )}

              {patientInfo.phone_number && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FontAwesomeIcon icon={faPhone} style={{ color: '#3fb6a8', width: '16px' }} />
                  <span style={{ fontWeight: '600', color: '#4a5568', minWidth: '80px' }}>Phone:</span>
                  <span style={{ color: '#2d3748' }}>{patientInfo.phone_number}</span>
                </div>
              )}

              {patientInfo.emergency_contact_name && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FontAwesomeIcon icon={faUser} style={{ color: '#e53e3e', width: '16px' }} />
                  <span style={{ fontWeight: '600', color: '#4a5568', minWidth: '120px' }}>Emergency Contact:</span>
                  <span style={{ color: '#2d3748' }}>{patientInfo.emergency_contact_name}</span>
                </div>
              )}

              {patientInfo.emergency_contact_phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FontAwesomeIcon icon={faPhone} style={{ color: '#e53e3e', width: '16px' }} />
                  <span style={{ fontWeight: '600', color: '#4a5568', minWidth: '120px' }}>Emergency Phone:</span>
                  <span style={{ color: '#2d3748' }}>{patientInfo.emergency_contact_phone}</span>
                </div>
              )}

              {patientInfo.med_aid_provider && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#3fb6a8', width: '16px', textAlign: 'center' }}>🏥</span>
                  <span style={{ fontWeight: '600', color: '#4a5568', minWidth: '120px' }}>Medical Aid:</span>
                  <span style={{ color: '#2d3748' }}>{patientInfo.med_aid_provider}</span>
                </div>
              )}

              {patientInfo.med_aid_number && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#3fb6a8', width: '16px', textAlign: 'center' }}>🏥</span>
                  <span style={{ fontWeight: '600', color: '#4a5568', minWidth: '120px' }}>Medical Aid Number:</span>
                  <span style={{ color: '#2d3748' }}>{patientInfo.med_aid_number}</span>
                </div>
              )}

              {patientInfo.primary_physician && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FontAwesomeIcon icon={faUserMd} style={{ color: '#3fb6a8', width: '16px' }} />
                  <span style={{ fontWeight: '600', color: '#4a5568', minWidth: '120px' }}>Primary Physician ID:</span>
                  <span style={{ color: '#2d3748' }}>{patientInfo.primary_physician}</span>
                </div>
              )}

              {patientInfo.allergies && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', gridColumn: isMobile ? '1' : '1 / -1' }}>
                  <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: '#e53e3e', width: '16px', marginTop: '2px' }} />
                  <span style={{ fontWeight: '600', color: '#4a5568', minWidth: '120px' }}>Known Allergies:</span>
                  <span style={{ color: '#e53e3e', fontWeight: '500' }}>{patientInfo.allergies}</span>
                </div>
              )}

              {patientInfo.med_conditions && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', gridColumn: isMobile ? '1' : '1 / -1' }}>
                  <span style={{ color: '#3fb6a8', width: '16px', textAlign: 'center', marginTop: '2px' }}>📋</span>
                  <span style={{ fontWeight: '600', color: '#4a5568', minWidth: '120px' }}>Medical Conditions:</span>
                  <span style={{ color: '#2d3748' }}>{patientInfo.med_conditions}</span>
                </div>
              )}
            </div>
          </div>

          {/* Clinical Notes Section */}
          <div style={{
            padding: isMobile ? '24px' : '32px'
          }}>
            <h3 style={{
              fontSize: isMobile ? '18px' : '20px',
              fontWeight: '600',
              color: '#2d3748',
              margin: '0 0 24px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Clinical Notes
            </h3>

            {clinicalNotes.length === 0 ? (
              <div style={{
                padding: '48px 0',
                textAlign: 'center',
                color: '#718096'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>📝</div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  margin: '0 0 8px 0',
                  color: '#4a5568'
                }}>
                  No clinical notes available
                </h4>
                <p style={{ fontSize: '14px', margin: '0' }}>
                  Clinical notes will appear here after patient consultations
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {clinicalNotes.map((note, index) => (
                  <div
                    key={note.id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: isMobile ? '20px' : '24px',
                      background: index % 2 === 0 ? '#fafafa' : 'white',
                      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                      fontSize: '14px',
                      lineHeight: '1.6'
                    }}
                  >
                    {/* Note Header */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '20px',
                      paddingBottom: '12px',
                      borderBottom: '1px solid #e2e8f0'
                    }}>
                      <div>
                        <h4 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#2d3748',
                          margin: '0 0 4px 0'
                        }}>
                          Note #{note.id} - {new Date(note.created_at).toLocaleDateString()}
                        </h4>
                        <p style={{
                          fontSize: '12px',
                          color: '#718096',
                          margin: '0'
                        }}>
                          Created at: {new Date(note.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#718096',
                        textAlign: 'right'
                      }}>
                        Doctor ID: {note.doctor_id}
                      </div>
                    </div>

                    {/* Note Content */}
                    <textarea
                      value={note.note}
                      onChange={(e) => {
                        // Update the specific note in the state
                        const updatedNotes = clinicalNotes.map(n =>
                          n.id === note.id ? { ...n, note: e.target.value } : n
                        );
                        setClinicalNotes(updatedNotes);
                      }}
                      style={{
                        width: '100%',
                        minHeight: 'auto',
                        background: 'white',
                        padding: '16px',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        color: '#2d3748',
                        resize: 'none',
                        overflow: 'hidden',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      ref={(textarea) => {
                        if (textarea) {
                          // Auto-resize on mount and content change
                          textarea.style.height = 'auto';
                          textarea.style.height = textarea.scrollHeight + 'px';
                        }
                      }}
                      onInput={(e) => {
                        // Auto-resize textarea to fit content
                        const textarea = e.target as HTMLTextAreaElement;
                        textarea.style.height = 'auto';
                        textarea.style.height = textarea.scrollHeight + 'px';
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#3fb6a8';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(63, 182, 168, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalNotes;