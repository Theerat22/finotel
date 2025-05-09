// app/api/ocr/route.ts
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    // รับ API Key จาก headers
    const apiKey = process.env.OCR_API;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key is required' },
        { status: 400 }
      )
    }

    // รับไฟล์และ parameters จาก request
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      )
    }

    // สร้าง FormData สำหรับส่งไปที่ API
    const apiFormData = new FormData()
    
    // เพิ่มไฟล์และ parameters
    apiFormData.append('file', file)
    apiFormData.append('return_image', 'false')
    apiFormData.append('return_ocr', 'false')

    // ส่งคำขอไปยัง iApp API
    const response = await axios.post(
      'https://api.iapp.co.th/ocr/v3/receipt/file',
      apiFormData,
      {
        headers: {
          'apikey': apiKey,
          // ไม่ต้องใช้ getHeaders() ใน browser environment เพราะ FormData จะจัดการเอง
        }
      }
    )

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('OCR API error:', error)
    
    let errorMessage = 'An unknown error occurred'
    let statusCode = 500
    
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message
      statusCode = error.response?.status || 500
    } else if (error instanceof Error) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
}