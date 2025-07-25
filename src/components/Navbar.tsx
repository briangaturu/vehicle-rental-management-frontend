import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import type { RootState } from "../app/store";
import { clearCredentials } from "../features/auth/authSlice";
import { FaUserCircle } from "react-icons/fa";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const role = useSelector((state: RootState) => state.auth.role);
  const user = useSelector((state: RootState) => state.auth.user);
  const firstName = user?.firstName || "";

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    dispatch(clearCredentials());
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    window.location.href = "/login";
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-[#0D1C49] text-white py-4 px-8 flex justify-between items-center">
      <div className="text-2xl font-bold">
        <Link to="/">
          Ride<span className="text-red-500 text-3xl">X</span>press
        </Link>
      </div>

      <ul className="flex space-x-6 font-medium">
        <li className="hover:text-red-500 transition-colors duration-200">
          <Link to="/">HOME</Link>
        </li>
        <li className="hover:text-red-500 transition-colors duration-200">
          <Link to="/about">ABOUT</Link>
        </li>
        <li className="hover:text-red-500 transition-colors duration-200">
          <Link to="/explore">EXPLORE</Link>
        </li>
        <li className="hover:text-red-500 transition-colors duration-200">
          <Link to="/contact">CONTACT</Link>
        </li>
      </ul>

      <div className="relative" ref={dropdownRef}>
        {isAuthenticated ? (
          <div className="flex flex-col items-center">
            <button onClick={() => setDropdownOpen(!dropdownOpen)}>
              <FaUserCircle
                size={28}
                className="text-white hover:text-red-500 transition duration-200"
              />
            </button>
            <span className="text-sm mt-1 font-medium">{firstName}</span>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-md z-50">
                <Link
                  to={role === "admin" ? "/admin" : "/user"}
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-x-4">
            <Link
              to="/signup"
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition duration-200"
            >
              SIGNUP
            </Link>
            <Link
              to="/login"
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition duration-200"
            >
              LOGIN
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
