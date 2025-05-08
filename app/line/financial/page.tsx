"use client";
import { useRouter } from "next/navigation";
import { MdHistory } from "react-icons/md";
import { BsDatabaseAdd } from "react-icons/bs";


export default function FinancialHomePage() {
  const router = useRouter();

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col justify-center items-center px-4">
      <div className="flex flex-col justify-center items-center">
        <h1 className="font-bold text-3xl text-blue-600 mb-10">การเงินโรงแรม</h1>
        <div className="grid grid-cols-2 gap-4">
          <button
            className="m-7"
            onClick={() => router.push("/line/financial/get-data")}
          >
            <div className="bg-white shadow-2xl rounded-2xl p-5">
              <div className="flex flex-col items-center">
                <MdHistory size={100} className="text-blue-500 mb-4" />
                <p className="font-bold text-2xl text-blue-600">
                  ดูข้อมูลการเงินโรงแรม
                </p>
              </div>
            </div>
          </button>

          <button
            className="m-7"
            onClick={() => router.push("/line/financial/add-data")}
          >
            <div className="bg-white shadow-2xl rounded-2xl p-5">
              <div className="flex flex-col items-center">
                <BsDatabaseAdd size={100} className="text-blue-500 mb-4" />
                <p className="font-bold text-2xl text-blue-600">
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
