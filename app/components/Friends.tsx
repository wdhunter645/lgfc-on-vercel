'use client';

import { useState, useEffect } from 'react';

interface Friend {
  id: string;
  name: string;
  description: string;
  website_url: string;
  logo_url?: string;
}

export default function Friends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/friends')
      .then(res => res.json())
      .then(data => {
        setFriends(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load friends:', err);
        setError('Failed to load friends');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="friends-section">
        <h2 className="friends-title">Friends of the Lou Gehrig Fan Club</h2>
        <p style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="friends-section">
        <h2 className="friends-title">Friends of the Lou Gehrig Fan Club</h2>
        <p style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</p>
      </section>
    );
  }

  return (
    <section className="friends-section">
      <h2 className="friends-title">Friends of the Lou Gehrig Fan Club</h2>
      <div className="friends-grid">
        {friends.map((friend) => (
          <div key={friend.id} className="friend-window">
            <h3 className="friend-name">{friend.name}</h3>
            <p className="friend-description">{friend.description}</p>
            <a 
              className="friend-link" 
              href={friend.website_url} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Visit Website
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
