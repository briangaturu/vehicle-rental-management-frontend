// src/pages/Explore.tsx
import React from 'react';
import CarCard from '../content/Explore/CarCards';
import CallToAction from '../content/Explore/CallToAction';
import Header from '../content/Explore/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Explore: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Header />

        {/* CarCard now handles the list internally */}
        <CarCard />

        <CallToAction />
      </main>
      <Footer />
    </>
  );
};

export default Explore;
