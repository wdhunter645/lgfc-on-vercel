'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

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
        // Update vote counts with explicit property mapping
        if (result.votes && typeof result.votes.votes_a === 'number' && typeof result.votes.votes_b === 'number') {
          setVoteData(prev => prev ? { 
            ...prev, 
            votes_a: result.votes.votes_a,
            votes_b: result.votes.votes_b
          } : null);
        }
      } else {
        alert(result.error || 'Failed to record vote');
      }
    } catch (err) {
      console.error('Vote error:', err);
      alert('Failed to record vote');
    }
  };

  const getErrorMessage = (errorText: string) => {
    if (errorText === 'Database not configured. Set up Supabase environment variables.') {
      return 'Voting will be available once database is configured.';
    }
    return errorText;
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
        <div className="pictures-container">
          <div className="picture-card">
            <Image 
              src="/picture-a.svg" 
              alt="Picture A" 
              width={400}
              height={180}
              style={{ width: '100%', height: '180px', borderRadius: '10px', objectFit: 'cover' }}
            />
            <h3 className="picture-title">Option A</h3>
            <button 
              className="vote-btn" 
              disabled
            >
              Vote
            </button>
          </div>
          <div className="picture-card">
            <Image 
              src="/picture-b.svg" 
              alt="Picture B" 
              width={400}
              height={180}
              style={{ width: '100%', height: '180px', borderRadius: '10px', objectFit: 'cover' }}
            />
            <h3 className="picture-title">Option B</h3>
            <button 
              className="vote-btn" 
              disabled
            >
              Vote
            </button>
          </div>
        </div>
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <h3 style={{ color: '#1e3a8a', fontSize: '1.5rem', marginBottom: '1rem' }}>Vote Totals</h3>
          <p style={{ color: '#666' }}>{getErrorMessage(error)}</p>
        </div>
      </section>
    );
  }

  if (!voteData) {
    return (
      <section className="voting-section">
        <h2 className="voting-title">Vote for your favorite picture</h2>
        <div className="pictures-container">
          <div className="picture-card">
            <Image 
              src="/picture-a.svg" 
              alt="Picture A" 
              width={400}
              height={180}
              style={{ width: '100%', height: '180px', borderRadius: '10px', objectFit: 'cover' }}
            />
            <h3 className="picture-title">Option A</h3>
            <button 
              className="vote-btn" 
              disabled
            >
              Vote
            </button>
          </div>
          <div className="picture-card">
            <Image 
              src="/picture-b.svg" 
              alt="Picture B" 
              width={400}
              height={180}
              style={{ width: '100%', height: '180px', borderRadius: '10px', objectFit: 'cover' }}
            />
            <h3 className="picture-title">Option B</h3>
            <button 
              className="vote-btn" 
              disabled
            >
              Vote
            </button>
          </div>
        </div>
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <h3 style={{ color: '#1e3a8a', fontSize: '1.5rem', marginBottom: '1rem' }}>Vote Totals</h3>
          <p style={{ color: '#666' }}>No active voting matchup at this time.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="voting-section">
      <h2 className="voting-title">Vote for your favorite picture</h2>
      <div className="pictures-container">
        <div className="picture-card">
          <Image 
            src="/picture-a.svg" 
            alt="Picture A" 
            width={400}
            height={180}
            style={{ width: '100%', height: '180px', borderRadius: '10px', objectFit: 'cover' }}
          />
          <h3 className="picture-title">Option A</h3>
          <button 
            className="vote-btn" 
            onClick={() => handleVote('A')}
            disabled={hasVoted}
          >
            {hasVoted ? 'Vote Recorded' : 'Vote'}
          </button>
        </div>
        <div className="picture-card">
          <Image 
            src="/picture-b.svg" 
            alt="Picture B" 
            width={400}
            height={180}
            style={{ width: '100%', height: '180px', borderRadius: '10px', objectFit: 'cover' }}
          />
          <h3 className="picture-title">Option B</h3>
          <button 
            className="vote-btn" 
            onClick={() => handleVote('B')}
            disabled={hasVoted}
          >
            {hasVoted ? 'Vote Recorded' : 'Vote'}
          </button>
        </div>
      </div>
      {hasVoted && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <h3 style={{ color: '#1e3a8a', fontSize: '1.5rem', marginBottom: '1rem' }}>Vote Totals</h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem' }}>
            <div>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Option A</p>
              <p style={{ fontSize: '2rem', color: '#3b82f6' }}>{voteData.votes_a}</p>
            </div>
            <div>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Option B</p>
              <p style={{ fontSize: '2rem', color: '#3b82f6' }}>{voteData.votes_b}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
