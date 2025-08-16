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
  const [isProcessing, setIsProcessing] = useState(false);

  const recordingTimeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const handleFileUpload = async () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        await uploadAudioFile(file);
      }
    };
    
    // Trigger the file selection dialog
    input.click();
  };

  const uploadAudioFile = async (file: File) => {
    try {
      // Show loading state
      setIsProcessing(true);
      
      const formData = new FormData();
      formData.append('audio_file', file);
      
      const response = await fetch('http://localhost:5000/transcribe/audio', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Transcription result:', result);
        
        // Show success popup
        setShowSavedPopup(true);
        setTimeout(() => setShowSavedPopup(false), 3000);
      } else {
        const errorData = await response.json();
        console.error('Upload failed:', errorData);
        alert('Upload failed: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file: ' + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const stopRecording = () => {
    // Check if MediaRecorder exists and is recording
    if (mediaRef.current && mediaRef.current.state === 'recording') {
      mediaRef.current.stop();
    }
    setRecording(false);

    if (recordingTimeRef.current) {
      clearInterval(recordingTimeRef.current);
      recordingTimeRef.current = null;
    }

    // Show saved popup
    setTimeout(() => {
      setShowSavedPopup(true);
      setTimeout(() => setShowSavedPopup(false), 3000);
    }, 500);
  };

  // Function to save recording to file
  const saveRecordingToFile = (blob: Blob) => {
    // Create a download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Optionally, you can also send to server:
    // uploadRecordingToServer(blob);
  };

  // Optional: Function to upload to server
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const uploadRecordingToServer = async (blob: Blob) => {
    const formData = new FormData();
    formData.append('audio', blob, 'recording.webm');
    
    try {
      const response = await fetch('/api/upload-recording', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        console.log('Recording uploaded successfully');
      } else {
        console.error('Failed to upload recording');
      }
    } catch (error) {
      console.error('Error uploading recording:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (mediaRef.current && mediaRef.current.state === 'recording') {
        mediaRef.current.stop();
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
                From doctor-patient conversations to organized clinical notes.
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

        <h2 style={{
              fontSize: isMobile ? '24px' : '28px',
              fontWeight: '600',
              color: '#2d3748',
              margin: '0 0 50px 0'
            }}>
              Audio Upload Session
            </h2>

        {/* Countdown Display */}
        {isProcessing && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: isMobile ? '24px' : '32px',
            fontWeight: '600',
            color: '#3fb6a8',
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            width: isMobile ? '280px' : '320px',
            height: isMobile ? '120px' : '140px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 40px rgba(63, 182, 168, 0.2)',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e2e8f0',
              borderTop: '4px solid #3fb6a8',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '16px'
            }} />
            Processing Audio...
          </div>
        )}

        {/* File Upload Visualization */}
        <div style={{
          width: isMobile ? '200px' : '280px',
          height: isMobile ? '200px' : '280px',
          borderRadius: '50%',
          background: isProcessing
            ? 'linear-gradient(135deg, #3fb6a8, #319795)'
            : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          marginBottom: '40px',
          boxShadow: isProcessing
            ? '0 0 0 0 rgba(63, 182, 168, 1), 0 20px 40px rgba(63, 182, 168, 0.3)'
            : '0 20px 40px rgba(0, 0, 0, 0.1)',
          animation: isProcessing ? 'micPulse 2s ease-in-out infinite' : 'none',
          transition: 'all 0.3s ease'
        }}>
          {/* Outer pulse rings for processing state */}
          {isProcessing && (
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

          {/* Upload Icon */}
          <svg
            width={isMobile ? "64" : "80"}
            height={isMobile ? "64" : "80"}
            viewBox="0 0 24 24"
            fill="none"
            stroke={isProcessing ? "white" : "#3fb6a8"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
        </div>

        {/* Processing Status */}
        <div style={{ marginBottom: '32px' }}>
          {isProcessing ? (
            <div>
              <h2 style={{
                fontSize: isMobile ? '24px' : '28px',
                fontWeight: '600',
                color: '#2d3748',
                margin: '0 0 8px 0'
              }}>
                Processing Audio
              </h2>
              <p style={{
                color: '#3fb6a8',
                fontSize: isMobile ? '18px' : '20px',
                margin: '0',
                fontWeight: '600'
              }}>
                Transcribing your audio file...
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
                Ready to Upload
              </h2>
              <p style={{
                color: '#718096',
                fontSize: isMobile ? '16px' : '18px',
                margin: '0'
              }}>
                Click upload to select an audio file
              </p>
            </div>
          )}
        </div>

        {/* Control Button */}
        {!isProcessing ? (
          <button
            onClick={handleFileUpload}
            style={{
              padding: isMobile ? '16px 32px' : '20px 40px',
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '50px',
              background: 'linear-gradient(135deg, #3fb6a8, #319795)',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 8px 20px rgba(63, 182, 168, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(63, 182, 168, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(63, 182, 168, 0.3)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
            Upload Recording
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
            Audio Uploaded Successfully!
          </h3>
          <p style={{
            color: '#718096',
            fontSize: '16px',
            margin: '0'
          }}>
            Your audio file has been processed and transcribed.
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
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
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