import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../content/AdminDashboard/Hero';
import AboutUs from '../content/About/AboutUs';
import OurMission from '../content/About/OurMission';
import OurStory from '../content/About/OurStory';
import Testimonials from '../content/About/Testimonials';
import Footer from '../components/Footer';

const About: React.FC = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutUs />
      <OurMission />
      <OurStory />
      <Testimonials />
      <Footer />
   </>
  );
}

export default About;