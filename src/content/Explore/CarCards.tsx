import React from 'react';
import {
  FaGasPump,
  FaCogs,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';

import subaruImg from '../../assets/subaru6.jpg';
import fordImg from '../../assets/ford mustang.jpg';
import nissanImg from '../../assets/gtr2.jpg';
import rangeRoverImg from '../../assets/Range Rover.jpg';
import bmwX7Img from '../../assets/BMW X7.jpg';
import lamborghiniImg from '../../assets/lamborghini.jpg';
import toyotaPradoImg from '../../assets/Prado TX.jpg';
import hyundaiImg from '../../assets/Hyundai.jpg';
import jeepWranglerImg from '../../assets/jeep.jpg';

export interface Car {
  id: string;
  name: string;
  pricePerDay: number;
  image: string;
  fuelType: string;
  transmission: string;
  seatingCapacity: number;
  availability: string;
}

const DUMMY_CARS: Car[] = [
  {
    id: '1',
    name: 'Subaru WRX STI',
    pricePerDay: 1000,
    image: subaruImg,
    fuelType: 'Petrol',
    transmission: 'Manual',
    seatingCapacity: 5,
    availability: 'Available',
  },
  {
    id: '2',
    name: 'Ford Mustang',
    pricePerDay: 3000,
    image: fordImg,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: 4,
    availability: 'Available',
  },
  {
    id: '3',
    name: 'Nissan GTR',
    pricePerDay: 3000,
    image: nissanImg,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: 2,
    availability: 'Not Available',
  },
  {
    id: '4',
    name: 'Range Rover',
    pricePerDay: 3000,
    image: rangeRoverImg,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    seatingCapacity: 5,
    availability: 'Available',
  },
  {
    id: '5',
    name: 'BMW X7',
    pricePerDay: 3000,
    image: bmwX7Img,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: 7,
    availability: 'Available',
  },
  {
    id: '6',
    name: 'Lamborghini',
    pricePerDay: 3000,
    image: lamborghiniImg,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: 2,
    availability: 'Not Available',
  },
  {
    id: '7',
    name: 'Toyota Prado TX',
    pricePerDay: 3000,
    image: toyotaPradoImg,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    seatingCapacity: 7,
    availability: 'Available',
  },
  {
    id: '8',
    name: 'Hyundai',
    pricePerDay: 3000,
    image: hyundaiImg,
    fuelType: 'Petrol',
    transmission: 'Manual',
    seatingCapacity: 5,
    availability: 'Available',
  },
  {
    id: '9',
    name: 'Jeep Wrangler',
    pricePerDay: 3000,
    image: jeepWranglerImg,
    fuelType: 'Petrol',
    transmission: 'Manual',
    seatingCapacity: 4,
    availability: 'Available',
  },
];

const CarCard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
      {DUMMY_CARS.map((car) => (
        <div
          key={car.id}
          className="bg-gray-50 rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300"
        >
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-48 object-cover"
          />

          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-[#0F172A] mb-3 text-center">
              {car.name}
            </h3>

            <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm mb-4">
              <div className="flex items-center space-x-2">
                <FaGasPump className="text-red-600" />
                <span>{car.fuelType}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCogs className="text-red-600" />
                <span>{car.transmission}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaUsers className="text-red-600" />
                <span>{car.seatingCapacity} Seats</span>
              </div>
              <div className="flex items-center space-x-2">
                {car.availability === 'Available' ? (
                  <>
                    <FaCheckCircle className="text-green-600" />
                    <span className="text-green-600 font-semibold">
                      Available
                    </span>
                  </>
                ) : (
                  <>
                    <FaTimesCircle className="text-red-600" />
                    <span className="text-red-600 font-semibold">
                      Not Available
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="mt-auto text-center">
              <span className="text-lg font-bold text-red-600 block mb-4">
                Ksh {car.pricePerDay}/day
              </span>

              <div className="flex space-x-2">
                <button
                  className="flex-1 bg-[#001258] hover:bg-blue-900 text-white py-2 rounded transition-colors"
                >
                  View
                </button>
                <button
                  className={`flex-1 ${
                    car.availability === 'Available'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  } text-white py-2 rounded transition-colors`}
                  disabled={car.availability !== 'Available'}
                >
                  Book
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CarCard;
