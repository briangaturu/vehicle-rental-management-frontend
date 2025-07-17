// src/pages/ErrorPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white p-8 text-center">
      <FaExclamationTriangle className="text-yellow-400 text-6xl mb-6" />

      <h1 className="text-4xl font-bold mb-4">Oops! Page Not Found</h1>
      <p className="text-lg text-gray-300 mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <button
        onClick={() => navigate('/')}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md text-sm font-semibold shadow"
      >
        Go to Homepage
      </button>
    </div>
  );
};

export default ErrorPage;
