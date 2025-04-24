import React from 'react';
import { DollarSign, Users, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

const Slug = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 py-4">
        <div className="bg-white p-4 rounded-xl shadow-md mb-4">
          <h1 className="text-2xl font-bold text-blue-600 text-center">ข้อมูลเดือนเมษายน 2025</h1>
        </div>

        {/* KPI Cards - Smaller grid */}
        <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 px-1">สถิติเดือนเมษายน</h3>
      
      <div className="space-y-3">
        {/* อัตราการเข้าพัก */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center">
            <Users className="text-blue-500 mr-2" size={16} />
            <p className="text-sm text-gray-600">อัตราเข้าพัก</p>
          </div>
          <p className="text-lg font-bold text-blue-600">86%</p>
        </div>
        <div className="h-px bg-gray-100"></div>
        
        {/* RevPAR */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center">
            <DollarSign className="text-green-500 mr-2" size={16} />
            <p className="text-sm text-gray-600">RevPAR</p>
          </div>
          <p className="text-lg font-bold text-green-600">3,871</p>
        </div>
        <div className="h-px bg-gray-100"></div>
        
        {/* GOPPAR */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center">
            <TrendingUp className="text-purple-500 mr-2" size={16} />
            <p className="text-sm text-gray-600">GOPPAR</p>
          </div>
          <p className="text-lg font-bold text-purple-600">1,243</p>
        </div>
      </div>
    </div>

        {/* Events */}
        <div className="bg-white p-4 rounded-xl shadow-lg mb-4 mt-4">
          <div className="flex items-center mb-2">
            <Calendar className="text-red-500 mr-2" size={18} />
            <h2 className="text-lg font-semibold text-gray-700">เทศกาลและอีเวนท์</h2>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="flex-shrink-0 bg-blue-100 p-1 rounded-full mr-2">
                <span className="text-blue-600 text-sm">✦</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">สงกรานต์</h3>
                <p className="text-gray-600 text-xs">13-15 เมษายน</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 bg-green-100 p-1 rounded-full mr-2">
                <span className="text-green-600 text-sm">✦</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">ขนทรายเข้าวัด</h3>
                <p className="text-gray-600 text-xs">13-14 เมษายน</p>
              </div>
            </li>
          </ul>
        </div>

        {/* RAG Recommendations */}
        <div className="bg-white p-4 rounded-xl shadow-lg mb-4">
  <div className="flex items-center mb-2">
    <AlertCircle className="text-amber-500 mr-2" size={18} />
    <h2 className="text-lg font-semibold text-gray-700">คำแนะนำในการจัดการการเงิน</h2>
  </div>
  <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 mb-3">
    <h3 className="font-semibold text-amber-800 text-sm mb-1">ช่วงที่มีลูกค้าเยอะกว่าปกติ</h3>
    <ul className="text-amber-700 space-y-1 text-xs">
      <li>• พิจารณาปรับราคาห้องพักแบบ dynamic pricing ตามความต้องการที่เพิ่มขึ้น</li>
      <li>• เพิ่มสัดส่วนพนักงานชั่วคราวเฉพาะช่วงพีคเพื่อลด OT และควบคุมต้นทุนแรงงาน</li>
      <li>• วิเคราะห์ต้นทุนต่อแขก 1 คน เพื่อหาจุดที่สามารถเพิ่มกำไรโดยไม่ลดคุณภาพ</li>
      <li>• ตรวจสอบ ROI ของแต่ละ upsell package เพื่อขยายเฉพาะตัวที่ทำกำไรสูง</li>
      <li>• ใช้ระบบ forecast เพื่อคาดการณ์วัตถุดิบล่วงหน้า ลดของเสียและต้นทุนแฝง</li>
    </ul>
  </div>
  {/* <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
    <h3 className="font-semibold text-blue-800 text-sm mb-1">ช่วงลูกค้าน้อย</h3>
    <ul className="text-blue-700 space-y-1 text-xs">
      <li>• ปรับลดจำนวนพนักงาน</li>
      <li>• วางแผนการสั่งซื้อวัตถุดิบ</li>
      <li>• พิจารณาปิดปรับปรุงบางส่วน</li>
      <li>• เสนอโปรโมชั่นพิเศษ</li>
    </ul>
  </div> */}
</div>


        {/* Footer */}
        <div className="bg-white p-2 rounded-xl shadow-lg text-center text-gray-600 text-xs">
          ข้อมูลอัพเดทล่าสุด: 23 เมษายน 2025
        </div>
      </div>
    </div>
  );
};

export default Slug;