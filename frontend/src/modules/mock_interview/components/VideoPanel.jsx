/**
 * VideoPanel Component - Modern video display with improved stability
 * Displays local and remote video streams with controls
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import './VideoPanel.css';

const VideoPanel = ({ 
  localStream, 
  remoteStream, 
  isMuted, 
  isVideoEnabled,
  onMuteToggle,
  onVideoToggle,
  connectionState,
  iceConnectionState
}) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const [isLocalVideoFullscreen, setIsLocalVideoFullscreen] = useState(false);
  const [isRemoteVideoFullscreen, setIsRemoteVideoFullscreen] = useState(false);
  const [localVideoError, setLocalVideoError] = useState(false);
  const [remoteVideoError, setRemoteVideoError] = useState(false);

  // Set up local video stream with error handling - fixed to prevent flickering
  useEffect(() => {
    const videoElement = localVideoRef.current;
    if (!videoElement) return;

    if (localStream) {
      try {
        // Use ref to track current stream to avoid unnecessary updates
        // Check by stream ID instead of reference to prevent flickering
        const currentStreamId = localStream.id || (localStream.getTracks()[0]?.id);
        const existingStreamId = localStreamRef.current?.id || (localStreamRef.current?.getTracks()[0]?.id);
        
        if (existingStreamId === currentStreamId && videoElement.srcObject) {
          // Same stream, just ensure it's playing
          if (videoElement.paused && videoElement.srcObject) {
            videoElement.play().catch(err => console.warn('Local video play (same stream):', err));
          }
          return;
        }
        
        console.log('Setting local video stream...');
        
        // Only clear if it's a different stream
        if (videoElement.srcObject && videoElement.srcObject !== localStream) {
          const oldStream = videoElement.srcObject;
          const oldStreamId = oldStream.id || (oldStream.getTracks()[0]?.id);
          // Don't stop tracks if they're part of the new stream
          if (oldStreamId !== currentStreamId) {
            oldStream.getTracks().forEach(track => {
              const isInNewStream = localStream.getTracks().some(t => t.id === track.id);
              if (!isInNewStream) {
                track.stop();
              }
            });
          }
        }
        
        // Set new stream only if different
        if (videoElement.srcObject !== localStream) {
          videoElement.srcObject = localStream;
          localStreamRef.current = localStream;
        }
        setLocalVideoError(false);
        
        // Ensure video plays with retry
        const playVideo = async () => {
          try {
            if (videoElement.paused) {
              await videoElement.play();
              console.log('✅ Local video playing');
            }
            
            // Check video track status
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
              // Ensure track is enabled
              if (!videoTrack.enabled) {
                videoTrack.enabled = true;
              }
            } else {
              console.warn('No video track in local stream');
            }
          } catch (err) {
            console.warn('Local video play error, retrying:', err);
            // Retry after a short delay
            setTimeout(() => {
              if (videoElement && videoElement.srcObject === localStream && videoElement.paused) {
                videoElement.play().catch(console.warn);
              }
            }, 200);
          }
        };
        playVideo();
      } catch (err) {
        console.error('Error setting local video:', err);
        setLocalVideoError(true);
      }
    } else {
      // Clear video when stream is removed
      if (videoElement.srcObject) {
        videoElement.srcObject = null;
      }
      localStreamRef.current = null;
      setLocalVideoError(false);
    }
  }, [localStream]);

  // Set up remote video stream with error handling - fixed to prevent flickering
  useEffect(() => {
    const videoElement = remoteVideoRef.current;
    if (!videoElement) return;

    if (remoteStream) {
      try {
        // Use ref to track current stream to avoid unnecessary updates
        // Check by stream ID instead of reference to prevent flickering
        const currentStreamId = remoteStream.id || (remoteStream.getTracks()[0]?.id);
        const existingStreamId = remoteStreamRef.current?.id || (remoteStreamRef.current?.getTracks()[0]?.id);
        
        if (existingStreamId === currentStreamId && videoElement.srcObject) {
          // Same stream, just ensure it's playing
          if (videoElement.paused && videoElement.srcObject) {
            videoElement.play().catch(err => console.warn('Remote video play (same stream):', err));
          }
          return;
        }
        
        console.log('Setting remote video stream...');
        
        // Only clear if it's a different stream
        if (videoElement.srcObject && videoElement.srcObject !== remoteStream) {
          const oldStream = videoElement.srcObject;
          const oldStreamId = oldStream.id || (oldStream.getTracks()[0]?.id);
          // Don't stop tracks if they're part of the new stream
          if (oldStreamId !== currentStreamId) {
            oldStream.getTracks().forEach(track => {
              const isInNewStream = remoteStream.getTracks().some(t => t.id === track.id);
              if (!isInNewStream) {
                track.stop();
              }
            });
          }
        }
        
        // Set new stream only if different
        if (videoElement.srcObject !== remoteStream) {
          videoElement.srcObject = remoteStream;
          remoteStreamRef.current = remoteStream;
        }
        setRemoteVideoError(false);
        
        // Ensure video plays with retry
        const playVideo = async () => {
          try {
            if (videoElement.paused) {
              await videoElement.play();
              console.log('✅ Remote video playing');
            }
            
            // Check video track status
            const videoTrack = remoteStream.getVideoTracks()[0];
            if (videoTrack && !videoTrack.enabled) {
              videoTrack.enabled = true;
            }
          } catch (err) {
            console.warn('Remote video play error, retrying:', err);
            // Retry after a short delay
            setTimeout(() => {
              if (videoElement && videoElement.srcObject === remoteStream && videoElement.paused) {
                videoElement.play().catch(console.warn);
              }
            }, 200);
          }
        };
        playVideo();
      } catch (err) {
        console.error('Error setting remote video:', err);
        setRemoteVideoError(true);
      }
    } else {
      // Clear video when stream is removed
      if (videoElement.srcObject) {
        videoElement.srcObject = null;
      }
      remoteStreamRef.current = null;
      setRemoteVideoError(false);
    }
  }, [remoteStream]);

  // Handle video load errors
  const handleLocalVideoError = useCallback(() => {
    console.error('Local video element error');
    setLocalVideoError(true);
  }, []);

  const handleRemoteVideoError = useCallback(() => {
    console.error('Remote video element error');
    setRemoteVideoError(true);
  }, []);

  const toggleLocalFullscreen = () => {
    if (localVideoRef.current) {
      if (!document.fullscreenElement) {
        localVideoRef.current.requestFullscreen().then(() => {
          setIsLocalVideoFullscreen(true);
        }).catch(err => console.error('Fullscreen error:', err));
      } else {
        document.exitFullscreen().then(() => {
          setIsLocalVideoFullscreen(false);
        }).catch(err => console.error('Exit fullscreen error:', err));
      }
    }
  };

  const toggleRemoteFullscreen = () => {
    if (remoteVideoRef.current) {
      if (!document.fullscreenElement) {
        remoteVideoRef.current.requestFullscreen().then(() => {
          setIsRemoteVideoFullscreen(true);
        }).catch(err => console.error('Fullscreen error:', err));
      } else {
        document.exitFullscreen().then(() => {
          setIsRemoteVideoFullscreen(false);
        }).catch(err => console.error('Exit fullscreen error:', err));
      }
    }
  };

  const getConnectionStatusColor = () => {
    if (iceConnectionState === 'connected' || iceConnectionState === 'completed') {
      return '#4CAF50';
    } else if (iceConnectionState === 'checking' || connectionState === 'connecting') {
      return '#FF9800';
    } else {
      return '#f44336';
    }
  };

  const getConnectionStatusText = () => {
    if (iceConnectionState === 'connected' || iceConnectionState === 'completed') {
      return 'Connected';
    } else if (iceConnectionState === 'checking' || connectionState === 'connecting') {
      return 'Connecting...';
    } else {
      return 'Disconnected';
    }
  };

  return (
    <div className="video-panel">
      <div className="video-grid">
        {/* Remote Video (AI HR) - Larger */}
        <div className="video-container remote-video">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            muted={false}
            className="video-element"
            onError={handleRemoteVideoError}
            onLoadedMetadata={() => {
              if (remoteVideoRef.current) {
                remoteVideoRef.current.play().catch(console.warn);
              }
            }}
          />
          {(!remoteStream || remoteVideoError) && (
            <div className="video-placeholder">
              <div className="avatar ai-avatar">🤖</div>
              <p className="placeholder-name">AI HR Interviewer</p>
              <div className="connection-indicator" style={{ backgroundColor: getConnectionStatusColor() }}>
                <span>{getConnectionStatusText()}</span>
              </div>
            </div>
          )}
          {remoteStream && !remoteVideoError && (
            <div className="video-overlay">
              <div className="video-label">AI HR Interviewer</div>
              <div className="connection-indicator" style={{ backgroundColor: getConnectionStatusColor() }}>
                <span>{getConnectionStatusText()}</span>
              </div>
              <button 
                className="fullscreen-button"
                onClick={toggleRemoteFullscreen}
                title="Toggle fullscreen"
                aria-label="Toggle fullscreen"
              >
                ⛶
              </button>
            </div>
          )}
        </div>

        {/* Local Video (User) - Smaller, bottom right */}
        <div className="video-container local-video">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted={true}
            className="video-element"
            onError={handleLocalVideoError}
            onLoadedMetadata={() => {
              if (localVideoRef.current) {
                localVideoRef.current.play().catch(console.warn);
                console.log('Local video metadata loaded:', {
                  width: localVideoRef.current.videoWidth,
                  height: localVideoRef.current.videoHeight
                });
              }
            }}
            onCanPlay={() => {
              if (localVideoRef.current) {
                console.log('Local video can play');
                localVideoRef.current.play().catch(console.warn);
              }
            }}
          />
          {(!localStream || localVideoError) && (
            <div className="video-placeholder">
              <div className="avatar user-avatar">👤</div>
              <p className="placeholder-name">You</p>
            </div>
          )}
          {localStream && !localVideoError && (
            <div className="video-overlay">
              <div className="video-label">You</div>
              <div className="video-controls-overlay">
                {!isVideoEnabled && (
                  <div className="video-disabled-indicator" title="Camera off">
                    <span>📷</span>
                  </div>
                )}
                {isMuted && (
                  <div className="audio-muted-indicator" title="Microphone muted">
                    <span>🔇</span>
                  </div>
                )}
              </div>
              <button 
                className="fullscreen-button"
                onClick={toggleLocalFullscreen}
                title="Toggle fullscreen"
                aria-label="Toggle fullscreen"
              >
                ⛶
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Video Controls Bar */}
      <div className="video-controls-bar">
        <button
          className={`control-button ${isMuted ? 'muted' : ''}`}
          onClick={onMuteToggle}
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          <span className="control-icon">{isMuted ? '🔇' : '🎤'}</span>
          <span className="control-text">{isMuted ? 'Unmute' : 'Mute'}</span>
        </button>
        <button
          className={`control-button ${!isVideoEnabled ? 'disabled' : ''}`}
          onClick={onVideoToggle}
          title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
          aria-label={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
        >
          <span className="control-icon">{isVideoEnabled ? '📹' : '📷'}</span>
          <span className="control-text">{isVideoEnabled ? 'Camera On' : 'Camera Off'}</span>
        </button>
        <div className="connection-status">
          <div 
            className="status-dot" 
            style={{ backgroundColor: getConnectionStatusColor() }}
          />
          <span className="status-text">{getConnectionStatusText()}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoPanel;
