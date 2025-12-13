/**
 * Main App Component
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import InterviewRoom from './modules/mock_interview/pages/InterviewRoom';
import ReportPage from './modules/mock_interview/pages/ReportPage';
import './App.css';

function App() {
  console.log('✅ App component rendering');
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/interview" replace />} />
        <Route path="/interview" element={<InterviewRoom />} />
        <Route path="/interview/:interviewSessionId" element={<InterviewRoom />} />
        <Route path="/report/:interviewSessionId" element={<ReportPage />} />
      </Routes>
    </Router>
  );
}

export default App;

