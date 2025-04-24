import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import liff from '@line/liff';

interface Step1Props {
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
}

// interface LineProfile {
//   userId: string;
//   displayName: string;
//   pictureUrl?: string;
//   statusMessage?: string;
// }

const Profile: React.FC<Step1Props> = ({ setActivePage }) => {
  const [pictureUrl, setPictureUrl] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const logout = (): void => {
    liff.logout();
    window.location.reload();
  };

//   const initLine = async (): Promise<void> => {
//     try {
//       console.log("เริ่มต้นการเชื่อมต่อกับ LINE...");
//       await liff.init({ liffId: '2007306544-Oyvzorbv' });
      
//       console.log("สถานะการล็อกอิน:", liff.isLoggedIn());
      
//       if (liff.isLoggedIn()) {
//         console.log("ผู้ใช้ล็อกอินแล้ว ดึงข้อมูลโปรไฟล์...");
//         await fetchProfile();
//       } else {
//         console.log("ผู้ใช้ยังไม่ได้ล็อกอิน กำลังเริ่มการล็อกอิน...");
//         liff.login();
//       }
//     } catch (err) {
//       console.error('LIFF initialization failed', err);
//       setError('ไม่สามารถเชื่อมต่อกับ LINE ได้ กรุณาลองใหม่อีกครั้ง');
//       setIsLoading(false);
//     }
//   };

//   const fetchProfile = async (): Promise<void> => {
//     try {
//       const profile: LineProfile = await liff.getProfile();
//       console.log("ได้รับข้อมูลโปรไฟล์:", profile);
//       setDisplayName(profile.displayName);
//       setPictureUrl(profile.pictureUrl || '');
//       setUserId(profile.userId);
//     } catch (err) {
//       console.error('Failed to get profile', err);
//       setError('ไม่สามารถดึงข้อมูลโปรไฟล์ LINE ได้');
//     } finally {
//       setIsLoading(false);
//     }
//   };
  const main = async () => {
    await liff.init({ liffId: "2007306544-Oyvzorbv" });
    liff.login()

    if (liff.isLoggedIn()){
        const profile = await liff.getProfile();
        console.log(profile);

        setDisplayName(profile.displayName);
        setPictureUrl(profile.pictureUrl || '');
        setUserId(profile.userId);
    }
    
  }

  useEffect(() => {

    // ตรวจสอบว่า liff object มีอยู่จริงก่อนเรียกใช้
    if (liff) {
      main();
    } else {
      setError('ไม่พบ LIFF SDK กรุณาตรวจสอบการติดตั้ง');
      setIsLoading(false);
    }
  }, []);

  if (isLoading) return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <p className="text-gray-600">กำลังโหลด...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md mx-auto bg-white rounded-md shadow p-6 text-center">
        <div className="text-red-500 mb-4">เกิดข้อผิดพลาด</div>
        <p>{error}</p>
        <button 
          className="mt-4 font-bold text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg"
          onClick={() => window.location.reload()}
        >
          ลองใหม่อีกครั้ง
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-md shadow overflow-hidden p-10 items-center text-center flex flex-col">
        <h1 className='font-bold text-center text-3xl text-blue-600'>ยินดีต้อนรับ</h1>
        {pictureUrl && (
          <Image
            src={pictureUrl}
            alt="รูปภาพวงกลม"
            width={150}
            height={150}
            className='rounded-full mx-auto mt-5'
          />
        )}
        <p className='font-bold text-2xl mt-4'>{displayName}</p>
        <p className='text-gray-500 text-sm mt-2'>User ID: {userId.substring(0, 8)}...</p>
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