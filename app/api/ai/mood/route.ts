import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the user's last 14 days of moods
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const moods = await prisma.mood.findMany({
      where: { 
        user: { email: session.user.email },
        date: { gte: fourteenDaysAgo }
      },
      orderBy: { date: "asc" },
      select: { date: true, mood: true, intensity: true, note: true }
    });

    if (moods.length < 3) {
      return NextResponse.json({
        observation: "You don't have enough recent mood logs. Keep tracking your mood daily to unlock deep Mind AI insights!",
        prediction: "Based on general patterns, resting well tonight will yield a brighter tomorrow."
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const prompt = `
      You are an expert, empathetic mental health analytics AI. 
      Analyze the following 14-day mood log data for a user.
      Extract exactly two things:
      1. A deeply insightful, slightly statistical or strongly correlated OBSERVATION about their mood patterns, tags, or intensity triggers. Keep it slightly under 2 sentences.
      2. An encouraging PREDICTION or micro-goal for tomorrow based on this data. 1 sentence.

      Do NOT wrap your response in markdown formatting or code blocks.
      Return STRICTLY a direct JSON object matching this schema:
      {"observation": "YOUR OBSERVATION", "prediction": "YOUR PREDICTION"}

      Data:
      ${JSON.stringify(moods)}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // strip markdown JSON encapsulation if Gemini ignores direct format
    if (text.startsWith("\`\`\`json")) {
        text = text.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
    } else if (text.startsWith("\`\`\`")) {
        text = text.replace(/\`\`\`/g, "").trim();
    }

    try {
        const parsed = JSON.parse(text);
        return NextResponse.json(parsed);
    } catch (e) {
        // Fallback in case of parsing failure
        return NextResponse.json({
            observation: "Your emotional patterns are unique and complex.",
            prediction: "Tomorrow is a new day full of potential."
        });
    }

  } catch (error) {
    console.error("AI Mood Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
