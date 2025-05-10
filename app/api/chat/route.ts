import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const body = await request.json();

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `คุณคือผู้เชี่ยวชาญด้านการจัดการโรงแรมขนาดเล็ก ที่มีประสบการณ์ตรงในการเป็นผู้จัดการโรงแรมมามากกว่า 10 ปี 
คุณให้คำแนะนำอย่างเป็นมิตร จริงใจ และอ้างอิงจากประสบการณ์จริงในการบริหารโรงแรม 
เพื่อช่วยให้เจ้าของโรงแรมรายย่อยสามารถปรับปรุงการดำเนินงานได้อย่างมีประสิทธิภาพ 
ตอบกลับในรูปแบบรายการ Markdown ที่อ่านง่าย ชัดเจน และสามารถนำไปใช้ได้ทันที`
      },
      {
        role: "user",
        content: body.prompt, // <<< เปลี่ยนจาก params.messages
      },
    ],
    temperature: 0.7,
    max_tokens: 512,
  });

  return NextResponse.json(response);
}
