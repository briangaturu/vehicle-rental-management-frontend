// src/content/Explore/CarCards.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  FaGasPump,
  FaCogs,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';

import { type Vehicle } from '../../features/api/vehiclesApi';
import { useCreateBookingMutation } from '../../features/api/bookingsApi';
import { useGetAllLocationsQuery } from '../../features/api/locationApi';
import { useSelector } from 'react-redux';
import { type RootState } from '../../app/store';
import { StripeCheckoutButton } from './payments';

interface CarCardProps {
  vehicles: Vehicle[];
}

const CarCard: React.FC<CarCardProps> = ({ vehicles }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // ✅ Payment Modal State
  const [currentBookingAmount, setCurrentBookingAmount] = useState<number>(0); // ✅ Amount to pass to payment

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [currentBookingId, setCurrentBookingId] = useState<number | null>(null);

  const [
    createBooking,
    {
      isLoading: isBookingLoading,
      isSuccess: isBookingSuccess,
      isError: isBookingError,
      error: bookingError,
    },
  ] = useCreateBookingMutation();
  const {
    data: locations,
    isLoading: isLocationsLoading,
    isError: isLocationsError,
    error: _locationsError,
  } = useGetAllLocationsQuery();

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedVehicle(null);
    setBookingDate('');
    setReturnDate('');
    setTotalAmount(0);
    setSelectedLocationId('');
    setErrorMessage('');
    setSuccessMessage('');
  }, []);

  const handleBookClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
    setBookingDate('');
    setReturnDate('');
    setTotalAmount(0);
    setSelectedLocationId('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  useEffect(() => {
    if (bookingDate && returnDate && selectedVehicle?.rentalRate) {
      const start = new Date(bookingDate);
      const end = new Date(returnDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        setErrorMessage('Invalid date selection.');
        setTotalAmount(0);
        return;
      }
      if (start >= end) {
        setErrorMessage('Return date must be after booking date.');
        setTotalAmount(0);
        return;
      }
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const calculatedAmount = diffDays * selectedVehicle.rentalRate;
      setTotalAmount(calculatedAmount);
      setErrorMessage('');
    } else {
      setTotalAmount(0);
    }
  }, [bookingDate, returnDate, selectedVehicle]);

  useEffect(() => {
    if (isBookingSuccess) {
      setSuccessMessage('Booking created successfully! Redirecting...');
      setCurrentBookingAmount(totalAmount); // ✅ Save amount for payment modal
      setCurrentBookingId(currentBookingId); // ✅ Correct assignment

      setTimeout(() => {
        setIsModalOpen(false); // Close booking modal
        setIsPaymentModalOpen(true); // ✅ Open payment modal
        setSuccessMessage('');
      }, 1500);
    }

    if (isBookingError) {
      const apiError =
        (bookingError as any)?.data?.error ||
        (bookingError as any)?.error ||
        'Failed to create booking.';
      setErrorMessage(apiError);
    }
  }, [isBookingSuccess, isBookingError, bookingError, handleCloseModal, totalAmount]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMessage('');
  setSuccessMessage('');

  if (!selectedVehicle) {
    setErrorMessage('No vehicle selected for booking.');
    return;
  }

  if (!bookingDate || !returnDate || !selectedLocationId) {
    setErrorMessage('Please fill in all required fields.');
    return;
  }

  if (totalAmount <= 0) {
    setErrorMessage('Please select valid dates to calculate total amount.');
    return;
  }

  const parsedUserId = userId ? parseInt(userId) : NaN;
  const parsedLocationId = parseInt(selectedLocationId);

  if (isNaN(parsedUserId) || parsedUserId <= 0) {
    setErrorMessage('User authentication error. Please log in again.');
    return;
  }

  if (isNaN(parsedLocationId) || parsedLocationId <= 0) {
    setErrorMessage('Invalid pickup location selected.');
    return;
  }

  const bookingPayload = {
    bookingDate,
    returnDate,
    totalAmount,
    vehicleId: selectedVehicle.vehicleId,
    locationId: parsedLocationId,
    userId: parsedUserId,
  };

  try {
    const booking = await createBooking(bookingPayload).unwrap(); // ✅ Wait for booking result
    console.log("Raw booking object:", booking);
    setCurrentBookingAmount(totalAmount);
    setCurrentBookingId(booking.bookingId); 
    console.log(booking.bookingId)
    setSuccessMessage('Booking created successfully! Redirecting...');

    setTimeout(() => {
      setIsModalOpen(false);
      setIsPaymentModalOpen(true);
      setSuccessMessage('');
    }, 1500);
  } catch (err: any) {
    const errorText =
      err?.data?.error || err?.message || 'Failed to create booking.';
    setErrorMessage(errorText);
    console.error('Booking failed:', err);
  }
};

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="text-center py-10 text-gray-600">
        No vehicles found to display.
      </div>
    );
  }
  


  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.vehicleId}
            className="bg-gray-50 rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative w-full h-48">
              <img
                src={
                  vehicle.imageUrl ||
                  `https://via.placeholder.com/400x250?text=${vehicle.vehicleSpec?.brand || ''}+${vehicle.vehicleSpec?.model || 'Car'}`
                }
                alt={`${vehicle.vehicleSpec?.brand || ''} ${vehicle.vehicleSpec?.model || 'Vehicle'}`}
                className="w-full h-full object-cover"
              />
              <button
                className="absolute bottom-3 right-3 bg-white text-[#001258] px-3 py-1 rounded-full text-xs font-semibold hover:bg-gray-200 transition-colors shadow-md"
                onClick={() => console.log('View vehicle:', vehicle.vehicleId)}
              >
                View
              </button>
            </div>

            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-[#0F172A] mb-3 text-center">
                {vehicle.vehicleSpec?.brand} {vehicle.vehicleSpec?.model}
              </h3>

              <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm mb-4">
                <div className="flex items-center space-x-2">
                  <FaGasPump className="text-red-600" />
                  <span>{vehicle.vehicleSpec?.fuelType || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCogs className="text-red-600" />
                  <span>{vehicle.vehicleSpec?.transmission || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaUsers className="text-red-600" />
                  <span>{vehicle.vehicleSpec?.seatingCapacity || 'N/A'} Seats</span>
                </div>
                <div className="flex items-center space-x-2">
                  {vehicle.availability ? (
                    <>
                      <FaCheckCircle className="text-green-600" />
                      <span className="text-green-600 font-semibold">Available</span>
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="text-red-600" />
                      <span className="text-red-600 font-semibold">Not Available</span>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-auto text-center">
                <span className="text-lg font-bold text-red-600 block mb-4">
                  Ksh {vehicle.rentalRate}/day
                </span>

                <button
                  className={`w-full py-2 px-4 rounded transition-colors ${
                    vehicle.availability
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  } text-white`}
                  disabled={!vehicle.availability}
                  onClick={() => handleBookClick(vehicle)}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-6 text-center">
              Book {selectedVehicle?.vehicleSpec?.brand} {selectedVehicle?.vehicleSpec?.model}
            </h2>

            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700">
                  Booking Date
                </label>
                <input
                  type="date"
                  id="bookingDate"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700">
                  Return Date
                </label>
                <input
                  type="date"
                  id="returnDate"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={bookingDate || new Date().toISOString().split('T')[0]}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Pickup Location
                </label>
                {isLocationsLoading ? (
                  <p className="text-gray-500 mt-1">Loading locations...</p>
                ) : isLocationsError ? (
                  <p className="text-red-500 mt-1">Error loading locations</p>
                ) : (
                  <select
                    id="location"
                    value={selectedLocationId}
                    onChange={(e) => setSelectedLocationId(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    required
                  >
                    <option value="">Select a location</option>
                    {locations?.map((loc) => (
                      <option key={loc.locationId} value={loc.locationId}>
                        {loc.name} ({loc.address})
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="text-lg font-semibold text-gray-800">
                Total Amount: <span className="text-red-600">Ksh {totalAmount.toFixed(2)}</span>
              </div>
              <button
                type="submit"
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isBookingLoading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                disabled={isBookingLoading}
              >
                {isBookingLoading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative shadow-xl">
            <button
              onClick={() => setIsPaymentModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Complete Your Payment</h2>
            <p className="text-gray-700 mb-6 text-center">
              You're booking a vehicle for <span className="text-red-600 font-semibold">Ksh {currentBookingAmount.toFixed(2)}</span>
            </p>
            <StripeCheckoutButton amount={currentBookingAmount} bookingId={currentBookingId} userId={userId} />
           
          </div>
        </div>
      )}
    </>
  );
};

export default CarCard;
