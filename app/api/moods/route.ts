import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Sentiment from "sentiment";

const sentiment = new Sentiment();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const moods = await prisma.mood.findMany({
      where: { user: { email: session.user.email } },
      orderBy: { date: "desc" },
      take: 30,
    });

    return NextResponse.json(moods.reverse());
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { mood, intensity, note } = await request.json();

    let sentimentScore = 0;
    if (note) {
      const result = sentiment.analyze(note);
      sentimentScore = result.score;
    }

    const newMood = await prisma.mood.create({
      data: {
        mood,
        intensity,
        note,
        sentimentScore,
        user: { connect: { email: session.user.email } },
      },
    });

    const xpGained = 50;

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        xp: { increment: xpGained }
      }
    });

    // Level up logic (e.g. 100 XP per level)
    let newLevel = user.level;
    const nextLevelXp = user.level * 100;
    if (user.xp >= nextLevelXp) {
      newLevel = user.level + 1;
      await prisma.user.update({
        where: { email: session.user.email },
        data: { level: newLevel }
      });
    }

    return NextResponse.json({
      mood: newMood,
      xpGained,
      totalXp: user.xp,
      level: newLevel,
      leveledUp: newLevel > user.level
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
