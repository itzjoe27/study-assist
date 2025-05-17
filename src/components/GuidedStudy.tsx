import React, { useState, useEffect } from 'react';
import MaterialLinks from './MaterialLinks';
import Timer from './Timer.tsx';
import useSessionManager, { StudyGoal } from './useSessionManager';
import '../css/GuidedStudy.css';

interface PomodoroSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
}

const GuidedStudy: React.FC = () => {
  const [sessionName, setSessionName] = useState('');
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const [nextTimeGoals, setNextTimeGoals] = useState('');
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const [timerMode, setTimerMode] = useState<'standard' | 'pomodoro'>('standard');
  const [standardTimerDuration, setStandardTimerDuration] = useState(25 * 60); // 25 minutes
  const [pomodoroSettings, setPomodoroSettings] = useState<PomodoroSettings>({
    workDuration: 25 * 60, // 25 minutes
    shortBreakDuration: 5 * 60, // 5 minutes
    longBreakDuration: 15 * 60, // 15 minutes
    longBreakInterval: 4, // Long break after 4 work sessions
  });
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [saveMessage, setSaveMessage] = useState('');

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('studyAssistSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.pomodoroSettings) {
        setPomodoroSettings(settings.pomodoroSettings);
      }
      if (settings.standardTimerDuration) {
        setStandardTimerDuration(settings.standardTimerDuration);
      }
    }
  }, []);

  // Session management
  const { saveSession, getSession } = useSessionManager();

  // Load session if ID is provided
  useEffect(() => {
    if (currentSessionId) {
      const savedSession = getSession(currentSessionId);
      if (savedSession) {
        setSessionName(savedSession.name || '');
        setGoals(savedSession.goals || []);
        setNextTimeGoals(savedSession.description || '');
        setPomodoroCount(savedSession.pomodoroCount || 0);
      }
    }
  }, [currentSessionId, getSession]);

  // Add a new goal
  const addGoal = () => {
    if (newGoal.trim()) {
      const newGoalItem: StudyGoal = {
        id: crypto.randomUUID(),
        text: newGoal,
        completed: false
      };
      setGoals([...goals, newGoalItem]);
      setNewGoal('');
      
      // Save session whenever a goal is added
      saveCurrentSession();
    }
  };

  // Toggle goal completion
  const toggleGoalCompletion = (id: string) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
    
    // Save session whenever a goal is toggled
    saveCurrentSession();
  };

  // Save current session
  const saveCurrentSession = () => {
    // Create session object
    const session = {
      id: currentSessionId || crypto.randomUUID(),
      name: sessionName,
      mode: 'guided' as const,
      goals: goals,
      description: nextTimeGoals,
      duration: elapsedTime,
      pomodoroCount: pomodoroCount,
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

  // Handle timer completion
  const handleTimerComplete = () => {
    if (timerMode === 'pomodoro') {
      setPomodoroCount(prev => prev + 1);
    }
    // Auto-save on timer completion
    saveCurrentSession();
  };

  // Handle timer tick to track elapsed time
  const handleTimerTick = () => {
    setElapsedTime(prev => prev + 1);
  };

  // Toggle standard timer
  const toggleTimer = () => {
    setTimerMode('standard');
    setIsPomodoroActive(false);
    setIsTimerActive(!isTimerActive);
  };

  // Toggle Pomodoro timer
  const togglePomodoro = () => {
    setTimerMode('pomodoro');
    setIsPomodoroActive(!isPomodoroActive);
    setIsTimerActive(!isPomodoroActive);
  };

  // Format time (seconds) to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="guided-study">
      <h2>Guided Study Session</h2>
      
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
          <h3>Session Goals</h3>
          <div className="goal-input">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Add a goal for this session"
              onKeyPress={(e) => e.key === 'Enter' && addGoal()}
            />
            <button onClick={addGoal}>Add</button>
          </div>
          
          <ul className="goals-list">
            {goals.map(goal => (
              <li key={goal.id} className={goal.completed ? 'completed' : ''}>
                <input
                  type="checkbox"
                  checked={goal.completed}
                  onChange={() => toggleGoalCompletion(goal.id)}
                />
                <span>{goal.text}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="form-group">
          <h3>Next Time Goals</h3>
          <textarea
            value={nextTimeGoals}
            onChange={(e) => setNextTimeGoals(e.target.value)}
            placeholder="What would you like to achieve next time?"
            rows={3}
          />
        </div>
      </div>
      
      <div className="timers-section">
        <div className="timer-controls">
          <h3>Timers</h3>
          
          {(isTimerActive || isPomodoroActive) && (
            <Timer 
              isRunning={isTimerActive || isPomodoroActive}
              initialSeconds={standardTimerDuration}
              mode={timerMode}
              pomodoroConfig={pomodoroSettings}
              onComplete={handleTimerComplete}
              onTick={handleTimerTick}
            />
          )}
          
          <div className="timer-buttons">
            <button 
              className={`timer-button ${isTimerActive && timerMode === 'standard' ? 'active' : ''}`}
              onClick={toggleTimer}
            >
              {isTimerActive && timerMode === 'standard' ? 'Pause Timer' : 'Start Timer'}
            </button>
            
            <button 
              className={`pomodoro-button ${isPomodoroActive ? 'active' : ''}`}
              onClick={togglePomodoro}
            >
              {isPomodoroActive ? 'Stop Pomodoro' : 'Start Pomodoro'}
            </button>
          </div>
        </div>
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

export default GuidedStudy;