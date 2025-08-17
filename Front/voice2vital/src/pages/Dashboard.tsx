import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faMicrophone, faRobot } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from 'jwt-decode'

const Dashboard: React.FC = () => {
  const nav = useNavigate();
  const location = useLocation();

  // Get user email from multiple sources (navigation state, localStorage, or fallback)
  const user = useMemo(() => {
    let storedUser: any = null;

    try {
      const authUser = localStorage.getItem("authUser");
      if (authUser) {
        // parse localStorage first
        const parsed = JSON.parse(authUser);

        // decode the JWT token
        const decoded: any = jwtDecode(parsed.token);
        console.log(decoded);

        storedUser = {
          email: parsed.email,
          token: parsed.token,
          surname: decoded.last_name,
          id: decoded.doctor_id // adjust key to match your token payload
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
  }, [location.state]);


  // // Mock patients data with more realistic entries
  // const [patients] = useState([
  //   { firstName: "John", lastName: "Smith", id: 1, lastSession: "2024-01-15" },
  //   { firstName: "Sarah", lastName: "Johnson", id: 2, lastSession: "2024-01-14" },
  //   { firstName: "Michael", lastName: "Brown", id: 3, lastSession: "2024-01-12" },
  //   { firstName: "Emily", lastName: "Davis", id: 4, lastSession: "2024-01-10" },
  //   { firstName: "David", lastName: "Wilson", id: 5, lastSession: "2024-01-08" },
  //   { firstName: "Lisa", lastName: "Anderson", id: 6, lastSession: "2024-01-07" },
  //   { firstName: "James", lastName: "Taylor", id: 7, lastSession: "2024-01-05" },
  //   { firstName: "Maria", lastName: "Garcia", id: 8, lastSession: "2024-01-03" },
  //   { firstName: "Robert", lastName: "Martinez", id: 9, lastSession: "2024-01-01" },
  //   { firstName: "Jennifer", lastName: "Rodriguez", id: 10, lastSession: "2023-12-30" }
  // ]);

  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user.id || !user.token) return;

    const fetchPatients = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/doctor/${user.id}/patients`, {
          headers: {
            "Authorization": `Bearer ${user.token}`,
            "Content-Type": "application/json"
          }
        });

        const data = await res.json();
        if (data.success) {
          setPatients(data.patients || []);
        } else {
          console.error("Error fetching patients:", data.error);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [user.id, user.token]);

  const recordSession = (patient: any) => {
    nav('/session', {
      state: {
        patient_id: patient.id,
        patient_first_name: patient.first_name,
        patient_last_name: patient.last_name,
        doctor_id: user.id,
      }
    });
  };

  const logout = () => {
    // Clear stored user data
    localStorage.removeItem("authUser");
    console.log("Logout and navigate to /");
    nav('/');
  };

  // const recordSession = (patientName: string) => {
  //   console.log(`Navigate to /session for ${patientName}`);
  //   nav('/session');
  // };
  const goToChatBox = () => {
    nav('/chatbox');
  };


  const registerNewPatient = () => {
    console.log("Navigate to /patient-register");
    nav("/patient-register");
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
              onClick={goToChatBox}
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
              <FontAwesomeIcon icon={faRobot} size="sm" />
              Mr Vital
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
        padding: isMobile ? '20px' : '32px',
        height: 'calc(100vh - 84px)',
        display: 'flex',
        flexDirection: 'column'
      }}>

        <h3 style={{
          color: '#718096',
          margin: '2px 0 0 0',
        }}>
          Welcome back, Dr {user.surname || user.email}
        </h3>
        {/* Dashboard Title */}
        <div style={{ marginBottom: isMobile ? '24px' : '32px' }}>
          <h2 style={{
            fontSize: isMobile ? '24px' : '32px',
            fontWeight: '600',
            color: '#2d3748',
            margin: '0 0 8px 0'
          }}>
            Patient Dashboard
          </h2>
          <p style={{
            color: '#718096',
            fontSize: isMobile ? '14px' : '16px',
            margin: '0'
          }}>
            Manage patient records and track consultation sessions
          </p>
        </div>

        {/* Patients Table Container */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08), 0 8px 16px rgba(0, 0, 0, 0.04)',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          marginBottom: '20px'
        }}>
          {/* Table Header */}
          <div style={{
            padding: isMobile ? '20px' : '24px',
            borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
            background: 'rgba(248, 250, 252, 0.5)'
          }}>
            <h3 style={{
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: '600',
              color: '#2d3748',
              margin: '0 0 4px 0'
            }}>
              Patient List
            </h3>
            <p style={{
              fontSize: isMobile ? '13px' : '14px',
              color: '#718096',
              margin: '0'
            }}>
              {patients.length} patient{patients.length !== 1 ? 's' : ''} registered
            </p>
          </div>

          {/* Scrollable Table Content */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden'
          }}>
            {loading ? (
              <div style={{
                padding: '48px 24px',
                textAlign: 'center',
                color: '#718096'
              }}>
                <div style={{
                  fontSize: '20px',
                  marginBottom: '16px',
                  opacity: 0.6
                }}>
                  ⏳
                </div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  margin: '0 0 8px 0',
                  color: '#4a5568'
                }}>
                  Loading patients...
                </h4>
              </div>
            ) : patients.length === 0 ? (
              <div style={{
                padding: '48px 24px',
                textAlign: 'center',
                color: '#718096'
              }}>
                <div style={{
                  fontSize: '48px',
                  marginBottom: '16px',
                  opacity: 0.3
                }}>
                  👥
                </div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  margin: '0 0 8px 0',
                  color: '#4a5568'
                }}>
                  No patients registered yet
                </h4>
                <p style={{ fontSize: '14px', margin: '0' }}>
                  Get started by registering your first patient
                </p>
              </div>
            ) : (
              <div>
                {patients.map((patient, index) => (
                  <div
                    key={patient.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: isMobile ? '16px 20px' : '20px 24px',
                      borderBottom: index < patients.length - 1 ? '1px solid rgba(226, 232, 240, 0.4)' : 'none',
                      background: index % 2 === 0 ? 'rgba(248, 250, 252, 0.3)' : 'transparent',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(63, 182, 168, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'rgba(248, 250, 252, 0.3)' : 'transparent';
                    }}
                  >
                    <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => nav(`/clinical-notes/${patient.id}`)}>
                      <h4 style={{
                        fontSize: isMobile ? '14px' : '16px',
                        fontWeight: '600',
                        color: '#3fb6a8',
                        margin: '0 0 4px 0',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        transition: 'color 0.2s ease'
                      }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#319795';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#3fb6a8';
                        }}
                      >
                        {patient.first_name} {patient.last_name}
                      </h4>
                      {/* <p style={{
                        fontSize: isMobile ? '12px' : '13px',
                        color: '#718096',
                        margin: '0'
                      }}>
                        Last session: {patient.lastSession}
                      </p> */}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        recordSession(patient);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: isMobile ? '36px' : '40px',
                        height: isMobile ? '36px' : '40px',
                        borderRadius: '10px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #3fb6a8, #319795)',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 8px rgba(63, 182, 168, 0.2)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(63, 182, 168, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(63, 182, 168, 0.2)';
                      }}
                      title={`Record session for ${patient.first_name} ${patient.last_name}`}
                    >
                      {/* Mic Icon */}
                      <FontAwesomeIcon icon={faMicrophone} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Register New Patient Button */}
        <button
          onClick={registerNewPatient}
          style={{
            width: '100%',
            padding: isMobile ? '16px' : '20px',
            fontSize: isMobile ? '14px' : '16px',
            fontWeight: '600',
            border: 'none',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3fb6a8, #319795)',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'inherit',
            boxShadow: '0 8px 20px rgba(63, 182, 168, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
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
          {/* Plus Icon */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Register New Patient
        </button>
      </div>
    </div>
  );
};

export default Dashboard;