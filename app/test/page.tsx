"use client";

import { useState, ChangeEvent } from "react";
import Image from "next/image";
import axios from "axios";

interface OCRResponse {
  message: string;
  raw?: {
    image?: string;
    text?: string;
  };
  processed?: {
    invoiceType: string;
    invoiceBook: string;
    invoiceID: string;
    invoiceDate: string;
    purchaseOrderID: string;
    issuerName: string;
    issuerAddress: string;
    issuerTaxID: string;
    issuerPhone: string;
    customerName: string;
    customerAddress: string;
    customerTaxID: string;
    customerPhone: string;
    items: {
      itemNo: string;
      itemCode: string;
      itemName: string;
      itemUnit: number;
      itemUnitCost: number;
      itemTotalCost: number;
    }[];
    totalCost: number;
    discount: number;
    totalCostAfterDiscount: number;
    vat: number;
    grandTotal: number;
  };
  template: string;
  iapp: string;
  process_ms: number;
}

export default function OCRPage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<
    OCRResponse["processed"] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  // const [apiKey, setApiKey] = useState<string>('')

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setReceiptData(null);
      setError("");
    }
  };

  // const handleApiKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setApiKey(e.target.value)
  // }

  const handleSubmit = async () => {
    if (!image) return setError("กรุณาเลือกรูปภาพใบเสร็จก่อน");
    // if (!apiKey) return setError('กรุณากรอก API Key')
    const apiKey = process.env.OCR_API as string;
    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", image);
      formData.append("return_image", "false");
      formData.append("return_ocr", "false");

      const response = await axios.post("/api/ocr", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-API-KEY": apiKey,
        },
      });

      const data = response.data as OCRResponse;

      if (!data.processed) {
        setError("ไม่พบข้อมูลในใบเสร็จ");
      } else {
        setReceiptData(data.processed);
      }
    } catch (err: unknown) {
      let errorMessage = "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(`เกิดข้อผิดพลาด: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!receiptData) return;
    const textData = JSON.stringify(receiptData, null, 2);
    navigator.clipboard
      .writeText(textData)
      .then(() => alert("คัดลอกข้อมูลแล้ว"))
      .catch((err) => console.error("ไม่สามารถคัดลอกข้อมูลได้:", err));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          ระบบวิเคราะห์ใบเสร็จ (Receipt OCR)
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          {/* <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">API Key:</label>
            <input
              type="text"
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder="ใส่ API Key ของ iApp"
              className="w-full border border-gray-300 rounded p-2 text-sm"
            />
          </div> */}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">
              เลือกรูปภาพใบเสร็จ:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded p-2 text-sm"
            />
          </div>

          {preview && (
            <div className="mb-4">
              <p className="text-gray-700 mb-2 font-medium">ภาพตัวอย่าง:</p>
              <div className="relative rounded-lg overflow-hidden border border-gray-300">
                <Image
                  src={preview}
                  alt="ตัวอย่าง"
                  width={500}
                  height={300}
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: "300px" }}
                />
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !image }
            className={`w-full py-2 px-4 rounded font-medium ${
              loading || !image
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-black"
            }`}
          >
            {loading ? "กำลังวิเคราะห์..." : "วิเคราะห์ใบเสร็จ"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {receiptData && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">ผลลัพธ์:</h2>
              <button
                onClick={copyToClipboard}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-3 rounded text-sm flex items-center"
              >
                📋 คัดลอก
              </button>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                ข้อมูลผู้ออกใบเสร็จ
              </h3>
              <div className="bg-gray-50 p-4 rounded border border-gray-200 text-sm">
                <p>
                  <strong>ชื่อร้าน:</strong> {receiptData.issuerName}
                </p>
                <p>
                  <strong>ที่อยู่:</strong> {receiptData.issuerAddress}
                </p>
                <p>
                  <strong>เบอร์โทร:</strong> {receiptData.issuerPhone}
                </p>
                <p>
                  <strong>เลขประจำตัวผู้เสียภาษี:</strong>{" "}
                  {receiptData.issuerTaxID}
                </p>
                <p>
                  <strong>วันที่ใบเสร็จ:</strong> {receiptData.invoiceDate}
                </p>
                <p>
                  <strong>เลขที่ใบเสร็จ:</strong> {receiptData.invoiceID}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                ข้อมูลลูกค้า
              </h3>
              <div className="bg-gray-50 p-4 rounded border border-gray-200 text-sm">
                <p>
                  <strong>ชื่อลูกค้า:</strong> {receiptData.customerName}
                </p>
                <p>
                  <strong>ที่อยู่:</strong> {receiptData.customerAddress}
                </p>
                <p>
                  <strong>เบอร์โทร:</strong> {receiptData.customerPhone}
                </p>
                <p>
                  <strong>เลขประจำตัวผู้เสียภาษี:</strong>{" "}
                  {receiptData.customerTaxID}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                รายการสินค้า
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="px-3 py-2">#</th>
                      <th className="px-3 py-2">ชื่อสินค้า</th>
                      <th className="px-3 py-2 text-right">จำนวน</th>
                      <th className="px-3 py-2 text-right">ราคาต่อหน่วย</th>
                      <th className="px-3 py-2 text-right">ราคารวม</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receiptData.items.map((item, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "" : "bg-gray-50"}
                      >
                        <td className="px-3 py-1">{item.itemNo}</td>
                        <td className="px-3 py-1">{item.itemName}</td>
                        <td className="px-3 py-1 text-right">
                          {item.itemUnit}
                        </td>
                        <td className="px-3 py-1 text-right">
                          {item.itemUnitCost.toLocaleString()}
                        </td>
                        <td className="px-3 py-1 text-right">
                          {item.itemTotalCost.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-sm bg-gray-50 p-4 rounded border border-gray-200">
              <p>
                <strong>ยอดรวม:</strong>{" "}
                {receiptData.totalCost.toLocaleString()} บาท
              </p>
              <p>
                <strong>ส่วนลด:</strong> {receiptData.discount.toLocaleString()}{" "}
                บาท
              </p>
              <p>
                <strong>ยอดหลังหักส่วนลด:</strong>{" "}
                {receiptData.totalCostAfterDiscount.toLocaleString()} บาท
              </p>
              <p>
                <strong>ภาษีมูลค่าเพิ่ม (VAT):</strong>{" "}
                {receiptData.vat.toLocaleString()} บาท
              </p>
              <p>
                <strong>ยอดสุทธิ:</strong>{" "}
                <span className="font-semibold text-blue-700">
                  {receiptData.grandTotal.toLocaleString()} บาท
                </span>
              </p>
            </div>

            <div className="mt-4">
              <details>
                <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                  แสดงข้อมูล JSON (สำหรับนักพัฒนา)
                </summary>
                <div className="mt-2 bg-gray-50 p-4 rounded border border-gray-200">
                  <pre className="whitespace-pre-wrap text-gray-700 break-words text-xs">
                    {JSON.stringify(receiptData, null, 2)}
                  </pre>
                </div>
              </details>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
