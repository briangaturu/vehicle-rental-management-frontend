import { SquareUserRound, LogOut as LogOutIcon } from "lucide-react";
import { FaDollarSign, FaCar } from "react-icons/fa";
import { FaShip, FaTicketAlt, FaTachometerAlt } from "react-icons/fa"; // 👈 Add Tachometer icon for Dashboard
import { useDispatch } from "react-redux";
import { clearCredentials } from "../features/auth/authSlice";

interface SidebarProps {
  onSelect: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
  const dispatch = useDispatch();

  const handleLogOut = () => {
    dispatch(clearCredentials());
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <aside className="w-64 bg-[#0D1C49] text-white p-6 flex flex-col min-h-screen">
      <h1 className="text-2xl font-bold mb-10 flex items-center">
        <FaCar className="mr-2 text-red-500" /> RideXpress
      </h1>

      <nav className="space-y-4 flex-1">
        {/* 👇 New Dashboard Item */}
        <NavItem
          icon={<FaTachometerAlt className="text-red-500" />}
          label="Dashboard"
          onClick={() => onSelect("Dashboard")}
        />
        <NavItem
          icon={<SquareUserRound className="text-red-500" />}
          label="Profile"
          onClick={() => onSelect("Profile")}
        />
        <NavItem
          icon={<FaShip className="text-red-500" />}
          label="My Bookings"
          onClick={() => onSelect("Bookings")}
        />
        <NavItem
          icon={<FaDollarSign className="text-red-500" />}
          label="My Payments"
          onClick={() => onSelect("Payments")}
        />
        <NavItem
          icon={<FaTicketAlt className="text-red-500" />}
          label="My Tickets"
          onClick={() => onSelect("Tickets")}
        />
        {/* Optional Support Nav */}
        {/* <NavItem
          icon={<FaHeadset className="text-red-500" />}
          label="Support"
          onClick={() => onSelect("Support")}
        /> */}
      </nav>

      <button
        onClick={handleLogOut}
        className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-[#1E293B] transition-colors mt-4"
      >
        <LogOutIcon className="text-red-500" />
        <span className="text-white font-medium">Log Out</span>
      </button>

      <div className="mt-auto space-y-4">
        <NavItem
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-house text-green-400"
            >
              <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
              <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
          }
          label="Home"
          onClick={() => (window.location.href = "/")}
        />
      </div>
    </aside>
  );
};

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex w-full items-center space-x-3 px-3 py-2 rounded hover:bg-[#1E293B] transition-colors"
  >
    {icon}
    <span className="text-white font-medium">{label}</span>
  </button>
);

export default Sidebar;
