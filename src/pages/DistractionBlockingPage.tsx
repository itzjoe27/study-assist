import React from 'react';
import DistractionBlocker from '../components/DistractionBlocker';
"import './DistractionBlockingPage.css';"

const DistractionBlockingPage: React.FC = () => {
  return (
    <div className="distraction-blocking-page">
      <h1>Distraction Blocking</h1>
      <p>Control your digital distractions to improve your focus during study sessions.</p>
      
      <DistractionBlocker />
    </div>
  );
};

export default DistractionBlockingPage;