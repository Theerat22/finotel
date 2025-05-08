"use client";

import { useEffect, useRef, useState } from "react";
import liff from "@line/liff";
// import * as olmOCR from "olmocr";

export default function SlipScanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [result, setResult] = useState<string>("");

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
        });
    });
  }, []);

  const handleCaptureAndScan = async () => {
    if (!videoRef.current) return;

    setResult("ใช้กล้องได้");

    // แคปเจอร์ภาพจากวิดีโอ
    // const canvas = document.createElement("canvas");
    // canvas.width = videoRef.current.videoWidth;
    // canvas.height = videoRef.current.videoHeight;
    // const ctx = canvas.getContext("2d");
    // if (ctx) {
    //   ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    //   const imageDataUrl = canvas.toDataURL("image/jpeg");

    //   // ส่งให้ olmOCR วิเคราะห์
    //   const result = await olmOCR.scanSlip(imageDataUrl);
    //   setResult(JSON.stringify(result, null, 2));
    // }
  };

  return (
    <div className="p-4">
      <video ref={videoRef} style={{ width: "100%", borderRadius: 10 }} />
      <button
        onClick={handleCaptureAndScan}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        สแกนสลิป
      </button>
      {result && (
        <pre className="mt-4 bg-gray-100 p-2 text-sm rounded">{result}</pre>
      )}
    </div>
  );
}
