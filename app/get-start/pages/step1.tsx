import React, { useState } from 'react';
import { FaArrowLeft,FaArrowRight } from 'react-icons/fa';
// import { useUser } from '@/app/components/UserContext';
// import LineMessageSender from '@/app/components/line/LineMessageSender';

interface Step1Props {
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
}

interface FormData {
  hotelName: string;
  ownerName: string;
}

const Step1: React.FC<Step1Props> = ({ setActivePage }) => {
  const [formData, setFormData] = useState<FormData>({
    hotelName: 'CD ลิงกังกู',
    ownerName: 'พวกเรา รักCEDT',
  });

  // const { userData } = useUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActivePage('hotel');
    console.log(formData);
  };



  return (
    <section className='relative min-h-screen overflow-hidden'>
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-md shadow overflow-hidden">
        {/* <LineMessageSender userId={userData.userId} /> */}
        <div className="md:hidden bg-blue-600 flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-xl font-bold text-white mb-2">เริ่มต้นโรงแรมของคุณ</h1>
          <p className="text-blue-100 mb-3 text-sm">กรอกข้อมูลโรงแรมของคุณเพื่อเริ่มต้นการใช้งานระบบ</p>
          <div className="mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-2/3 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">ข้อมูลโรงแรม</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="hotelName" className="block text-sm font-medium text-gray-700">ชื่อโรงแรม</label>
                <input
                  type="text"
                  id="hotelName"
                  name="hotelName"
                  value={formData.hotelName}
                  onChange={handleChange}
                  placeholder="กรุณากรอกชื่อโรงแรม"
                  className="w-full px-3 py-2 text-sm font-bold text-blue-500 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">ชื่อผู้ประกอบการ</label>
                <input
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="กรุณากรอกชื่อผู้ประกอบการ"
                  className="w-full px-3 py-2 text-sm font-bold text-blue-500 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setActivePage('login')}
                  className="flex items-center text-sm space-x-1 px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-200"
                >
                  <FaArrowLeft className="h-3 w-3" />
                  <span>ย้อนกลับ</span>
                </button>
                
                <button
                  type="submit"
                  className="flex items-center text-sm space-x-1 px-4 py-2 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 transition duration-200"
                >
                  <span>ถัดไป</span>
                  <FaArrowRight className="h-3 w-3" />
                </button>
              </div>
            </form>
          </div>

          {/* สำหรับหน้าจอ desktop - แสดงส่วนสีน้ำเงินด้านขวา */}
          <div className="hidden md:flex md:w-1/3 bg-blue-600 flex-col items-center justify-center p-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">เริ่มต้นโรงแรมของคุณ</h1>
            <p className="text-blue-100 mb-6">กรอกข้อมูลโรงแรมของคุณเพื่อเริ่มต้นการใช้งานระบบ</p>
            <div className="mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
};

export default Step1;