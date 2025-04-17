import React from 'react';

const RecommendationsBox = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      <h2 className="text-lg font-semibold mb-4 text-blue-700">คำแนะนำในการบริหารโรงแรม</h2>
      
      <div className="space-y-6">
        {/* RevPAR Recommendations */}
        <div className="border-b pb-4">
          <h3 className="font-medium text-blue-600 mb-2">เป้าหมาย RevPAR (Revenue Per Available Room)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded-md">
              <p className="font-semibold text-green-700 mb-1">เกณฑ์ดีเยี่ยม: &gt;80%</p>
              <p className="text-sm text-gray-600">โรงแรมสามารถทำรายได้ได้อย่างมีประสิทธิภาพสูง ควรรักษามาตรฐานและอาจพิจารณาเพิ่มราคาห้องพัก</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="font-semibold text-blue-700 mb-1">เกณฑ์ดี: 65-80%</p>
              <p className="text-sm text-gray-600">ผลประกอบการอยู่ในเกณฑ์ดี แต่ยังสามารถปรับปรุงได้ด้วยกลยุทธ์การขายที่เหมาะสม</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-md">
              <p className="font-semibold text-yellow-700 mb-1">เกณฑ์พอใช้: 50-65%</p>
              <p className="text-sm text-gray-600">ควรพิจารณาปรับกลยุทธ์การตลาดและราคาเพื่อเพิ่มอัตราการเข้าพักหรือค่าห้องเฉลี่ย</p>
            </div>
            <div className="bg-red-50 p-3 rounded-md">
              <p className="font-semibold text-red-700 mb-1">ต้องปรับปรุง: &lt;50%</p>
              <p className="text-sm text-gray-600">ควรทบทวนกลยุทธ์การบริหารรายได้โดยเร่งด่วน พิจารณาทั้งราคา การส่งเสริมการขาย และช่องทางการจัดจำหน่าย</p>
            </div>
          </div>
        </div>
        
        {/* GOPPAR Recommendations */}
        <div className="border-b pb-4">
          <h3 className="font-medium text-blue-600 mb-2">เป้าหมาย GOPPAR (Gross Operating Profit Per Available Room)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded-md">
              <p className="font-semibold text-green-700 mb-1">เกณฑ์ดีเยี่ยม: &gt;40%</p>
              <p className="text-sm text-gray-600">ประสิทธิภาพการทำกำไรสูงมาก แสดงถึงการบริหารต้นทุนที่ดีเยี่ยม</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="font-semibold text-blue-700 mb-1">เกณฑ์ดี: 30-40%</p>
              <p className="text-sm text-gray-600">ผลประกอบการด้านกำไรอยู่ในเกณฑ์ดี มีการบริหารต้นทุนที่มีประสิทธิภาพ</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-md">
              <p className="font-semibold text-yellow-700 mb-1">เกณฑ์พอใช้: 20-30%</p>
              <p className="text-sm text-gray-600">ควรตรวจสอบต้นทุนการดำเนินงานและพิจารณาหาโอกาสในการลดค่าใช้จ่ายที่ไม่จำเป็น</p>
            </div>
            <div className="bg-red-50 p-3 rounded-md">
              <p className="font-semibold text-red-700 mb-1">ต้องปรับปรุง: &lt;20%</p>
              <p className="text-sm text-gray-600">ควรทบทวนโครงสร้างต้นทุนอย่างเร่งด่วน วิเคราะห์ค่าใช้จ่ายที่สูงเกินไปและหาแนวทางในการเพิ่มกำไร</p>
            </div>
          </div>
        </div>
        
        {/* Revenue Gap Recommendations */}
        <div>
          <h3 className="font-medium text-blue-600 mb-2">ช่องว่างในการเพิ่มรายได้</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded-md">
              <p className="font-semibold text-green-700 mb-1">เกณฑ์ดีเยี่ยม: &lt;20%</p>
              <p className="text-sm text-gray-600">โรงแรมสามารถทำรายได้ได้ใกล้เคียงกับศักยภาพสูงสุด แสดงถึงการบริหารรายได้ที่มีประสิทธิภาพสูง</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="font-semibold text-blue-700 mb-1">เกณฑ์ดี: 20-35%</p>
              <p className="text-sm text-gray-600">มีช่องว่างในการเพิ่มรายได้พอสมควร แต่ยังอยู่ในเกณฑ์ที่ดี</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-md">
              <p className="font-semibold text-yellow-700 mb-1">เกณฑ์พอใช้: 35-50%</p>
              <p className="text-sm text-gray-600">ควรพิจารณากลยุทธ์การตลาดและการกำหนดราคาเพื่อลดช่องว่างในการเพิ่มรายได้</p>
            </div>
            <div className="bg-red-50 p-3 rounded-md">
              <p className="font-semibold text-red-700 mb-1">ต้องปรับปรุง: &gt;50%</p>
              <p className="text-sm text-gray-600">มีช่องว่างในการเพิ่มรายได้สูงมาก ควรทบทวนและปรับปรุงกลยุทธ์การบริหารรายได้โดยเร่งด่วน</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="font-medium text-blue-600 mb-2">คำแนะนำเพิ่มเติม</h3>
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
          <li>ติดตามเปรียบเทียบค่า RevPAR และ GOPPAR กับคู่แข่งในตลาดเดียวกันเพื่อประเมินสถานะการแข่งขัน</li>
          <li>พิจารณาปัจจัยตามฤดูกาลในการประเมินผลการดำเนินงาน โดยเฉพาะในช่วง Low Season</li>
          <li>ทบทวนกลยุทธ์การกำหนดราคาแบบไดนามิกอย่างสม่ำเสมอเพื่อให้สอดคล้องกับสภาพตลาดที่เปลี่ยนแปลง</li>
          <li>ควรวิเคราะห์ต้นทุนการดำเนินงานเพื่อปรับปรุงอัตรากำไร โดยเฉพาะในเดือนที่มี GOPPAR ต่ำ</li>
          <li>พิจารณาเพิ่มบริการเสริมที่สร้างรายได้เพิ่มเติมนอกเหนือจากค่าห้องพัก</li>
        </ul>
      </div>
    </div>
  );
};

export default RecommendationsBox;