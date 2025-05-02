"use client";
import React, { useState } from "react";
import { FaHouseCircleCheck } from "react-icons/fa6";
import liff from "@line/liff";
import { useUser } from "@/app/components/UserContext";
import axios from "axios";

type MonthData = {
  month: string;
  goppar: number;
  revpar: number;
  occ: number;
};
type MonthsRecord = {
  [key: string]: MonthData;
};

export default function Financial() {
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

  const mockMonth: MonthsRecord = {
    มกราคม: {
      month: "January",
      goppar: 1000,
      revpar: 2000,
      occ: 50
    },
    กุมภาพันธ์ุ: {
      month: "February",
      goppar: 1200,
      revpar: 2200,
      occ: 50
    },
    มีนาคม: {
      month: "March",
      goppar: 1300,
      revpar: 2300,
      occ: 50
    },
    เมษายน: {
      month: "April",
      goppar: 1400,
      revpar: 2400,
      occ: 50
    },
    พฤษภาคม: {
      month: "May",
      goppar: 1500,
      revpar: 2500,
      occ: 50
    },
  };

  const { userData } = useUser();
  const userId = userData.userId;

  const sendFlexMessage = async () => {
    const selectedMonth = mockMonth[value];

    if (!selectedMonth) {
      console.log("No month selected");
      return;
    }

    const month = selectedMonth.month;
    const goppar = selectedMonth.goppar;
    const revpar = selectedMonth.revpar;
    const occ = selectedMonth.occ;

    try {
      //   setStatus({ loading: true });
      console.log("Sending message:", selectedMonth, userId);

      const response = await axios.post("/api/sendFlexMessageMonth", {
        userId,
        month,
        goppar,
        revpar,
        occ
      });

      console.log("Response:", response.data);

      await liff.init({ liffId: "2007306544-8nvWdZ1v" });
      setTimeout(() => {
        liff.closeWindow();
      }, 1000);

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-md shadow overflow-hidden p-10 items-center text-center flex flex-col">
        <div className="flex flex-col items-center">
          <FaHouseCircleCheck size={100} className="text-blue-500 mb-4" />
          <p className="font-bold mb-3 text-blue-600 text-2xl">เลือกเดือนที่ต้องการ</p>
          <select
            className="border border-gray-300 rounded-md py-2 px-4 mb-4 w-1/2"
            onChange={(e) => setValue(e.target.value)}
          >
            <option value="all" >เลือกเดือน</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          {value && (
            <button
              onClick={sendFlexMessage}
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
