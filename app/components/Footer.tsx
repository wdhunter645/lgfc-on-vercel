'use client';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-menu">
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="/admin">Admin</a>
      </div>
      <p className="footer-text">
        © {year} Lou Gehrig Fan Club · Contact: LouGehrigFanClub@gmail.com
      </p>
    </footer>
  );
}
