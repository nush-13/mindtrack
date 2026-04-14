import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

// GET: Check if the user has a journal PIN setup
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { journalPin: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ hasPin: !!user.journalPin });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user context" }, { status: 500 });
  }
}

// POST: Verify a PIN
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { pin } = body;

    if (!pin) {
      return NextResponse.json({ error: "PIN is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { journalPin: true }
    });

    if (!user || !user.journalPin) {
      return NextResponse.json({ error: "No PIN setup yet" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(pin, user.journalPin);
    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect PIN" }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: "Vault unlocked" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to verify PIN" }, { status: 500 });
  }
}

// PUT: Create/Change a PIN
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { pin } = body;

    // PIN validation
    if (!pin || typeof pin !== 'string' || pin.length !== 4) {
      return NextResponse.json({ error: "Invalid PIN format" }, { status: 400 });
    }

    const hashedPin = await bcrypt.hash(pin, 10);

    await prisma.user.update({
      where: { email: session.user.email },
      data: { journalPin: hashedPin }
    });

    return NextResponse.json({ success: true, message: "PIN securely created" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save PIN" }, { status: 500 });
  }
}
