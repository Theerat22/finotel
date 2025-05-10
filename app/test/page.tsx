"use client";

import { useState } from "react";

export default function AddAttractionForm() {
  const [formData, setFormData] = useState({
    name: "",
    detail: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formData);

    const res = await fetch("/api/add-financial", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
      }),
    });

    if (res.ok) {
      setStatus("✅ เพิ่มข้อมูลสำเร็จ");
      setFormData({
        name: "",
        detail: "",
      });
    } else {
      setStatus("❌ เพิ่มข้อมูลไม่สำเร็จ");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-4 rounded shadow"
    >
      <input
        type="text"
        name="name"
        placeholder="ชื่อสถานที่"
        value={formData.name}
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />
      <textarea
        name="detail"
        placeholder="รายละเอียด"
        value={formData.detail}
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        เพิ่มข้อมูล
      </button>
      {status && <p>{status}</p>}
    </form>
  );
}
