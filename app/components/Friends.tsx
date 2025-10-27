'use client';

export default function Friends() {
  const friends = [
    {
      name: 'Baseball Hall of Fame',
      description: 'Preserving baseball history and honoring legends like Lou Gehrig',
      url: 'https://baseballhall.org'
    },
    {
      name: 'ALS Association',
      description: 'Fighting ALS and supporting families affected by Lou Gehrig\'s Disease',
      url: 'https://www.als.org'
    },
    {
      name: 'New York Yankees',
      description: 'Lou\'s legendary team where he played his entire career',
      url: 'https://www.mlb.com/yankees'
    }
  ];

  return (
    <section className="friends-section">
      <h2 className="friends-title">Friends of the Lou Gehrig Fan Club</h2>
      <div className="friends-grid">
        {friends.map((friend, index) => (
          <div key={index} className="friend-window">
            <h3 className="friend-name">{friend.name}</h3>
            <p className="friend-description">{friend.description}</p>
            <a 
              className="friend-link" 
              href={friend.url} 
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
