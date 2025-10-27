'use client';

export default function Header() {
  return (
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
  );
}
