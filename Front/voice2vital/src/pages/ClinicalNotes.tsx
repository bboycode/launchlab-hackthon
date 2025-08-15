import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalendarAlt, faUser, faIdCard, faLanguage, faEnvelope, faPhone, faUserMd, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

// Define interfaces for type safety
interface PatientInfo {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: 'Male' | 'Female' | 'Other';
  language: string;
  email?: string;
  phoneNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medicalAidProvider?: string;
  primaryPhysician?: string;
  knownAllergies?: string;
  medicalConditions?: string;
}

interface ClinicalNote {
  id: number;
  date: string;
  sessionDuration?: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  physicalExamination: string;
  assessment: string;
  plan: string;
  followUp?: string;
  doctorName?: string;
}

const ClinicalNotes: React.FC = () => {
  const nav = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();
  
  // Mock user data (same as dashboard)
  const user = useMemo(() => ({ email: "doctor@voice2vitals.com" }), []);

  // Mock patient data - in real app, this would come from API based on patientId
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNote[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulate data fetching
  useEffect(() => {
    // Mock API call - replace with actual API integration
    setTimeout(() => {
      // Mock patient data
      const mockPatient: PatientInfo = {
        id: parseInt(patientId || "1"),
        firstName: "John",
        lastName: "Smith",
        dateOfBirth: "1985-03-15",
        sex: "Male",
        language: "English",
        email: "john.smith@email.com",
        phoneNumber: "+1 (555) 123-4567",
        emergencyContactName: "Jane Smith",
        emergencyContactPhone: "+1 (555) 987-6543",
        medicalAidProvider: "HealthCare Plus",
        primaryPhysician: "Dr. Sarah Johnson",
        knownAllergies: "Penicillin, Shellfish",
        medicalConditions: "Hypertension, Type 2 Diabetes"
      };

      // Mock clinical notes
      const mockNotes: ClinicalNote[] = [
        {
          id: 1,
          date: "2024-01-15",
          sessionDuration: "45 minutes",
          chiefComplaint: "Patient presents with persistent cough and shortness of breath for the past 3 weeks.",
          historyOfPresentIllness: "Mr. Smith reports a dry, persistent cough that began approximately 3 weeks ago. Initially attributed to seasonal allergies, but symptoms have worsened. Patient also reports shortness of breath during mild exertion and occasional chest tightness. No fever, chills, or night sweats. No recent travel or sick contacts.",
          physicalExamination: "Vital Signs: BP 142/88, HR 78, RR 22, Temp 98.6°F, O2 Sat 96%\nGeneral: Alert, oriented, mild respiratory distress\nLungs: Bilateral fine crackles in lower lobes, diminished breath sounds\nHeart: Regular rate and rhythm, no murmurs\nExtremities: No edema, good peripheral pulses",
          assessment: "1. Possible pneumonia vs. exacerbation of underlying respiratory condition\n2. Hypertension - elevated readings\n3. Type 2 Diabetes - well controlled",
          plan: "1. Chest X-ray ordered\n2. Complete blood count and inflammatory markers\n3. Prescribed Azithromycin 500mg daily x 5 days\n4. Continue current diabetes medications\n5. Monitor blood pressure - may need adjustment\n6. Return to clinic in 1 week or sooner if symptoms worsen",
          followUp: "Follow-up appointment scheduled for January 22, 2024",
          doctorName: "Dr. Sarah Johnson"
        },
        {
          id: 2,
          date: "2024-01-08",
          sessionDuration: "30 minutes",
          chiefComplaint: "Routine follow-up for diabetes and hypertension management.",
          historyOfPresentIllness: "Patient returns for routine 3-month follow-up. Reports good medication compliance. Blood glucose levels have been stable (80-140 mg/dL range). Some occasional morning headaches.",
          physicalExamination: "Vital Signs: BP 138/85, HR 72, RR 16, Temp 98.2°F\nGeneral: Well-appearing, no acute distress\nFeet: No ulcerations, good sensation\nHeart: Regular rate and rhythm\nEyes: Fundoscopic exam normal",
          assessment: "1. Type 2 Diabetes - well controlled\n2. Essential hypertension - adequately controlled\n3. Preventive care up to date",
          plan: "1. Continue current Metformin 1000mg BID\n2. Continue Lisinopril 10mg daily\n3. HbA1c and lipid panel ordered\n4. Continue home blood pressure monitoring\n5. Dietary counseling reinforced",
          followUp: "Next appointment in 3 months",
          doctorName: "Dr. Sarah Johnson"
        }
      ];

      setPatientInfo(mockPatient);
      setClinicalNotes(mockNotes);
      setLoading(false);
    }, 1000);
  }, [patientId]);

  const logout = () => {
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

  if (!patientInfo) {
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
          <p>Patient not found</p>
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
      {/* Header Bar - Exactly same as Dashboard */}
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
            {patientInfo.firstName} {patientInfo.lastName}
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
                <span style={{ fontWeight: '600', color: '#4a5568', minWidth: '80px' }}>ID:</span>
                <span style={{ color: '#2d3748' }}>{patientInfo.id}</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#3fb6a8', width: '16px' }} />
                <span style={{ fontWeight: '600', color: '#4a5568', minWidth: '80px' }}>DOB:</span>
                <span style={{ color: '#2d3748' }}>{new Date(patientInfo.dateOfBirth).toLocaleDateString()}</span>
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
              {patientInfo.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FontAwesomeIcon icon={faEnvelope} style={{ color: '#3fb6a8', width: '16px' }} />
                  <span style={{ fontWeight: '600', color: '#4a5568', minWidth: '80px' }}>Email:</span>
                  <span style={{ color: '#2d3748' }}>{patientInfo.email}</span>
                </div>
              )}

              {patientInfo.phoneNumber && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FontAwesomeIcon icon={faPhone} style={{ color: '#3fb6a8', width: '16px' }} />
                  <span style={{ fontWeight: '600', color: '#4a5568', minWidth: '80px' }}>Phone:</span>
                  <span style={{ color: '#2d3748' }}>{patientInfo.phoneNumber}</span>
                </div>
              )}

              {patientInfo.emergencyContactName && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FontAwesomeIcon icon={faUser} style={{ color: '#e53e3e', width: '16px' }} />
                  <span style={{ fontWeight: '600', color: '#4a5568', minWidth: '120px' }}>Emergency Contact:</span>
                  <span style={{ color: '#2d3748' }}>{patientInfo.emergencyContactName}</span>
                </div>
              )}

              {patientInfo.emergencyContactPhone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FontAwesomeIcon icon={faPhone} style={{ color: '#e53e3e', width: '16px' }} />
                  <span style={{ fontWeight: '600', color: '#4a5568', minWidth: '120px' }}>Emergency Phone:</span>
                  <span style={{ color: '#2d3748' }}>{patientInfo.emergencyContactPhone}</span>
                </div>
              )}

              {patientInfo.medicalAidProvider && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#3fb6a8', width: '16px', textAlign: 'center' }}>🏥</span>
                  <span style={{ fontWeight: '600', color: '#4a5568', minWidth: '120px' }}>Medical Aid:</span>
                  <span style={{ color: '#2d3748' }}>{patientInfo.medicalAidProvider}</span>
                </div>
              )}

              {patientInfo.primaryPhysician && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FontAwesomeIcon icon={faUserMd} style={{ color: '#3fb6a8', width: '16px' }} />
                  <span style={{ fontWeight: '600', color: '#4a5568', minWidth: '120px' }}>Primary Physician:</span>
                  <span style={{ color: '#2d3748' }}>{patientInfo.primaryPhysician}</span>
                </div>
              )}

              {patientInfo.knownAllergies && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', gridColumn: isMobile ? '1' : '1 / -1' }}>
                  <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: '#e53e3e', width: '16px', marginTop: '2px' }} />
                  <span style={{ fontWeight: '600', color: '#4a5568', minWidth: '120px' }}>Known Allergies:</span>
                  <span style={{ color: '#e53e3e', fontWeight: '500' }}>{patientInfo.knownAllergies}</span>
                </div>
              )}

              {patientInfo.medicalConditions && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', gridColumn: isMobile ? '1' : '1 / -1' }}>
                  <span style={{ color: '#3fb6a8', width: '16px', textAlign: 'center', marginTop: '2px' }}>📋</span>
                  <span style={{ fontWeight: '600', color: '#4a5568', minWidth: '120px' }}>Medical Conditions:</span>
                  <span style={{ color: '#2d3748' }}>{patientInfo.medicalConditions}</span>
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
                          Session Date: {new Date(note.date).toLocaleDateString()}
                        </h4>
                        {note.sessionDuration && (
                          <p style={{
                            fontSize: '12px',
                            color: '#718096',
                            margin: '0'
                          }}>
                            Duration: {note.sessionDuration}
                          </p>
                        )}
                      </div>
                      {note.doctorName && (
                        <div style={{
                          fontSize: '12px',
                          color: '#718096',
                          textAlign: 'right'
                        }}>
                          {note.doctorName}
                        </div>
                      )}
                    </div>

                    {/* Note Content */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <strong style={{ color: '#3fb6a8', display: 'block', marginBottom: '8px' }}>Chief Complaint:</strong>
                        <p style={{ margin: '0', color: '#2d3748', whiteSpace: 'pre-wrap' }}>{note.chiefComplaint}</p>
                      </div>

                      <div>
                        <strong style={{ color: '#3fb6a8', display: 'block', marginBottom: '8px' }}>History of Present Illness:</strong>
                        <p style={{ margin: '0', color: '#2d3748', whiteSpace: 'pre-wrap' }}>{note.historyOfPresentIllness}</p>
                      </div>

                      <div>
                        <strong style={{ color: '#3fb6a8', display: 'block', marginBottom: '8px' }}>Physical Examination:</strong>
                        <p style={{ margin: '0', color: '#2d3748', whiteSpace: 'pre-wrap' }}>{note.physicalExamination}</p>
                      </div>

                      <div>
                        <strong style={{ color: '#3fb6a8', display: 'block', marginBottom: '8px' }}>Assessment:</strong>
                        <p style={{ margin: '0', color: '#2d3748', whiteSpace: 'pre-wrap' }}>{note.assessment}</p>
                      </div>

                      <div>
                        <strong style={{ color: '#3fb6a8', display: 'block', marginBottom: '8px' }}>Plan:</strong>
                        <p style={{ margin: '0', color: '#2d3748', whiteSpace: 'pre-wrap' }}>{note.plan}</p>
                      </div>

                      {note.followUp && (
                        <div>
                          <strong style={{ color: '#3fb6a8', display: 'block', marginBottom: '8px' }}>Follow-up:</strong>
                          <p style={{ margin: '0', color: '#2d3748', whiteSpace: 'pre-wrap' }}>{note.followUp}</p>
                        </div>
                      )}
                    </div>
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