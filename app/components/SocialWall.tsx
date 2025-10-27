'use client';

import { useEffect } from 'react';

export default function SocialWall() {
  useEffect(() => {
    // Load Elfsight script
    const script = document.createElement('script');
    script.src = 'https://elfsightcdn.com/platform.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section className="social-section">
      <h2 className="social-title">Social Wall</h2>
      <div className="elfsight-app-805f3c5c-67cd-4edf-bde6-2d5978e386a8" data-elfsight-app-lazy></div>
    </section>
  );
}
