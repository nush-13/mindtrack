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

    // Fetch user's recent journals
    const journals = await prisma.journalEntry.findMany({
      where: { user: { email: session.user.email } },
      orderBy: { date: "desc" },
      take: 5,
      select: { date: true, title: true, content: true }
    });

    if (journals.length === 0) {
      return NextResponse.json({
        suggestion: "Your vault is empty. Try using the Gratitude template to kickstart your writing journey!"
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const prompt = `
      You are an expert, empathetic journaling prompt generator. 
      Review these recent journal entries from the user.
      Provide one single, highly personalized writing prompt / suggestion for them today (under 30 words).
      Make it feel warm, insightful, and specifically referencing a recurring theme or emotion they mentioned recently.
      DO NOT quote their text directly, synthesize it. If they talk about stress at work, suggest a prompt about letting go of control, etc.
      Return the plain string directly. Do NOT use quotes.

      Data: ${JSON.stringify(journals)}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    return NextResponse.json({ suggestion: text });

  } catch (error) {
    console.error("AI Journal Suggestion Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, action } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "No content provided" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    let prompt = "";

    if (action === "expand") {
      prompt = `
        As a supportive therapist AI, read the user's current journal text and deeply EXPAND on their thoughts.
        Provide one short, profound paragraph (3-4 sentences max) that validates their feelings and gently challenges them to explore the 'why' behind what they wrote.
        Make it sound extremely empathetic. Do not use robotic intro phrases like "it sounds like".
        Text: "${content}"
      `;
    } else if (action === "summarize") {
      prompt = `
        Read the user's current journal text and summarize the core emotional themes and events into exactly 3 very short, powerful bullet points.
        Format cleanly.
        Text: "${content}"
      `;
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("AI Journal Action Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
