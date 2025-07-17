import React from 'react';
import backgroundImage from '../../assets/background.png'; 

const HeroSection: React.FC = () => {
  return (
    <div
      className="relative bg-cover bg-center h-96 flex items-center justify-center text-white"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay */}
      <div className="z-10 text-center">
        <h1 className="text-5xl font-bold mb-4">YOUR <span className="text-red-500">TRUSTED</span> RENTAL PARTNER</h1>
        <p className="text-2xl">Safe. Affordable. Reliable.</p>
      </div>
    </div>
  );
};

export default HeroSection;