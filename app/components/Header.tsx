'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="header">
      <div className="nav-container">
        <div className="logo"><Link href="/">Lou Gehrig Fan Club</Link></div>
        <ul className="nav-menu">
          <li><Link href="/about">About</Link></li>
          <li><a href="https://www.bonfire.com/store/lou-gehrig-fan-club/" target="_blank" rel="noopener noreferrer">Store</a></li>
          <li><Link href="/search">Search</Link></li>
          <li><Link href="/login">Login</Link></li>
        </ul>
      </div>
    </header>
  );
}
