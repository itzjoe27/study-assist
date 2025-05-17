import React from 'react';
import { Link } from 'react-router-dom';
import useSessionManager, { type StudySession } from './useSessionManager';
import '../css/SessionList.css';

interface SessionsListProps {
  limit?: number;
  mode?: 'guided' | 'non-guided';
  title?: string;
}

const SessionsList: React.FC<SessionsListProps> = ({ 
  limit = 5, 
  mode,
  title = 'Recent Sessions'
}) => {
  const { sessions, deleteSession } = useSessionManager();
  
  // Filter sessions by mode if provided, and sort by most recent
  const filteredSessions = sessions
    .filter(session => mode ? session.mode === mode : true)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, limit);
  
  // Format date for display
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format duration for display
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0m';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };
  
  // Handle delete session
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this session?')) {
      deleteSession(id);
    }
  };
  
  // Determine route for session
  const getSessionRoute = (session: StudySession) => {
    const basePath = session.mode === 'guided' ? '/study?mode=guided' : '/study?mode=nonguided';
    return `${basePath}&session=${session.id}`;
  };
  
  if (filteredSessions.length === 0) {
    return (
      <div className="sessions-list">
        <h3>{title}</h3>
        <p className="no-sessions">No sessions found</p>
      </div>
    );
  }
  
  return (
    <div className="sessions-list">
      <h3>{title}</h3>
      <ul>
        {filteredSessions.map(session => (
          <li key={session.id} className="session-item">
            <Link to={getSessionRoute(session)} className="session-link">
              <div className="session-header">
                <h4>{session.name || 'Untitled Session'}</h4>
                <div className="session-actions">
                  <button 
                    className="delete-btn" 
                    onClick={(e) => handleDelete(session.id, e)}
                    title="Delete session"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="session-details">
                <span className="mode">{session.mode === 'guided' ? 'Guided' : 'Non-guided'}</span>
                <span className="duration">{formatDuration(session.duration)}</span>
                <span className="date">{formatDate(session.updatedAt)}</span>
              </div>
              {session.goals && session.goals.length > 0 && (
                <div className="session-goals">
                  <span>{session.goals.filter(g => g.completed).length} of {session.goals.length} goals completed</span>
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionsList;