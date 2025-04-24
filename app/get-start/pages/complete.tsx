/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from 'react';
import liff from '@line/liff';
import { CiCircleCheck } from "react-icons/ci";
import { useUser } from '@/app/components/UserContext';
import axios from 'axios';

const Complete: React.FC = () => {
    const [status, setStatus] = useState<{
        loading: boolean;
        error?: string;
        success?: boolean;
      }>({ loading: false });

    const message = {
        "type": "bubble",
        "body": {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "text",
              "text": "Hello,"
            },
            {
              "type": "text",
              "text": "World!"
            }
          ]
        }
      }

    const { userData } = useUser();
    const userId = userData.userId;

    const sendMessage = async () => {
        if (!message) {
            setStatus({ loading: false, error: 'Message cannot be empty' });
            return;
        }
    
        try {
            setStatus({ loading: true });
            console.log('Sending message:', message);
            
            const response = await axios.post('/api/sendFlexMessage', {
            userId,
            message
            });
            
            console.log('Response:', response.data);
            setStatus({ loading: false, success: true });

            setTimeout(() => {
            setStatus({ loading: false });
            }, 3000);
        } catch (error) {
            console.error("Error:", error);
        };
    };


    useEffect(() => {
        const initializeLiff = async () => {
          try {
            await liff.init({ liffId: "2007306544-Oyvzorbv" });
            sendMessage();
            setTimeout(() => {
              liff.closeWindow();
            }, 1000);
          } catch (error) {
            console.error('LIFF initialization failed', error);
          }
        };
    
        initializeLiff();
      }, []);


  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-md shadow overflow-hidden p-10 items-center text-center flex flex-col">
        <CiCircleCheck size={100} className='text-green-600' />
        <h1 className='font-bold text-2xl text-blue-600 mt-4'>เริ่มต้นกับ Finotel เสร็จเรียบร้อย</h1>
        {status.error && (
        <div className="text-red-500 text-sm">{status.error}</div>
      )}
      
      {status.success && (
        <div className="text-green-500 text-sm"></div>
      )}
      </div>
    </div>
  );
};

export default Complete;
