"use client";

import { useState } from "react";
import Image from "next/image";

export default function SlipScanner() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      {uploadedImage && (
        <div>
          <h2 className="text-sm font-medium mb-2">ภาพที่อัปโหลด:</h2>
          <Image
            src={uploadedImage}
            alt="Uploaded"
            width={600}
            height={400}
            className="rounded shadow-md w-full"
          />
        </div>
      )}
    </div>
  );
}
