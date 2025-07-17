// src/components/Navbar.tsx
import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Navbar: React.FC = () => {
  return (
    <nav className="bg-[#0D1C49] text-white py-4 px-8 flex justify-between items-center">
      <div className="text-2xl font-bold">
        {/* Link the logo to the home page */}
        <Link to="/"> {/* The 'to' prop uses the paths you defined in App.tsx */}
          Ride<span className="text-red-500">X</span>press
        </Link>
      </div>
      <ul className="flex space-x-6 font-medium">
        {/* Use Link components for navigation */}
        <li className="hover:text-red-500">
          <Link to="/">HOME</Link> {/* Corresponds to path: "/" */}
        </li>
        <li className="hover:text-red-500">
          <Link to="/about">ABOUT</Link> {/* Corresponds to path: "/about" */}
        </li>
        <li className="hover:text-red-500">
          <Link to="/explore">EXPLORE</Link> {/* Corresponds to path: "/explore" */}
        </li>
        <li className="hover:text-red-500">
          <Link to="/contact">CONTACT</Link> {/* Corresponds to path: "/contact" */}
        </li>
      </ul>
      <div className="space-x-4">
        {/* Use Link for buttons to ensure client-side navigation */}
        <Link
          to="/login" // Corresponds to path: "/login"
          className="bg-white text-blue-900 px-3 py-1 rounded hover:bg-gray-200 inline-block"
        >
          LOGIN
        </Link>
        <Link
          to="/signup" // Corresponds to path: "/signup"
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 inline-block"
        >
          SIGNUP
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;