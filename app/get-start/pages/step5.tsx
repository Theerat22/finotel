import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaPlus, FaTrash } from "react-icons/fa";

interface Step1Props {
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
}

interface Room {
  name: string;
  price: string;
}

interface FormData {
  rooms: Room[];
}

const Step5: React.FC<Step1Props> = ({ setActivePage }) => {
  const [formData, setFormData] = useState<FormData>({
    rooms: [{ name: "", price: "" }],
  });

  const averagePrice =
  formData.rooms.length > 0
    ? formData.rooms.reduce((sum, room) => sum + parseFloat(room.price || "0"), 0) / formData.rooms.length
    : 0;



  const handleRoomChange = (
    index: number,
    field: keyof Room,
    value: string
  ) => {
    const updatedRooms = [...formData.rooms];
    updatedRooms[index][field] = value;
    setFormData((prev) => ({ ...prev, rooms: updatedRooms }));
  };

  const addRoom = () => {
    setFormData((prev) => ({
      ...prev,
      rooms: [...prev.rooms, { name: "", price: "" }],
    }));
  };

  const removeRoom = (index: number) => {
    const updatedRooms = formData.rooms.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, rooms: updatedRooms }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(averagePrice);

    try {
      const res = await fetch("/api/add-financial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ averagePrice }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

    } catch (err) {
      console.error("Failed to fetch financial data:", err);
    }
    setActivePage("complete");
  };

  return (
    <section className="relative min-h-screen overflow-hidden px-4">
      <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-4xl mx-auto bg-white rounded-md shadow overflow-hidden">

        <div className="md:hidden bg-blue-600 flex flex-col items-center justify-center p-4 text-center">
            <h1 className="text-xl font-bold text-white mb-2">
              อัตราการเข้าพักโรงแรม
            </h1>
            <p className="text-blue-100 mb-3 text-sm">
              อัปโหลดข้อมูลอัตราการเข้าพักจากไฟล์ CSV
            </p>
            <div className="mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-white opacity-80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Left Side - Form */}
            <div className="w-full md:w-2/3 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* ห้องพัก */}
                <div className="space-y-4">
                  <h3 className="text-md font-semibold text-gray-700">
                    รายละเอียดห้องพัก
                  </h3>
                  {formData.rooms.map((room, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap items-center gap-2 mb-2"
                    >
                      <div className="flex-1 min-w-[140px]">
                        <input
                          type="text"
                          placeholder={`ห้องพัก ${index + 1}`}
                          value={`ห้องพัก ${index + 1}`}
                          onChange={(e) =>
                            handleRoomChange(index, "name", e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-400"
                          required
                        />
                      </div>
                      <div className="flex-1 min-w-[140px]">
                        <input
                          type="number"
                          placeholder="ราคาต่อคืน"
                          value={room.price}
                          onChange={(e) =>
                            handleRoomChange(index, "price", e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-400"
                          required
                        />
                      </div>
                      <div className="w-auto">
                        {formData.rooms.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRoom(index)}
                            className="text-red-500 hover:text-red-600 p-2"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addRoom}
                    className="flex items-center text-sm text-blue-600 mt-2 hover:text-blue-800"
                  >
                    <FaPlus className="mr-1" /> เพิ่มห้องพัก
                  </button>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={() => setActivePage("login")}
                    className="flex items-center text-sm px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                  >
                    <FaArrowLeft className="mr-2 h-3 w-3" />
                    ย้อนกลับ
                  </button>

                  <button
                    type="submit"
                    className="flex items-center text-sm px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    ถัดไป
                    <FaArrowRight className="ml-2 h-3 w-3" />
                  </button>
                </div>
              </form>
            </div>

            {/* Right Side - Blue Info */}
            <div className="hidden md:flex md:w-1/3 bg-blue-600 flex-col items-center justify-center p-6 text-center">
              <h1 className="text-2xl font-bold text-white mb-4">
                เริ่มต้นโรงแรมของคุณ
              </h1>
              <p className="text-blue-100 mb-6">
                กรอกข้อมูลโรงแรมและรายละเอียดห้องพักของคุณ
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-white opacity-80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>

            
          </div>
        </div>
      </div>
    </section>
  );
};

export default Step5;
