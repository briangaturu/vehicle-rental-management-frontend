import React from "react";
import { motion } from "framer-motion";
import backgroundImage from "../../assets/background.png";

// Variants for letter-by-letter title animation
const letterVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 },
  }),
};

const Hero: React.FC = () => {
  const title = "YOUR RIDE, YOUR WAY";

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      className="h-[400px] bg-cover bg-center relative flex flex-col justify-center items-center text-white text-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Background overlay animation */}
      <motion.div
        className="absolute inset-0 bg-black opacity-50"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      <div className="relative z-10">
        {/* RIDEXPRESS Branding */}
        <motion.h1
          className="text-6xl md:text-7xl font-extrabold mb-4 cursor-pointer"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-white">RIDE</span>
          <span className="text-red-500 text-7xl md:text-8xl font-black px-1">X</span>
          <span className="text-white">PRESS</span>
        </motion.h1>

        {/* Animated Headline Letter by Letter */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold flex flex-wrap justify-center mb-2"
          aria-label={title}
        >
          {title.split("").map((char, i) => (
            <motion.span
              key={i}
              custom={i}
              initial="hidden"
              animate="visible"
              whileHover={{
                y: -3,
                textShadow: "0px 0px 8px #ffffff",
              }}
              variants={letterVariants}
              className={`inline-block transition duration-300 ${
                char !== " " ? "text-white" : ""
              }`}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h2>

        {/* Subtitle with hover glow */}
        <motion.p
          className="mt-2 text-lg text-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          whileHover={{
            textShadow: "0px 0px 10px rgba(255,255,255,0.8)",
            scale: 1.02,
          }}
        >
          Fast, affordable car rentals for every journey
        </motion.p>

        {/* Button with hover bounce */}
        <motion.button
          className="mt-4 bg-red-500 px-6 py-3 rounded-lg hover:bg-red-600 text-white font-semibold shadow-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.08 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          Get started
        </motion.button>
      </div>
    </motion.section>
  );
};

export default Hero;
