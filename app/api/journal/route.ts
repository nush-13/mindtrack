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

    const entries = await prisma.journalEntry.findMany({
      where: { user: { email: session.user.email } },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(entries);
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

    const { title, content } = await request.json();

    let sentimentScore = 0;
    if (content) {
      const result = sentiment.analyze(content);
      sentimentScore = result.score;
    }

    const entry = await prisma.journalEntry.create({
      data: {
        title,
        content,
        sentimentScore,
        user: { connect: { email: session.user.email } },
      },
    });

    const xpGained = 20;

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
       entry, 
       xpGained, 
       totalXp: user.xp, 
       level: newLevel,
       leveledUp: newLevel > user.level
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
