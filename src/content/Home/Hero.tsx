import React from "react";
import  backgroundImage from "../../assets/background.png";

const Hero: React.FC = () => {
  return (
    <section
      className="h-[400px] bg-cover bg-center relative flex flex-col justify-center items-center text-white text-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold">YOUR RIDE, YOUR WAY</h1>
        <p className="mt-2 text-lg">fast, affordable car rentals for every journey</p>
        <button className="mt-4 bg-red-500 px-4 py-2 rounded hover:bg-red-600">Get started</button>
      </div>
    </section>
  );
};

export default Hero;