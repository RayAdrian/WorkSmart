import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // For security, do not reveal if email exists
    return NextResponse.json({
      message: "If that email exists, a reset link has been sent.",
    });
  }
  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: token, resetTokenExpiry: expiry },
  });
  // In a real app, send email. For demo, return token in response.
  return NextResponse.json({ message: "Reset link generated", token });
}
