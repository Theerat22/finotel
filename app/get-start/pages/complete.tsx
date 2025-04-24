"use client";
import React, { useEffect } from 'react';
import liff from '@line/liff';
import { CiCircleCheck } from "react-icons/ci";
interface ProfileProps {
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
}

const Complete: React.FC<ProfileProps> = ({ setActivePage }) => {
    useEffect(() => {
        liff.init({ liffId: "2007306544-Oyvzorbv" });
        liff.closeWindow();
    }, [setActivePage]);

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