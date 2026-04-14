import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();
    const { email, name, password, age } = body;

    if (!email || !name || !password) {
      return new NextResponse("Missing info", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        age: age ? parseInt(age) : null,
      }
    });

    return NextResponse.json(user);
  } catch (error: any) {
    if (error.code === "P2002") {
        return new NextResponse("Email already exists", { status: 400 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
