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

    const habits = await prisma.habit.findMany({
      where: { user: { email: session.user.email } },
      orderBy: { createdAt: "asc" },
    });

    // Reset daily status logic
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const updatedHabits = await Promise.all(
      habits.map(async (habit) => {
        if (habit.lastCompleted && habit.lastCompleted < today && habit.completedToday) {
          return await prisma.habit.update({
             where: { id: habit.id },
             data: { completedToday: false }
          });
        }
        return habit;
      })
    );

    return NextResponse.json(updatedHabits);
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

    const { name } = await request.json();

    const habit = await prisma.habit.create({
      data: {
        name,
        user: { connect: { email: session.user.email } },
      },
    });

    return NextResponse.json(habit);
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, completedToday, streak } = await request.json();

    const habit = await prisma.habit.update({
      where: { id },
      data: {
        completedToday,
        streak,
        lastCompleted: completedToday ? new Date() : undefined,
      },
    });

    return NextResponse.json(habit);
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
