import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchVisitorData } from '../utils/visitorApi';
import { loadVisitorDataFromFile, getVisitorById, getVisitorCategoryStats } from '../utils/visitorService';
import { fetchExhibitorByObjectId } from '../utils/exhibitorService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './VisitorDashboard.css';

const VisitorDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [visitorName, setVisitorName] = useState({ firstName: '', lastName: '' });
  const [visitorStats, setVisitorStats] = useState(null);
  const [connectedCompanies, setConnectedCompanies] = useState([]);
  const [recommendedCompanies, setRecommendedCompanies] = useState([]);
  const [connectedPage, setConnectedPage] = useState(1);
  const [recommendedPage, setRecommendedPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [showContact, setShowContact] = useState({});
  const ITEMS_PER_PAGE = 3;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get badge ID from query params
        const badgeId = searchParams.get('badgeId');
        
        if (!badgeId) {
          setError('Badge ID is required. Please provide a badgeId query parameter.');
          setLoading(false);
          return;
        }
        
        // Try to fetch visitor name from API, fallback to "Test Visitor"
        try {
          const apiData = await fetchVisitorData(badgeId);
          setVisitorName({
            firstName: apiData.firstName,
            lastName: apiData.lastName
          });
        } catch (err) {
          console.warn('Could not fetch visitor name from API, using fallback:', err);
          setVisitorName({ firstName: 'Test', lastName: 'Visitor' });
        }

        // Load CSV data
        const csvLoaded = await loadVisitorDataFromFile();
        console.log('CSV loaded:', csvLoaded);
        
        // Get visitor analytics data from CSV using badgeId
        const csvVisitor = getVisitorById(badgeId);
        console.log('Looking for badge ID:', badgeId);
        console.log('Found visitor:', csvVisitor);
        
        if (csvVisitor) {
          setVisitorStats(csvVisitor);
          
          // Fetch real exhibitor data from Algolia for connected companies
          const connectedPromises = csvVisitor.connectedExhibitors.map(async (exhibitorId) => {
            try {
              const exhibitor = await fetchExhibitorByObjectId(exhibitorId);
              return exhibitor ? {
                id: exhibitor.id,
                name: exhibitor.companyName || exhibitor.exhibitorName,
                category: exhibitor.showObjective || 'Exhibitor',
                description: exhibitor.description || 'No description available',
                website: exhibitor.website || '',
                email: exhibitor.email || '',
                phone: exhibitor.phone || '',
                logo: '🏢'
              } : null;
            } catch (err) {
              console.error(`Error fetching exhibitor ${exhibitorId}:`, err);
              return null;
            }
          });
          
          const connected = (await Promise.all(connectedPromises)).filter(Boolean);
          setConnectedCompanies(connected);

          // Fetch recommended exhibitors
          const recommendedPromises = csvVisitor.recommendedExhibitors.map(async (exhibitorId) => {
            try {
              const exhibitor = await fetchExhibitorByObjectId(exhibitorId);
              return exhibitor ? {
                id: exhibitor.id,
                name: exhibitor.companyName || exhibitor.exhibitorName,
                category: exhibitor.showObjective || 'Exhibitor',
                description: exhibitor.description || 'No description available',
                website: exhibitor.website || '',
                email: exhibitor.email || '',
                phone: exhibitor.phone || '',
                logo: '💡'
              } : null;
            } catch (err) {
              console.error(`Error fetching exhibitor ${exhibitorId}:`, err);
              return null;
            }
          });
          
          const recommended = (await Promise.all(recommendedPromises)).filter(Boolean);
          setRecommendedCompanies(recommended);
        } else {
          setError('Visitor ID not found or not provided. Please provide a visitorId query parameter.');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading visitor data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, [searchParams]);

  // Calculate interest matches - use the actual count from CSV categories
  const getInterestMatches = (interest) => {
    // Find the category in topCategories and return its count
    const category = topCategories.find(cat => cat.name === interest);
    return category ? category.count : 0;
  };

  // Pagination helpers
  const getPaginatedItems = (items, page) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return items.slice(startIndex, endIndex);
  };

  const getTotalPages = (items) => Math.ceil(items.length / ITEMS_PER_PAGE);

  const toggleDescription = (companyId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [companyId]: !prev[companyId]
    }));
  };

  const toggleContact = (companyId) => {
    setShowContact(prev => ({
      ...prev,
      [companyId]: !prev[companyId]
    }));
  };

  if (loading) {
    return (
      <div className="visitor-dashboard">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading visitor profile...</p>
        </div>
      </div>
    );
  }

  if (!visitorStats) {
    return (
      <div className="visitor-dashboard">
        <div className="dashboard-header-modern">
        </div>
        <div className="section-card">
          <h2 className="section-title">⚠️ Visitor Not Found</h2>
          <p className="section-description">
            {error || 'The visitor ID you provided could not be found in our records.'}
          </p>
          <p className="section-description">
            Please check the visitor ID and try again.
          </p>
        </div>
      </div>
    );
  }

  const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  
  // Get category stats for charts
  const categoryStats = getVisitorCategoryStats(visitorStats);
  const topCategories = categoryStats?.topCategories || [];
  
  // Generate interests from top categories
  const interests = topCategories.slice(0, 5).map(cat => cat.name);

  return (
    <div className="visitor-dashboard">
      {/* Header Section */}
      <div className="dashboard-header-modern">
        {error && (
          <div className="error-banner">
            ⚠️ Could not fetch visitor data from API. Showing demo data.
          </div>
        )}
        <div className="header-content">
          <div className="visitor-info">
            <h1>{visitorName.firstName} {visitorName.lastName}</h1>
            <p className="visitor-title">Visitor Analytics Dashboard</p>
            {searchParams.get('badgeId') && (
              <div className="company-badge">
                <span className="company-icon">🎫</span>
                <span>Badge ID: {searchParams.get('badgeId')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-container">
        <div className="stat-card primary">
          <div className="stat-icon">🤝</div>
          <div className="stat-content">
            <h3>{visitorStats.totalConnections}</h3>
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
            <h3>{interests.length}</h3>
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
        <p className="section-description">
          Interests with matching connections count
        </p>
        <div className="interests-grid">
          {interests.map((interest, index) => {
            const matchCount = getInterestMatches(interest);
            return (
              <div key={index} className="interest-tag">
                <span className="tag-dot"></span>
                <span className="interest-name">{interest}</span>
                <span className="interest-count">{matchCount} match{matchCount !== 1 ? 'es' : ''}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Insights Section with Charts */}
      <div className="section-card">
        <h2 className="section-title">
          <span className="title-icon">📊</span>
          Category Engagement Insights
        </h2>
        <p className="section-description">
          Product categories based on visitor interactions and preferences
        </p>
        <div className="charts-container">
          <div className="chart-wrapper" style={{ gridColumn: '1 / -1' }}>
            <h3 className="chart-title">Engagement by Category</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={topCategories} margin={{ bottom: 60, left: 10, right: 10, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  tick={{ fontSize: 11, fill: '#94a3b8' }} 
                  angle={-35} 
                  textAnchor="end" 
                  height={80}
                  interval={0}
                />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '13px' }} />
                <Bar dataKey="count" fill="#0ea5e9" radius={[8, 8, 0, 0]} name="Interactions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Connected Companies Section with Pagination */}
      <div className="section-card">
        <h2 className="section-title">
          <span className="title-icon">🤝</span>
          Connected Companies
          <span className="title-badge">{connectedCompanies.length}</span>
        </h2>
        <p className="section-description">
          Top companies this visitor has engaged with during the event
        </p>
        <div className="companies-grid">
          {getPaginatedItems(connectedCompanies, connectedPage).map((company, index) => {
            const companyKey = `connected-${company.id}`;
            const isExpanded = expandedDescriptions[companyKey];
            const isContactVisible = showContact[companyKey];
            return (
              <div key={index} className="company-card">
                <div className="company-header">
                  <span className="company-logo">{company.logo}</span>
                  <div className="company-rank">#{(connectedPage - 1) * ITEMS_PER_PAGE + index + 1}</div>
                </div>
                <h3 className="company-name">{company.name}</h3>
                <p className="company-category">{company.category}</p>
                <p 
                  className={`company-description ${isExpanded ? 'expanded' : ''}`}
                  onClick={() => toggleDescription(companyKey)}
                >
                  {company.description}
                </p>
                <button 
                  className="connect-btn"
                  onClick={() => toggleContact(companyKey)}
                >
                  {isContactVisible ? '✕ Close' : '📞 Connect'}
                </button>
                {isContactVisible && (
                  <div className="contact-details">
                    {company.phone && (
                      <div className="contact-item">
                        <span className="contact-icon">📱</span>
                        <a href={`tel:${company.phone}`}>{company.phone}</a>
                      </div>
                    )}
                    {company.email && (
                      <div className="contact-item">
                        <span className="contact-icon">✉️</span>
                        <a href={`mailto:${company.email}`}>{company.email}</a>
                      </div>
                    )}
                    {company.website && (
                      <div className="contact-item">
                        <span className="contact-icon">🔗</span>
                        <a href={company.website} target="_blank" rel="noopener noreferrer">Website</a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {getTotalPages(connectedCompanies) > 1 && (
          <div className="pagination">
            <button 
              className="pagination-btn" 
              onClick={() => setConnectedPage(p => Math.max(1, p - 1))}
              disabled={connectedPage === 1}
            >
              ← Previous
            </button>
            <span className="pagination-info">
              Page {connectedPage} of {getTotalPages(connectedCompanies)}
            </span>
            <button 
              className="pagination-btn" 
              onClick={() => setConnectedPage(p => Math.min(getTotalPages(connectedCompanies), p + 1))}
              disabled={connectedPage === getTotalPages(connectedCompanies)}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Recommended Companies Section with Pagination */}
      <div className="section-card recommended">
        <h2 className="section-title">
          <span className="title-icon">💡</span>
          Recommended Matches
          <span className="title-badge">{recommendedCompanies.length}</span>
        </h2>
        <p className="section-description">
          Top companies that align with visitor interests and engagement patterns
        </p>
        <div className="companies-grid">
          {getPaginatedItems(recommendedCompanies, recommendedPage).map((company, index) => {
            const companyKey = `recommended-${company.id}`;
            const isExpanded = expandedDescriptions[companyKey];
            const isContactVisible = showContact[companyKey];
            return (
              <div key={index} className="company-card recommended-card">
                <div className="recommended-badge">Recommended</div>
                <div className="company-header">
                  <span className="company-logo">{company.logo}</span>
                </div>
                <h3 className="company-name">{company.name}</h3>
                <p className="company-category">{company.category}</p>
                <p 
                  className={`company-description ${isExpanded ? 'expanded' : ''}`}
                  onClick={() => toggleDescription(companyKey)}
                >
                  {company.description}
                </p>
                <button 
                  className="connect-btn"
                  onClick={() => toggleContact(companyKey)}
                >
                  {isContactVisible ? '✕ Close' : '📞 Connect'}
                </button>
                {isContactVisible && (
                  <div className="contact-details">
                    {company.phone && (
                      <div className="contact-item">
                        <span className="contact-icon">📱</span>
                        <a href={`tel:${company.phone}`}>{company.phone}</a>
                      </div>
                    )}
                    {company.email && (
                      <div className="contact-item">
                        <span className="contact-icon">✉️</span>
                        <a href={`mailto:${company.email}`}>{company.email}</a>
                      </div>
                    )}
                    {company.website && (
                      <div className="contact-item">
                        <span className="contact-icon">🔗</span>
                        <a href={company.website} target="_blank" rel="noopener noreferrer">Website</a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {getTotalPages(recommendedCompanies) > 1 && (
          <div className="pagination">
            <button 
              className="pagination-btn" 
              onClick={() => setRecommendedPage(p => Math.max(1, p - 1))}
              disabled={recommendedPage === 1}
            >
              ← Previous
            </button>
            <span className="pagination-info">
              Page {recommendedPage} of {getTotalPages(recommendedCompanies)}
            </span>
            <button 
              className="pagination-btn" 
              onClick={() => setRecommendedPage(p => Math.min(getTotalPages(recommendedCompanies), p + 1))}
              disabled={recommendedPage === getTotalPages(recommendedCompanies)}
            >
              Next →
            </button>
          </div>
        )}
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
              <p>Established {visitorStats.totalConnections} meaningful connections with exhibitors</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-marker categories"></div>
            <div className="timeline-content">
              <h4>Category Exploration</h4>
              <p>Engaged with {topCategories.length} different product categories</p>
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
