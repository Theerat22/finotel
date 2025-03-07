import React, { useState } from 'react';

interface Step1Props {
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
}

interface FormData {
  hotelName: string;
  ownerName: string;
  contactPhone: string;
  email: string;
}

const Step1: React.FC<Step1Props> = ({ setActivePage }) => {
  const [formData, setFormData] = useState<FormData>({
    hotelName: 'CD Hotel',
    ownerName: 'สมชาย',
    contactPhone: '123-456-7890',
    email: 'cdhotel@gmail.com',
  });

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
    // console.log(formData);
  };

  const isFormValid = () => {
    const { hotelName, ownerName, contactPhone, email } = formData;
    return hotelName && ownerName && contactPhone && email;
  };

  return (
    <div className=" bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-md shadow overflow-hidden">
        <div className="flex flex-col md:flex-row">

          <div className="md:w-2/3 p-6">
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">เบอร์โทรศัพท์</label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="0xx-xxx-xxxx"
                    className="w-full px-3 py-2 text-sm font-bold text-blue-500 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">อีเมล</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    className="w-full px-3 py-2 text-sm font-bold text-blue-500 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>


              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  disabled={!isFormValid()}
                  className={`flex items-center text-sm space-x-1 px-4 py-2 rounded-md text-white font-medium 
                    ${isFormValid() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} 
                    transition duration-200`}
                >
                  <span>ถัดไป</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          <div className="md:w-1/3 bg-blue-600 flex flex-col items-center justify-center p-6 text-center">
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
  );
};

export default Step1;