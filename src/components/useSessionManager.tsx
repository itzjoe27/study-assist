import { useEffect, useState } from 'react';

// Define session types
export interface StudySession {
  id: string;
  name: string;
  mode: 'guided' | 'non-guided';
  createdAt: number;
  updatedAt: number;
  duration?: number; // total session duration in seconds
  goals?: StudyGoal[];
  description?: string;
  reflection?: string;
  isCompleted?: boolean;
  pomodoroCount?: number;
}

export interface StudyGoal {
  id: string;
  text: string;
  completed: boolean;
}

// Define hooks for working with sessions
export const useSessionManager = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  
  // Load all sessions from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('studyAssistSessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);
  
  // Save session to localStorage
  const saveSession = (session: StudySession) => {
    // Check if session already exists
    const existingSessionIndex = sessions.findIndex(s => s.id === session.id);
    
    let updatedSessions: StudySession[];
    
    if (existingSessionIndex >= 0) {
      // Update existing session
      updatedSessions = [...sessions];
      updatedSessions[existingSessionIndex] = {
        ...session,
        updatedAt: Date.now()
      };
    } else {
      // Add new session
      updatedSessions = [
        ...sessions,
        {
          ...session,
          id: session.id || crypto.randomUUID(),
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      ];
    }
    
    setSessions(updatedSessions);
    localStorage.setItem('studyAssistSessions', JSON.stringify(updatedSessions));
    return updatedSessions;
  };
  
  // Get session by ID
  const getSession = (id: string): StudySession | undefined => {
    return sessions.find(session => session.id === id);
  };
  
  // Delete session
  const deleteSession = (id: string) => {
    const filteredSessions = sessions.filter(session => session.id !== id);
    setSessions(filteredSessions);
    localStorage.setItem('studyAssistSessions', JSON.stringify(filteredSessions));
    return filteredSessions;
  };
  
  // Get all sessions for a specific mode
  const getSessionsByMode = (mode: 'guided' | 'non-guided'): StudySession[] => {
    return sessions.filter(session => session.mode === mode);
  };
  
  // Get all sessions sorted by recent
  const getRecentSessions = (limit = 5): StudySession[] => {
    return [...sessions]
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, limit);
  };
  
  return {
    sessions,
    saveSession,
    getSession,
    deleteSession,
    getSessionsByMode,
    getRecentSessions
  };
};

export default useSessionManager;