import React from 'react';
import { FaHotel } from 'react-icons/fa';
import Link from 'next/link';

const StartNav: React.FC = () => {

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 w-full z-50 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href={'/'} className="flex items-center">
              <FaHotel className="text-blue-600 text-3xl mr-2" />
              <span className="text-2xl font-bold text-blue-600">Finotel</span>
            </Link>
        </div>
        </div>
      </div>
    </nav>
  );
};

export default StartNav;