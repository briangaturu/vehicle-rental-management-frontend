import React from 'react';

const Testimonials: React.FC = () => {
  return (
    <section className="bg-gray-800 text-white py-16 px-8 text-center">
      <h2 className="text-3xl font-bold mb-8">TESTIMONIALS</h2>
      <div className="space-y-6">
        <p className="text-xl">"Great service!" - Jane</p>
        <p className="text-xl">"Best prices ever!" - John</p>
      </div>
    </section>
  );
};

export default Testimonials;