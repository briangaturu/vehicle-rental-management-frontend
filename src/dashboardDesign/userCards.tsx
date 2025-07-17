// src/components/DashboardCard.tsx

import React from 'react';

interface DashboardCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, label, value }) => {
  return (
    <div className="bg-white p-6 rounded shadow flex items-center space-x-4">
      <div className="text-blue-600">{icon}</div>
      <div>
        <div className="text-gray-500 text-sm">{label}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </div>
  );
};

export default DashboardCard;
