import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { username, email, password } = await req.json();
  if (!username || !email || !password) {
    return NextResponse.json(
      { error: "Missing username, email, or password" },
      { status: 400 }
    );
  }
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });
  if (existingUser) {
    if (existingUser.username === username) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }
    if (existingUser.email === email) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, email, password: hashed },
  });
  // Log in the user by setting JWT cookie
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
  const res = NextResponse.json(
    { id: user.id, username: user.username, email: user.email },
    { status: 201 }
  );
  res.cookies.set("auth", token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}
