// src/pages/ContactPage.tsx
import React from 'react';
import OfficeInfo from '../content/Contact/OfficeInfo';
import ContactForm from '../content/Contact/ContactForm';
import Hero from '../content/Contact/Hero';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ContactPage: React.FC = () => {
  return (
    <div className="bg-white font-sans antialiased">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        <Hero />
        <OfficeInfo />
        <ContactForm />
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
