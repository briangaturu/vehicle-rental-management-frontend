// src/components/Topbar.tsx
import React from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';

const Navbar: React.FC = () => {
  return (
    <div className="flex justify-between items-center px-6 py-4 border-b bg-red-500 text-white">
      <h2 className="text-xl font-bold">Admin Dashboard</h2>

      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 rounded px-3 py-1 text-sm"
        />
        <FaBell className="text-gray-600 cursor-pointer" size={20} />
        <FaUserCircle className="text-gray-600" size={28} />
      </div>
    </div>
  );
};

export default Navbar;
