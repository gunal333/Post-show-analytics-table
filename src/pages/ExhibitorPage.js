import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchExhibitorByObjectId } from '../utils/exhibitorService';
import './ExhibitorPage.css';

const ExhibitorPage = () => {
  const { exhibitorId } = useParams();
  const [exhibitor, setExhibitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadExhibitor = async () => {
      if (!exhibitorId) {
        setError('No exhibitor ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await fetchExhibitorByObjectId(exhibitorId);
        
        if (data) {
          setExhibitor(data);
        } else {
          setError('Exhibitor not found');
        }
      } catch (err) {
        setError('Failed to load exhibitor data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadExhibitor();
  }, [exhibitorId]);

  const getProductCategories = () => {
    if (!exhibitor?.ppsAnswers) return 'N/A';
    return exhibitor.ppsAnswers.join(', ');
  };

  if (loading) {
    return (
      <div className="exhibitor-page">
        <div className="loading">Loading exhibitor details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="exhibitor-page">
        <div className="error-card">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!exhibitor) {
    return (
      <div className="exhibitor-page">
        <div className="error-card">
          <h2>Not Found</h2>
          <p>Exhibitor not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="exhibitor-page">
      <div className="exhibitor-card">
        <div className="card-header">
          {exhibitor.logo && (
            <img 
              src={exhibitor.logo} 
              alt={exhibitor.exhibitorName} 
              className="exhibitor-logo"
            />
          )}
          <h1>{exhibitor.exhibitorName}</h1>
        </div>
        
        <div className="card-content">
          <div className="info-row">
            <span className="label">Company Name:</span>
            <span className="value">{exhibitor.companyName}</span>
          </div>
          
          <div className="info-row">
            <span className="label">Product Categories:</span>
            <span className="value">{getProductCategories()}</span>
          </div>
          
          <div className="info-row">
            <span className="label">Website:</span>
            <span className="value">
              {exhibitor.website ? (
                <a 
                  href={exhibitor.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="website-link"
                >
                  {exhibitor.website}
                </a>
              ) : (
                'N/A'
              )}
            </span>
          </div>

          {exhibitor.description && (
            <div className="info-row description">
              <span className="label">Description:</span>
              <p className="value">{exhibitor.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExhibitorPage;
