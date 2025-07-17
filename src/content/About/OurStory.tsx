import React from 'react';

const OurStory: React.FC = () => {
  return (
    <section className="bg-white py-16 px-8 flex flex-col md:flex-row items-center justify-center">
      <div className="md:w-1/3 flex justify-center mb-8 md:mb-0 md:mr-8">
        {/* Placeholder for an image or graphic related to the story */}
        <div className="w-48 h-48 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="md:w-2/3 text-center md:text-left">
        <h2 className="text-3xl font-bold text-red-500 mb-4">OUR STORY</h2>
        <p className="text-gray-700 leading-relaxed text-xl">
          Frustrated with high rates of vehicles and lack of support in case of an emergency, RideXpress is here for you.......
        </p>
      </div>
    </section>
  );
};

export default OurStory;