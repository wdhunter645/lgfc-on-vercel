import Header from './components/Header';
import Hero from './components/Hero';
import Voting from './components/Voting';
import Friends from './components/Friends';
import Timeline from './components/Timeline';
import Faq from './components/Faq';
import Results from './components/Results';
import Calendar from './components/Calendar';
import SocialWall from './components/SocialWall';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <main className="main-content">
        <Voting />
        <Friends />
        <Timeline />
        <Faq />
        <Results />
        <Calendar />
        <SocialWall />
      </main>
      <Footer />
    </>
  );
}
