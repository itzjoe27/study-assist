import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import StudySessionPage from './pages/StudySessionPage.tsx';
import DistractionBlockingPage from './pages/DistractionBlockingPage.tsx';
import SettingsPage from './pages/SettingsPage.tsx';
import Navigation from './components/Navigation.tsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/study" element={<StudySessionPage />} />
            <Route path="/distractions" element={<DistractionBlockingPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;