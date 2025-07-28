import { SquareUserRound, LogOut as LogOutIcon } from "lucide-react";
import { FaDollarSign, FaCar } from "react-icons/fa";
import { FaShip, FaTicketAlt, FaTachometerAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { clearCredentials } from "../features/auth/authSlice";

interface SidebarProps {
  onSelect: (view: string) => void;
  isOpen?: boolean; // ✅ To control sidebar visibility on mobile
  onClose?: () => void; // ✅ For closing when clicking overlay or nav
}

export const Sidebar: React.FC<SidebarProps> = ({ onSelect, isOpen = true, onClose }) => {
  const dispatch = useDispatch();

  const handleLogOut = () => {
    dispatch(clearCredentials());
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <>
      {/* ✅ Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      ></div>

      {/* ✅ Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#0D1C49] text-white p-6 flex flex-col transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:flex`}
      >
        <h1 className="text-2xl font-bold mb-10 flex items-center">
          <FaCar className="mr-2 text-red-500" /> RideXpress
        </h1>

        <nav className="space-y-4 flex-1">
          <NavItem
            icon={<FaTachometerAlt className="text-red-500" />}
            label="Dashboard"
            onClick={() => {
              onSelect("Dashboard");
              onClose?.();
            }}
          />
          <NavItem
            icon={<SquareUserRound className="text-red-500" />}
            label="Profile"
            onClick={() => {
              onSelect("Profile");
              onClose?.();
            }}
          />
          <NavItem
            icon={<FaShip className="text-red-500" />}
            label="My Bookings"
            onClick={() => {
              onSelect("Bookings");
              onClose?.();
            }}
          />
          <NavItem
            icon={<FaDollarSign className="text-red-500" />}
            label="My Payments"
            onClick={() => {
              onSelect("Payments");
              onClose?.();
            }}
          />
          <NavItem
            icon={<FaTicketAlt className="text-red-500" />}
            label="My Tickets"
            onClick={() => {
              onSelect("Tickets");
              onClose?.();
            }}
          />
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
            onClick={() => {
              window.location.href = "/";
              onClose?.();
            }}
          />
        </div>
      </aside>
    </>
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
