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

    // Fetch the user's last mood logs and meditation frequency
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        moods: { orderBy: { date: "desc" }, take: 3 },
        meditationSessions: { orderBy: { completedAt: "desc" }, take: 5 }
      }
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      You are an expert AI Meditation Coach. 
      Analyze the user's data and provide a personalized, empathetic recommendation.
      
      User Data:
      Mood Logs: ${JSON.stringify(user.moods)}
      Recent Meditations: ${JSON.stringify(user.meditationSessions)}
      
      Extract exactly two things:
      1. A short, empathetic summary of WHY they should meditate right now based on their latest mood. (e.g. "You logged High Stress recently; it's time to re-center.")
      2. A specific meditation techique suggestion from the following: "Box Breathing", "4-7-8 Technique", "6-2 Technique".
      
      Return STRICTLY a direct JSON object matching this schema:
      {"insight": "YOUR INSIGHT", "technique": "Box Breathing | 4-7-8 Technique | 6-2 Technique"}
      
      Do NOT wrap response in code blocks.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // cleanup in case JSON is wrapped
    if (text.includes("```json")) {
        text = text.split("```json")[1].split("```")[0].trim();
    } else if (text.includes("```")) {
        text = text.split("```")[1].split("```")[0].trim();
    }

    try {
        const parsed = JSON.parse(text);
        return NextResponse.json(parsed);
    } catch (e) {
        // Fallback
        return NextResponse.json({
            insight: "You've been doing great. A quick breathing session will help maintain your focus.",
            technique: "Box Breathing"
        });
    }

  } catch (error) {
    console.error("AI Meditation Coach Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
