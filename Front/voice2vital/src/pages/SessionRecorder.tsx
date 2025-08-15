import React, { useEffect, useRef, useState } from "react";

const SessionRecorder: React.FC = () => {
  // Audio recording
  const mediaRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // UI states
  const [countdown, setCountdown] = useState(0);
  const [showSavedPopup, setShowSavedPopup] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'pending'>('pending');

  const recordingTimeRef = useRef<number | null>(null);
  // Check microphone permission on load
  useEffect(() => {
    navigator.permissions?.query({ name: 'microphone' as PermissionName })
      .then(permission => {
        setMicPermission(permission.state as 'granted' | 'denied');
        permission.addEventListener('change', () => {
          setMicPermission(permission.state as 'granted' | 'denied');
        });
      })
      .catch(() => setMicPermission('pending'));
  }, []);

  const startCountdown = () => {
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          startRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRecording = async () => {
    try {
      setAudioURL(null);
      setRecordingTime(0);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      mediaRef.current = rec;
      chunksRef.current = [];

      rec.ondataavailable = (ev) => chunksRef.current.push(ev.data);
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        stream.getTracks().forEach(track => track.stop());
      };

      rec.start();
      setRecording(true);
      setMicPermission('granted');

      // Start recording timer
      recordingTimeRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      setMicPermission('denied');
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    setRecording(false);

    if (recordingTimeRef.current) {
      clearInterval(recordingTimeRef.current);
    }

    // Show saved popup
    setTimeout(() => {
      setShowSavedPopup(true);
      setTimeout(() => setShowSavedPopup(false), 3000);
    }, 500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const goBack = () => {
    console.log("Navigate to /dashboard");
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioURL) URL.revokeObjectURL(audioURL);
      if (recordingTimeRef.current) {
        clearInterval(recordingTimeRef.current);
      }
    };
  }, [audioURL]);

  const isMobile = window.innerWidth <= 768;

  return (
    <div style={{
      minHeight: '100vh',
      minWidth: '100vw',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      position: 'relative'
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
                Voice Recording Session
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: isMobile ? '40px 20px' : '60px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 84px)',
        textAlign: 'center'
      }}>

        {/* Countdown Display */}
        {countdown > 0 && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: isMobile ? '72px' : '96px',
            fontWeight: '700',
            color: '#3fb6a8',
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '50%',
            width: isMobile ? '120px' : '160px',
            height: isMobile ? '120px' : '160px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 40px rgba(63, 182, 168, 0.2)',
            animation: 'pulse 1s ease-in-out infinite'
          }}>
            {countdown}
          </div>
        )}

        {/* Microphone Visualization */}
        <div style={{
          width: isMobile ? '200px' : '280px',
          height: isMobile ? '200px' : '280px',
          borderRadius: '50%',
          background: recording
            ? 'linear-gradient(135deg, #3fb6a8, #319795)'
            : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          marginBottom: '40px',
          boxShadow: recording
            ? '0 0 0 0 rgba(63, 182, 168, 1), 0 20px 40px rgba(63, 182, 168, 0.3)'
            : '0 20px 40px rgba(0, 0, 0, 0.1)',
          animation: recording ? 'micPulse 2s ease-in-out infinite' : 'none',
          transition: 'all 0.3s ease'
        }}>
          {/* Outer pulse rings for recording state */}
          {recording && (
            <>
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '3px solid rgba(63, 182, 168, 0.3)',
                animation: 'ripple 2s linear infinite'
              }} />
              <div style={{
                position: 'absolute',
                width: '120%',
                height: '120%',
                borderRadius: '50%',
                border: '2px solid rgba(63, 182, 168, 0.2)',
                animation: 'ripple 2s linear infinite 0.5s'
              }} />
            </>
          )}

          {/* Microphone Icon */}
          <svg
            width={isMobile ? "64" : "80"}
            height={isMobile ? "64" : "80"}
            viewBox="0 0 24 24"
            fill="none"
            stroke={recording ? "white" : "#3fb6a8"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </div>

        {/* Recording Status */}
        <div style={{ marginBottom: '32px' }}>
          {recording ? (
            <div>
              <h2 style={{
                fontSize: isMobile ? '24px' : '28px',
                fontWeight: '600',
                color: '#2d3748',
                margin: '0 0 8px 0'
              }}>
                Recording in Progress
              </h2>
              <p style={{
                color: '#3fb6a8',
                fontSize: isMobile ? '18px' : '20px',
                margin: '0',
                fontWeight: '600'
              }}>
                {formatTime(recordingTime)}
              </p>
            </div>
          ) : countdown > 0 ? (
            <div>
              <h2 style={{
                fontSize: isMobile ? '24px' : '28px',
                fontWeight: '600',
                color: '#2d3748',
                margin: '0 0 8px 0'
              }}>
                Get Ready
              </h2>
              <p style={{
                color: '#718096',
                fontSize: isMobile ? '16px' : '18px',
                margin: '0'
              }}>
                Recording starts in {countdown}...
              </p>
            </div>
          ) : micPermission === 'denied' ? (
            <div>
              <h2 style={{
                fontSize: isMobile ? '24px' : '28px',
                fontWeight: '600',
                color: '#e53e3e',
                margin: '0 0 8px 0'
              }}>
                Microphone Access Denied
              </h2>
              <p style={{
                color: '#718096',
                fontSize: isMobile ? '16px' : '18px',
                margin: '0'
              }}>
                Please allow microphone access to record
              </p>
            </div>
          ) : (
            <div>
              <h2 style={{
                fontSize: isMobile ? '24px' : '28px',
                fontWeight: '600',
                color: '#2d3748',
                margin: '0 0 8px 0'
              }}>
                Ready to Record
              </h2>
              <p style={{
                color: '#718096',
                fontSize: isMobile ? '16px' : '18px',
                margin: '0'
              }}>
                Click start when you're ready to begin
              </p>
            </div>
          )}
        </div>

        {/* Control Button */}
        {!recording && countdown === 0 ? (
          <button
            onClick={startCountdown}
            disabled={micPermission === 'denied'}
            style={{
              padding: isMobile ? '16px 32px' : '20px 40px',
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '50px',
              background: micPermission === 'denied'
                ? '#a0aec0'
                : 'linear-gradient(135deg, #3fb6a8, #319795)',
              color: 'white',
              cursor: micPermission === 'denied' ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: micPermission === 'denied'
                ? 'none'
                : '0 8px 20px rgba(63, 182, 168, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (micPermission !== 'denied') {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(63, 182, 168, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (micPermission !== 'denied') {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(63, 182, 168, 0.3)';
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="8 5 19 12 8 19 8 5" />
            </svg>
            Start Recording
          </button>
        ) : recording ? (
          <button
            onClick={stopRecording}
            style={{
              padding: isMobile ? '16px 32px' : '20px 40px',
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '50px',
              background: 'linear-gradient(135deg, #e53e3e, #c53030)',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 8px 20px rgba(229, 62, 62, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(229, 62, 62, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(229, 62, 62, 0.3)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
            Stop Recording
          </button>
        ) : null}
      </div>

      {/* Success Popup */}
      {showSavedPopup && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          zIndex: 1000,
          textAlign: 'center',
          minWidth: isMobile ? '280px' : '320px',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #48bb78, #38a169)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#2d3748',
            margin: '0 0 8px 0'
          }}>
            Recording Saved!
          </h3>
          <p style={{
            color: '#718096',
            fontSize: '16px',
            margin: '0'
          }}>
            Your voice recording has been successfully saved.
          </p>
        </div>
      )}

      <style>
        {`
          @keyframes micPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          @keyframes ripple {
            0% {
              opacity: 1;
              transform: scale(1);
            }
            100% {
              opacity: 0;
              transform: scale(1.4);
            }
          }
          
          @keyframes pulse {
            0%, 100% { 
              transform: translate(-50%, -50%) scale(1); 
              box-shadow: 0 20px 40px rgba(63, 182, 168, 0.2);
            }
            50% { 
              transform: translate(-50%, -50%) scale(1.05); 
              box-shadow: 0 25px 50px rgba(63, 182, 168, 0.3);
            }
          }
          
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.8);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default SessionRecorder;