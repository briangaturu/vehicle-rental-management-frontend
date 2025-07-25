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

const AdminLayout: React.FC = () => {
  const [activeView, setActiveView] = useState('Dashboard');

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

      case 'Bookings': // This is the correct and first instance for 'Bookings'
        return <AllBookings />;

      case 'Support': // Correct case for 'Support'
        return <AllTickets/>; // Renders AllTickets for 'Support'

      case 'Users':
        return <AllUsers />;

      // ⭐ Corrected: Ensure this matches the label in your AdminSidenav
      case 'Vehicle Specs': // Assuming your sidebar passes 'Vehicle Specs'
        return <AllVehicleSpecs />;

      case 'Payments':
        return <AllPayments/>;

      case 'Logout':
        console.log("Perform logout logic here.");
        return <h2 className="text-2xl font-bold">Logging out...</h2>;

      default:
        // This is the fallback if no other case matches
        return <h2 className="text-2xl font-bold">Select a section</h2>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar at top */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <AdminSidenav onSelect={setActiveView} />

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;