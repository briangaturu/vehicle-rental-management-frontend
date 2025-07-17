import React from 'react';
import { useNavigate } from 'react-router-dom';

const CallToAction: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="text-center py-10">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">
        Unable to book your Ride
      </h2>
      <button
        onClick={() => navigate('/contact')}
        className="bg-red-600 text-white px-8 py-3 rounded-md text-lg hover:bg-red-700 transition-colors"
      >
        Contact Us
      </button>
    </section>
  );
};

export default CallToAction;
