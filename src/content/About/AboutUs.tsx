import React from 'react';
import rideCar from '../../assets/rideCar.png'; 

const AboutUs: React.FC = () => {
  return (
    <section className="bg-gray-100 py-16 px-8 flex flex-col md:flex-row items-center justify-center">
      <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0 md:mr-8">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">ABOUT RIDEXPRESS</h2>
        <p className="text-gray-700 leading-relaxed">
          RideXpress was founded in 2025 by Brian Gaturu as a way of offering affordable and available modern vehicles
          capable of long distances, short distances, different roads and terrain for budget friendly price
        </p>
      </div>
      <div className="md:w-1/2 flex justify-center">
        <img src={rideCar} alt="RideXpress Car" className="rounded-lg shadow-lg w-full max-w-md" /> {/* Replace with your image */}
      </div>
    </section>
  );
};

export default AboutUs;