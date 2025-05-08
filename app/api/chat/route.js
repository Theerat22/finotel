import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST() {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // const params = await request.json();

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          `คุณคือผู้เชี่ยวชาญด้านการจัดการโรงแรมขนาดเล็ก ที่มีประสบการณ์ตรงในการเป็นผู้จัดการโรงแรมมามากกว่า 10 ปี 
คุณให้คำแนะนำอย่างเป็นมิตร จริงใจ และอ้างอิงจากประสบการณ์จริงในการบริหารโรงแรม 
เพื่อช่วยให้เจ้าของโรงแรมรายย่อยสามารถปรับปรุงการดำเนินงานได้อย่างมีประสิทธิภาพ 
ตอบกลับในรูปแบบรายการ Markdown ที่อ่านง่าย ชัดเจน และสามารถนำไปใช้ได้ทันที`
      },
      {
        role: "user",
        content: `
You are a hotel financial manager. Here is some of the information you need:

- This month’s income: 800,000 Baht  
- Water expenses: 8,000 Baht  
- Electricity: 25,000 Baht  
- Food and supplies: 30,000 Baht  
- Staff: 200,000 Baht  
- Occupancy rate: 60.00%  
- Next month’s expected occupancy rate: 40.00%

Your task:
- Suggest how to **reduce and adjust the spending** in each of these categories: water, electricity, food and supplies, and staff
- For each category, give a **specific number** of how much it should be reduced to, and then follow with a **short reason why**
- Write in **Thai**, and format the answer in **Markdown bullet points**
- Do **not include any introduction or explanation**, just go straight to the list
- The format should be like this:
  - ลดค่าน้ำจาก 8,000 บาท เหลือ 5,500 บาท เพราะ...  
  - ลดค่าไฟฟ้าจาก ... เหลือ ... เพราะ...

Make sure all 4 categories are covered and keep each point on a single line.
`
      },
    ],
    temperature: 0.7,
    max_tokens: 512,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  return NextResponse.json(response);
}
