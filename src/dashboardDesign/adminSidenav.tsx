import React from 'react';
import {
  FaTachometerAlt,
  FaCar,
  FaClipboardList,
  FaUsers,
  FaMoneyBillAlt,
  FaHeadphones,
  FaPowerOff,
  FaCog, // ✅ NEW: Import FaCog icon for specs
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { clearCredentials } from '../features/auth/authSlice';

interface AdminSidenavProps {
  onSelect: (label: string) => void;
}

const AdminSidenav: React.FC<AdminSidenavProps> = ({ onSelect }) => {
  const dispatch = useDispatch();

  const LogOut = () => {
    dispatch(clearCredentials());
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="bg-[#001258] text-white w-64 min-h-screen flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-8 flex items-center">
        <FaCar className="mr-2" /> RideXpress
      </h1>

      <nav className="flex-1 space-y-4">
        <NavItem icon={<FaTachometerAlt />} label="Dashboard" onClick={onSelect} />
        <NavItem icon={<FaCar />} label="Vehicles" onClick={onSelect} />
        {/* ✅ NEW: Add NavItem for Vehicle Specs */}
        <NavItem icon={<FaCog />} label="Vehicle Specs" onClick={onSelect} />
        <NavItem icon={<FaClipboardList />} label="Bookings" onClick={onSelect} />
        <NavItem icon={<FaUsers />} label="Users" onClick={onSelect} />
        <NavItem icon={<FaMoneyBillAlt />} label="Payments" onClick={onSelect} />
        <NavItem icon={<FaHeadphones />} label="Support" onClick={onSelect} />
      </nav>

      <button
        className="flex items-center space-x-2 mt-auto text-red-400 hover:text-red-600"
        onClick={LogOut}
      >
        <FaPowerOff />
        <span>Logout</span>
      </button>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: (label: string) => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, onClick }) => (
  <div
    className="flex items-center space-x-2 cursor-pointer hover:bg-[#1E293B] px-3 py-2 rounded"
    onClick={() => onClick(label)}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </div>
);

export default AdminSidenav;