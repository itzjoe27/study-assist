import React, { useState } from 'react';
"import './DistractionBlocker.css';"

interface BlockedSite {
  id: number;
  name: string;
  url: string;
  isBlocked: boolean;
}

const DistractionBlocker: React.FC = () => {
  // Predefined websites for initial state
  const [blockedSites, setBlockedSites] = useState<BlockedSite[]>([
    { id: 1, name: 'Facebook', url: 'facebook.com', isBlocked: true },
    { id: 2, name: 'Twitter', url: 'twitter.com', isBlocked: true },
    { id: 3, name: 'Instagram', url: 'instagram.com', isBlocked: true },
    { id: 4, name: 'YouTube', url: 'youtube.com', isBlocked: true },
    { id: 5, name: 'Reddit', url: 'reddit.com', isBlocked: true },
    { id: 6, name: 'TikTok', url: 'tiktok.com', isBlocked: true },
  ]);
  
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteUrl, setNewSiteUrl] = useState('');

  // Toggle blocking status (not actually implementing blocking functionality yet)
  const toggleBlocking = (id: number) => {
    setBlockedSites(blockedSites.map(site => 
      site.id === id ? { ...site, isBlocked: !site.isBlocked } : site
    ));
  };

  // Add new site to the list
  const addSite = () => {
    if (newSiteName.trim() && newSiteUrl.trim()) {
      setBlockedSites([
        ...blockedSites,
        {
          id: Date.now(),
          name: newSiteName,
          url: newSiteUrl,
          isBlocked: true
        }
      ]);
      setNewSiteName('');
      setNewSiteUrl('');
    }
  };

  // Remove site from the list
  const removeSite = (id: number) => {
    setBlockedSites(blockedSites.filter(site => site.id !== id));
  };

  return (
    <div className="distraction-blocker">
      <div className="info-box">
        <h3>How It Works</h3>
        <p>
          The distraction blocker helps you stay focused by blocking distracting websites during your study sessions.
          In this prototype, blocking is simulated but not actually implemented.
        </p>
      </div>
      
      <div className="blocked-sites">
        <h2>Blocked Websites</h2>
        
        <div className="add-site">
          <input
            type="text"
            placeholder="Website Name"
            value={newSiteName}
            onChange={(e) => setNewSiteName(e.target.value)}
          />
          <input
            type="text"
            placeholder="URL (e.g., facebook.com)"
            value={newSiteUrl}
            onChange={(e) => setNewSiteUrl(e.target.value)}
          />
          <button onClick={addSite}>Add Website</button>
        </div>
        
        <table className="sites-table">
          <thead>
            <tr>
              <th>Website</th>
              <th>URL</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blockedSites.map(site => (
              <tr key={site.id}>
                <td>{site.name}</td>
                <td>{site.url}</td>
                <td>
                  <span className={site.isBlocked ? 'blocked' : 'allowed'}>
                    {site.isBlocked ? 'Blocked' : 'Allowed'}
                  </span>
                </td>
                <td>
                  <button 
                    className="toggle-button"
                    onClick={() => toggleBlocking(site.id)}
                  >
                    {site.isBlocked ? 'Allow' : 'Block'}
                  </button>
                  <button 
                    className="remove-button"
                    onClick={() => removeSite(site.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DistractionBlocker;