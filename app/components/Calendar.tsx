'use client';

export default function Calendar() {
  return (
    <section className="calendar-section">
      <h2 className="calendar-title">Club Calendar</h2>
      <div className="calendar-grid">
        <div className="day-header">Sun</div>
        <div className="day-header">Mon</div>
        <div className="day-header">Tue</div>
        <div className="day-header">Wed</div>
        <div className="day-header">Thu</div>
        <div className="day-header">Fri</div>
        <div className="day-header">Sat</div>
        <div className="calendar-day other-month"></div>
        <div className="calendar-day other-month"></div>
        <div className="calendar-day">1</div>
        <div className="calendar-day">2</div>
        <div className="calendar-day">3</div>
        <div className="calendar-day">4</div>
        <div className="calendar-day">5</div>
        <div className="calendar-day">6</div>
      </div>
    </section>
  );
}
