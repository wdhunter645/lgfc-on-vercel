import Header from '../components/Header';
import Footer from '../components/Footer';

export default function About() {
  return (
    <>
      <Header />
      <section className="hero">
        <div className="hero-content">
          <h1>About the Lou Gehrig Fan Club</h1>
          <p>Honoring the legacy of baseball&apos;s Iron Horse</p>
        </div>
      </section>
      <main className="main-content">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="voting-title">Our Mission</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
            The Lou Gehrig Fan Club is dedicated to celebrating and preserving the legacy of 
            one of baseball&apos;s greatest players. Lou Gehrig, known as the &quot;Iron Horse,&quot; set 
            records for consecutive games played and exemplified courage, dignity, and 
            determination both on and off the field.
          </p>
          
          <h2 className="voting-title">About Lou Gehrig</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
            Henry Louis Gehrig (1903-1941) was a legendary first baseman for the New York 
            Yankees. His consecutive games streak of 2,130 games stood for 56 years. A 
            seven-time All-Star and two-time American League MVP, Gehrig&apos;s career was 
            tragically cut short by ALS, a disease that now bears his name.
          </p>
          
          <h2 className="voting-title">Join Our Community</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
            Whether you&apos;re a lifelong baseball fan or just learning about Lou Gehrig&apos;s 
            incredible story, we welcome you to join our community. Together, we honor 
            his memory and continue to inspire others with his example of perseverance 
            and grace.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
