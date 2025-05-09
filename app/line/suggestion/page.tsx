"use client";
import React, { useState } from "react";
import { FaHouseCircleCheck } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export default function Financial() {
  const [value, setValue] = useState<string>("");
  const router = useRouter();

  const months = [
    { th: "มกราคม", en: "January2025" },
    { th: "กุมภาพันธ์", en: "February2025" },
    { th: "มีนาคม", en: "March2025" },
    { th: "เมษายน", en: "April2025" },
    { th: "พฤษภาคม", en: "May2025" },
    { th: "มิถุนายน", en: "June2025" },
    { th: "กรกฎาคม", en: "July2025" },
    { th: "สิงหาคม", en: "August2025" },
    { th: "กันยายน", en: "September2025" },
    { th: "ตุลาคม", en: "October2025" },
    { th: "พฤศจิกายน", en: "November2025" },
    { th: "ธันวาคม", en: "December2025" },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col justify-center items-center px-4">
    <div className="w-full max-w-2xl mx-auto bg-white rounded-md shadow overflow-hidden p-10 items-center text-center flex flex-col">
      <div className="flex flex-col items-center">
        <FaHouseCircleCheck size={100} className="text-blue-500 mb-4" />
        <p className="font-bold mb-6 text-blue-700 text-2xl">เลือกเดือนที่ต้องการ</p>

        <div className="relative w-full mb-6">
        <select
            className="border border-gray-300 rounded-md py-2 px-4 mb-4 w-1/2"
            onChange={(e) => {
              setValue(e.target.value);
              console.log(e.target.value);
            }}
            value={value}
          >
            <option value="">-- กรุณาเลือกเดือน --</option>
            {months.map((month) => (
              <option key={month.en} value={month.en}>
                {month.th}
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
          onClick={() =>
            router.push(
              `https://finotel.vercel.app/detail/suggestion/${value}`
            )
          }
          className="font-bold text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg"
        >
          เลือก
        </button>
        )}
        
      </div>
    </div>
  </section>
  );
}
