/**
 * Interview Room Page - Google Meet-like interface with AI HR
 * Uses VideoPanel, ChatOverlay, and AudioVisualizer components
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWebRTC } from '../hooks/useWebRTC';
import { useWebSocket } from '../hooks/useWebSocket';
import { startInterview, endInterview, getInterviewSession } from '../services/api';
import VideoPanel from '../components/VideoPanel';
import ChatOverlay from '../components/ChatOverlay';
import AudioVisualizer from '../components/AudioVisualizer';
import RealTimeTranscript from '../components/RealTimeTranscript';
import './InterviewRoom.css';

const InterviewRoom = () => {
  const { interviewSessionId } = useParams();
  const navigate = useNavigate();

  // Debug: Log component mount
  useEffect(() => {
    console.log('✅ InterviewRoom component mounted');
    console.log('Interview Session ID:', interviewSessionId);
  }, []);

  const [interviewData, setInterviewData] = useState(null);
  const [transcripts, setTranscripts] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [streamingText, setStreamingText] = useState('');
  const [streamingSpeaker, setStreamingSpeaker] = useState(null);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [silenceDetected, setSilenceDetected] = useState(false);
  const [realTimeTranscript, setRealTimeTranscript] = useState(''); // Real-time transcription text
  const [testMode, setTestMode] = useState(false); // Test mode: 2 questions
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const isListeningRef = useRef(false); // Use ref to avoid stale closures
  const audioCaptureIntervalRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamSourceRef = useRef(null);
  const processorNodeRef = useRef(null);
  const audioQueueRef = useRef([]);
  const isPlayingAudioRef = useRef(false);
  const currentAudioRef = useRef(null);
  const silenceStartTimeRef = useRef(null); // Track when silence started
  const lastAudioTimeRef = useRef(null); // Track last time we detected audio
  const silenceThreshold = 0.005; // Audio amplitude threshold for silence detection
  const silenceDurationMs = 2500; // 2.5 seconds of silence before stopping

  // Compute webrtcSessionId - use a stable value to avoid hook re-initialization
  const webrtcSessionId = interviewData?.webrtc_session_id || interviewSessionId || 'default-room';
  
  // WebSocket hook - initialize first with stable room ID
  const { 
    isConnected, 
    sendOffer, 
    sendAnswer, 
    sendICECandidate, 
    on, 
    off 
  } = useWebSocket(webrtcSessionId || 'default-room');

  // WebRTC hook with video support - initialize after WebSocket
  const { 
    localStream, 
    remoteStream, 
    connectionState, 
    iceConnectionState,
    createOffer, 
    setRemoteDescription, 
    createAnswer, 
    addICECandidate,
    toggleMute,
    toggleVideo
  } = useWebRTC(
    webrtcSessionId || 'default-room',
    interviewSessionId || null,
    (stream) => {
      // Remote stream received
      console.log('Remote stream received:', stream);
    }
  );
  
  // Debug: Log stream states
  useEffect(() => {
    if (localStream) {
      console.log('📹 Local stream available:', {
        videoTracks: localStream.getVideoTracks().length,
        audioTracks: localStream.getAudioTracks().length,
        videoEnabled: localStream.getVideoTracks()[0]?.enabled
      });
    }
    if (remoteStream) {
      console.log('📹 Remote stream available:', {
        videoTracks: remoteStream.getVideoTracks().length,
        audioTracks: remoteStream.getAudioTracks().length
      });
    }
  }, [localStream, remoteStream]);

  // Load interview data if session ID exists in URL
  useEffect(() => {
    if (interviewSessionId && !interviewData) {
      const loadInterview = async () => {
        try {
          const data = await getInterviewSession(interviewSessionId);
          setInterviewData(data);
          
          // Try to get current question from Redis state (via WebSocket or API)
          // For now, we'll wait for WebSocket to send it
        } catch (error) {
          console.error('Error loading interview:', error);
          // Don't set error state to prevent UI flickering
        }
      };
      loadInterview();
    }
  }, [interviewSessionId]); // Removed interviewData from dependencies to prevent loops

  // Update connection status
  useEffect(() => {
    if (iceConnectionState === 'connected' || iceConnectionState === 'completed') {
      setConnectionStatus('connected');
    } else if (iceConnectionState === 'checking' || connectionState === 'connecting') {
      setConnectionStatus('connecting');
    } else {
      setConnectionStatus('disconnected');
    }
  }, [connectionState, iceConnectionState]);

  // Handle AI speech complete - automatically start listening
  const handleAISpeechComplete = useCallback((data) => {
    console.log('[EVENT] Received ai-speech-complete event:', {
      ready_for_input: data.ready_for_input,
      timestamp: data.timestamp,
      interview_session_id: data.interview_session_id,
      question_number: data.question_number,
      total_questions: data.total_questions
    });
    
    // Update question number if provided
    if (data.question_number) {
      setQuestionNumber(data.question_number);
    }
    if (data.total_questions) {
      setTotalQuestions(data.total_questions);
    }
    
    if (data.ready_for_input && interviewSessionId && isConnected) {
      console.log('[STATE] AI finished speaking, sending start-listening event to backend...');
      
      // Send start-listening event to trigger backend microphone input
      const wsClient = window.__wsClient__;
      if (wsClient && wsClient.sendStartListening && interviewSessionId) {
        wsClient.sendStartListening(interviewSessionId);
        setIsListening(true);
        isListeningRef.current = true;
        console.log('[STATE] ✅ Sent start-listening event to backend');
      } else {
        console.warn('[STATE] ⚠️ Cannot send start-listening:', {
          hasWsClient: !!wsClient,
          hasSendStartListening: wsClient?.sendStartListening,
          hasInterviewId: !!interviewSessionId,
          isConnected
        });
      }
    }
  }, [interviewSessionId, isConnected]);

  // Stop audio capture
  const stopAudioCapture = useCallback(() => {
    if (processorNodeRef.current) {
      try {
        processorNodeRef.current.disconnect();
      } catch (e) {}
      processorNodeRef.current = null;
    }
    if (mediaStreamSourceRef.current) {
      try {
        mediaStreamSourceRef.current.disconnect();
      } catch (e) {}
      mediaStreamSourceRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }
    // Reset silence tracking
    silenceStartTimeRef.current = null;
    lastAudioTimeRef.current = null;
    setSilenceDetected(false);
    // Clear real-time transcript when stopping
    setRealTimeTranscript('');
    isListeningRef.current = false;
    setIsListening(false);
  }, []);

  // Start capturing audio from local stream and sending to backend
  const startAudioCapture = useCallback(() => {
    if (!localStream || !interviewSessionId || !isConnected) return;
    
    // Stop any existing capture
    stopAudioCapture();
    
    try {
      // Create AudioContext for processing
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      
      // Create media stream source
      mediaStreamSourceRef.current = audioContextRef.current.createMediaStreamSource(localStream);
      
      // Create script processor for capturing audio
      const bufferSize = 4096;
      processorNodeRef.current = audioContextRef.current.createScriptProcessor(bufferSize, 1, 1);
      
      // Reset silence tracking when starting capture
      silenceStartTimeRef.current = null;
      lastAudioTimeRef.current = null;
      setSilenceDetected(false);
      
      processorNodeRef.current.onaudioprocess = (event) => {
        // Use ref to check listening state to avoid stale closure
        if (!isListeningRef.current || isMuted) {
          return;
        }
        
        // Throttle sending - only send every ~100ms to avoid overwhelming the backend
        const now = Date.now();
        if (!processorNodeRef.current._lastSendTime) {
          processorNodeRef.current._lastSendTime = now;
        }
        if (now - processorNodeRef.current._lastSendTime < 100) {
          return;
        }
        processorNodeRef.current._lastSendTime = now;
        
        const inputData = event.inputBuffer.getChannelData(0);
        
        // Check if there's actual audio (not silence) - lower threshold for better sensitivity
        let hasAudio = false;
        let maxAmplitude = 0;
        for (let i = 0; i < inputData.length; i++) {
          const amplitude = Math.abs(inputData[i]);
          maxAmplitude = Math.max(maxAmplitude, amplitude);
          if (amplitude > silenceThreshold) {
            hasAudio = true;
            break;
          }
        }
        
        // Silence detection logic
        if (hasAudio) {
          // Audio detected - reset silence tracking
          if (lastAudioTimeRef.current === null) {
            // First audio detected - initialize tracking
            lastAudioTimeRef.current = now;
          } else {
            // Update last audio time
            lastAudioTimeRef.current = now;
          }
          if (silenceStartTimeRef.current !== null) {
            // We had silence before, but now we have audio - reset
            silenceStartTimeRef.current = null;
            if (silenceDetected) {
              setSilenceDetected(false);
              console.log('[SILENCE] Audio detected, resetting silence timer');
            }
          }
        } else {
          // No audio detected - check if we've been silent long enough
          if (lastAudioTimeRef.current === null) {
            // Haven't detected any audio yet - don't start silence timer
            return;
          }
          
          // Calculate silence duration since last audio
          const silenceDuration = now - lastAudioTimeRef.current;
          
          if (silenceDuration >= silenceDurationMs) {
            // Silence detected for long enough - stop listening
            if (!silenceDetected) {
              console.log(`[SILENCE] ⚠️ Silence detected for ${silenceDuration}ms (threshold: ${silenceDurationMs}ms), stopping listening`);
              setSilenceDetected(true);
              
              // Stop listening after a brief delay to allow final audio chunks to be sent
              setTimeout(() => {
                if (isListeningRef.current) {
                  console.log('[SILENCE] ✅ Stopping listening due to silence detection');
                  isListeningRef.current = false;
                  setIsListening(false);
                  stopAudioCapture();
                }
              }, 200); // Small delay to send any pending chunks
            }
            return; // Don't process silent chunks
          } else if (silenceDuration >= silenceDurationMs * 0.7) {
            // Approaching silence threshold - show warning (but don't stop yet)
            if (!silenceDetected) {
              console.log(`[SILENCE] ⚠️ Approaching silence threshold (${silenceDuration}ms / ${silenceDurationMs}ms)`);
            }
          }
        }
        
        if (!hasAudio) {
          return; // Skip silent chunks (but we still track them for silence detection)
        }
        
        // Convert Float32Array to Int16Array (16-bit PCM)
        const int16Data = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          // Clamp and convert to 16-bit integer
          const s = Math.max(-1, Math.min(1, inputData[i]));
          int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        
        // Convert to base64 and send via WebSocket
        try {
          const bytes = new Uint8Array(int16Data.buffer);
          let binary = '';
          for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64Audio = btoa(binary);
          
          // Send via WebSocket using the websocket service
          const wsClient = window.__wsClient__;
          if (wsClient && wsClient.sendAudioChunk && interviewSessionId) {
            wsClient.sendAudioChunk(base64Audio, interviewSessionId);
            
            // Log periodically (every 50 chunks = ~5 seconds)
            if (!processorNodeRef.current._chunkCount) {
              processorNodeRef.current._chunkCount = 0;
            }
            processorNodeRef.current._chunkCount++;
            if (processorNodeRef.current._chunkCount === 1) {
              console.log('[AUDIO] 🎤 Started sending audio chunks for STT transcription...');
            }
            if (processorNodeRef.current._chunkCount % 50 === 0) {
              console.log(`[AUDIO] 🎤 Sending audio chunks for STT... (${processorNodeRef.current._chunkCount} chunks, amplitude: ${maxAmplitude.toFixed(3)})`);
            }
          } else {
            if (processorNodeRef.current._chunkCount === 1 || processorNodeRef.current._chunkCount % 100 === 0) {
              console.warn('⚠️ Cannot send audio chunk:', {
                hasWsClient: !!wsClient,
                hasSendAudioChunk: wsClient?.sendAudioChunk,
                hasInterviewId: !!interviewSessionId
              });
            }
          }
        } catch (err) {
          console.error('Error encoding audio:', err);
        }
      };
      
      // Connect processor to destination
      mediaStreamSourceRef.current.connect(processorNodeRef.current);
      processorNodeRef.current.connect(audioContextRef.current.destination);
      
      console.log('[AUDIO] ✅ Audio capture started for STT');
      console.log('[AUDIO] Silence detection enabled:', {
        threshold: silenceThreshold,
        durationMs: silenceDurationMs
      });
    } catch (error) {
      console.error('[AUDIO] ❌ Error starting audio capture:', error);
      isListeningRef.current = false;
      setIsListening(false);
    }
  }, [localStream, interviewSessionId, isMuted, isConnected, stopAudioCapture]);

  // Audio capture disabled - using backend direct microphone input instead
  // Keep the effect but don't start audio capture for STT
  useEffect(() => {
    // Audio capture is now handled by backend microphone
    // We only manage the listening state UI
    if (!isListening) {
      stopAudioCapture(); // Clean up any existing capture
    }
    
    return () => {
      stopAudioCapture();
    };
  }, [isListening, stopAudioCapture]);

  // Audio queue system for sequential playback - defined outside useEffect
  const playNextAudioChunk = useCallback(async () => {
    if (isPlayingAudioRef.current || audioQueueRef.current.length === 0) {
      return;
    }

    isPlayingAudioRef.current = true;
    const audioData = audioQueueRef.current.shift();

    try {
      // Convert base64 to blob
      const binaryString = atob(audioData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Try WAV first, fallback to other formats
      let blob = new Blob([bytes], { type: 'audio/wav' });
      let audioUrl = URL.createObjectURL(blob);
      
      const audio = new Audio(audioUrl);
      audio.volume = 1.0;
      currentAudioRef.current = audio;

      // Set up event handlers
      const cleanup = () => {
        try {
          URL.revokeObjectURL(audioUrl);
        } catch (e) {
          console.warn('Error revoking audio URL:', e);
        }
        currentAudioRef.current = null;
        isPlayingAudioRef.current = false;
      };

      audio.addEventListener('ended', () => {
        cleanup();
        // Play next chunk in queue
        setTimeout(() => {
          if (audioQueueRef.current.length > 0) {
            playNextAudioChunk();
          }
        }, 50); // Small delay to ensure cleanup
      });

      audio.addEventListener('error', (e) => {
        console.error('❌ Audio playback error:', e, 'Error code:', audio.error?.code);
        // Try with different MIME type if WAV fails
        if (audio.error?.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
          console.log('Trying alternative audio format...');
          blob = new Blob([bytes], { type: 'audio/mpeg' });
          audioUrl = URL.createObjectURL(blob);
          audio.src = audioUrl;
          audio.load();
          audio.play().catch(err => {
            console.error('❌ Failed with alternative format:', err);
            cleanup();
            if (audioQueueRef.current.length > 0) {
              playNextAudioChunk();
            }
          });
          return;
        }
        cleanup();
        // Try next chunk even if this one failed
        setTimeout(() => {
          if (audioQueueRef.current.length > 0) {
            playNextAudioChunk();
          }
        }, 50);
      });

      // Add load event to ensure audio is ready
      audio.addEventListener('canplaythrough', () => {
        console.log('✅ Audio ready to play');
      });

      audio.addEventListener('loadstart', () => {
        console.log('🎵 Audio loading started');
      });

      await audio.play();
      console.log('✅ Playing audio chunk, queue remaining:', audioQueueRef.current.length);
    } catch (error) {
      console.error('❌ Error playing audio chunk:', error);
      currentAudioRef.current = null;
      isPlayingAudioRef.current = false;
      // Try next chunk even if this one failed
      setTimeout(() => {
        if (audioQueueRef.current.length > 0) {
          playNextAudioChunk();
        }
      }, 50);
    }
  }, []);

  // Audio chunk for TTS - queue system for sequential playback
  const handleAudioChunk = useCallback((data) => {
    if (data.audio_chunk) {
      console.log('📥 Received audio chunk, adding to queue. Current queue length:', audioQueueRef.current.length);
      // Add to queue
      audioQueueRef.current.push(data.audio_chunk);
      
      // Start playing if not already playing
      if (!isPlayingAudioRef.current) {
        console.log('🎵 Starting audio playback...');
        playNextAudioChunk();
      } else {
        console.log('🎵 Audio already playing, chunk queued');
      }
    } else {
      console.warn('⚠️ Received audio chunk event but no audio_chunk in data:', data);
    }
  }, [playNextAudioChunk]);

  // WebSocket event handlers
  useEffect(() => {
    if (!isConnected) return;

    const handleOffer = async (data) => {
      if (data.offer) {
        await setRemoteDescription(data.offer);
        const answer = await createAnswer();
        if (answer) {
          sendAnswer(data.session_id, answer, interviewSessionId);
        }
      }
    };

    const handleAnswer = async (data) => {
      if (data.answer) {
        await setRemoteDescription(data.answer);
      }
    };

    const handleICECandidate = async (data) => {
      if (data.candidate) {
        await addICECandidate(new RTCIceCandidate(data.candidate));
      }
    };

    // Real-time transcript updates
    const handleTranscript = (data) => {
      if (data.text && data.speaker) {
        const transcriptPreview = data.text.length > 50 
          ? data.text.substring(0, 50) + '...' 
          : data.text;
        
        console.log(`📝 Transcript [${data.speaker}]: ${transcriptPreview} (interim: ${data.is_interim || false})`);
        
        const newTranscript = {
          id: Date.now(),
          speaker: data.speaker,
          text: data.text,
          timestamp: new Date().toISOString(),
          isInterim: data.is_interim || false
        };
        
        if (data.is_interim) {
          // Update real-time transcription text box (right side)
          setRealTimeTranscript(data.text);
          // Also update streaming text for ChatOverlay
          setStreamingText(data.text);
          setStreamingSpeaker(data.speaker);
          console.log(`📝 Interim transcript (live): "${data.text}"`);
        } else {
          // Final transcript - add to chat and clear real-time box
          console.log(`✅ Final transcript: "${data.text}"`);
          setRealTimeTranscript(''); // Clear real-time box
          setStreamingText('');
          setStreamingSpeaker(null);
          setTranscripts(prev => {
            // Avoid duplicates by checking if this exact text was recently added
            const recentTranscript = prev.find(t => 
              t.speaker === data.speaker && 
              t.text === data.text &&
              Math.abs(new Date(t.timestamp).getTime() - new Date().getTime()) < 2000
            );
            if (!recentTranscript) {
              console.log('✅ Adding final transcript to chat');
              return [...prev, newTranscript];
            }
            console.log('⚠️ Duplicate transcript ignored');
            return prev;
          });
        }
      }
    };

    // AI response streaming
    const handleAIResponse = (data) => {
      if (data.text) {
        // Update question number if provided
        if (data.question_number) {
          setQuestionNumber(data.question_number);
        }
        if (data.total_questions) {
          setTotalQuestions(data.total_questions);
        }
        
        if (data.is_streaming) {
          // Streaming response (word-by-word) - stop listening when AI starts speaking
          if (isListeningRef.current) {
            console.log('[STATE] AI started speaking, stopping listening');
            isListeningRef.current = false;
            setIsListening(false);
            stopAudioCapture();
          }
          // Clear real-time transcript when AI starts speaking
          setRealTimeTranscript('');
          setStreamingText(data.text);
          setStreamingSpeaker('ai');
        } else {
          // Final response - check if it's already in transcripts to avoid duplicates
          setStreamingText('');
          setStreamingSpeaker(null);
          setTranscripts(prev => {
            // Check if this exact text already exists (with timestamp check for stability)
            const exists = prev.some(t => 
              t.speaker === 'ai' && 
              t.text === data.text &&
              // Allow same text if it's been more than 5 seconds
              (Date.now() - new Date(t.timestamp).getTime() < 5000)
            );
            if (!exists) {
              const newTranscript = {
                id: Date.now(),
                speaker: 'ai',
                text: data.text,
                timestamp: new Date().toISOString()
              };
              return [...prev, newTranscript];
            }
            return prev;
          });
        }
      }
    };
    
    // Handle interview completion
    const handleInterviewComplete = (data) => {
      console.log('[INTERVIEW] Interview completed:', data);
      setIsListening(false);
      isListeningRef.current = false;
      stopAudioCapture();
      setRealTimeTranscript(''); // Clear real-time transcript
      
      // Show completion message
      alert(data.message || `Interview completed! You answered ${data.completed_questions || questionNumber} questions.`);
      
      // Navigate to report page
      if (interviewSessionId) {
        setTimeout(() => {
          navigate(`/report/${interviewSessionId}`);
        }, 2000);
      }
    };

    // Register event handlers
    on('offer', handleOffer);
    on('answer', handleAnswer);
    on('ice-candidate', handleICECandidate);
    on('transcript', handleTranscript);
    on('ai-response', handleAIResponse);
    on('audio-chunk', handleAudioChunk);
    on('ai-speech-complete', handleAISpeechComplete);
    
    // Handle listening started/stopped events from backend
    const handleListeningStarted = (data) => {
      console.log('[EVENT] Backend started listening:', data);
      setIsListening(true);
      isListeningRef.current = true;
    };
    
    const handleListeningStopped = (data) => {
      console.log('[EVENT] Backend stopped listening:', data);
      setIsListening(false);
      isListeningRef.current = false;
    };
    
    on('listening-started', handleListeningStarted);
    on('listening-stopped', handleListeningStopped);
    on('interview-complete', handleInterviewComplete);

    return () => {
      off('offer', handleOffer);
      off('answer', handleAnswer);
      off('ice-candidate', handleICECandidate);
      off('transcript', handleTranscript);
      off('ai-response', handleAIResponse);
      off('audio-chunk', handleAudioChunk);
      off('ai-speech-complete', handleAISpeechComplete);
      off('listening-started', handleListeningStarted);
      off('listening-stopped', handleListeningStopped);
      off('interview-complete', handleInterviewComplete);
    };
  }, [isConnected, interviewSessionId, on, off, setRemoteDescription, createAnswer, addICECandidate, sendAnswer, handleAISpeechComplete, handleAudioChunk, stopAudioCapture, navigate, questionNumber]);

  // Initialize WebRTC connection
  useEffect(() => {
    if (isConnected && webrtcSessionId && createOffer) {
      const initConnection = async () => {
        const offer = await createOffer();
        if (offer) {
          sendOffer(webrtcSessionId, offer, interviewSessionId);
        }
      };
      initConnection();
    }
  }, [isConnected, webrtcSessionId, interviewSessionId, createOffer, sendOffer]);

  // Start interview
  const handleStartInterview = async () => {
    if (isLoading) return; // Prevent multiple clicks
    
    setIsLoading(true);
    try {
      const numQuestions = testMode ? 2 : 5;
      setTotalQuestions(numQuestions);
      setQuestionNumber(1);
      
      const data = await startInterview({
        total_questions: numQuestions,
        job_role: 'Software Engineer',
        job_description: 'Full-stack development position',
        duration_minutes: 50,
        single_question: false,
      });
      setInterviewData(data);
      
      // Initialize question tracking
      setQuestionNumber(1);
      setTotalQuestions(numQuestions);
      
      // Display first question if available
      if (data.question) {
        setCurrentQuestion(data.question);
        const questionTranscript = {
          id: Date.now(),
          speaker: 'ai',
          text: data.question,
          timestamp: new Date().toISOString()
        };
        setTranscripts([questionTranscript]);
        
        // Play question audio if available
        if (data.question_audio && data.question_audio.length > 100) {
          // Only play if audio is substantial (more than 100 base64 chars = ~75 bytes)
          try {
            const base64Audio = data.question_audio;
            console.log(`🎵 Received question audio: ${base64Audio.length} base64 chars`);
            
            // Audio is now WAV format (converted from AIFF on backend)
            const playAudio = async () => {
              try {
                // Convert base64 to blob
            const binaryString = atob(base64Audio);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
                
                // Check if it's valid WAV (starts with RIFF)
                const isValidWAV = binaryString.substring(0, 4) === 'RIFF';
                const mimeType = isValidWAV ? 'audio/wav' : 'audio/mpeg';
                
                console.log(`🎵 Audio decoded: ${bytes.length} bytes, format: ${mimeType}`);
                
                const blob = new Blob([bytes], { type: mimeType });
                const audioUrl = URL.createObjectURL(blob);
                
                const audio = new Audio(audioUrl);
                audio.volume = 1.0;
                
                // Add event listeners for debugging
                audio.addEventListener('loadstart', () => console.log('🎵 Question audio loading started'));
                audio.addEventListener('loadedmetadata', () => console.log('🎵 Question audio metadata loaded'));
                audio.addEventListener('canplay', () => console.log('🎵 Question audio can play'));
                audio.addEventListener('canplaythrough', () => console.log('🎵 Question audio ready to play'));
                audio.addEventListener('play', () => console.log('✅ Question audio playing...'));
                audio.addEventListener('ended', () => {
                  console.log('🎵 Question audio playback ended - starting to listen for user answer...');
                  URL.revokeObjectURL(audioUrl);
                  
                  // Automatically start listening after AI finishes speaking
                  if (localStream && !isMuted && interviewSessionId && isConnected) {
                    setTimeout(() => {
                      if (!isListeningRef.current) {
                        isListeningRef.current = true;
                        console.log('🎤 Starting automatic STT listening after AI speech...');
                        setIsListening(true);
                      } else {
                        console.log('🎤 Already listening, skipping');
                      }
                    }, 500); // Small delay to ensure audio is fully finished
                  } else {
                    console.warn('⚠️ Cannot start listening after question audio:', {
                      hasLocalStream: !!localStream,
                      isMuted,
                      hasInterviewId: !!interviewSessionId,
                      isConnected
                    });
                  }
                });
                audio.addEventListener('error', (e) => {
                  console.error('❌ Question audio playback error:', e, 'Error code:', audio.error?.code);
                  URL.revokeObjectURL(audioUrl);
                  
                  // Even if audio fails, start listening after a delay
                  setTimeout(() => {
                    if (localStream && !isMuted && interviewSessionId && isConnected && !isListeningRef.current) {
                      isListeningRef.current = true;
                      console.log('🎤 Starting STT listening (audio playback failed but proceeding)...');
                      setIsListening(true);
                    }
                  }, 1000);
                });
                
                // Try to play with user interaction fallback
                try {
                  await audio.play();
                  console.log('✅ Question audio started playing');
                } catch (playError) {
                    // Autoplay might be blocked, try again after a short delay
                  console.warn('⚠️ Autoplay blocked, retrying...', playError);
                  setTimeout(async () => {
                    try {
                      await audio.play();
                      console.log('✅ Question audio started playing (retry)');
                    } catch (retryError) {
                      console.error('❌ Failed to play audio after retry:', retryError);
                      // Start listening anyway after delay
                      setTimeout(() => {
                        if (localStream && !isMuted && interviewSessionId && isConnected && !isListeningRef.current) {
                          isListeningRef.current = true;
                          console.log('🎤 Starting STT listening (audio play failed but proceeding)...');
                          setIsListening(true);
                        }
                      }, 1000);
                    }
                  }, 500);
                }
              } catch (err) {
                console.error('❌ Failed to process/play audio:', err);
                // Start listening anyway
                setTimeout(() => {
                  if (localStream && !isMuted && interviewSessionId && isConnected && !isListeningRef.current) {
                    isListeningRef.current = true;
                    console.log('🎤 Starting STT listening (audio processing failed but proceeding)...');
                    setIsListening(true);
                  }
                }, 1000);
                return false;
              }
            };
            
            // Play audio after a small delay to ensure DOM is ready
            setTimeout(() => {
              playAudio();
            }, 100);
          } catch (error) {
            console.error('Error processing question audio:', error);
            // Start listening anyway if audio processing fails
            setTimeout(() => {
              if (localStream && !isMuted && interviewSessionId && isConnected && !isListening) {
                console.log('🎤 Starting STT listening (audio processing error but proceeding)...');
                setIsListening(true);
              }
            }, 1000);
          }
        } else if (data.question_audio) {
          console.warn('⚠️ Question audio too short, skipping playback:', data.question_audio.length, 'chars');
          // Start listening anyway
          setTimeout(() => {
            if (localStream && !isMuted && interviewSessionId && isConnected && !isListeningRef.current) {
              isListeningRef.current = true;
              console.log('🎤 Starting STT listening (no audio but proceeding)...');
              setIsListening(true);
            }
          }, 500);
        } else {
          // If no audio, at least show the question text and start listening
          console.log('ℹ️ No question audio provided, showing text only:', data.question);
          setTimeout(() => {
            if (localStream && !isMuted && interviewSessionId && isConnected && !isListeningRef.current) {
              isListeningRef.current = true;
              console.log('🎤 Starting STT listening (no audio provided)...');
              setIsListening(true);
            }
          }, 1000);
        }
      }
      
      if (data.interview_session_id || data.interview_id) {
        const id = data.interview_session_id || data.interview_id;
        navigate(`/interview/${id}`);
      }
    } catch (error) {
      console.error('Error starting interview:', error);
      console.error('Error details:', error.response?.data || error.message);
      alert(`Failed to start interview: ${error.response?.data?.detail || error.message || 'Please check your connection and try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // End interview
  const handleEndInterview = async () => {
    if (!interviewSessionId) {
      console.error('No interview session ID available');
      return;
    }
    try {
      await endInterview(interviewSessionId);
      navigate(`/report/${interviewSessionId}`);
    } catch (error) {
      console.error('Error ending interview:', error);
      alert('Failed to end interview. Please try again.');
    }
  };
  
  // Toggle mute
  const handleMuteToggle = useCallback(() => {
    if (toggleMute) {
      toggleMute();
      setIsMuted(prev => !prev);
    } else {
      // Fallback: toggle audio tracks
      if (localStream) {
        localStream.getAudioTracks().forEach(track => {
          track.enabled = !track.enabled;
        });
        setIsMuted(prev => !prev);
      }
    }
  }, [toggleMute, localStream]);
  
  // Toggle video
  const handleVideoToggle = useCallback(() => {
    if (toggleVideo) {
      toggleVideo();
      setIsVideoEnabled(prev => !prev);
    } else {
      // Fallback: toggle video tracks
      if (localStream) {
        localStream.getVideoTracks().forEach(track => {
          track.enabled = !track.enabled;
        });
        setIsVideoEnabled(prev => !prev);
      }
    }
  }, [toggleVideo, localStream]);
  
  // Welcome screen if no interview started
  if (!interviewData && !interviewSessionId) {
    return (
      <div className="interview-room welcome-screen" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#fff' }}>
        <div className="welcome-content" style={{ textAlign: 'center', maxWidth: '600px', padding: '2rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Mock Interview</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Practice your interview skills with AI-powered evaluation</p>
          
          {/* Test Mode Toggle */}
          <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', fontSize: '1.1rem' }}>
              <input
                type="checkbox"
                checked={testMode}
                onChange={(e) => setTestMode(e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <span>Test Mode (2 questions only)</span>
            </label>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.8 }}>
              {testMode ? 'Quick test with 2 questions' : 'Full interview with 5 questions'}
            </p>
          </div>
          
          <button 
            onClick={handleStartInterview} 
            className="start-button"
            disabled={isLoading}
            style={{ padding: '1rem 2rem', fontSize: '1.2rem', cursor: isLoading ? 'not-allowed' : 'pointer', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '8px' }}
          >
            {isLoading ? 'Starting...' : `Start Interview (${testMode ? '2' : '5'} questions)`}
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="interview-room">
      {/* Header */}
      <div className="interview-header">
        <div className="connection-status">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></span>
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
        <div className="interview-info">
          <h2>Mock Interview</h2>
          <p>Session: {interviewSessionId?.substring(0, 8)}...</p>
          {totalQuestions > 0 && (
            <p style={{ fontSize: '0.9rem', marginTop: '0.25rem', opacity: 0.9 }}>
              Question {questionNumber} of {totalQuestions}
            </p>
          )}
        </div>
        <button onClick={handleEndInterview} className="end-button">
          End Interview
        </button>
      </div>
  
      {/* Main Content */}
      <div className="interview-content">
        {/* Video Panel - Full screen */}
        <VideoPanel
          localStream={localStream}
          remoteStream={remoteStream}
          isMuted={isMuted}
          isVideoEnabled={isVideoEnabled}
          onMuteToggle={handleMuteToggle}
          onVideoToggle={handleVideoToggle}
          connectionState={connectionState}
          iceConnectionState={iceConnectionState}
        />
      </div>
  
      {/* Chat Overlay */}
      <ChatOverlay
        transcripts={transcripts}
        isMinimized={isChatMinimized}
        onToggleMinimize={() => setIsChatMinimized(prev => !prev)}
        streamingText={streamingText}
        streamingSpeaker={streamingSpeaker}
        isListening={isListening}
      />
      
      {/* Real-Time Transcript (Right Side) */}
      <RealTimeTranscript
        transcriptText={realTimeTranscript}
        isListening={isListening}
        isActive={isListening || realTimeTranscript.length > 0}
      />
      
      {/* Listening Indicator */}
      {isListening && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: silenceDetected 
            ? 'rgba(255, 152, 0, 0.9)' 
            : 'rgba(76, 175, 80, 0.9)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '20px',
          fontSize: '14px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          transition: 'background-color 0.3s ease'
        }}>
          <span style={{ animation: silenceDetected ? 'none' : 'pulse 1.5s infinite' }}>
            {silenceDetected ? '⏸️' : '🎤'}
          </span>
          <span>
            {silenceDetected ? 'Silence detected...' : 'Listening...'}
          </span>
        </div>
      )}
  
      {/* Audio Visualizer */}
      {localStream && (
        <AudioVisualizer
          localStream={localStream}
          remoteStream={remoteStream}
          isMuted={isMuted}
        />
      )}
  
      {/* Control Bar */}
      <div className="control-bar">
        <button
          className={`control-button ${isMuted ? 'muted' : ''}`}
          onClick={handleMuteToggle}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? '🔇' : '🎤'}
        </button>
        <button
          className={`control-button ${!isVideoEnabled ? 'disabled' : ''}`}
          onClick={handleVideoToggle}
          title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
        >
          {isVideoEnabled ? '📹' : '📷'}
        </button>
        <button
          className="control-button end-interview"
          onClick={handleEndInterview}
          title="End Interview"
        >
          🚪 End Interview
        </button>
      </div>
    </div>
  );
};

export default InterviewRoom;
