'use client';

import { useEffect } from 'react';

export default function Faq() {
  const faqs = [
    {
      question: 'When was the Farewell Speech?',
      answer: 'July 4, 1939 — Yankee Stadium.'
    },
    {
      question: 'What position did Lou play?',
      answer: 'First base.'
    }
  ];

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
    <section className="faq-section">
      <h2 className="faq-title">News &amp; Q&amp;A</h2>
      <div className="faq-container">
        <div className="faq-search">
          <input type="text" placeholder="Search questions..." aria-label="Search" />
          <button className="search-btn" type="button">Search</button>
        </div>
        <ul className="faq-list">
          {faqs.map((faq, index) => (
            <li key={index} className="faq-item">
              <button className="faq-question" type="button">{faq.question}</button>
              <div className="faq-answer"><p>{faq.answer}</p></div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
