/**
 * React hook for WebRTC peer connection with video support
 * Supports video/audio streaming and remote audio injection
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { getRTCConfig } from '../services/api';

export const useWebRTC = (webrtcSessionId, interviewSessionId, onRemoteStream) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [connectionState, setConnectionState] = useState('new');
  const [iceConnectionState, setIceConnectionState] = useState('new');
  const [error, setError] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const remoteAudioStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamDestinationRef = useRef(null);

  // Initialize peer connection
  useEffect(() => {
    if (!webrtcSessionId) {
      console.log('No webrtcSessionId, skipping WebRTC initialization');
      return;
    }

    // Prevent re-initialization if already initialized with same session
    if (peerConnectionRef.current && localStreamRef.current) {
      const currentSessionId = peerConnectionRef.current._sessionId;
      if (currentSessionId === webrtcSessionId) {
        console.log('WebRTC already initialized for this session, skipping...');
        return;
      }
    }

    let isMounted = true;
    let cleanupCalled = false;

    const initPeerConnection = async () => {
      try {
        console.log('Initializing WebRTC with session:', webrtcSessionId);
        
        // Get RTC configuration
        const rtcConfig = await getRTCConfig();

        // Create peer connection
        const pc = new RTCPeerConnection(rtcConfig);
        if (!isMounted) {
          pc.close();
          return;
        }
        pc._sessionId = webrtcSessionId; // Track session ID
        peerConnectionRef.current = pc;

        // Set up event handlers
        pc.onconnectionstatechange = () => {
          setConnectionState(pc.connectionState);
          console.log('Connection state:', pc.connectionState);
        };

        pc.oniceconnectionstatechange = () => {
          setIceConnectionState(pc.iceConnectionState);
          console.log('ICE connection state:', pc.iceConnectionState);
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            // ICE candidate will be sent via WebSocket
            console.log('ICE candidate generated:', event.candidate);
          }
        };

        pc.ontrack = (event) => {
          console.log('Received remote track:', event.track.kind);
          if (event.streams && event.streams[0]) {
            setRemoteStream(event.streams[0]);
            remoteStreamRef.current = event.streams[0];
            if (onRemoteStream) {
              onRemoteStream(event.streams[0]);
            }
          } else if (event.track) {
            // Handle individual track
            const stream = new MediaStream([event.track]);
            setRemoteStream(stream);
            remoteStreamRef.current = stream;
            if (onRemoteStream) {
              onRemoteStream(stream);
            }
          }
        };

        // Get user media with video and audio
        console.log('Requesting user media...');
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
          video: {
            width: { ideal: 1280, min: 640 },
            height: { ideal: 720, min: 480 },
            frameRate: { ideal: 30, min: 15 },
            facingMode: 'user',
          },
        });
        
        if (!isMounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        
        console.log('User media obtained:', {
          videoTracks: stream.getVideoTracks().length,
          audioTracks: stream.getAudioTracks().length,
          videoEnabled: stream.getVideoTracks()[0]?.enabled,
          audioEnabled: stream.getAudioTracks()[0]?.enabled
        });

        // Ensure tracks stay active
        stream.getTracks().forEach((track) => {
          track.onended = () => {
            console.warn(`${track.kind} track ended, attempting to restart`);
            // Try to get new track if ended
            if (track.kind === 'video') {
              navigator.mediaDevices.getUserMedia({ video: true })
                .then(newStream => {
                  const newTrack = newStream.getVideoTracks()[0];
                  if (newTrack && localStreamRef.current) {
                    const oldTrack = localStreamRef.current.getVideoTracks()[0];
                    if (oldTrack) {
                      localStreamRef.current.removeTrack(oldTrack);
                      oldTrack.stop();
                    }
                    localStreamRef.current.addTrack(newTrack);
                    if (peerConnectionRef.current) {
                      const sender = peerConnectionRef.current.getSenders().find(s => s.track && s.track.kind === 'video');
                      if (sender) {
                        sender.replaceTrack(newTrack);
                      }
                    }
                  }
                })
                .catch(err => console.error('Failed to restart video track:', err));
            }
          };
        });

        // Set local stream state
        if (isMounted) {
          setLocalStream(stream);
          localStreamRef.current = stream;
          setIsVideoEnabled(stream.getVideoTracks().length > 0 && stream.getVideoTracks()[0].enabled);
          setIsMuted(!stream.getAudioTracks()[0]?.enabled);
          console.log('✅ Local stream set successfully');
        }

        // Add tracks to peer connection
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
          console.log('Added track:', track.kind, track.enabled, 'readyState:', track.readyState);
        });

        // Create audio context for remote audio injection
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        mediaStreamDestinationRef.current = audioContextRef.current.createMediaStreamDestination();

      } catch (err) {
        console.error('Error initializing WebRTC:', err);
        setError(err);
        
        // Fallback to audio-only if video fails
        if (err.name === 'NotAllowedError' || err.name === 'NotFoundError') {
          try {
            const audioStream = await navigator.mediaDevices.getUserMedia({
              audio: true,
              video: false,
            });
            setLocalStream(audioStream);
            localStreamRef.current = audioStream;
            setIsVideoEnabled(false);
            
            if (peerConnectionRef.current) {
              audioStream.getTracks().forEach((track) => {
                peerConnectionRef.current.addTrack(track, audioStream);
              });
            }
          } catch (audioErr) {
            console.error('Error getting audio stream:', audioErr);
          }
        }
      }
    };

    initPeerConnection();

    // Cleanup
    return () => {
      if (cleanupCalled) {
        return;
      }
      cleanupCalled = true;
      isMounted = false;
      
      // Only cleanup if session ID actually changed
      const cleanupSessionId = webrtcSessionId;
      const currentPcSessionId = peerConnectionRef.current?._sessionId;
      
      // If session IDs match, don't cleanup (component might be re-rendering)
      if (currentPcSessionId === cleanupSessionId) {
        console.log('Skipping cleanup - same session ID, likely just a re-render');
        return;
      }
      
      console.log('Cleaning up WebRTC for session:', cleanupSessionId);
      
      // Cleanup with a small delay to allow for rapid re-renders
      const cleanupTimeout = setTimeout(() => {
        // Double-check session ID hasn't changed back
        const finalPcSessionId = peerConnectionRef.current?._sessionId;
        if (finalPcSessionId === cleanupSessionId) {
          // Session changed, proceed with cleanup
          if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => {
              track.stop();
              console.log(`Stopped ${track.kind} track`);
            });
            localStreamRef.current = null;
          }
          if (remoteStreamRef.current) {
            remoteStreamRef.current.getTracks().forEach((track) => track.stop());
            remoteStreamRef.current = null;
          }
          if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close().catch(console.warn);
            audioContextRef.current = null;
          }
          if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
          }
          setLocalStream(null);
          setRemoteStream(null);
        }
      }, 200);
      
      // Return cleanup function to clear timeout if component re-mounts quickly
      return () => {
        clearTimeout(cleanupTimeout);
      };
    };
  }, [webrtcSessionId, interviewSessionId, onRemoteStream]);

  // Inject remote audio (TTS) as MediaStream
  const injectRemoteAudio = useCallback(async (audioBlob) => {
    try {
      if (!peerConnectionRef.current || !audioContextRef.current) {
        console.warn('Peer connection or audio context not ready');
        return;
      }

      // Convert blob to audio buffer
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

      // Create source and connect to destination
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(mediaStreamDestinationRef.current);

      // Get or create remote audio stream
      let remoteAudioStream = remoteAudioStreamRef.current;
      if (!remoteAudioStream) {
        remoteAudioStream = mediaStreamDestinationRef.current.stream;
        remoteAudioStreamRef.current = remoteAudioStream;

        // Add audio track to peer connection
        remoteAudioStream.getAudioTracks().forEach((track) => {
          // Check if track already exists
          const existingSenders = peerConnectionRef.current.getSenders();
          const hasTrack = existingSenders.some(
            sender => sender.track && sender.track.kind === 'audio' && sender.track.id === track.id
          );

          if (!hasTrack) {
            peerConnectionRef.current.addTrack(track, remoteAudioStream);
          }
        });

        // Merge with existing remote stream if available
        if (remoteStreamRef.current) {
          const mergedStream = new MediaStream();
          remoteStreamRef.current.getVideoTracks().forEach(track => mergedStream.addTrack(track));
          remoteAudioStream.getAudioTracks().forEach(track => mergedStream.addTrack(track));
          setRemoteStream(mergedStream);
          remoteStreamRef.current = mergedStream;
        } else {
          setRemoteStream(remoteAudioStream);
          remoteStreamRef.current = remoteAudioStream;
        }
      }

      // Play audio
      source.start(0);

      // Clean up source after playback
      source.onended = () => {
        source.disconnect();
      };

    } catch (err) {
      console.error('Error injecting remote audio:', err);
    }
  }, []);

  const createOffer = useCallback(async () => {
    if (!peerConnectionRef.current) return null;

    try {
      const offer = await peerConnectionRef.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await peerConnectionRef.current.setLocalDescription(offer);
      return offer;
    } catch (err) {
      console.error('Error creating offer:', err);
      setError(err);
      return null;
    }
  }, []);

  const setRemoteDescription = useCallback(async (description) => {
    if (!peerConnectionRef.current) return;

    try {
      await peerConnectionRef.current.setRemoteDescription(description);
    } catch (err) {
      console.error('Error setting remote description:', err);
      setError(err);
    }
  }, []);

  const createAnswer = useCallback(async () => {
    if (!peerConnectionRef.current) return null;

    try {
      const answer = await peerConnectionRef.current.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await peerConnectionRef.current.setLocalDescription(answer);
      return answer;
    } catch (err) {
      console.error('Error creating answer:', err);
      setError(err);
      return null;
    }
  }, []);

  const addICECandidate = useCallback(async (candidate) => {
    if (!peerConnectionRef.current) return;

    try {
      await peerConnectionRef.current.addIceCandidate(candidate);
    } catch (err) {
      console.error('Error adding ICE candidate:', err);
      setError(err);
    }
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
        setIsMuted(!track.enabled);
      });
    }
  }, []);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
        setIsVideoEnabled(track.enabled);
      });
    }
  }, []);

  const close = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    setLocalStream(null);
    setRemoteStream(null);
  }, []);

  return {
    localStream,
    remoteStream,
    connectionState,
    iceConnectionState,
    error,
    isMuted,
    isVideoEnabled,
    createOffer,
    setRemoteDescription,
    createAnswer,
    addICECandidate,
    toggleMute,
    toggleVideo,
    injectRemoteAudio,
    close,
  };
};
