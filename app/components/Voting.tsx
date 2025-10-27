'use client';

import { useState } from 'react';

export default function Voting() {
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (id: string) => {
    // TODO: Connect to /api/vote endpoint
    alert(`Vote recorded for ${id} (stub)`);
    setHasVoted(true);
  };

  return (
    <section className="voting-section">
      <h2 className="voting-title">Vote for your favorite picture</h2>
      <div className="pictures-container">
        <div className="picture-card">
          <div className="picture-placeholder" aria-label="Picture 1 placeholder"></div>
          <h3 className="picture-title">Lou at Yankee Stadium</h3>
          <button 
            className="vote-btn" 
            onClick={() => handleVote('picture1')}
            disabled={hasVoted}
          >
            {hasVoted ? 'Vote Recorded' : 'Vote for this picture'}
          </button>
        </div>
        <div className="picture-card">
          <div className="picture-placeholder" aria-label="Picture 2 placeholder"></div>
          <h3 className="picture-title">Lou&apos;s Farewell Speech</h3>
          <button 
            className="vote-btn" 
            onClick={() => handleVote('picture2')}
            disabled={hasVoted}
          >
            {hasVoted ? 'Vote Recorded' : 'Vote for this picture'}
          </button>
        </div>
      </div>
    </section>
  );
}
