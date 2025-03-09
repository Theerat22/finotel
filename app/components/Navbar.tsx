import React, { useState } from 'react';
import { type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { FaHotel } from 'react-icons/fa';

import { 
  Home, 
  BarChart, 
  Settings, 
  Thermometer, 
  BadgeDollarSign,
  Menu, 
  X
} from 'lucide-react';

export interface NavItem {
  icon: LucideIcon;
  label: string;
  page: string;
}
interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems: NavItem[] = [
    { icon: BadgeDollarSign, label: 'วิเคราะห์การเงิน', page: 'financial' },
    { icon: Home, label: 'อัตราการจอง', page: 'booking' },
    { icon: BarChart, label: 'การกำหนดราคา', page: 'dynamic' },
    { icon: Settings, label: 'Settings', page: 'settings' }
  ];

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href={'/dashboard'} className="flex items-center">
              <FaHotel className="text-blue-600 text-3xl mr-2" />
              <span className="text-2xl font-bold text-blue-600">Finotel</span>
            </Link>
        </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActivePage(item.page)}
                className={`
                  ${activePage === item.page 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  } 
                  px-3 py-2 rounded-md flex items-center space-x-2 transition duration-300 ease-in-out
                `}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setActivePage(item.page);
                    setIsOpen(false);
                  }}
                  className={`
                    ${activePage === item.page 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    } 
                    w-full text-left px-3 py-2 rounded-md flex items-center space-x-2 transition duration-300 ease-in-out
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;