"use client";
import React, { useState, useEffect } from "react";
import { Calendar } from 'lucide-react';
import liff from "@line/liff";
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

interface UserData {
  userId: string;
  displayName: string;
  pictureUrl: string;
  isLoggedIn: boolean;
}

const defaultUserData: UserData = {
  userId: '',
  displayName: '',
  pictureUrl: '',
  isLoggedIn: false,
};

export default function Financial() {
  const [value, setValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<UserData>(defaultUserData);

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
      month: "January2025",
      goppar: 1000,
      revpar: 2000,
      occ: 50
    },
    กุมภาพันธ์: {
      month: "February2025",
      goppar: 1200,
      revpar: 2200,
      occ: 50
    },
    มีนาคม: {
      month: "March2025",
      goppar: 1300,
      revpar: 2300,
      occ: 50
    },
    เมษายน: {
      month: "April2025",
      goppar: 1400,
      revpar: 2400,
      occ: 50
    },
    พฤษภาคม: {
      month: "May2025",
      goppar: 1500,
      revpar: 2500,
      occ: 50
    },
  };

  // Initialize LIFF and get user data
  useEffect(() => {
    const initializeLiff = async (): Promise<void> => {
      try {
        await liff.init({ liffId: "2007306544-8nvWdZ1v" });
        
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          setUserData({
            userId: profile.userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl || '',
            isLoggedIn: true,
          });

          setIsLoading(false);
          // const userId = localStorage.setItem('userId', JSON.stringify(profile.userId));
          // console.log('userId:', userId);
        } else {
          console.log('ยังไม่ได้ login');
          liff.login();
        }
      } catch (error) {
        console.error('LIFF initialization failed', error);
      }
    };

    initializeLiff();
  }, []);

  // Create flex message based on selected month (only when a month is selected)
  const getFlexMessage = () => {
    if (!value || !mockMonth[value]) return null;
    
    const selectedMonth = mockMonth[value];

    const match = selectedMonth.month.match(/^([A-Za-z]+)(\d+)$/);

    const month_name = match ? match[1] : '';
    const year = match ? match[2] : '';
    
    return {
      "type": "bubble",
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "ทำนายอัตราการเข้าพัก",
            "weight": "bold",
            "color": "#1DB446",
            "size": "sm"
          },
          {
            "type": "text",
            "text": `${month_name} ${year}`,
            "weight": "bold",
            "size": "xxl",
            "margin": "md"
          },
          {
            "type": "text",
            "size": "xs",
            "color": "#aaaaaa",
            "wrap": true,
            "text": "Nan, Thailand"
          },
          {
            "type": "separator",
            "margin": "xxl"
          },
          {
            "type": "box",
            "layout": "vertical",
            "margin": "xxl",
            "spacing": "sm",
            "contents": [
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "ทำนายอัตราการเข้าพัก",
                    "size": "md",
                    "color": "#555555",
                    "flex": 0
                  },
                  {
                    "type": "text",
                    "text": `${selectedMonth.occ}%`,
                    "size": "xl",
                    "color": "#1DB446",
                    "align": "end"
                  }
                ]
              },
              {
                "type": "separator",
                "margin": "xxl"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "margin": "xxl",
                "contents": [
                  {
                    "type": "text",
                    "text": "RevPAR",
                    "size": "sm",
                    "color": "#555555"
                  },
                  {
                    "type": "text",
                    "text": `${selectedMonth.revpar}฿`,
                    "size": "sm",
                    "color": "#145CFA",
                    "align": "end"
                  }
                ]
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "GOPPAR",
                    "size": "sm",
                    "color": "#555555"
                  },
                  {
                    "type": "text",
                    "text": `${selectedMonth.goppar}฿`,
                    "size": "sm",
                    "color": "#145CFA",
                    "align": "end"
                  }
                ]
              }
            ]
          },
          {
            "type": "separator",
            "margin": "xxl"
          },
          {
            "type": "box",
            "layout": "horizontal",
            "margin": "md",
            "contents": [
              {
                "type": "button",
                "action": {
                  "type": "uri",
                  "label": "ดูเพิ่มเติม",
                  "uri": `https://finotel.vercel.app/detail/booking/${selectedMonth.month}`
                }
              }
            ]
          }
        ]
      },
      "styles": {
        "footer": {
          "separator": true
        }
      }
    };
  };

  const sendFlexMessage = async () => {
    console.log("Send Flex Message");
    if (!value || !mockMonth[value]) {
      console.log("No month selected");
      return;
    }

    const flexMessage = getFlexMessage();
    
    try {
      console.log("Sending message to:", userData.userId);

      const response = await axios.post("/api/sendFlexMessage", {
        userId: userData.userId,
        flexMessage
      });

      console.log("Response:", response.data);

      setTimeout(() => {
        liff.closeWindow();
      }, 1000);
      
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (isLoading) return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <p className="text-gray-600">กำลังโหลด...</p>
      </div>
    </div>
  );

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-16 flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-md shadow overflow-hidden p-10 items-center text-center flex flex-col">
        <div className="flex flex-col items-center">
          <Calendar size={100} className="text-blue-500 mb-4" />
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