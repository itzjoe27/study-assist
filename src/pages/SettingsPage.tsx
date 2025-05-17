import React from 'react';
import useSettings from '../components/useSettings';
import '../css/SettingsPage.css';

const SettingsPage: React.FC = () => {
  const { settings, updateSettings, updatePomodoroSettings, resetSettings } = useSettings();

  // Convert minutes to seconds for the settings
  const minutesToSeconds = (minutes: number) => minutes * 60;
  
  // Convert seconds to minutes for display
  const secondsToMinutes = (seconds: number) => seconds / 60;

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <p>Customize your study assistant experience to match your preferences.</p>
      
      <div className="settings-section">
        <h2>Application Settings</h2>
        
        <div className="setting-item">
          <label>
            <input 
              type="checkbox" 
              checked={settings.showTipsOnHomepage}
              onChange={(e) => updateSettings({ showTipsOnHomepage: e.target.checked })}
            />
            Show study tips on home page
          </label>
        </div>
        
        <div className="setting-item">
          <label>
            <input 
              type="checkbox" 
              checked={settings.autoStartTimers}
              onChange={(e) => updateSettings({ autoStartTimers: e.target.checked })}
            />
            Auto-start Timers after setup
          </label>
        </div>
        
        <div className="setting-item">
          <label>
            Default Timer Duration:
            <select 
              value={secondsToMinutes(settings.standardTimerDuration)}
              onChange={(e) => updateSettings({ 
                standardTimerDuration: minutesToSeconds(parseInt(e.target.value)) 
              })}
            >
              <option value="15">15 minutes</option>
              <option value="20">20 minutes</option>
              <option value="25">25 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </label>
        </div>
      </div>
      
      <div className="settings-section">
        <h2>Pomodoro Settings</h2>
        
        <div className="setting-item">
          <label>
            Work Duration:
            <select 
              value={secondsToMinutes(settings.pomodoroSettings.workDuration)}
              onChange={(e) => updatePomodoroSettings({ 
                workDuration: minutesToSeconds(parseInt(e.target.value)) 
              })}
            >
              <option value="15">15 minutes</option>
              <option value="20">20 minutes</option>
              <option value="25">25 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </label>
        </div>
        
        <div className="setting-item">
          <label>
            Short Break Duration:
            <select 
              value={secondsToMinutes(settings.pomodoroSettings.shortBreakDuration)}
              onChange={(e) => updatePomodoroSettings({ 
                shortBreakDuration: minutesToSeconds(parseInt(e.target.value)) 
              })}
            >
              <option value="3">3 minutes</option>
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
            </select>
          </label>
        </div>
        
        <div className="setting-item">
          <label>
            Long Break Duration:
            <select 
              value={secondsToMinutes(settings.pomodoroSettings.longBreakDuration)}
              onChange={(e) => updatePomodoroSettings({ 
                longBreakDuration: minutesToSeconds(parseInt(e.target.value)) 
              })}
            >
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
              <option value="20">20 minutes</option>
              <option value="25">25 minutes</option>
              <option value="30">30 minutes</option>
            </select>
          </label>
        </div>
        
        <div className="setting-item">
          <label>
            Long Break After:
            <select 
              value={settings.pomodoroSettings.longBreakInterval}
              onChange={(e) => updatePomodoroSettings({ 
                longBreakInterval: parseInt(e.target.value) 
              })}
            >
              <option value="2">2 pomodoros</option>
              <option value="3">3 pomodoros</option>
              <option value="4">4 pomodoros</option>
              <option value="5">5 pomodoros</option>
              <option value="6">6 pomodoros</option>
            </select>
          </label>
        </div>
      </div>
      
      <div className="settings-actions">
        <button className="reset-button" onClick={resetSettings}>
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;