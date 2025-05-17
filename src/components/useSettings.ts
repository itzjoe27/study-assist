import { useState, useEffect } from 'react';

export interface StudySettings {
  showTipsOnHomepage: boolean;
  autoStartTimers: boolean;
  standardTimerDuration: number; // in seconds
  pomodoroSettings: {
    workDuration: number; // in seconds
    shortBreakDuration: number; // in seconds
    longBreakDuration: number; // in seconds
    longBreakInterval: number; // number of pomodoros before long break
  };
}

const DEFAULT_SETTINGS: StudySettings = {
  showTipsOnHomepage: true,
  autoStartTimers: true,
  standardTimerDuration: 25 * 60, // 25 minutes
  pomodoroSettings: {
    workDuration: 25 * 60, // 25 minutes
    shortBreakDuration: 5 * 60, // 5 minutes
    longBreakDuration: 15 * 60, // 15 minutes
    longBreakInterval: 4, // Long break after 4 work sessions
  },
};

export const useSettings = () => {
  const [settings, setSettings] = useState<StudySettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('studyAssistSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({
          ...DEFAULT_SETTINGS,
          ...parsedSettings,
        });
      } catch (error) {
        console.error('Failed to parse settings:', error);
        // If settings are corrupted, use defaults
        setSettings(DEFAULT_SETTINGS);
      }
    }
    setLoaded(true);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem('studyAssistSettings', JSON.stringify(settings));
    }
  }, [settings, loaded]);

  // Update a specific setting
  const updateSettings = (newSettings: Partial<StudySettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  // Update pomodoro settings specifically
  const updatePomodoroSettings = (pomodoroSettings: Partial<StudySettings['pomodoroSettings']>) => {
    setSettings((prev) => ({
      ...prev,
      pomodoroSettings: {
        ...prev.pomodoroSettings,
        ...pomodoroSettings,
      },
    }));
  };

  // Reset settings to defaults
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return {
    settings,
    updateSettings,
    updatePomodoroSettings,
    resetSettings,
  };
};

export default useSettings;