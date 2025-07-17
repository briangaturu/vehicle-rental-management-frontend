
import React from 'react';
import benz from '../../assets/benz.jpg'; 

const Header: React.FC = () => {
  return (
    <header className="bg-red-600 text-white p-6 text-center">
      <div className="flex justify-center items-center mb-2">
        <img src={benz} alt="Car Icon" className="h-10 w-10 mr-2" />
        <h1 className="text-4xl font-bold">OUR FLEET</h1>
      </div>
      <p className="text-lg">fast, affordable car rentals for every journey</p>
    </header>
  );
};

export default Header;