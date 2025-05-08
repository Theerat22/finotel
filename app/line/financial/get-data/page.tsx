"use client";
import { useState } from 'react';
import { FcMoneyTransfer } from "react-icons/fc";
import SlipScanner from '@/app/components/SlipScanner';
export default function Home() {
    const [value, setValue] = useState<string>("");
    const months = [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
      ];
    return (
        <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-md shadow overflow-hidden p-10 items-center text-center flex flex-col">
          <div className="flex flex-col items-center">
            <FcMoneyTransfer size={100} className="text-blue-500 mb-4" />
            <p className="font-bold mb-6 text-blue-700 text-2xl">เลือกเดือนที่ต้องการ</p>
  
            <div className="relative w-full mb-6">
              <select
                className="w-full border-2 border-blue-300 rounded-lg py-3 px-4 appearance-none bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-center"
                onChange={(e) => setValue(e.target.value)}
                value={value}
              >
                <option value="" disabled>-- กรุณาเลือกเดือน --</option>
                {months.map((month) => (
                  <option key={month} value={month} className="py-1">
                    {month}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-blue-500">
                <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
  
  
            {value && (
              <button
                // onClick={}
                className="font-bold text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg"
              >
                เลือก
              </button>
            )}
            
          </div>
        </div>
        <SlipScanner />
      </section>
    );
}