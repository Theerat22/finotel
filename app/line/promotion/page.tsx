"use client";
import React, { useState, useEffect } from "react";
import liff from "@line/liff";
import axios from "axios";
import { TbProgressAlert } from "react-icons/tb";

interface UserData {
  userId: string;
  displayName: string;
  pictureUrl: string;
  isLoggedIn: boolean;
}

const defaultUserData: UserData = {
  userId: "",
  displayName: "",
  pictureUrl: "",
  isLoggedIn: false,
};

export default function Financial() {
  const [value, setValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<UserData>(defaultUserData);

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

  // Initialize LIFF and get user data
  useEffect(() => {
    const initializeLiff = async (): Promise<void> => {
      try {
        await liff.init({ liffId: "2007306544-j3JapnwJ" });

        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          setUserData({
            userId: profile.userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl || "",
            isLoggedIn: true,
          });

          setIsLoading(false);
        } else {
          console.log("ยังไม่ได้ login");
          liff.login();
        }
      } catch (error) {
        console.error("LIFF initialization failed", error);
      }
    };

    initializeLiff();
  }, []);

  // Create flex message based on selected month (only when a month is selected)
  const getFlexMessage = () => {
    if (!value) return null;
    
    const selectedMonth = value;

    const match = selectedMonth.match(/^([A-Za-z]+)(\d+)$/);

    const month_name = match ? match[1] : '';
    const year = match ? match[2] : '';
    
    return {
      type: "bubble",
      size: "mega",
      body: {
        type: "box",
        layout: "vertical",
        backgroundColor: "#ffffff",
        contents: [
          {
            type: "text",
            text: "แนะนำโปรโมชั่นห้องพัก",
            weight: "bold",
            color: "#1E3A8A", // dark blue
            size: "sm",
          },
          {
            type: "text",
            text: `เดือน ${month_name} ${year}`,
            weight: "bold",
            size: "xxl",
            margin: "md",
            color: "#1E3A8A",
          },
          {
            type: "text",
            size: "xs",
            color: "#94a3b8", // light slate
            wrap: true,
            text: "โรงแรมลิงกังกู",
          },
          {
            type: "separator",
            margin: "xxl",
            color: "#E0E7FF", // light blue
          },
          {
            type: "separator",
            margin: "xxl",
            color: "#E0E7FF", // light blue
          },
          {
            type: "box",
            layout: "horizontal",
            margin: "md",
            contents: [
              {
                type: "button",
                style: "primary",
                color: "#2563EB", // button blue
                action: {
                  type: "uri",
                  label: "ดูเพิ่มเติม",
                  uri: `https://finotel.vercel.app/detail/promotion/${value}`,
                },
              },
            ],
          },
        ],
      },
      styles: {
        footer: {
          separator: true,
        },
      },
    };
  };
  

  const sendFlexMessage = async () => {
    console.log("Send Flex Message");
    if (!value) {
      console.log("No month selected");
      return;
    }

    const flexMessage = getFlexMessage();

    try {
      console.log("Sending message to:", userData.userId);

      const response = await axios.post("/api/sendFlexMessage", {
        userId: userData.userId,
        flexMessage,
      });

      console.log("Response:", response.data);

      setTimeout(() => {
        liff.closeWindow();
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (isLoading)
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-md shadow overflow-hidden p-10 items-center text-center flex flex-col">
          <div className="flex flex-col items-center">
            <TbProgressAlert size={100} className="text-blue-500 mb-4" />
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
