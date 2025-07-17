import React from "react";
import corollaImg from "../../assets/car1.png";
import subaruImg from "../../assets/car2.png";
import imprezaImg from "../../assets/car3.png";

interface Car {
  name: string;
  price: string;
  image: string;
}

const fleetData: Car[] = [
  { name: "corolla", price: "ksh 600/day", image: corollaImg },
  { name: "Subaru", price: "ksh 1000/day", image: subaruImg },
  { name: "impreza", price: "ksh 1000/day", image: imprezaImg },
];

const Fleet: React.FC = () => {
  return (
    <section className="py-12 bg-white">
      <h2 className="text-center text-3xl font-bold text-[#0D1C49] uppercase mb-8">
        Explore Our Fleet
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
        {fleetData.map((car) => (
          <div
            key={car.name}
            className="bg-white border border-gray-200 shadow hover:shadow-lg transition duration-300 flex flex-col h-full"
          >
            <img
              src={car.image}
              alt={car.name}
              className="w-full h-[250px] object-cover"
            />
            <div className="flex-grow flex flex-col justify-between p-4 text-center">
              <div>
                <h3 className="text-lg font-bold capitalize text-gray-900">{car.name}</h3>
                <p className="text-gray-700">{car.price}</p>
              </div>
              <button className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full">
                view
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Fleet;