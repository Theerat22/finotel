"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useUser } from '@/app/components/UserContext';

interface ProfileProps {
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
}

const Profile: React.FC<ProfileProps> = ({ setActivePage }) => {
  const { userData, logout, initializeLiff } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const setupProfile = async () => {
      await initializeLiff();
      setIsLoading(false);
    };
    
    setupProfile();
  }, [initializeLiff]);

  if (isLoading) return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <p className="text-gray-600">กำลังโหลด...</p>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-md shadow overflow-hidden p-10 items-center text-center flex flex-col">
        <h1 className='font-bold text-center text-3xl text-blue-600'>ยินดีต้อนรับ</h1>
        {userData.pictureUrl && (
          <Image
            src={userData.pictureUrl}
            alt="รูปภาพวงกลม"
            width={150}
            height={150}
            className='rounded-full mx-auto mt-5'
          />
        )}
        <p className='font-bold text-2xl mt-4'>{userData.displayName}</p>
        <p className='text-gray-500 text-sm mt-2'>User ID: {userData.userId.substring(0, 8)}...</p>
        <button
          className='mt-6 font-bold text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg'
          onClick={() => setActivePage('overview')}
        >
          เริ่มต้นกับ Finotel
        </button>
        <button
          className='mt-3 text-gray-600 bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-lg'
          onClick={logout}
        >
          ออกจากระบบ
        </button>
      </div>
    </div>
  );
};

export default Profile;