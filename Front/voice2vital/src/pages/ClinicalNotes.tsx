import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalendarAlt, faUser, faIdCard, faLanguage, faEnvelope, faPhone, faUserMd, faExclamationTriangle, faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode';
import ReactMarkdown from 'react-markdown';

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

// Function to convert JSON clinical note to markdown
const jsonToMarkdown = (jsonString: string): string => {
  try {
    const data = JSON.parse(jsonString);
    let markdown = "";

    // Patient Information
    if (data.patient_info) {
      markdown += "# Patient Information\n\n";
      Object.entries(data.patient_info).forEach(([key, value]) => {
        if (value && value !== "Not stated") {
          markdown += `**${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:** ${value}\n\n`;
        }
      });
    }

    // History of Present Illness
    if (data.history_of_present_illness) {
      markdown += "# History of Present Illness\n\n";
      markdown += `${data.history_of_present_illness}\n\n`;
    }

    // Allergies
    if (data.allergies && data.allergies.length > 0) {
      markdown += "# Allergies\n\n";
      data.allergies.forEach((allergy: string) => {
        markdown += `- ${allergy}\n`;
      });
      markdown += "\n";
    }

    // Medications
    if (data.medications && data.medications.length > 0) {
      markdown += "# Current Medications\n\n";
      data.medications.forEach((medication: string) => {
        markdown += `- ${medication}\n`;
      });
      markdown += "\n";
    }

    // Previous History
    if (data.previous_history) {
      markdown += "# Previous History\n\n";
      
      if (data.previous_history.past_medical_history && data.previous_history.past_medical_history.length > 0) {
        markdown += "## Past Medical History\n";
        data.previous_history.past_medical_history.forEach((history: string) => {
          markdown += `- ${history}\n`;
        });
        markdown += "\n";
      }

      if (data.previous_history.past_surgical_history && data.previous_history.past_surgical_history.length > 0) {
        markdown += "## Past Surgical History\n";
        data.previous_history.past_surgical_history.forEach((surgery: string) => {
          markdown += `- ${surgery}\n`;
        });
        markdown += "\n";
      }

      if (data.previous_history.family_history && data.previous_history.family_history.length > 0) {
        markdown += "## Family History\n";
        data.previous_history.family_history.forEach((family: string) => {
          markdown += `- ${family}\n`;
        });
        markdown += "\n";
      }

      if (data.previous_history.social_history) {
        markdown += "## Social History\n";
        markdown += `${data.previous_history.social_history}\n\n`;
      }
    }

    // Review of Systems
    if (data.review_of_systems) {
      markdown += "# Review of Systems\n\n";
      
      if (data.review_of_systems.positive_findings && data.review_of_systems.positive_findings.length > 0) {
        markdown += "## Positive Findings\n";
        data.review_of_systems.positive_findings.forEach((finding: string) => {
          markdown += `- ${finding}\n`;
        });
        markdown += "\n";
      }

      if (data.review_of_systems.negative_findings && data.review_of_systems.negative_findings.length > 0) {
        markdown += "## Negative Findings\n";
        data.review_of_systems.negative_findings.forEach((finding: string) => {
          markdown += `- ${finding}\n`;
        });
        markdown += "\n";
      }
    }

    // Physical Exam
    if (data.physical_exam) {
      markdown += "# Physical Examination\n\n";
      
      if (data.physical_exam.general_appearance && data.physical_exam.general_appearance !== "Not stated") {
        markdown += `**General Appearance:** ${data.physical_exam.general_appearance}\n\n`;
      }

      if (data.physical_exam.vital_signs) {
        markdown += "## Vital Signs\n";
        Object.entries(data.physical_exam.vital_signs).forEach(([key, value]) => {
          if (value && value !== "Not stated") {
            markdown += `**${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:** ${value}\n\n`;
          }
        });
      }

      if (data.physical_exam.examination_findings) {
        markdown += "## Examination Findings\n";
        markdown += `${data.physical_exam.examination_findings}\n\n`;
      }
    }

    // Assessment
    if (data.assessment) {
      markdown += "# Assessment\n\n";
      markdown += `${data.assessment}\n\n`;
    }

    // ICD-10 Codes
    if (data.icd10_codes && data.icd10_codes.length > 0) {
      markdown += "# ICD-10 Codes\n\n";
      data.icd10_codes.forEach((code: string) => {
        markdown += `- ${code}\n`;
      });
      markdown += "\n";
    }

    // Plan
    if (data.plan && data.plan.length > 0) {
      markdown += "# Treatment Plan\n\n";
      data.plan.forEach((item: string, index: number) => {
        markdown += `${index + 1}. ${item}\n`;
      });
      markdown += "\n";
    }

    // Medical Decision Making
    if (data.medical_decision_making) {
      markdown += "# Medical Decision Making\n\n";
      markdown += `${data.medical_decision_making}\n\n`;
    }

    return markdown;
  } catch (error) {
    console.error("Error parsing JSON to markdown:", error);
    return jsonString; // Return original if parsing fails
  }
};

// Function to check if a string is valid JSON
const isValidJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

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
  const [editingNotes, setEditingNotes] = useState<{ [key: number]: boolean }>({});

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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                          onClick={() => setEditingNotes(prev => ({ ...prev, [note.id]: !prev[note.id] }))}
                          style={{
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            border: '1px solid #3fb6a8',
                            borderRadius: '6px',
                            background: editingNotes[note.id] ? '#3fb6a8' : 'white',
                            color: editingNotes[note.id] ? 'white' : '#3fb6a8',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <FontAwesomeIcon icon={editingNotes[note.id] ? faEye : faEdit} size="sm" />
                          {editingNotes[note.id] ? 'View' : 'Edit'}
                        </button>
                        <div style={{
                          fontSize: '12px',
                          color: '#718096',
                          textAlign: 'right'
                        }}>
                          Doctor ID: {note.doctor_id}
                        </div>
                      </div>
                    </div>

                    {/* Note Content */}
                    {editingNotes[note.id] ? (
                      // Edit Mode - Raw textarea
                      <textarea
                        value={note.note}
                        onChange={(e) => {
                          const updatedNotes = clinicalNotes.map(n =>
                            n.id === note.id ? { ...n, note: e.target.value } : n
                          );
                          setClinicalNotes(updatedNotes);
                        }}
                        style={{
                          width: '100%',
                          minHeight: '400px',
                          background: 'white',
                          padding: '16px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                          fontSize: '14px',
                          lineHeight: '1.6',
                          color: '#2d3748',
                          resize: 'vertical',
                          outline: 'none',
                          boxSizing: 'border-box'
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
                    ) : (
                      // View Mode - Formatted markdown
                      <div style={{
                        background: 'white',
                        padding: '16px',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        minHeight: '200px'
                      }}>
                        {isValidJSON(note.note) ? (
                          // If it's valid JSON, convert to markdown and render
                          <div style={{
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                            lineHeight: '1.6',
                            color: '#2d3748'
                          }}>
                            <ReactMarkdown
                              components={{
                                h1: ({ children }) => (
                                  <h1 style={{
                                    fontSize: '20px',
                                    fontWeight: '600',
                                    color: '#2d3748',
                                    margin: '24px 0 12px 0',
                                    padding: '0 0 8px 0',
                                    borderBottom: '2px solid #3fb6a8'
                                  }}>
                                    {children}
                                  </h1>
                                ),
                                h2: ({ children }) => (
                                  <h2 style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    color: '#2d3748',
                                    margin: '20px 0 10px 0'
                                  }}>
                                    {children}
                                  </h2>
                                ),
                                h3: ({ children }) => (
                                  <h3 style={{
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: '#2d3748',
                                    margin: '16px 0 8px 0'
                                  }}>
                                    {children}
                                  </h3>
                                ),
                                p: ({ children }) => (
                                  <p style={{
                                    margin: '0 0 12px 0',
                                    lineHeight: '1.6'
                                  }}>
                                    {children}
                                  </p>
                                ),
                                ul: ({ children }) => (
                                  <ul style={{
                                    margin: '0 0 12px 0',
                                    paddingLeft: '20px'
                                  }}>
                                    {children}
                                  </ul>
                                ),
                                ol: ({ children }) => (
                                  <ol style={{
                                    margin: '0 0 12px 0',
                                    paddingLeft: '20px'
                                  }}>
                                    {children}
                                  </ol>
                                ),
                                li: ({ children }) => (
                                  <li style={{
                                    margin: '4px 0'
                                  }}>
                                    {children}
                                  </li>
                                ),
                                strong: ({ children }) => (
                                  <strong style={{
                                    fontWeight: '600',
                                    color: '#3fb6a8'
                                  }}>
                                    {children}
                                  </strong>
                                )
                              }}
                            >
                              {jsonToMarkdown(note.note)}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          // If it's not JSON, display as plain text with basic formatting
                          <div style={{
                            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                            fontSize: '14px',
                            lineHeight: '1.6',
                            color: '#2d3748',
                            whiteSpace: 'pre-wrap'
                          }}>
                            {note.note}
                          </div>
                        )}
                      </div>
                    )}
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