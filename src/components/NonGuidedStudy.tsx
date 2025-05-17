import React, { useState, useEffect } from 'react';
import MaterialLinks from './MaterialLinks';
import Timer from './Timer';
import useSessionManager from './useSessionManager';
import '../css/NonGuidedStudy.css';

const NonGuidedStudy: React.FC = () => {
  const [sessionName, setSessionName] = useState('');
  const [description, setDescription] = useState('');
  const [reflection, setReflection] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState('');
  
  // Session management
  const { saveSession, getSession } = useSessionManager();

  // Load session if ID is provided
  useEffect(() => {
    if (currentSessionId) {
      const savedSession = getSession(currentSessionId);
      if (savedSession) {
        setSessionName(savedSession.name || '');
        setDescription(savedSession.description || '');
        setReflection(savedSession.reflection || '');
        setElapsedTime(savedSession.duration || 0);
      }
    }
  }, [currentSessionId, getSession]);

  // Format time in HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle timer
  const toggleTimer = () => {
    if (!isRunning) {
      // Starting timer - create a session if one doesn't exist
      if (!currentSessionId) {
        saveCurrentSession();
      }
    }
    setIsRunning(!isRunning);
  };

  // Handle timer tick (update elapsed time)
  const handleTimerTick = () => {
    setElapsedTime(prev => prev + 1);
  };

  // Save current session
  const saveCurrentSession = () => {
    // Create session object
    const session = {
      id: currentSessionId || crypto.randomUUID(),
      name: sessionName || 'Untitled Session',
      mode: 'non-guided' as const,
      description: description,
      reflection: reflection,
      duration: elapsedTime,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isCompleted: false
    };
    
    // Save session
    saveSession(session);
    setCurrentSessionId(session.id);
    
    // Show save message
    setSaveMessage('Session saved');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  // Auto-save every minute
  useEffect(() => {
    if (isRunning && currentSessionId) {
      const autoSaveInterval = setInterval(() => {
        saveCurrentSession();
      }, 60000); // Save every minute
      
      return () => clearInterval(autoSaveInterval);
    }
  }, [isRunning, currentSessionId]);

  return (
    <div className="non-guided-study">
      <h2>Non-Guided Study Session</h2>
      
      <div className="session-setup">
        <div className="form-group">
          <label htmlFor="session-name">Session Name:</label>
          <input
            type="text"
            id="session-name"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            placeholder="What are you studying today?"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="session-description">Session Description:</label>
          <textarea
            id="session-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you plan to do in this session"
            rows={3}
          />
        </div>
      </div>
      
      <div className="timer-section">
        <h3>Session Timer</h3>
        
        {isRunning ? (
          <Timer 
            isRunning={isRunning}
            mode="standard"
            onTick={handleTimerTick}
            initialSeconds={0}
          />
        ) : (
          <div className="timer-display">
            <span className="time">{formatTime(elapsedTime)}</span>
          </div>
        )}
        
        <button 
          className={`timer-button ${isRunning ? 'active' : ''}`}
          onClick={toggleTimer}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
      </div>
      
      <div className="reflection-section">
        <h3>Session Reflection</h3>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="After your session, reflect on what you accomplished and learned"
          rows={4}
        />
      </div>
      
      <div className="session-actions">
        <button className="save-button" onClick={saveCurrentSession}>
          Save Session
        </button>
        {saveMessage && <span className="save-message">{saveMessage}</span>}
      </div>
      
      <MaterialLinks />
    </div>
  );
};

export default NonGuidedStudy;