"use client";
import React, { useState, useEffect } from "react";
import { FaHouseCircleCheck } from "react-icons/fa6";
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
      month: "January",
      goppar: 1000,
      revpar: 2000,
      occ: 50
    },
    กุมภาพันธ์: { // Fixed typo: removed ุ
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

  // Move localStorage operations inside useEffect to prevent server-side errors
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

  const userId = userData.userId;
  console.log("userId:", userId);

  const selectedMonth = mockMonth[value];

  const month = selectedMonth.month;
  const goppar = selectedMonth.goppar;
  const revpar = selectedMonth.revpar;
  const occ = selectedMonth.occ;

    const flexMessage = {
      "type": "bubble",
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "สรุปการเงินโรงแรม",
            "weight": "bold",
            "color": "#1DB446",
            "size": "sm"
          },
          {
            "type": "text",
            "text": month,
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
                    "size": "xl",
                    "color": "#555555",
                    "flex": 0
                  },
                  {
                    "type": "text",
                    "text": occ,
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
                    "text": revpar,
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
                    "text": goppar,
                    "size": "sm",
                    "color": "#555555"
                  },
                  {
                    "type": "text",
                    "text": "867",
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
                  "uri": "http://linecorp.com/"
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

  const sendFlexMessage = async () => {
    const selectedMonth = mockMonth[value];

    if (!selectedMonth) {
      console.log("No month selected");
    }

    try {
      console.log("Sending message:", selectedMonth, userId);

      const response = await axios.post("/api/sendFlexMessage", {
        userId,
        flexMessage
      });

      console.log("Response:", response.data);

    } catch (error) {
      console.error("Error:", error);
    }

    await liff.init({ liffId: "2007306544-8nvWdZ1v" });
    setTimeout(() => {
      liff.closeWindow();
    }, 1000);
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
    <section className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-md shadow overflow-hidden p-10 items-center text-center flex flex-col">
        <div className="flex flex-col items-center">
          <FaHouseCircleCheck size={100} className="text-blue-500 mb-4" />
          {/* {userId && (
            <p className="font-bold mb-3 text-blue-600 text-2xl">ยินดีต้อนรับ {userId}</p>
            )} */}
          <p className="font-bold mb-3 text-blue-600 text-2xl">เลือกเดือนที่ต้องการ</p>
          <select
            className="border border-gray-300 rounded-md py-2 px-4 mb-4 w-1/2"
            onChange={(e) => setValue(e.target.value)}
          >
            <option value="" >เลือกเดือน</option>
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

