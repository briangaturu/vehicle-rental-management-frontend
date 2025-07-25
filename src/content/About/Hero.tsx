import React from 'react';
import { motion } from 'framer-motion';
import backgroundImage from '../../assets/background.png';

// Variants for letter-by-letter animation
const letterVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04 },
  }),
};

const HeroSection: React.FC = () => {
  const title = "YOUR TRUSTED RENTAL PARTNER";

  return (
    <motion.div
      className="relative bg-cover bg-center h-96 flex items-center justify-center text-white"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      initial={{ scale: 1.05 }}
      animate={{ scale: 1 }}
      transition={{ duration: 2, ease: 'easeOut' }}
    >
      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-black opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1 }}
      />

      {/* Text Container with hover lift */}
      <motion.div
        className="z-10 text-center"
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        {/* Animated Title */}
        <motion.h1
          className="text-5xl font-bold mb-4 flex flex-wrap justify-center cursor-pointer"
          aria-label={title}
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          {title.split("").map((char, i) => (
            <motion.span
              key={i}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={letterVariants}
              className={`inline-block ${
                char === " " ? "w-2" : char === "T" ? "text-red-500" : ""
              }`}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle with glow on hover */}
        <motion.p
          className="text-2xl cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          whileHover={{
            textShadow: '0px 0px 10px rgba(255, 255, 255, 0.9)',
            scale: 1.05,
          }}
        >
          Safe. Affordable. Reliable.
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default HeroSection;
