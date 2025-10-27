'use client';

export default function Timeline() {
  const events = [
    {
      date: '1923',
      title: 'MLB Debut',
      description: 'Gehrig debuts with the Yankees on June 15, 1923.'
    },
    {
      date: '1925',
      title: 'The Streak Begins',
      description: 'Starts his consecutive games streak June 1, 1925.'
    },
    {
      date: '1927',
      title: 'Murderers\' Row',
      description: 'Key part of the legendary 1927 Yankees lineup.'
    }
  ];

  return (
    <section className="timeline-section">
      <h2 className="timeline-title">Lou Gehrig&apos;s Career Milestones</h2>
      <div className="timeline-container">
        {events.map((event, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-date">{event.date}</div>
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
