import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user.id;

    // 1. Avg Mood Score
    const recentMoods = await prisma.mood.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 30, // Last 30 moods
    });
    
    // Scale 1-10 intensity to 10-100 score
    const totalIntensity = recentMoods.reduce((sum, mood) => sum + mood.intensity, 0);
    const avgMoodInput = recentMoods.length > 0 ? (totalIntensity / recentMoods.length) : 0;
    const avgMood = avgMoodInput > 0 ? Math.round(avgMoodInput * 10) : 0; // if average is 7.4 -> 74

    // 2. Journal Count
    const journalCount = await prisma.journalEntry.count({
      where: { userId },
    });

    // 3. Therapy Sessions (Total Assessments)
    const therapySessions = await prisma.therapyAssessment.count({
      where: { userId },
    });
    const totalSessions = therapySessions;

    // 4. Meditation Minutes (from new table, default 0 if empty)
    const meditations = await (prisma as any).meditationSession.findMany({
      where: { userId },
    });
    const medMinutes = meditations.reduce((sum: number, s: any) => sum + s.durationMinutes, 0);

    // 5. DNA Calculation
    // Use last assessment severity to determine Stress Level
    const lastAssessment = await prisma.therapyAssessment.findFirst({
      where: { userId },
      orderBy: { date: "desc" }
    });

    let stressLevel = "Low";
    let stressPct = 20;

    if (lastAssessment) {
      const score = lastAssessment.score;
      if (score >= 15) {
        stressLevel = "High ⚠️";
        stressPct = 85;
      } else if (score >= 10) {
        stressLevel = "Medium";
        stressPct = 50;
      }
    } else {
      // Uncalculated fallback
      stressLevel = "Medium";
      stressPct = 40;
    }

    // Stability based on mood variance - simple heuristic
    // Social logic mock for now
    
    const dna = {
      stress: stressLevel,
      stressPct: stressPct,
      stability: "Medium",
      stabilityPct: 60,
      social: "Low",
      socialPct: 25
    };

    // Streak calculation (Consecutive days of moods)
    const calculateStreak = (items: any[]) => {
      let exactStreak = 0;
      if (items.length > 0) {
        const dates = [...new Set(items.map(m => new Date(m.date || m.completedAt || m.createdAt).toISOString().split('T')[0]))];
        const today = new Date().toISOString().split('T')[0];
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterday = yesterdayDate.toISOString().split('T')[0];

        let checkDate: Date | null = null;
        if (dates.includes(today)) {
          checkDate = new Date();
        } else if (dates.includes(yesterday)) {
          checkDate = yesterdayDate;
        }

        if (checkDate) {
          exactStreak = 1;
          let pDate = new Date(checkDate);
          while (true) {
            pDate.setDate(pDate.getDate() - 1);
            const pDateStr = pDate.toISOString().split('T')[0];
            if (dates.includes(pDateStr)) {
              exactStreak++;
            } else {
              break;
            }
          }
        }
      }
      return exactStreak;
    };

    const allJournals = await prisma.journalEntry.findMany({ where: { userId }, orderBy: { date: "desc" }});
    const allMeditations = await (prisma as any).meditationSession.findMany({ where: { userId }, orderBy: { completedAt: "desc" }});

    return NextResponse.json({
      avgMood: avgMood || 0,
      journalCount,
      meditationMinutes: medMinutes || 0,
      meditationCount: allMeditations.length,
      sessions: totalSessions,
      streak: calculateStreak(recentMoods),
      journalStreak: calculateStreak(allJournals),
      meditationStreak: calculateStreak(allMeditations),
      xp: user.xp,
      level: user.level,
      dna
    });

  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
