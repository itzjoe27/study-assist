import React from 'react';
import { Link } from 'react-router-dom';
import StudyTip from '../components/StudyTip';
import SessionList from '../components/SessionList';
import '../css/HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <h1>Study Assistant</h1>
      <p>Welcome to your study assistant. Get started by selecting a study session or managing your distractions.</p>
      
      <div className="home-content">
        <div className="main-content">
          <div className="quick-actions">
            <h2>Quick Start</h2>
            <div className="action-buttons">
              <Link to="/study?mode=guided" className="action-button guided">
                Start Guided Study
              </Link>
              <Link to="/study?mode=nonguided" className="action-button non-guided">
                Start Non-guided Study
              </Link>
              <Link to="/distractions" className="action-button distractions">
                Manage Distractions
              </Link>
            </div>
          </div>
          
          {/* Show recent sessions */}
          <SessionList limit={5} title="Recent Sessions" />
        </div>
        
        <div className="side-content">
          <div className="tip-section">
            <h2>Study Tip of the Day</h2>
            <StudyTip />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;