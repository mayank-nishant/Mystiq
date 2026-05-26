import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const runtime = "edge";

export async function POST() {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform. Avoid personal or sensitive topics.";

    const result = await model.generateContent(prompt);

    const response = await result.response;

    const text = response.text();

    return Response.json(
      {
        success: true,
        questions: text,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Gemini Error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to generate questions",
      },
      { status: 500 },
    );
  }
}
