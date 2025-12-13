/**
 * ChatOverlay Component - Real-time transcript display
 * Shows user and AI messages with streaming support
 */

import React, { useEffect, useRef, useState } from 'react';
import './ChatOverlay.css';

const ChatOverlay = ({ transcripts, isMinimized, onToggleMinimize, streamingText, streamingSpeaker, isListening }) => {
  const messagesEndRef = useRef(null);
  const [localTranscripts, setLocalTranscripts] = useState([]);

  // Update local transcripts when props change
  useEffect(() => {
    if (transcripts && Array.isArray(transcripts)) {
      setLocalTranscripts([...transcripts]);
    }
  }, [transcripts]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [localTranscripts, streamingText]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className={`chat-overlay ${isMinimized ? 'minimized' : ''}`}>
      <div className="chat-header">
        <div className="chat-title">
          <span className="chat-icon">💬</span>
          <span>Live Transcript</span>
          {isListening && (
            <span className="listening-indicator" title="Listening for your answer...">
              🎤 <span className="pulse-dot"></span>
            </span>
          )}
        </div>
        <button 
          className="toggle-button"
          onClick={onToggleMinimize}
          title={isMinimized ? 'Expand' : 'Minimize'}
        >
          {isMinimized ? '▲' : '▼'}
        </button>
      </div>

      {!isMinimized && (
        <div className="chat-messages">
          {localTranscripts.length === 0 && !streamingText && (
            <div className="empty-state">
              <p>No messages yet. Start speaking to see the transcript.</p>
            </div>
          )}

          {localTranscripts.map((transcript, index) => (
            <div 
              key={transcript.id || index} 
              className={`message ${transcript.speaker || 'user'}`}
            >
              <div className="message-header">
                <span className="speaker-name">
                  {transcript.speaker === 'ai' ? 'AI HR' : 'You'}
                </span>
                {transcript.timestamp && (
                  <span className="message-time">
                    {formatTimestamp(transcript.timestamp)}
                  </span>
                )}
              </div>
              <div className="message-text">
                {transcript.text}
              </div>
              {transcript.isInterim && (
                <div className="interim-indicator">...</div>
              )}
            </div>
          ))}

          {/* Streaming message */}
          {streamingText && (
            <div className={`message ${streamingSpeaker || 'ai'} streaming`}>
              <div className="message-header">
                <span className="speaker-name">
                  {streamingSpeaker === 'ai' ? 'AI HR' : 'You'}
                </span>
                <span className="streaming-indicator">
                  <span className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </span>
              </div>
              <div className="message-text">
                {streamingText}
                <span className="cursor">|</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {isMinimized && localTranscripts.length > 0 && (
        <div className="minimized-preview">
          <span className="preview-text">
            {localTranscripts[localTranscripts.length - 1]?.text?.substring(0, 50)}...
          </span>
        </div>
      )}
    </div>
  );
};

export default ChatOverlay;
