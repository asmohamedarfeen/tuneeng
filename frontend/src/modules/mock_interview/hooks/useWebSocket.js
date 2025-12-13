/**
 * React hook for WebSocket signaling
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import WebSocketClient from '../services/websocket';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

export const useWebSocket = (roomId) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const wsClientRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;

    const wsClient = new WebSocketClient(WS_URL);
    wsClientRef.current = wsClient;
    // Make websocket client globally accessible for audio capture
    window.__wsClient__ = wsClient;

    // Set up event listeners
    wsClient.on('connected', () => {
      setIsConnected(true);
      setError(null);
    });

    wsClient.on('disconnected', () => {
      setIsConnected(false);
    });

    wsClient.on('error', (err) => {
      setError(err);
      setIsConnected(false);
    });

    wsClient.on('reconnect-failed', () => {
      setError(new Error('Failed to reconnect to WebSocket'));
    });

    // Connect
    wsClient.connect(roomId).catch((err) => {
      setError(err);
      setIsConnected(false);
    });

    // Cleanup
    return () => {
      wsClient.disconnect();
    };
  }, [roomId]);

  const sendOffer = useCallback((sessionId, offer, interviewSessionId) => {
    if (wsClientRef.current) {
      wsClientRef.current.sendOffer(sessionId, offer, interviewSessionId);
    }
  }, []);

  const sendAnswer = useCallback((sessionId, answer, interviewSessionId) => {
    if (wsClientRef.current) {
      wsClientRef.current.sendAnswer(sessionId, answer, interviewSessionId);
    }
  }, []);

  const sendICECandidate = useCallback((sessionId, candidate, interviewSessionId) => {
    if (wsClientRef.current) {
      wsClientRef.current.sendICECandidate(sessionId, candidate, interviewSessionId);
    }
  }, []);

  const sendInterviewState = useCallback((interviewSessionId, state) => {
    if (wsClientRef.current) {
      wsClientRef.current.sendInterviewState(interviewSessionId, state);
    }
  }, []);

  const on = useCallback((event, callback) => {
    if (wsClientRef.current) {
      wsClientRef.current.on(event, callback);
    }
  }, []);

  const off = useCallback((event, callback) => {
    if (wsClientRef.current) {
      wsClientRef.current.off(event, callback);
    }
  }, []);

  return {
    isConnected,
    error,
    sendOffer,
    sendAnswer,
    sendICECandidate,
    sendInterviewState,
    on,
    off,
  };
};

