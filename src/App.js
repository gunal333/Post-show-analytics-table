import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import ExhibitorPage from './pages/ExhibitorPage';
import VisitorDashboard from './pages/VisitorDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <div className="App-header">
              <div className="home-container">
                <div className="home-hero">
                  <h1 className="home-title">📊 Post Show Analytics</h1>
                  <p className="home-subtitle">
                    Access visitor analytics and exhibitor information
                  </p>
                </div>
                <div className="home-actions">
                  <Link to="/visitor?badgeId=1468561159428614-KUK" className="primary-btn">
                    <span className="btn-icon">🔍</span>
                    <div className="btn-content">
                      <span className="btn-title">Visitor Analytics Dashboard</span>
                      <span className="btn-description">View detailed visitor insights</span>
                    </div>
                  </Link>
                  <Link to="/visitor?badgeId=1465136297106152-POY" className="secondary-btn">
                    <span className="btn-icon">👤</span>
                    <div className="btn-content">
                      <span className="btn-title">Another Visitor</span>
                      <span className="btn-description">View different visitor data</span>
                    </div>
                  </Link>
                  <Link to="/exhibitors/exh-6dcc038f-9122-457f-9cf8-08dcbe8fd3fe" className="secondary-btn">
                    <span className="btn-icon">🏢</span>
                    <div className="btn-content">
                      <span className="btn-title">Sample Exhibitor</span>
                      <span className="btn-description">Explore exhibitor profile</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          } />
          <Route path="/visitor" element={<VisitorDashboard />} />
          <Route path="/exhibitors/:exhibitorId" element={<ExhibitorPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
