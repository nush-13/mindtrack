import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const body = await req.json();
    const { score, severity, answers } = body;

    const assessment = await prisma.therapyAssessment.create({
      data: {
        userId: user.id,
        score,
        severity,
        answers: JSON.stringify(answers),
      },
    });

    return NextResponse.json(assessment, { status: 201 });
  } catch (error) {
    console.error("[THERAPY_ASSESSMENT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const assessments = await prisma.therapyAssessment.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(assessments);
  } catch (error) {
    console.error("[THERAPY_ASSESSMENT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
