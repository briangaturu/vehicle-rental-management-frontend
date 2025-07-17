import React, { useState } from 'react';
import Sidebar from '../dashboardDesign/userSidebar.tsx';
import UserNav from './userNav.tsx';

// Import all user pages:
import UserDashboard from '../components/user/Dashboard.tsx';
import Profile from '../content/UserDashboard/Profile.tsx';
import Payments from '../content/UserDashboard/Payments';
import UserTicketsPage from '../content/UserDashboard/Tickets';
import Bookings from '../content/UserDashboard/Bookings';

const UserLayout: React.FC = () => {
  const [activeView, setActiveView] = useState<string>('Dashboard');

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
    <div className="flex h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-white shadow-md">
        <Sidebar onSelect={setActiveView} />
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar */}
        <header className="w-full shadow bg-white z-10">
          <UserNav />
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
