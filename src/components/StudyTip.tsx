import React from 'react';
"import './StudyTip.css';"

const StudyTip: React.FC = () => {
  // For now, we'll just have a static tip as mentioned in requirements
  return (
    <div className="study-tip">
      <p>
        <strong>Active Recall:</strong> Instead of passively re-reading your notes, test yourself by trying 
        to recall the information from memory. This strengthens the neural connections and improves retention.
      </p>
    </div>
  );
};

export default StudyTip;