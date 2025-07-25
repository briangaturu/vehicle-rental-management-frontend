import React from 'react';
import { motion } from 'framer-motion';
import benz from '../../assets/benz.jpg';

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -200 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 2 }}
      className="bg-red-600 text-white p-6 text-center"
    >
      <motion.div
        className="flex justify-center items-center mb-2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <img src={benz} alt="Car Icon" className="h-10 w-10 mr-2 rounded-full" />
        <h1 className="text-4xl font-bold">OUR FLEET</h1>
      </motion.div>

      <motion.p
        className="text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        Fast, affordable car rentals for every journey
      </motion.p>
    </motion.header>
  );
};

export default Header;
