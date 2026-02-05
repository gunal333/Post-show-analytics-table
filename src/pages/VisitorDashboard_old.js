import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSampleVisitorProfile, getCompaniesInfo } from '../utils/companyMapping';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './VisitorDashboard.css';

const VisitorDashboard = () => {
  const navigate = useNavigate();
  const [visitor, setVisitor] = useState(null);
  const [connectedCompanies, setConnectedCompanies] = useState([]);
  const [recommendedCompanies, setRecommendedCompanies] = useState([]);
  const [connectedPage, setConnectedPage] = useState(1);
  const [recommendedPage, setRecommendedPage] = useState(1);
  const ITEMS_PER_PAGE = 3;

  useEffect(() => {
    // Load sample visitor profile
    const profile = getSampleVisitorProfile();
    setVisitor(profile);
    
    // Get company information for exhibitors
    const connected = getCompaniesInfo(profile.connectedExhibitors);
    const recommended = getCompaniesInfo(profile.recommendedExhibitors);
    
    setConnectedCompanies(connected);
    setRecommendedCompanies(recommended);
  }, []);

  // Pagination helpers
  const getPaginatedItems = (items, page) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return items.slice(startIndex, endIndex);
  };

  const getTotalPages = (items) => Math.ceil(items.length / ITEMS_PER_PAGE);

  if (!visitor) {
    return (
      <div className="visitor-dashboard">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading visitor profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="visitor-dashboard">
      {/* Header Section */}
      <div className="dashboard-header-modern">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <div className="header-content">
          <div className="visitor-avatar">
            <span className="avatar-icon">👤</span>
          </div>
          <div className="visitor-info">
            <h1>{visitor.visitorName}</h1>
            <p className="visitor-title">{visitor.title}</p>
            <div className="company-badge">
              <span className="company-icon">🏢</span>
              <a href={visitor.companyWebsite} target="_blank" rel="noopener noreferrer" className="company-link">
                {visitor.company}
              </a>
            </div>
            <div className="visitor-meta">
              <span className="meta-item">
                <span className="meta-icon">📍</span>
                {visitor.location}
              </span>
              <span className="meta-item">
                <span className="meta-icon">🏷️</span>
                {visitor.industry}
              </span>
              <span className="meta-item">
                <span className="meta-icon">🎫</span>
                {visitor.eventAttendance} attending
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-container">
        <div className="stat-card primary">
          <div className="stat-icon">🤝</div>
          <div className="stat-content">
            <h3>{visitor.totalConnections}</h3>
            <p>Connections Made</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{connectedCompanies.length}</h3>
            <p>Companies Connected</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💡</div>
          <div className="stat-content">
            <h3>{recommendedCompanies.length}</h3>
            <p>Recommendations</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>{visitor.interests.length}</h3>
            <p>Interest Areas</p>
          </div>
        </div>
      </div>

      {/* Interests Section */}
      <div className="section-card">
        <h2 className="section-title">
          <span className="title-icon">🎯</span>
          Primary Interests
        </h2>
        <div className="interests-grid">
          {visitor.interests.map((interest, index) => (
            <div key={index} className="interest-tag">
              <span className="tag-dot"></span>
              {interest}
            </div>
          ))}
        </div>
      </div>

      {/* Connected Companies Section */}
      <div className="section-card">
        <h2 className="section-title">
          <span className="title-icon">🤝</span>
          Connected Companies
          <span className="title-badge">{connectedCompanies.length}</span>
        </h2>
        <p className="section-description">
          Companies this visitor has engaged with during the event
        </p>
        <div className="companies-grid">
          {connectedCompanies.map((company, index) => (
            <div key={index} className="company-card">
              <div className="company-header">
                <span className="company-logo">{company.logo}</span>
                <div className="company-rank">#{index + 1}</div>
              </div>
              <h3 className="company-name">{company.name}</h3>
              <p className="company-category">{company.category}</p>
              <p className="company-description">{company.description}</p>
              <a 
                href={company.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="company-website"
              >
                <span className="link-icon">🔗</span>
                Visit Website
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Companies Section */}
      <div className="section-card recommended">
        <h2 className="section-title">
          <span className="title-icon">💡</span>
          Recommended Matches
          <span className="title-badge">{recommendedCompanies.length}</span>
        </h2>
        <p className="section-description">
          Companies that align with visitor interests and engagement patterns
        </p>
        <div className="companies-grid">
          {recommendedCompanies.map((company, index) => (
            <div key={index} className="company-card recommended-card">
              <div className="recommended-badge">Recommended</div>
              <div className="company-header">
                <span className="company-logo">{company.logo}</span>
              </div>
              <h3 className="company-name">{company.name}</h3>
              <p className="company-category">{company.category}</p>
              <p className="company-description">{company.description}</p>
              <a 
                href={company.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="company-website"
              >
                <span className="link-icon">🔗</span>
                Visit Website
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Category Insights Section */}
      <div className="section-card">
        <h2 className="section-title">
          <span className="title-icon">📊</span>
          Category Engagement Insights
        </h2>
        <p className="section-description">
          Product categories based on visitor interactions and preferences
        </p>
        <div className="categories-modern">
          {visitor.topCategories.map((category, index) => {
            const maxCount = visitor.topCategories[0].count;
            const percentage = (category.count / maxCount) * 100;
            
            return (
              <div key={index} className="category-row">
                <div className="category-info">
                  <span className="category-rank">#{index + 1}</span>
                  <span className="category-label">{category.name}</span>
                </div>
                <div className="category-visual">
                  <div className="category-bar-container">
                    <div 
                      className="category-bar-filled" 
                      style={{ width: `${percentage}%` }}
                    >
                      <span className="bar-label">{category.count} interactions</span>
                    </div>
                  </div>
                  <span className="category-percentage">{Math.round(percentage)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="section-card timeline-card">
        <h2 className="section-title">
          <span className="title-icon">📅</span>
          Engagement Summary
        </h2>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-marker connected"></div>
            <div className="timeline-content">
              <h4>Active Connections</h4>
              <p>Established {visitor.totalConnections} meaningful connections with exhibitors</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-marker categories"></div>
            <div className="timeline-content">
              <h4>Category Exploration</h4>
              <p>Engaged with {visitor.topCategories.length} different product categories</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-marker recommendations"></div>
            <div className="timeline-content">
              <h4>Personalized Recommendations</h4>
              <p>Received {recommendedCompanies.length} curated company matches</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorDashboard;

