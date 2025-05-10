/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import liff from "@line/liff";
import { CiCircleCheck } from "react-icons/ci";
import { useUser } from "@/app/components/UserContext";
import axios from "axios";

const Complete: React.FC = () => {
  const [status, setStatus] = useState<{
    loading: boolean;
    error?: string;
    success?: boolean;
  }>({ loading: false });

  const flexMessage = {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      backgroundColor: "#ffffff",
      contents: [
        {
          type: "text",
          text: "โรงแรมลิงกังกู",
          weight: "bold",
          color: "#1E3A8A", // dark blue
          size: "sm",
        },
        {
          type: "text",
          text: "ยินดีต้อนรับ!",
          weight: "bold",
          size: "xxl",
          margin: "md",
          color: "#1E3A8A",
        },
        {
          type: "text",
          text: "ขอบคุณที่มาเป็นส่วนหนึ่งของครอบครัว Finotel",
          weight: "bold",
          size: "sm",
          margin: "md",
          color: "#1E3A8A",
        },
      ],
    },
    styles: {
      footer: {
        separator: true,
      },
    },
  };
  
  // const message =
  //   'เริ่มต้นกับ Finotel เสร็จเรียบร้อยแล้ว! \n\nยินดีต้อนรับ "โรงแรมลิงกังกู" ที่มาเป็นส่วนนึงของครอบครัว Finotel';
  const { userData } = useUser();
  const userId = userData.userId;

  // const sendMessage = async () => {
  //   if (!message) {
  //     setStatus({ loading: false, error: "Message cannot be empty" });
  //     return;
  //   }

  //   try {
  //     setStatus({ loading: true });
  //     console.log("Sending message:", message);

  //     const response = await axios.post("/api/sendMessage", {
  //       userId,
  //       message,
  //     });

  //     sendFlexMessage();

  //     console.log("Response:", response.data);
  //     setStatus({ loading: false, success: true });

  //     setTimeout(() => {
  //       setStatus({ loading: false });
  //     }, 4000);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  const sendFlexMessage = async () => {
    if (!flexMessage) {
      setStatus({ loading: false, error: "Message cannot be empty" });
      return;
    }

    try {
      setStatus({ loading: true });
      console.log("Sending message:", flexMessage);

      const response = await axios.post("/api/sendFlexMessage", {
        userId,
        flexMessage,
      });

      console.log("Response:", response.data);
      setStatus({ loading: false, success: true });

      setTimeout(() => {
        setStatus({ loading: false });
      }, 4000);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await liff.init({ liffId: "2007306544-Oyvzorbv" });
        sendFlexMessage();
        setTimeout(() => {
          liff.closeWindow();
        }, 2000);
      } catch (error) {
        console.error("LIFF initialization failed", error);
      }
    };

    initializeLiff();
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden px-4">
      <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl mx-auto bg-white rounded-md shadow overflow-hidden p-10 items-center text-center flex flex-col">
          <CiCircleCheck size={100} className="text-green-600" />
          <h1 className="font-bold text-2xl text-blue-600 mt-4">
            เริ่มต้นกับ Finotel เสร็จเรียบร้อย
          </h1>
          {status.error && (
            <div className="text-red-500 text-sm">{status.error}</div>
          )}

          {status.success && <div className="text-green-500 text-sm"></div>}
        </div>
      </div>
    </section>
  );
};

export default Complete;
