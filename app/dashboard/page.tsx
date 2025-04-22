"use client";

import React, { useState } from 'react';
import Navbar from '@/app/components/Navbar';
import BookingTrend from './pages/BookingTrend';
import DynamicPricing from './pages/DynamicPricing';
// import ExpenseAnalysis from '@/app/dashboard/pages/ExpenseAnalysist';
import { Analytics } from "@vercel/analytics/react";

const Dashboard: React.FC = () => {
  const [activePage, setActivePage] = useState('overview');

  const renderPage = () => {
    switch(activePage) {
      // case 'financial': return <ExpenseAnalysis />;
      case 'booking': return <BookingTrend />;
      case 'dynamic': return <DynamicPricing />;
      default: return <BookingTrend />;
    }
  };

  const date = new Date();
const thaiDate = date.toLocaleDateString('th-TH', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
      />
      <main className="pt-16 flex-grow">
        <Analytics />
        {renderPage()}
      </main>
      <footer className="mt-5 p-10 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Finotel  | อัปเดตล่าสุด {thaiDate}</p>
      </footer>
    </div>
  );
};

export default Dashboard;