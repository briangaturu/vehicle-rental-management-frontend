import React, { useState } from 'react';
import Sidebar from '../dashboardDesign/userSidebar.tsx';
import Navbar from '../components/Navbar.tsx';

// Import all user pages:
import UserDashboard from '../components/user/Dashboard.tsx';
import Profile from '../content/UserDashboard/Profile.tsx';
import Payments from '../content/UserDashboard/Payments';
import UserTicketsPage from '../content/UserDashboard/Tickets';
import Bookings from '../content/UserDashboard/Bookings';

const UserLayout: React.FC = () => {
  const [activeView, setActiveView] = useState<string>('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false); // ✅ Sidebar toggle state

  const renderContent = () => {
    switch (activeView) {
      case 'Dashboard':
        return <UserDashboard />;
      case 'Profile':
        return <Profile />;
      case 'Payments':
        return <Payments />;
      case 'Tickets':
        return <UserTicketsPage />;
      case 'Bookings':
        return <Bookings />;
      default:
        return <h2 className="text-2xl font-bold">Select a section</h2>;
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar for desktop */}
      <aside className="hidden md:block w-64 min-h-screen bg-white shadow-md">
        <Sidebar onSelect={setActiveView} />
      </aside>

      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity ${
          sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-50 transform transition-transform duration-300 md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onSelect={(view) => { setActiveView(view); setSidebarOpen(false); }} />
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar */}
        <header className="w-full shadow bg-white z-10">
          <Navbar />
          {/* Mobile Sidebar Toggle Button */}
          <button
            className="md:hidden p-3 text-gray-700"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
