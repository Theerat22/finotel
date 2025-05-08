"use client";
import React, { useState } from 'react';
import StartNav from '../components/StartNav';
import Step1 from '@/app/get-start/pages/step1';
import Step2 from './pages/step2';
import Profile from './pages/profile';
import Complete from './pages/complete';
import HotelFinanceForm from './pages/step3';
import HotelOccupancyUpload from './pages/step4';

const StartPage: React.FC = () => {
  const [activePage, setActivePage] = useState('login');
  
  const renderPage = () => {
    switch (activePage) {
      case "login":
        return <Profile setActivePage={setActivePage} />;
      case "overview":
        return <Step1 setActivePage={setActivePage} />;
      case "hotel":
        return <Step2 setActivePage={setActivePage} />;
      case "complete":
        return <Complete />;
      case "finance":
        return <HotelFinanceForm setActivePage={setActivePage} />;
      case "booking":
        return <HotelOccupancyUpload setActivePage={setActivePage} />;
      default:
        return <div>Overview Page</div>;
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <StartNav />
      <main className="pt-16 flex-grow bg-gray-50 p-4">
        {renderPage()}
      </main>
    </div>
  );
};

export default StartPage;