import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { category, score, severity, answers } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Attempt to update the journey string
    const journey = await prisma.therapyJourney.findUnique({
      where: {
        userId_category: {
          userId: user.id,
          category,
        },
      },
    });

    if (journey) {
      await prisma.therapyJourney.update({
        where: { id: journey.id },
        data: { currentDay: journey.currentDay + 1, lastInteraction: new Date() },
      });
    }

    // Save assessment to profile
    await prisma.therapyAssessment.create({
      data: {
        userId: user.id,
        category: category,
        score,
        severity,
        answers: JSON.stringify(answers)
      }
    });

    // 3. Generate AI Note
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro", 
      systemInstruction: "You are a supportive, concise digital therapy assistant. Generate a short, empathetic reflection note for a user who completed a module on their mental health journey.",
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_NONE",
        },
      ] as any
    });
    
    const prompt = `The user completed a module for ${category}. Their severity score was ${severity} (${score} points). 
    Please provide:
    1. A warm acknowledgement of their active effort to improve.
    2. A brief, actionable summary of what they should incorporate into their regular, daily routine to help manage ${category}.
    Keep the total response empathetic, encouraging, and between 2 to 4 sentences. Do not use markdown.`;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error("Empty response from AI");
    }

    return NextResponse.json({ aiNote: text, nextDay: journey ? journey.currentDay + 1 : 1 });

  } catch (error) {
    console.error("AI Journey Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
