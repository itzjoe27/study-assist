import React from 'react';
import { Link } from 'react-router-dom';
"import './Navigation.css';"

const Navigation: React.FC = () => {
  return (
    <nav className="navigation">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/study">Study Sessions</Link>
        </li>
        <li>
          <Link to="/distractions">Distraction Blocking</Link>
        </li>
        <li>
          <Link to="/settings">Settings</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;