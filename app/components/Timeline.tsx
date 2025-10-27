'use client';

import { useState, useEffect } from 'react';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category?: string;
}

export default function Timeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/timeline')
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load timeline:', err);
        setLoading(false);
      });
  }, []);

  const formatYear = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return original if invalid
      }
      return date.getFullYear().toString();
    } catch {
      return dateString; // Return original if error
    }
  };

  if (loading) {
    return (
      <section className="timeline-section">
        <h2 className="timeline-title">Lou Gehrig&apos;s Career Milestones</h2>
        <p style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>
      </section>
    );
  }

  return (
    <section className="timeline-section">
      <h2 className="timeline-title">Lou Gehrig&apos;s Career Milestones</h2>
      <div className="timeline-container">
        {events.map((event) => (
          <div key={event.id} className="timeline-item">
            <div className="timeline-date">{formatYear(event.date)}</div>
            <div className="timeline-content">
              <h4>{event.title}</h4>
              <p>{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
