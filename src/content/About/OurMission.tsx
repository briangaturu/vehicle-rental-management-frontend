import React from 'react';
import { FaCheckCircle, FaCar, FaPhoneVolume } from 'react-icons/fa';

const OurMission: React.FC = () => {
  return (
    <section className="bg-blue-900 text-white py-16 px-8 text-center">
      <h2 className="text-3xl font-bold text-red-500 mb-8">OUR MISSION</h2>
      <div className="flex flex-col items-center space-y-6">
        <div className="flex items-center space-x-4">
          <FaCheckCircle className="text-4xl text-green-400" />
          <p className="text-2xl font-semibold">Affordable rates</p>
        </div>
        <div className="flex items-center space-x-4">
          <FaCar className="text-4xl text-blue-400" />
          <p className="text-2xl font-semibold">Modern fleet</p>
        </div>
        <div className="flex items-center space-x-4">
          <FaPhoneVolume className="text-4xl text-purple-400" />
          <p className="text-2xl font-semibold">24/7 support</p>
        </div>
      </div>
    </section>
  );
};

export default OurMission;