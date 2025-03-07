"use client";
import React, { useState } from 'react';
import StartNav from '../components/StartNav';
import Step1 from '@/app/get-start/pages/step1';
import Step2 from './pages/step2';

const StartPage: React.FC = () => {
  const [activePage, setActivePage] = useState('overview');
  
  const renderPage = () => {
    switch (activePage) {
      case "overview":
        return <Step1 setActivePage={setActivePage} />;
      case "hotel":
        return <Step2 setActivePage={setActivePage} />;
      case "finance":
        return <div>Finance Dashboard Page</div>;
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