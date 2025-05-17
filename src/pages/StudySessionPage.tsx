import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GuidedStudy from '../components/GuidedStudy';
import NonGuidedStudy from '../components/NonGuidedStudy';
import SessionsList from '../components/SessionList';
import '../css/StudySessionPage.css';

const StudySessionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [studyMode, setStudyMode] = useState<'guided' | 'nonguided' | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  // Parse query parameters on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    const session = params.get('session');
    
    if (mode === 'guided') {
      setStudyMode('guided');
    } else if (mode === 'nonguided') {
      setStudyMode('nonguided');
    }
    
    if (session) {
      setSessionId(session);
    }
  }, [location.search]);
  
  // Update URL when mode changes
  useEffect(() => {
    if (studyMode) {
      const params = new URLSearchParams();
      params.set('mode', studyMode);
      if (sessionId) {
        params.set('session', sessionId);
      }
      navigate(`/study?${params.toString()}`, { replace: true });
    }
  }, [studyMode, sessionId, navigate]);
  
  // Handle mode selection
  const handleModeSelect = (mode: 'guided' | 'nonguided') => {
    setStudyMode(mode);
    setSessionId(null);
  };
  
  // Handle back button
  const handleBack = () => {
    setStudyMode(null);
    setSessionId(null);
    navigate('/study', { replace: true });
  };

  return (
    <div className="study-session-page">
      <h1>Study Sessions</h1>
      
      {!studyMode && (
        <div className="study-container">
          <div className="study-mode-selection">
            <h2>Select Study Mode</h2>
            <div className="mode-buttons">
              <button onClick={() => handleModeSelect('guided')} className="guided-button">
                <h3>Guided Study</h3>
                <p>Follow structured techniques like Pomodoro, set goals, and track progress</p>
              </button>
              
              <button onClick={() => handleModeSelect('nonguided')} className="non-guided-button">
                <h3>Non-Guided Study</h3>
                <p>Create a flexible study session with simple timing and notes</p>
              </button>
            </div>
          </div>
          
          <div className="recent-sessions">
            <div className="sessions-container">
              <SessionsList mode="guided" limit={3} title="Recent Guided Sessions" />
              <SessionsList mode="non-guided" limit={3} title="Recent Non-Guided Sessions" />
            </div>
          </div>
        </div>
      )}

      {studyMode === 'guided' && (
        <div>
          <button className="back-button" onClick={handleBack}>
            ← Back to Selection
          </button>
          <GuidedStudy />
        </div>
      )}

      {studyMode === 'nonguided' && (
        <div>
          <button className="back-button" onClick={handleBack}>
            ← Back to Selection
          </button>
          <NonGuidedStudy />
        </div>
      )}
    </div>
  );
};

export default StudySessionPage;