'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [year] = useState(new Date().getFullYear());

  const handleVote = (id: string) => {
    alert(`Vote recorded for ${id} (stub)`);
  };

  useEffect(() => {
    const handleFaqClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('faq-question')) {
        target.closest('.faq-item')?.classList.toggle('active');
      }
    };

    document.addEventListener('click', handleFaqClick);
    return () => document.removeEventListener('click', handleFaqClick);
  }, []);

  return (
    <>
      <header className="header">
        <div className="nav-container">
          <div className="logo">Lou Gehrig Fan Club</div>
          <ul className="nav-menu">
            <li><a href="/weekly">Weekly Matchup</a></li>
            <li><a href="/milestones">Milestones</a></li>
            <li><a href="/charities">Charities</a></li>
            <li><a href="/news">News &amp; Q&amp;A</a></li>
            <li><a href="/calendar">Calendar</a></li>
            <li><a href="/member">Join</a></li>
          </ul>
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to the Lou Gehrig Fan Club!</h1>
          <p>Celebrating the Iron Horse and his incredible legacy</p>
        </div>
      </section>

      <main className="main-content">
        {/* Voting Section */}
        <section className="voting-section">
          <h2 className="voting-title">Vote for your favorite picture</h2>
          <div className="pictures-container">
            <div className="picture-card">
              <div className="picture-placeholder" aria-label="Picture 1 placeholder"></div>
              <h3 className="picture-title">Lou at Yankee Stadium</h3>
              <button className="vote-btn" onClick={() => handleVote('picture1')}>Vote for this picture</button>
            </div>
            <div className="picture-card">
              <div className="picture-placeholder" aria-label="Picture 2 placeholder"></div>
              <h3 className="picture-title">Lou&apos;s Farewell Speech</h3>
              <button className="vote-btn" onClick={() => handleVote('picture2')}>Vote for this picture</button>
            </div>
          </div>
        </section>

        {/* Friends Section */}
        <section className="friends-section">
          <h2 className="friends-title">Friends of the Lou Gehrig Fan Club</h2>
          <div className="friends-grid">
            <div className="friend-window">
              <h3 className="friend-name">Baseball Hall of Fame</h3>
              <p className="friend-description">Preserving baseball history and honoring legends like Lou Gehrig</p>
              <a className="friend-link" href="https://baseballhall.org" target="_blank" rel="noopener noreferrer">Visit Website</a>
            </div>
            <div className="friend-window">
              <h3 className="friend-name">ALS Association</h3>
              <p className="friend-description">Fighting ALS and supporting families affected by Lou Gehrig&apos;s Disease</p>
              <a className="friend-link" href="https://www.als.org" target="_blank" rel="noopener noreferrer">Visit Website</a>
            </div>
            <div className="friend-window">
              <h3 className="friend-name">New York Yankees</h3>
              <p className="friend-description">Lou&apos;s legendary team where he played his entire career</p>
              <a className="friend-link" href="https://www.mlb.com/yankees" target="_blank" rel="noopener noreferrer">Visit Website</a>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="timeline-section">
          <h2 className="timeline-title">Lou Gehrig&apos;s Career Milestones</h2>
          <div className="timeline-container">
            <div className="timeline-item">
              <div className="timeline-date">1923</div>
              <div className="timeline-content">
                <h4>MLB Debut</h4>
                <p>Gehrig debuts with the Yankees on June 15, 1923.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">1925</div>
              <div className="timeline-content">
                <h4>The Streak Begins</h4>
                <p>Starts his consecutive games streak June 1, 1925.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">1927</div>
              <div className="timeline-content">
                <h4>Murderers&apos; Row</h4>
                <p>Key part of the legendary 1927 Yankees lineup.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="faq-section">
          <h2 className="faq-title">News &amp; Q&amp;A</h2>
          <div className="faq-container">
            <div className="faq-search">
              <input type="text" placeholder="Search questions..." aria-label="Search" />
              <button className="search-btn" type="button">Search</button>
            </div>
            <ul className="faq-list">
              <li className="faq-item">
                <button className="faq-question" type="button">When was the Farewell Speech?</button>
                <div className="faq-answer"><p>July 4, 1939 — Yankee Stadium.</p></div>
              </li>
              <li className="faq-item">
                <button className="faq-question" type="button">What position did Lou play?</button>
                <div className="faq-answer"><p>First base.</p></div>
              </li>
            </ul>
          </div>
        </section>

        {/* Results */}
        <section className="results-section">
          <h2 className="results-title">Weekly Matchup Results</h2>
          <table className="results-table" aria-label="Matchup results">
            <thead><tr><th>Picture</th><th>Votes</th></tr></thead>
            <tbody>
              <tr><td>Lou at Yankee Stadium</td><td>128</td></tr>
              <tr><td>Farewell Speech</td><td>173</td></tr>
            </tbody>
          </table>
        </section>

        {/* Calendar */}
        <section className="calendar-section">
          <h2 className="calendar-title">Club Calendar</h2>
          <div className="calendar-grid">
            <div className="day-header">Sun</div><div className="day-header">Mon</div><div className="day-header">Tue</div>
            <div className="day-header">Wed</div><div className="day-header">Thu</div><div className="day-header">Fri</div><div className="day-header">Sat</div>
            <div className="calendar-day other-month"></div><div className="calendar-day other-month"></div>
            <div className="calendar-day">1</div><div className="calendar-day">2</div><div className="calendar-day">3</div>
            <div className="calendar-day">4</div><div className="calendar-day">5</div><div className="calendar-day">6</div>
          </div>
        </section>

        {/* Social */}
        <section className="social-section">
          <h2 className="social-title">Social Wall</h2>
          <script src="https://elfsightcdn.com/platform.js" async></script>
          <div className="elfsight-app-805f3c5c-67cd-4edf-bde6-2d5978e386a8" data-elfsight-app-lazy></div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-menu">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/admin">Admin</a>
        </div>
        <p className="footer-text">© {year} Lou Gehrig Fan Club · Contact: LouGehrigFanClub@gmail.com</p>
      </footer>
    </>
  );
}
