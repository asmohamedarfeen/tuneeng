/**
 * Report Page - Advanced feedback visualization
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFeedback } from '../services/api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './ReportPage.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ReportPage = () => {
  const { interviewSessionId } = useParams();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const data = await getFeedback(interviewSessionId);
        setFeedback(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (interviewSessionId) {
      loadFeedback();
    }
  }, [interviewSessionId]);

  if (loading) {
    return <div className="report-page loading">Loading feedback...</div>;
  }

  if (error) {
    return <div className="report-page error">Error: {error}</div>;
  }

  if (!feedback) {
    return <div className="report-page">No feedback available</div>;
  }

  // Prepare chart data
  const pronunciationData = feedback.pronunciation_chart_data || [];
  const hesitationData = feedback.hesitation_chart_data || [];
  const confidenceData = feedback.confidence_chart_data || [];
  const categoryData = Object.entries(feedback.average_category_scores || {}).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="report-page">
      <div className="report-header">
        <h1>Interview Feedback Report</h1>
        <p>Interview ID: {interviewSessionId}</p>
      </div>

      <div className="report-content">
        {/* Overall Score */}
        <div className="score-section">
          <h2>Overall Score</h2>
          <div className="score-circle">
            <div className="score-value">{feedback.overall_score.toFixed(1)}</div>
            <div className="score-label">/ 10</div>
          </div>
        </div>

        {/* Category Scores */}
        <div className="category-section">
          <h2>Category Scores</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pronunciation Over Time */}
        {pronunciationData.length > 0 && (
          <div className="chart-section">
            <h2>Pronunciation Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={pronunciationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Hesitation Frequency */}
        {hesitationData.length > 0 && (
          <div className="chart-section">
            <h2>Hesitation Frequency</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hesitationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="duration" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Confidence Trends */}
        {confidenceData.length > 0 && (
          <div className="chart-section">
            <h2>Confidence Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={confidenceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#ffc658" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Category Breakdown */}
        <div className="chart-section">
          <h2>Category Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Strengths and Weaknesses */}
        <div className="feedback-section">
          <div className="strengths">
            <h2>Strengths</h2>
            <ul>
              {feedback.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
          <div className="weaknesses">
            <h2>Areas to Improve</h2>
            <ul>
              {feedback.weaknesses.map((weakness, index) => (
                <li key={index}>{weakness}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommendations */}
        <div className="recommendations-section">
          <h2>Recommendations</h2>
          <ul>
            {feedback.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>

        {/* Detailed Analysis */}
        <div className="analysis-section">
          <h2>Detailed Analysis</h2>
          <p>{feedback.detailed_analysis}</p>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;

