'use client';

import { useState, useEffect, useCallback } from 'react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export default function Faq() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadFaqs = useCallback((search?: string) => {
    const url = search ? `/api/faq?search=${encodeURIComponent(search)}` : '/api/faq';
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setFaqs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load FAQ:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadFaqs();
  }, [loadFaqs]);

  const handleSearch = () => {
    setLoading(true);
    loadFaqs(searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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

  if (loading && faqs.length === 0) {
    return (
      <section className="faq-section">
        <h2 className="faq-title">News &amp; Q&amp;A</h2>
        <p style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>
      </section>
    );
  }

  return (
    <section className="faq-section">
      <h2 className="faq-title">News &amp; Q&amp;A</h2>
      <div className="faq-container">
        <div className="faq-search">
          <input 
            type="text" 
            placeholder="Search questions..." 
            aria-label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button className="search-btn" type="button" onClick={handleSearch}>
            Search
          </button>
        </div>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '1rem' }}>Searching...</p>
        ) : (
          <ul className="faq-list">
            {faqs.map((faq) => (
              <li key={faq.id} className="faq-item">
                <button className="faq-question" type="button">{faq.question}</button>
                <div className="faq-answer"><p>{faq.answer}</p></div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
