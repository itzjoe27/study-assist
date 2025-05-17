import React, { useEffect, useState } from 'react';
import '../css/Timer.css'; 

export interface TimerProps {
  initialSeconds?: number;
  isRunning: boolean;
  isPaused?: boolean;
  onComplete?: () => void;
  onTick?: (seconds: number) => void;
  mode: 'standard' | 'pomodoro';
  pomodoroConfig?: {
    workDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    longBreakInterval: number;
  };
}

const DEFAULT_POMODORO_CONFIG = {
  workDuration: 25 * 60, // 25 minutes in seconds
  shortBreakDuration: 5 * 60, // 5 minutes in seconds
  longBreakDuration: 15 * 60, // 15 minutes in seconds
  longBreakInterval: 4, // Long break after 4 work sessions
};

const Timer: React.FC<TimerProps> = ({
  initialSeconds = 25 * 60, // Default 25 minutes
  isRunning,
  isPaused = false,
  onComplete,
  onTick,
  mode,
  pomodoroConfig = DEFAULT_POMODORO_CONFIG,
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [pomodoroPhase, setPomodoroPhase] = useState<'work' | 'short-break' | 'long-break'>('work');

  useEffect(() => {
    let interval: number | undefined;

    if (isRunning && !isPaused) {
      interval = window.setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            clearInterval(interval);
            
            if (mode === 'pomodoro') {
              handlePomodoroPhaseComplete();
            } else if (onComplete) {
              onComplete();
            }
            
            return 0;
          }
          
          const newSeconds = prevSeconds - 1;
          if (onTick) {
            onTick(newSeconds);
          }
          return newSeconds;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, isPaused, onComplete, onTick, mode]);

  const handlePomodoroPhaseComplete = () => {
    if (pomodoroPhase === 'work') {
      const newPomodoroCount = pomodoroCount + 1;
      setPomodoroCount(newPomodoroCount);
      
      if (newPomodoroCount % pomodoroConfig.longBreakInterval === 0) {
        setPomodoroPhase('long-break');
        setSeconds(pomodoroConfig.longBreakDuration);
      } else {
        setPomodoroPhase('short-break');
        setSeconds(pomodoroConfig.shortBreakDuration);
      }
    } else {
      setPomodoroPhase('work');
      setSeconds(pomodoroConfig.workDuration);
    }
    
    if (onComplete) {
      onComplete();
    }
  };

  // Reset the Timer with new configuration
  useEffect(() => {
    if (mode === 'standard') {
      setSeconds(initialSeconds);
    } else if (mode === 'pomodoro' && pomodoroPhase === 'work') {
      setSeconds(pomodoroConfig.workDuration);
    }
  }, [initialSeconds, mode, pomodoroConfig, pomodoroPhase]);

  // Format time display (MM:SS)
  const formatTime = () => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="Timer">
      <div className="Timer-display">
        <span className="time">{formatTime()}</span>
        {mode === 'pomodoro' && (
          <div className="pomodoro-info">
            <span className="phase">{pomodoroPhase.replace('-', ' ')}</span>
            <span className="count">Pomodoro: {pomodoroCount}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer;