"use client";

import React, { useState } from 'react';
import Navbar from '@/app/components/Navbar';
import OverviewPage from '@/app/dashboard/page/Overview';
// import HotelDashboard from '@/app/pages/hotel';

const Dashboard: React.FC = () => {
  const [activePage, setActivePage] = useState('overview');

  // Render the active page
  const renderPage = () => {
    switch(activePage) {
      case 'overview': return <OverviewPage />;
      // case 'hotel': return <HotelDashboard />;
      default: return <OverviewPage />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
      />

      <main className="pt-16 flex-grow">
        {renderPage()}
      </main>
    </div>
  );
};

export default Dashboard;