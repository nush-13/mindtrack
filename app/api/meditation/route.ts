import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entries = await (prisma as any).meditationSession.findMany({
      where: { user: { email: session.user.email } },
      orderBy: { completedAt: "desc" },
      take: 5,
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

    const { durationMinutes } = await request.json();

    const newSession = await (prisma as any).meditationSession.create({
      data: {
        durationMinutes,
        user: { connect: { email: session.user.email } },
      },
    });

    // 10 XP per minute, minimum 10 XP
    const xpGained = Math.max(10, durationMinutes * 10);

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
      meditation: newSession,
      xpGained,
      totalXp: user.xp,
      level: newLevel,
      leveledUp: newLevel > user.level
    });
  } catch (error) {
    console.error("Meditation POST Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
