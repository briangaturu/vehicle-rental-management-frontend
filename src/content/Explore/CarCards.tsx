// src/content/Explore/CarCards.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  FaGasPump,
  FaCogs,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarCheck,
} from 'react-icons/fa';

import { type Vehicle } from '../../features/api/vehiclesApi';
import { useCreateBookingMutation, useCheckVehicleAvailabilityMutation } from '../../features/api/bookingsApi';
import { useGetAllLocationsQuery } from '../../features/api/locationApi';
import { useSelector } from 'react-redux';
import { type RootState } from '../../app/store';
import { PaymentButton } from './payments';

interface CarCardProps {
  vehicles: Vehicle[];
}

const CarCard: React.FC<CarCardProps> = ({ vehicles }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [isPayLaterModalOpen, setIsPayLaterModalOpen] = useState(false);
  const [currentBookingAmount, setCurrentBookingAmount] = useState<number>(0);
  const [currentBookingId, setCurrentBookingId] = useState<number | null>(null);

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<{
    isAvailable: boolean;
    message: string;
  } | null>(null);

  const [selectedFuelType, setSelectedFuelType] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fuelTypes = Array.from(new Set(vehicles.map(v => v.vehicleSpec?.fuelType).filter(Boolean)));
  const models = Array.from(new Set(vehicles.map(v => v.vehicleSpec?.model).filter(Boolean)));

  const filteredVehicles = vehicles.filter(vehicle => {
    const fuelMatch = selectedFuelType ? vehicle.vehicleSpec?.fuelType === selectedFuelType : true;
    const modelMatch = selectedModel ? vehicle.vehicleSpec?.model === selectedModel : true;
    const price = vehicle.rentalRate || 0;
    const min = minPrice ? parseFloat(minPrice) : null;
    const max = maxPrice ? parseFloat(maxPrice) : null;
    const priceMatch = (min === null || price >= min) && (max === null || price <= max);
    return fuelMatch && modelMatch && priceMatch;
  });

  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const [createBooking, { isLoading: isBookingLoading }] = useCreateBookingMutation();
  const [checkVehicleAvailability] = useCheckVehicleAvailabilityMutation();

  const {
    data: locations,
    isLoading: isLocationsLoading,
    isError: isLocationsError,
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
    setAvailabilityResult(null);
    setIsCheckingAvailability(false);
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
    setAvailabilityResult(null);
    setIsCheckingAvailability(false);
  };

  const handleCheckAvailability = async () => {
    if (!selectedVehicle || !bookingDate || !returnDate) {
      setAvailabilityResult({
        isAvailable: false,
        message: 'Please select both booking and return dates to check availability.',
      });
      return;
    }

    const start = new Date(bookingDate);
    const end = new Date(returnDate);

    if (start >= end) {
      setAvailabilityResult({ isAvailable: false, message: 'Return date must be after booking date.' });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (start < today) {
      setAvailabilityResult({ isAvailable: false, message: 'Booking date cannot be in the past.' });
      return;
    }

    setIsCheckingAvailability(true);
    setAvailabilityResult(null);

    try {
      const result = await checkVehicleAvailability({
        vehicleId: selectedVehicle.vehicleId,
        bookingDate,
        returnDate,
      }).unwrap();

      setAvailabilityResult({
        isAvailable: Boolean(result.available),
        message: result.message,
      });
    } catch (err: any) {
      console.log('Availability check failed:', err);
      setAvailabilityResult({
        isAvailable: true,
        message: 'Vehicle appears to be available (backend check not implemented yet)',
      });
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  // Recalculate total when dates change
  useEffect(() => {
    if (bookingDate && returnDate && selectedVehicle?.rentalRate) {
      const start = new Date(bookingDate);
      const end = new Date(returnDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
        setTotalAmount(0);
        return;
      }
      const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      setTotalAmount(diffDays * selectedVehicle.rentalRate);
      setAvailabilityResult(null);
    } else {
      setTotalAmount(0);
    }
  }, [bookingDate, returnDate, selectedVehicle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!selectedVehicle) { setErrorMessage('No vehicle selected for booking.'); return; }
    if (!bookingDate || !returnDate || !selectedLocationId) { setErrorMessage('Please fill in all required fields.'); return; }
    if (totalAmount <= 0) { setErrorMessage('Please select valid dates to calculate total amount.'); return; }
    if (availabilityResult && !availabilityResult.isAvailable) {
      setErrorMessage('Vehicle is not available for the selected dates. Please choose different dates.');
      return;
    }

    const parsedUserId = userId ?? NaN;
    const parsedLocationId = parseInt(selectedLocationId);

    if (isNaN(Number(parsedUserId)) || Number(parsedUserId) <= 0) { setErrorMessage('User authentication error. Please log in again.'); return; }
    if (isNaN(parsedLocationId) || parsedLocationId <= 0) { setErrorMessage('Invalid pickup location selected.'); return; }

    try {
      const response = await createBooking({
        bookingDate,
        returnDate,
        totalAmount,
        vehicleId: selectedVehicle.vehicleId,
        locationId: parsedLocationId,
        userId: parsedUserId,
      }).unwrap();

      const bookingId = response?.booking?.bookingId ?? response?.bookingId;
      console.log('✅ Booking created, bookingId:', bookingId);

      setCurrentBookingAmount(totalAmount);
      setCurrentBookingId(bookingId);
      setSuccessMessage('Booking created! Proceed to payment...');

      setTimeout(() => {
        setIsModalOpen(false);
        setIsPayLaterModalOpen(true);
        setSuccessMessage('');
      }, 1500);

    } catch (err: any) {
      const errorText = err?.data?.error || err?.message || 'Failed to create booking.';
      setErrorMessage(errorText);
      console.error('Booking failed:', err);
    }
  };

  if (!vehicles || vehicles.length === 0) {
    return <div className="text-center py-10 text-gray-600">No vehicles found to display.</div>;
  }

  return (
    <>
      {/* Filter UI */}
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Fuel Type</label>
          <select className="border rounded px-3 py-2" value={selectedFuelType} onChange={e => setSelectedFuelType(e.target.value)}>
            <option value="">All</option>
            {fuelTypes.map(fuel => <option key={fuel} value={fuel}>{fuel}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Model</label>
          <select className="border rounded px-3 py-2" value={selectedModel} onChange={e => setSelectedModel(e.target.value)}>
            <option value="">All</option>
            {models.map(model => <option key={model} value={model}>{model}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Min Price</label>
          <input type="number" className="border rounded px-3 py-2 w-24" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="0" min="0" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Max Price</label>
          <input type="number" className="border rounded px-3 py-2 w-24" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="" min="0" />
        </div>
      </div>

      {/* Vehicle Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.vehicleId} className="bg-gray-50 rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
            <div className="relative w-full h-48">
              <img
                src={vehicle.imageUrl || `https://via.placeholder.com/400x250?text=${vehicle.vehicleSpec?.brand || ''}+${vehicle.vehicleSpec?.model || 'Car'}`}
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
                <div className="flex items-center space-x-2"><FaGasPump className="text-red-600" /><span>{vehicle.vehicleSpec?.fuelType || 'N/A'}</span></div>
                <div className="flex items-center space-x-2"><FaCogs className="text-red-600" /><span>{vehicle.vehicleSpec?.transmission || 'N/A'}</span></div>
                <div className="flex items-center space-x-2"><FaUsers className="text-red-600" /><span>{vehicle.vehicleSpec?.seatingCapacity || 'N/A'} Seats</span></div>
                <div className="flex items-center space-x-2">
                  {vehicle.availability
                    ? <><FaCheckCircle className="text-green-600" /><span className="text-green-600 font-semibold">Available</span></>
                    : <><FaTimesCircle className="text-red-600" /><span className="text-red-600 font-semibold">Not Available</span></>}
                </div>
              </div>
              <div className="mt-auto text-center">
                <span className="text-lg font-bold text-red-600 block mb-4">Ksh {vehicle.rentalRate}/day</span>
                <button
                  className={`w-full py-2 px-4 rounded transition-colors ${vehicle.availability ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'} text-white`}
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button onClick={handleCloseModal} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-6 text-center">
              Book {selectedVehicle?.vehicleSpec?.brand} {selectedVehicle?.vehicleSpec?.model}
            </h2>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                ❌ {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
                ✅ {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700">Booking Date</label>
                <input
                  type="date" id="bookingDate" value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700">Return Date</label>
                <input
                  type="date" id="returnDate" value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={bookingDate || new Date().toISOString().split('T')[0]}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Pickup Location</label>
                {isLocationsLoading ? (
                  <p className="text-gray-500 mt-1">Loading locations...</p>
                ) : isLocationsError ? (
                  <p className="text-red-500 mt-1">Error loading locations</p>
                ) : (
                  <select
                    id="location" value={selectedLocationId}
                    onChange={(e) => setSelectedLocationId(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    required
                  >
                    <option value="">Select a location</option>
                    {locations?.map((loc) => (
                      <option key={loc.locationId} value={loc.locationId}>{loc.name} ({loc.address})</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="text-lg font-semibold text-gray-800">
                Total Amount: <span className="text-red-600">Ksh {totalAmount.toFixed(2)}</span>
              </div>

              {/* Availability Check */}
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-3 text-center">
                  💡 <strong>Tip:</strong> Check vehicle availability before booking to ensure your dates are available.
                </p>
                <button
                  type="button"
                  onClick={handleCheckAvailability}
                  disabled={!bookingDate || !returnDate || isCheckingAvailability}
                  className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white mb-3 ${
                    !bookingDate || !returnDate || isCheckingAvailability ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {isCheckingAvailability ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Checking Availability...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center"><FaCalendarCheck className="mr-2" />Check Availability</span>
                  )}
                </button>

                {availabilityResult && (
                  <div className={`p-3 rounded-md mb-3 ${availabilityResult.isAvailable ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
                    <div className="flex items-center">
                      {availabilityResult.isAvailable
                        ? <FaCheckCircle className="mr-2 text-green-600" />
                        : <FaTimesCircle className="mr-2 text-red-600" />}
                      <span className="font-medium">{availabilityResult.message}</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isBookingLoading || (availabilityResult && !availabilityResult.isAvailable)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                disabled={isBookingLoading || (availabilityResult ? !availabilityResult.isAvailable : false)}
              >
                {isBookingLoading ? 'Booking...' : 'Confirm Booking'}
              </button>

              {!availabilityResult && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  💡 Tip: Check availability to ensure your dates are available
                </p>
              )}
              {availabilityResult && !availabilityResult.isAvailable && (
                <p className="text-xs text-red-500 text-center mt-2">❌ Vehicle not available for selected dates</p>
              )}
              {availabilityResult && availabilityResult.isAvailable && (
                <p className="text-xs text-green-500 text-center mt-2">✅ Vehicle available</p>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Booking Confirmed Modal - Payment options shown DIRECTLY here */}
{isPayLaterModalOpen && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative text-center">
      <button
        onClick={() => setIsPayLaterModalOpen(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
      >
        &times;
      </button>
      <div className="text-4xl mb-3">🎉</div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
      <p className="text-gray-600 mb-4">
        Your booking is confirmed for{' '}
        <span className="text-red-600 font-semibold">Ksh {currentBookingAmount.toFixed(2)}</span>
      </p>
      
      {/* Payment options (M-Pesa, Card) shown directly here */}
      <PaymentButton
        amount={currentBookingAmount}
        bookingId={currentBookingId}
        userId={userId}
      />
      
      <div className="mt-4">
        <button
          onClick={() => setIsPayLaterModalOpen(false)}
          className="w-full py-2 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-md transition-colors"
        >
          Pay Later
        </button>
      </div>
    </div>
  </div>
)}

      
    </>
  );
};

export default CarCard;