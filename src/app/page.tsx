import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import ProblemSolution from '../components/ProblemSolution';
import Credentials from '../components/Credentials';
import Founder from '../components/Founder';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <ProblemSolution />
      <Credentials />
      <Founder />
      <CTA />
      <Footer />
    </>
  );
}
