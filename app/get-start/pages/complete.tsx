"use client";
import React, { useEffect } from 'react';
import liff from '@line/liff';
import { CiCircleCheck } from "react-icons/ci";



const Complete: React.FC = () => {
    useEffect(() => {
        const initializeLiff = async () => {
          try {
            await liff.init({ liffId: "2007306544-Oyvzorbv" });
            setTimeout(() => {
              liff.closeWindow();
            }, 2000);
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
      </div>
    </div>
  );
};

export default Complete;