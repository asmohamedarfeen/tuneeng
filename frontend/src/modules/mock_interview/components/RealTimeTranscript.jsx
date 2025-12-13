/**
 * RealTimeTranscript Component - Right-side panel for live transcription
 * Displays user's answer as they speak in real-time
 */

import React, { useEffect, useRef } from 'react';
import './RealTimeTranscript.css';

const RealTimeTranscript = ({ transcriptText, isListening, isActive }) => {
  const textAreaRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom when text updates
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
    }
  }, [transcriptText]);

  // Show/hide based on active state
  if (!isActive) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className={`real-time-transcript ${isListening ? 'listening' : ''}`}
    >
      <div className="rt-transcript-header">
        <div className="rt-transcript-title">
          <span className="rt-icon">📝</span>
          <span>Your Answer</span>
          {isListening && (
            <span className="rt-listening-indicator" title="Listening...">
              <span className="rt-pulse-dot"></span>
            </span>
          )}
        </div>
      </div>
      
      <div className="rt-transcript-content">
        <textarea
          ref={textAreaRef}
          className="rt-transcript-textarea"
          value={transcriptText || ''}
          readOnly
          placeholder={isListening ? "Speak your answer... (transcription will appear here)" : "Waiting for question..."}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: '#fff',
            fontSize: '1rem',
            lineHeight: '1.6',
            padding: '1rem',
            resize: 'none',
            fontFamily: 'inherit'
          }}
        />
        {isListening && !transcriptText && (
          <div className="rt-placeholder">
            <div className="rt-typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p>Listening for your answer...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealTimeTranscript;

