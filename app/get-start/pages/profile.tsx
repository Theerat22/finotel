import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import liff from '@line/liff';


interface Step1Props {
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
}

interface LineProfile {
    userId: string;
    displayName: string;
    pictureUrl?: string;
    statusMessage?: string;
  }
  


const Profile: React.FC<Step1Props> = ({ setActivePage }) => {
    const [pictureUrl, setPictureUrl] = useState<string>('');
    const [displayName, setDisplayName] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    // const logout = (): void => {
    //   liff.logout();
    //   window.location.reload();
    // };
  
    const initLine = async (): Promise<void> => {
      try {
        await liff.init({ liffId: '2007306544-Oyvzorbv' });
        if (liff.isLoggedIn()) {
          await runApp();
        } else {
          liff.login();
        }
      } catch (err) {
        console.error('LIFF initialization failed', err);
        setError('Failed to initialize LIFF');
        setIsLoading(false);
      }
    };
  
    const runApp = async (): Promise<void> => {
      try {
        const profile: LineProfile = await liff.getProfile();
        console.log(profile);
        setDisplayName(profile.displayName);
        setPictureUrl(profile.pictureUrl || '');
        setUserId(profile.userId);
        setIsLoading(false);
        console.log(userId);
      } catch (err) {
        console.error('Failed to get profile', err);
        setError('Failed to get LINE profile');
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      initLine();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-md shadow overflow-hidden p-10 items-center text-center flex flex-col">
        <h1 className='font-bold text-center text-3xl text-blue-600'>ยินดีต้อนรับ</h1>
        <Image 
        src={pictureUrl}
        alt="รูปภาพวงกลม"
        width={150}
        height={150}
        className='rounded-full mx-auto mt-5'
      />
      <p className='font-bold text-2xl mt-4'>{displayName}</p>
      <button className='mt-3 font-bold text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg' onClick={() => setActivePage('overview')}>เริ่มต้นกับ Finotel</button>
      </div>
      
    </div>
  );
};

export default Profile;