"use client";

import { useEffect, useRef, useState } from "react";
import liff from "@line/liff";
import Image from "next/image";

export default function SlipScanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    liff.init({ liffId: "2007306544-8XxGDdBx" }).then(() => {
      if (!liff.isInClient()) {
        alert("กรุณาเปิดใน LINE App");
        return;
      }

      // ขออนุญาตเปิดกล้อง
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch((err) => {
          console.error("เปิดกล้องไม่สำเร็จ:", err);
          setError("ไม่สามารถเปิดกล้องได้");
        });
    });
  }, []);

  const handleCaptureAndScan = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL("image/jpeg");
      setCapturedImage(imageDataUrl);
    }
  };

  return (
    <div className="p-4">
      <video ref={videoRef} style={{ width: "100%", borderRadius: 10 }} playsInline muted />
      <button
        onClick={handleCaptureAndScan}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        ถ่ายรูป
      </button>

      {capturedImage && (
        <div className="mt-4">
          <h2 className="text-sm font-medium mb-2">ภาพที่ถ่าย:</h2>
          <Image src={capturedImage} alt="Captured" className="rounded shadow-md w-full" />
        </div>
      )}

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
