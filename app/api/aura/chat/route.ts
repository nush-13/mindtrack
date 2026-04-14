import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing. Please add it to your .env file." },
        { status: 500 }
      );
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    let userContext = "";
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { 
          therapyAssessments: { orderBy: { date: "desc" }, take: 1 },
          moods: { orderBy: { date: "desc" }, take: 1 }
        }
      });
      if (user) {
        const name = user.name ? user.name.split(" ")[0] : "there";
        const latestAssessment = user.therapyAssessments[0] ? `Recent anxiety/stress assessment score: ${user.therapyAssessments[0].score}/100 (${user.therapyAssessments[0].severity}).` : "";
        const latestMood = user.moods[0] ? `Latest logged mood: ${user.moods[0].mood} with intensity ${user.moods[0].intensity}/10.` : "";
        
        userContext = `\n\nUser Context:\nYou are speaking to ${name}. ${latestAssessment} ${latestMood} Acknowledge their recent feelings naturally.`;
      }
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro"
    });

    const systemPrompt = `You are Aura AI, your friendly, 24/7 AI mental health assistant in the MindTrack app. 
You are here to help users prep for therapy sessions, vent their anxieties, and reflect on their feelings.
Be highly interactive, empathetic, and casual. Keep your responses short (1-2 sentences). 
Never repeat the exact same text or question twice. Avoid phrases like "How does that make you feel?" instead try to ask specific, engaging follow up questions.
Use grounding techniques if they are stressed, or just joke lightly if they are happy.${userContext}`;

    // Filter out system messages and format for Gemini
    const chatLog = messages
      .filter((msg: any) => msg.sender === "user" || msg.sender === "ai")
      .map((msg: any) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

    if (chatLog.length === 0) {
      return NextResponse.json({ error: "No valid messages found." }, { status: 400 });
    }

    // Extract the very last message to send
    const lastMessage = chatLog[chatLog.length - 1];
    
    // The history is everything except the last message
    let history = chatLog.slice(0, -1);
    
    // Gemini history MUST start with the 'user' role
    if (history.length > 0 && history[0].role === "model") {
      history.shift(); 
    }

    // Inject system prompt manually
    history = [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "Got it! I am Aura, your friendly AI assistant, and I will strictly follow these instructions." }] },
      ...history
    ];

    const chatSession = model.startChat({ history });

    const result = await chatSession.sendMessage(lastMessage.parts[0].text);
    const text = result.response.text();

    return NextResponse.json({ reply: text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error?.message || "An error occurred while communicating with the AI therapist." },
      { status: 500 }
    );
  }
}
