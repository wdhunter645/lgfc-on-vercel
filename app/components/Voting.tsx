'use client';

import { useState, useEffect } from 'react';

interface VoteData {
  week_id: string;
  image_a_url: string;
  image_b_url: string;
  votes_a: number;
  votes_b: number;
}

export default function Voting() {
  const [hasVoted, setHasVoted] = useState(false);
  const [voteData, setVoteData] = useState<VoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load current voting data
    fetch('/api/vote')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setVoteData(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load voting data');
        setLoading(false);
      });
  }, []);

  const handleVote = async (option: 'A' | 'B') => {
    if (!voteData) return;

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weekId: voteData.week_id,
          option: option
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setHasVoted(true);
        // Update vote counts
        if (result.votes) {
          setVoteData(prev => prev ? { ...prev, ...result.votes } : null);
        }
      } else {
        alert(result.error || 'Failed to record vote');
      }
    } catch (err) {
      console.error('Vote error:', err);
      alert('Failed to record vote');
    }
  };

  if (loading) {
    return (
      <section className="voting-section">
        <h2 className="voting-title">Vote for your favorite picture</h2>
        <p style={{ textAlign: 'center', padding: '2rem' }}>Loading voting data...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="voting-section">
        <h2 className="voting-title">Vote for your favorite picture</h2>
        <p style={{ textAlign: 'center', padding: '2rem' }}>
          {error === 'Database not configured. Set up Supabase environment variables.' 
            ? 'Voting will be available once database is configured.' 
            : error}
        </p>
      </section>
    );
  }

  if (!voteData) {
    return (
      <section className="voting-section">
        <h2 className="voting-title">Vote for your favorite picture</h2>
        <p style={{ textAlign: 'center', padding: '2rem' }}>No active voting matchup at this time.</p>
      </section>
    );
  }

  return (
    <section className="voting-section">
      <h2 className="voting-title">Vote for your favorite picture</h2>
      <div className="pictures-container">
        <div className="picture-card">
          <div className="picture-placeholder" aria-label="Picture A placeholder"></div>
          <h3 className="picture-title">Option A</h3>
          {hasVoted && <p style={{ textAlign: 'center' }}>Votes: {voteData.votes_a}</p>}
          <button 
            className="vote-btn" 
            onClick={() => handleVote('A')}
            disabled={hasVoted}
          >
            {hasVoted ? 'Vote Recorded' : 'Vote for this picture'}
          </button>
        </div>
        <div className="picture-card">
          <div className="picture-placeholder" aria-label="Picture B placeholder"></div>
          <h3 className="picture-title">Option B</h3>
          {hasVoted && <p style={{ textAlign: 'center' }}>Votes: {voteData.votes_b}</p>}
          <button 
            className="vote-btn" 
            onClick={() => handleVote('B')}
            disabled={hasVoted}
          >
            {hasVoted ? 'Vote Recorded' : 'Vote for this picture'}
          </button>
        </div>
      </div>
    </section>
  );
}
