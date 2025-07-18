// src/pages/Explore.tsx
import React from 'react';
import CarCard from '../content/Explore/CarCards';
import CallToAction from '../content/Explore/CallToAction';
import Header from '../content/Explore/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useGetAllVehiclesQuery } from '../features/api/vehiclesApi'; // Import the RTK Query hook

const Explore: React.FC = () => {
  // Use the RTK Query hook to fetch all vehicles
  const { data: vehicles, error, isLoading } = useGetAllVehiclesQuery();

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Header />
          <div className="text-center text-xl text-gray-700 py-10">Loading vehicles... 🚗💨</div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    // A more robust error handling could parse the error object
    const errorMessage = (error as any)?.data?.error || (error as any)?.message || 'Failed to load vehicles. Please try again later.';
    return (
      <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Header />
          <div className="text-center text-xl text-red-500 py-10">Error: {errorMessage} ❌</div>
        </main>
        <Footer />
      </>
    );
  }

  // If no vehicles are found after loading
  if (!vehicles || vehicles.length === 0) {
    return (
      <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Header />
          <div className="text-center text-xl text-gray-700 py-10">No vehicles available at the moment. Check back soon! 😔</div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Header />

        {/* Pass the fetched vehicles data to the CarCard component */}
        <CarCard vehicles={vehicles} />

        <CallToAction />
      </main>
      <Footer />
    </>
  );
};

export default Explore;