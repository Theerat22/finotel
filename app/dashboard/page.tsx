"use client";

import React, { useState } from 'react';
import Navbar from '@/app/components/Navbar';
import HotelFinancialForecast from './pages/Density';
import DynamicPricing from './pages/DynamicPricing';
import ExpenseAnalysis from '@/app/dashboard/pages/ExpenseAnalysis';

const Dashboard: React.FC = () => {
  const [activePage, setActivePage] = useState('overview');

  const renderPage = () => {
    switch(activePage) {
      case 'overview': return <HotelFinancialForecast />;
      case 'hotel': return <ExpenseAnalysis />;
      case 'financial': return <DynamicPricing />;
      default: return <HotelFinancialForecast />;
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