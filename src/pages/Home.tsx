import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../content/Home/Hero";
import Fleet from "../content/Home/Fleet";
import WhyChooseUs from "../content/Home/WhyChooseUs";
import Footer from "../components/Footer";

const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Fleet />
      <WhyChooseUs />
      <Footer />
    </>
  );
};

export default Home;
