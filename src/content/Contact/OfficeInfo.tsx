import React from 'react';

const OfficeInfo: React.FC = () => {
  return (
    <div className="bg-gray-100 p-8 rounded-lg shadow-md text-center md:text-left">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">RideXpress Office Info</h2>
      <ul className="space-y-4">
        <li className="flex items-center justify-center md:justify-start">
          {/* Using text icons for simplicity, replace with actual image icons if desired */}
          <span className="text-red-600 mr-3 text-xl">📍</span>
          <p className="text-gray-700">Location: Kimathi Street, Nairobi</p>
        </li>
        <li className="flex items-center justify-center md:justify-start">
          <span className="text-red-600 mr-3 text-xl">📞</span>
          <p className="text-gray-700">Phone: +254 796 598 257</p>
        </li>
        <li className="flex items-center justify-center md:justify-start">
          <span className="text-red-600 mr-3 text-xl">📧</span>
          <p className="text-gray-700">Email: ridexpress@gmail.com</p>
        </li>
        <li className="flex items-center justify-center md:justify-start">
          <span className="text-red-600 mr-3 text-xl">⏰</span>
          <p className="text-gray-700">Hours: 8AM – 8PM (Mon-Sun)</p>
        </li>
      </ul>
    </div>
  );
};

export default OfficeInfo;