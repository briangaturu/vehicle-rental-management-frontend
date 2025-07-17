import React from "react";

const whyChooseUs: React.FC = () => {
  return (
    <section className="bg-[#0D1C49] text-white py-12 mt-8 ">
      <h2 className="text-center text-3xl font-bold text-red-600 mb-8">
        WHY CHOOSE US
      </h2>
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 px-8">
        <p>✔ AFFORDABLE RATES FROM KSH500 PER DAY</p>
        <p>🚘 MODERN FLEET STYLISH CARS ALL ROADS CARS</p>
        <p>📞 24/7 SUPPORT ALWAYS ON CALL</p>
      </div>
      <p className="text-center italic text-red-400 mt-8 text-xl">
        Ready to hit the road?
      </p>
      <div className="flex justify-center mt-4">
        <button className="bg-white text-[#0D1C49] px-6 py-2 rounded hover:bg-gray-200">
          Book Your Ride
        </button>
      </div>
    </section>
  );
};

export default whyChooseUs;
