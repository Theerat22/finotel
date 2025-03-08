import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { FaChartLine, FaHotel, FaMoneyBillWave, FaRobot } from 'react-icons/fa';
import Dashboard from '@/public/imgs/dashboard.png';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <Head>
        <title>Finotel | ระบบจัดการการเงินของโรงแรมด้วย AI</title>
        <meta name="description" content="ระบบจัดการการเงินของโรงแรมที่ใช้ AI/ML เพื่อวิเคราะห์แนวโน้มรายได้ ต้นทุน และราคาห้องพัก" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="fixed w-full bg-white shadow-md z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href={'/'} className="flex items-center">
              <FaHotel className="text-blue-600 text-3xl mr-2" />
              <span className="text-2xl font-bold text-blue-600">Finotel</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="#features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                คุณสมบัติ
              </Link>
              <Link href="#pricing" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                ราคา
              </Link>
              <Link href="#testimonials" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                ความคิดเห็น
              </Link>
              <Link href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                ติดต่อ
              </Link>
            </nav>
            <div className="hidden md:flex space-x-4">
              <Link href="/login" className="px-4 py-2 text-blue-600 font-medium">
                เข้าสู่ระบบ
              </Link>
              <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                ลงทะเบียน
              </Link>
            </div>
            <button className="md:hidden text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
                  จัดการการเงินโรงแรมของคุณด้วย
                  <span className="text-blue-600"> AI</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  ระบบจัดการการเงินที่ช่วยวิเคราะห์แนวโน้มรายได้ ต้นทุน และราคาห้องพัก
                  เพื่อช่วยให้คุณตัดสินใจทางการเงินได้แม่นยำยิ่งขึ้น
                </p>
                <Link 
                  href="get-start" 
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                >
                  เริ่มต้นใช้งาน
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              <div className="md:w-1/2">
                <div className="relative mt-3 h-64 md:h-96 w-full">
                  <Image 
                    src={Dashboard}
                    alt="Finotel Dashboard" 
                    layout="fit"
                    objectFit="contain"
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">คุณสมบัติหลัก</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                ระบบของเราถูกออกแบบมาเพื่อทำให้การจัดการการเงินของโรงแรมเป็นเรื่องง่าย
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="text-blue-600 text-4xl mb-4">
                  <FaChartLine />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">วิเคราะห์แนวโน้มรายได้</h3>
                <p className="text-gray-600">
                  ใช้ AI วิเคราะห์ข้อมูลรายได้ในอดีตเพื่อคาดการณ์แนวโน้มในอนาคตและช่วยในการตัดสินใจที่ดีขึ้น
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="text-blue-600 text-4xl mb-4">
                  <FaMoneyBillWave />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">จัดการต้นทุนอัตโนมัติ</h3>
                <p className="text-gray-600">
                  ระบบติดตามและวิเคราะห์ต้นทุนทั้งหมดเพื่อระบุโอกาสในการประหยัดและเพิ่มกำไร
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="text-blue-600 text-4xl mb-4">
                  <FaRobot />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">ปรับราคาห้องพักอัจฉริยะ</h3>
                <p className="text-gray-600">
                  ใช้ ML เพื่อปรับราคาห้องพักตามความต้องการของตลาด ฤดูกาล และอัตราการจองในปัจจุบัน
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">วิธีการเริ่มต้นใช้งาน</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                เริ่มต้นใช้งาน Finotel ได้ง่ายๆ เพียง 3 ขั้นตอน
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center mb-12">
                <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">1</div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">หน้าเริ่มต้น</h3>
                  <p className="text-gray-600">คลิกปุ่ม "เริ่มต้นใช้งาน" เพื่อเริ่มการตั้งค่าระบบสำหรับโรงแรมของคุณ</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center mb-12">
                <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">2</div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">กรอกข้อมูลโรงแรม</h3>
                  <p className="text-gray-600">กรอกชื่อโรงแรมและเลือกประเภทของโรงแรมเพื่อปรับแต่งระบบให้เหมาะกับธุรกิจของคุณ</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">3</div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">ระบุตำแหน่งที่ตั้ง</h3>
                  <p className="text-gray-600">ใช้ Google Maps เพื่อกำหนดตำแหน่งที่ตั้งของโรงแรม ช่วยให้ระบบวิเคราะห์ข้อมูลตามทำเลที่ตั้งได้แม่นยำยิ่งขึ้น</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">พร้อมที่จะเพิ่มประสิทธิภาพการจัดการการเงินของโรงแรมคุณหรือยัง?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              เริ่มใช้งาน Finotel วันนี้และดูการเปลี่ยนแปลงที่ระบบ AI/ML ของเราสามารถทำให้กับธุรกิจของคุณ
            </p>
            <Link 
              href="/onboarding" 
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-medium text-lg hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              เริ่มต้นใช้งานฟรี
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <FaHotel className="text-blue-400 text-2xl mr-2" />
                <span className="text-xl font-bold">Finotel</span>
              </div>
              <p className="text-gray-400">
                ระบบจัดการการเงินของโรงแรมที่ใช้ AI/ML เพื่อเพิ่มกำไรและลดต้นทุน
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">เมนูหลัก</h3>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-gray-400 hover:text-white transition-colors">คุณสมบัติ</Link></li>
                <li><Link href="#pricing" className="text-gray-400 hover:text-white transition-colors">ราคา</Link></li>
                <li><Link href="#testimonials" className="text-gray-400 hover:text-white transition-colors">ความคิดเห็น</Link></li>
                <li><Link href="#contact" className="text-gray-400 hover:text-white transition-colors">ติดต่อ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">เกี่ยวกับเรา</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">เกี่ยวกับ Finotel</Link></li>
                <li><Link href="/team" className="text-gray-400 hover:text-white transition-colors">ทีมงาน</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-white transition-colors">ร่วมงานกับเรา</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">บล็อก</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">ติดต่อ</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">support@finotel.com</li>
                <li className="text-gray-400">+66 2 123 4567</li>
                <li className="text-gray-400">กรุงเทพมหานคร, ประเทศไทย</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Finotel. สงวนลิขสิทธิ์ทั้งหมด.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}