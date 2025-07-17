import React, { useState, useRef, useEffect } from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';

const UserNav: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    // add your logout logic here
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-red-600 text-white shadow-md relative">
      <h2 className="text-xl font-bold">User Dashboard</h2>

      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search..."
          className="rounded px-3 py-1 text-sm text-black"
        />
        <FaBell className="cursor-pointer" size={20} />

        <div className="relative" ref={dropdownRef}>
          <FaUserCircle
            size={28}
            className="cursor-pointer"
            onClick={handleToggle}
          />

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserNav;
