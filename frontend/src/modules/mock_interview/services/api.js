/**
 * REST API client for Mock Interview Module
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Start a new interview session
 */
export const startInterview = async (data) => {
  const response = await apiClient.post('/api/interview/start', data);
  return response.data;
};

/**
 * Save an answer
 */
export const saveAnswer = async (data) => {
  const response = await apiClient.post('/api/interview/answer', data);
  return response.data;
};

/**
 * Get next question
 */
export const getNextQuestion = async (interviewId) => {
  const response = await apiClient.get(`/api/interview/next-question?interview_id=${interviewId}`);
  return response.data;
};

/**
 * Get interview history
 */
export const getInterviewHistory = async (interviewId) => {
  const response = await apiClient.get(`/api/interview/history?interview_id=${interviewId}`);
  return response.data;
};

/**
 * Evaluate all answers
 */
export const evaluateAll = async (interviewId) => {
  const response = await apiClient.post('/api/interview/evaluate-all', { interview_id: interviewId });
  return response.data;
};

/**
 * Generate report
 */
export const generateReport = async (interviewId) => {
  const response = await apiClient.post('/api/interview/generate-report', { interview_id: interviewId });
  return response.data;
};

/**
 * Get report
 */
export const getReport = async (interviewId) => {
  const response = await apiClient.get(`/api/interview/report?interview_id=${interviewId}`);
  return response.data;
};

/**
 * Get interview session details
 */
export const getInterviewSession = async (interviewSessionId) => {
  const response = await apiClient.get(`/api/interview/${interviewSessionId}`);
  return response.data;
};

/**
 * Get transcripts for an interview
 */
export const getTranscripts = async (interviewSessionId) => {
  const response = await apiClient.get(`/api/interview/${interviewSessionId}/transcripts`);
  return response.data;
};

/**
 * Get feedback for an interview (placeholder - use report instead)
 */
export const getFeedback = async (interviewSessionId) => {
  // Use report endpoint instead
  const response = await apiClient.get(`/api/interview/report?interview_id=${interviewSessionId}`);
  return response.data;
};

/**
 * End an interview session
 */
export const endInterview = async (interviewSessionId) => {
  try {
    // Call the end endpoint directly
    const response = await apiClient.post(`/api/interview/${interviewSessionId}/end`);
    return response.data;
  } catch (error) {
    console.error('Error ending interview:', error);
    // Try to evaluate and generate report as fallback
    try {
      await evaluateAll(interviewSessionId);
      await generateReport(interviewSessionId);
      return { status: 'completed', interview_session_id: interviewSessionId };
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
      throw error; // Throw original error
    }
  }
};

/**
 * Get RTC configuration (placeholder - not implemented in current API)
 */
export const getRTCConfig = async () => {
  // Return default STUN servers for now
  return {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };
};

