/**
 * WebSocket client for WebRTC signaling and real-time streaming
 */

class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.listeners = new Map();
    this.isConnected = false;
    this.roomId = null;
  }

  connect(roomId) {
    return new Promise((resolve, reject) => {
      try {
        this.roomId = roomId;
        const wsUrl = `${this.url}/ws/signaling/${roomId}`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.emit('connected');
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            // Emit the event type as the event name
            if (data.type) {
              this.emit(data.type, data);
            }
            // Also emit generic 'message' event
            this.emit('message', data);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.emit('error', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.isConnected = false;
          this.emit('disconnected');
          this.attemptReconnect(roomId);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  attemptReconnect(roomId) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => {
        this.connect(roomId).catch(console.error);
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
      this.emit('reconnect-failed');
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
    this.isConnected = false;
  }

  // WebRTC signaling methods
  sendOffer(sessionId, offer, interviewSessionId) {
    this.send({
      type: 'offer',
      session_id: sessionId,
      offer: offer,
      interview_session_id: interviewSessionId,
    });
  }

  sendAnswer(sessionId, answer, interviewSessionId) {
    this.send({
      type: 'answer',
      session_id: sessionId,
      answer: answer,
      interview_session_id: interviewSessionId,
    });
  }

  sendICECandidate(sessionId, candidate, interviewSessionId) {
    this.send({
      type: 'ice-candidate',
      session_id: sessionId,
      candidate: candidate,
      interview_session_id: interviewSessionId,
    });
  }

  sendInterviewState(interviewSessionId, state) {
    this.send({
      type: 'interview-state',
      interview_session_id: interviewSessionId,
      state: state,
    });
  }

  // Streaming methods
  sendAudioChunk(audioChunk, interviewSessionId) {
    // Send audio chunk as base64 (kept for backward compatibility, but not used for STT)
    this.send({
      type: 'audio-chunk',
      audio_chunk: audioChunk,
      interview_session_id: interviewSessionId,
    });
  }

  sendStartListening(interviewSessionId) {
    // Send start-listening event to trigger backend microphone input
    this.send({
      type: 'start-listening',
      interview_session_id: interviewSessionId,
    });
  }

  sendTranscript(transcript, isInterim, interviewSessionId) {
    this.send({
      type: 'transcript',
      text: transcript,
      is_interim: isInterim,
      speaker: 'user',
      interview_session_id: interviewSessionId,
    });
  }

  requestAIResponse(transcript, interviewSessionId) {
    this.send({
      type: 'request-ai-response',
      transcript: transcript,
      interview_session_id: interviewSessionId,
    });
  }
}

export default WebSocketClient;
