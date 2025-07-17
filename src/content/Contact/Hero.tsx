// src/components/HeroBanner.tsx (Alternative - Hardcoded)
import React from 'react';
import contactBanner from '../../assets/background.png'; 

const Hero: React.FC = () => {
  const title = "Contact Us"; 
  const subtitle = "We are here to help you hit the road";
  const backgroundImage = contactBanner; 
  const titleColor = "text-red-500"; 

  return (
    <section
      className="relative bg-cover bg-center h-64 flex items-center justify-center text-white"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center">
        <h1 className={`text-5xl font-bold mb-2 ${titleColor}`}>{title}</h1>
        <p className="text-xl">{subtitle}</p>
      </div>
    </section>
  );
};

export default Hero;