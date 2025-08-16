import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPaperPlane,
    faRobot,
    faUserMd,
    faArrowLeft,
    faMicrophone,
    faStop,
    faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode';

interface Message {
    id: number;
    content: string;
    isBot: boolean;
    timestamp: Date;
}

const ChatBox: React.FC = () => {
    const nav = useNavigate();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            content: "Hello! I'm Dr. Vital, your virtual medical assistant. I'm here to help you with clinical documentation, medical queries, and patient care guidance. How can I assist you today?",
            isBot: true,
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Get user data from localStorage (same pattern as other components)
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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const simulateBotResponse = async (userMessage: string) => {
        setIsTyping(true);

        try {
            // Make API call to backend
            const response = await fetch('/chat/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage
                })
            });

            const data = await response.json();

            let botResponse = '';

            if (data.success && data.ai_response) {
                botResponse = data.ai_response;
            } else {
                // Fallback response if API fails
                botResponse = data.error || 'Sorry, I encountered an issue processing your request. Please try again.';
            }

            const newMessage: Message = {
                id: Date.now(),
                content: botResponse,
                isBot: true,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, newMessage]);

        } catch (error) {
            console.error('Error calling chat API:', error);

            // Fallback response for network errors
            const errorMessage: Message = {
                id: Date.now(),
                content: 'Sorry, I\'m having trouble connecting to the server. Please check your connection and try again.',
                isBot: true,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage: Message = {
            id: Date.now(),
            content: inputMessage,
            isBot: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        await simulateBotResponse(inputMessage);
        setInputMessage('');
    };

    const handleKeyPress = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            await handleSendMessage();
        }
    };

    const toggleVoiceInput = () => {
        setIsListening(!isListening);
        // In a real implementation, you would integrate with Web Speech API here
        if (!isListening) {
            // Start listening
            console.log('Voice input started');
        } else {
            // Stop listening
            console.log('Voice input stopped');
        }
    };

    const logout = () => {
        localStorage.removeItem("authUser");
        nav('/');
    };

    const goBackToDashboard = () => {
        nav('/dashboard');
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
                            Dr. Vital - AI Assistant
                        </h1>
                        <p style={{
                            color: '#718096',
                            fontSize: isMobile ? '12px' : '14px',
                            margin: '2px 0 0 0',
                            fontWeight: '500'
                        }}>
                            Your intelligent medical companion
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

            {/* Chat Container */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: isMobile ? '20px' : '32px',
                height: 'calc(100vh - 84px)',
                display: 'flex',
                flexDirection: 'column'
            }}>

                {/* Welcome Section */}
                <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3fb6a8, #319795)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px auto',
                        boxShadow: '0 8px 24px rgba(63, 182, 168, 0.3)'
                    }}>
                        <FontAwesomeIcon icon={faRobot} size="2x" color="white" />
                    </div>
                    <h2 style={{
                        fontSize: isMobile ? '24px' : '28px',
                        fontWeight: '600',
                        color: '#2d3748',
                        margin: '0 0 8px 0'
                    }}>
                        Chat with Dr. Vital
                    </h2>
                    <p style={{
                        color: '#718096',
                        fontSize: isMobile ? '14px' : '16px',
                        margin: '0'
                    }}>
                        Ask me anything about patient care, documentation, or medical queries
                    </p>
                </div>

                {/* Chat Messages Container */}
                <div style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    marginBottom: '20px'
                }}>

                    {/* Messages Area */}
                    <div style={{
                        flex: 1,
                        padding: '24px',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    }}>
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    justifyContent: message.isBot ? 'flex-start' : 'flex-end'
                                }}
                            >
                                {message.isBot && (
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #3fb6a8, #319795)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <FontAwesomeIcon icon={faRobot} size="sm" color="white" />
                                    </div>
                                )}

                                <div style={{
                                    maxWidth: '70%',
                                    padding: '12px 16px',
                                    borderRadius: message.isBot ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                                    background: message.isBot
                                        ? 'linear-gradient(135deg, #f8fafc, #e2e8f0)'
                                        : 'linear-gradient(135deg, #3fb6a8, #319795)',
                                    color: message.isBot ? '#2d3748' : 'white',
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    whiteSpace: 'pre-wrap',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                }}>
                                    {message.content}
                                    <div style={{
                                        fontSize: '11px',
                                        opacity: 0.7,
                                        marginTop: '6px',
                                        textAlign: 'right'
                                    }}>
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>

                                {!message.isBot && (
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #4a5568, #2d3748)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <FontAwesomeIcon icon={faUserMd} size="sm" color="white" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px'
                            }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #3fb6a8, #319795)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <FontAwesomeIcon icon={faSpinner} size="sm" color="white" spin />
                                </div>

                                <div style={{
                                    padding: '12px 16px',
                                    borderRadius: '16px 16px 16px 4px',
                                    background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
                                    color: '#718096',
                                    fontSize: '14px',
                                    fontStyle: 'italic'
                                }}>
                                    Dr. Vital is typing...
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={{
                        padding: '16px 24px',
                        borderTop: '1px solid rgba(226, 232, 240, 0.6)',
                        background: 'rgba(248, 250, 252, 0.5)'
                    }}>
                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'center'
                        }}>
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask Dr. Vital anything about patient care..."
                                style={{
                                    flex: 1,
                                    padding: '12px 16px',
                                    borderRadius: '24px',
                                    border: '1px solid #e2e8f0',
                                    background: 'white',
                                    color: '#000000',
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: 'all 0.2s ease'
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

                            <button
                                onClick={toggleVoiceInput}
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: isListening
                                        ? 'linear-gradient(135deg, #e53e3e, #c53030)'
                                        : 'linear-gradient(135deg, #718096, #4a5568)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                <FontAwesomeIcon icon={isListening ? faStop : faMicrophone} size="sm" />
                            </button>

                            <button
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim()}
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: inputMessage.trim()
                                        ? 'linear-gradient(135deg, #3fb6a8, #319795)'
                                        : 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
                                    color: inputMessage.trim() ? 'white' : '#9ca3af',
                                    cursor: inputMessage.trim() ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    if (inputMessage.trim()) {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(63, 182, 168, 0.3)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <FontAwesomeIcon icon={faPaperPlane} size="sm" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;