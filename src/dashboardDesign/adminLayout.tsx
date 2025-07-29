import React, { useState } from 'react';
import AdminSidenav from './adminSidenav';
import AllVehicles from '../content/AdminDashboard/AllVehicles';
import Navbar from '../components/Navbar';
import AdminCards from './adminCard';
import AllBookings from '../content/AdminDashboard/AllBookings';
import BookingsChart from '../content/admin/Analytics';
import LatestBookingsTable from '../content/admin/LatestBookingsTable';
import MostBookedVehiclesTable from '../content/admin/MostBookedVehicles';
import AllTickets from '../content/AdminDashboard/AllTickets';
import { AllUsers } from '../content/AdminDashboard/AllUsers';
import { AllPayments } from '../content/AdminDashboard/AllPayments';
import AllVehicleSpecs from '../content/AdminDashboard/AllVehicleSpecs';
import Profile from '../content/AdminDashboard/profile';
import { FaBars } from 'react-icons/fa';
import LocationsPage from '../content/AdminDashboard/OurBranches';

const AdminLayout: React.FC = () => {
  const [activeView, setActiveView] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case 'Dashboard':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Welcome to the Dashboard!</h2>
            <AdminCards />
            <BookingsChart />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <LatestBookingsTable />
              <MostBookedVehiclesTable />
            </div>
          </div>
        );
      case 'Vehicles':
        return <AllVehicles />;
      case 'Bookings':
        return <AllBookings />;
      case 'Support':
        return <AllTickets />;
      case 'Users':
        return <AllUsers />;
      case 'Vehicle Specs':
        return <AllVehicleSpecs />;
      case 'Payments':
        return <AllPayments />;
        case 'AdminProfile' :
          return <Profile/>;
          case 'Location':
            return <LocationsPage/>;
      case 'Logout':
        console.log("Perform logout logic here.");
        return <h2 className="text-2xl font-bold">Logging out...</h2>;
      default:
        return <h2 className="text-2xl font-bold">Select a section</h2>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar at top */}
      <Navbar />

      <div className="flex flex-1 relative">
        {/* Sidebar for large screens */}
        <div className="hidden lg:block w-64 bg-white shadow-lg">
          <AdminSidenav onSelect={setActiveView} />
        </div>

        {/* Toggle Button for Mobile */}
        <button
          className="lg:hidden absolute top-4 left-4 z-50 bg-[#0D1C49] text-white p-2 rounded-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FaBars size={20} />
        </button>

        {/* Sidebar Drawer for Mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden">
            <div className="absolute left-0 top-0 w-64 h-full bg-white shadow-lg p-4">
              <AdminSidenav
                onSelect={(view) => {
                  setActiveView(view);
                  setSidebarOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 bg-gray-50 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
