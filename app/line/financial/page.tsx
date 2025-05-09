"use client";
import { useRouter } from "next/navigation";
import { MdHistory } from "react-icons/md";
import { BsDatabaseAdd } from "react-icons/bs";

export default function FinancialHomePage() {
  const router = useRouter();

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col justify-center items-center px-4 py-8">
      <div className="flex flex-col justify-center items-center w-full max-w-4xl">
        <h1 className="font-bold text-2xl sm:text-3xl text-blue-600 mb-6 sm:mb-10 text-center">การเงินโรงแรม</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <button
            className="mx-auto my-3 sm:m-7 w-full max-w-sm"
            onClick={() => router.push("https://liff.line.me/2007306544-Z0Gq6kmG")}
          >
            <div className="bg-white shadow-xl sm:shadow-2xl rounded-2xl p-4 sm:p-5 w-full">
              <div className="flex flex-col items-center">
                {/* ปรับขนาดไอคอนให้เล็กลงบนมือถือ */}
                <MdHistory size={70} className="sm:size-100 text-blue-500 mb-3 sm:mb-4" />
                <p className="font-bold text-lg sm:text-2xl text-blue-600 text-center">
                  ดูข้อมูลการเงินโรงแรม
                </p>
              </div>
            </div>
          </button>

          <button
            className="mx-auto my-3 sm:m-7 w-full max-w-sm"
            onClick={() => router.push("https://liff.line.me/2007306544-a750okE5")}
          >
            <div className="bg-white shadow-xl sm:shadow-2xl rounded-2xl p-4 sm:p-5 w-full">
              <div className="flex flex-col items-center">
                <BsDatabaseAdd size={70} className="sm:size-100 text-blue-500 mb-3 sm:mb-4" />
                <p className="font-bold text-lg sm:text-2xl text-blue-600 text-center">
                  เพิ่มรายรับ-รายจ่าย
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}