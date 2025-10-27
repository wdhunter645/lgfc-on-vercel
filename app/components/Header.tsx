'use client';

export default function Header() {
  return (
    <header className="header">
      <div className="nav-container">
        <div className="logo"><a href="/">Lou Gehrig Fan Club</a></div>
        <ul className="nav-menu">
          <li><a href="/about">About</a></li>
          <li><a href="/store">Store</a></li>
          <li><a href="/search">Search</a></li>
          <li><a href="/login">Login</a></li>
        </ul>
      </div>
    </header>
  );
}
