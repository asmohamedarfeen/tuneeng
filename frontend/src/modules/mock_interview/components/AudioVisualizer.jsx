/**
 * AudioVisualizer Component - Real-time audio visualization
 * Displays microphone activity and audio levels
 */

import React, { useEffect, useRef, useState } from 'react';
import './AudioVisualizer.css';

const AudioVisualizer = ({ localStream, remoteStream, isMuted }) => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (!localStream || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Create audio context and analyser
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;

    const source = audioContext.createMediaStreamSource(localStream);
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const draw = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;

      animationFrameRef.current = requestAnimationFrame(draw);

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      // Calculate average audio level
      const average = dataArrayRef.current.reduce((a, b) => a + b) / bufferLength;
      const normalizedLevel = average / 255;
      
      setAudioLevel(normalizedLevel);
      setIsSpeaking(normalizedLevel > 0.1);

      // Clear canvas
      ctx.fillStyle = 'rgba(26, 26, 26, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isMuted) {
        // Show muted state
        ctx.fillStyle = '#f44336';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Muted', canvas.width / 2, canvas.height / 2);
        return;
      }

      // Draw waveform
      const barWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArrayRef.current[i] / 255) * canvas.height * 0.8;

        // Create gradient
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
        gradient.addColorStop(0, '#4CAF50');
        gradient.addColorStop(0.5, '#8BC34A');
        gradient.addColorStop(1, '#FFEB3B');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);

        x += barWidth;
      }

      // Draw center line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [localStream, isMuted]);

  return (
    <div className="audio-visualizer">
      <div className="visualizer-header">
        <span className="visualizer-label">Audio Activity</span>
        <div className="audio-status">
          {isMuted ? (
            <span className="status-muted">🔇 Muted</span>
          ) : isSpeaking ? (
            <span className="status-speaking">🎤 Speaking</span>
          ) : (
            <span className="status-silent">🔇 Silent</span>
          )}
        </div>
      </div>
      <div className="visualizer-container">
        <canvas ref={canvasRef} className="visualizer-canvas" />
        <div className="audio-level-bar">
          <div 
            className="audio-level-fill"
            style={{ 
              width: `${audioLevel * 100}%`,
              backgroundColor: audioLevel > 0.7 ? '#4CAF50' : audioLevel > 0.3 ? '#FF9800' : '#f44336'
            }}
          />
        </div>
      </div>
      <div className="audio-level-text">
        Level: {Math.round(audioLevel * 100)}%
      </div>
    </div>
  );
};

export default AudioVisualizer;
