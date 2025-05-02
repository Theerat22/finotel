"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import liff from '@line/liff';

// กำหนด interface สำหรับข้อมูลผู้ใช้
interface UserData {
  userId: string;
  displayName: string;
  pictureUrl: string;
  isLoggedIn: boolean;
}

// กำหนด interface สำหรับ context
interface UserContextType {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  logout: () => void;
  initializeLiff: () => Promise<void>;
}

const defaultUserData: UserData = {
  userId: '',
  displayName: '',
  pictureUrl: '',
  isLoggedIn: false,
};

// สร้าง context
const UserContext = createContext<UserContextType | undefined>(undefined);

// สร้าง provider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>(defaultUserData);

  const logout = (): void => {
    liff.logout();
    setUserData(defaultUserData);
    window.location.reload();
  };

  const initializeLiff = async (): Promise<void> => {
    try {
      await liff.init({ liffId: "2007306544-Oyvzorbv" });
      
      if (liff.isLoggedIn()) {
        const profile = await liff.getProfile();
        setUserData({
          userId: profile.userId,
          displayName: profile.displayName,
          pictureUrl: profile.pictureUrl || '',
          isLoggedIn: true,
        });

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

  // สร้าง value object สำหรับ context
  const value = {
    userData,
    setUserData,
    logout,
    initializeLiff,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// สร้าง custom hook เพื่อให้ง่ายต่อการใช้งาน
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
};