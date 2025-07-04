import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Parse query parameters
  const url = new URL(req.url);
  const mine = url.searchParams.get("mine");

  // If mine=1, return only current user's check-ins
  if (mine === "1") {
    const checkIns = await prisma.checkIn.findMany({
      where: { userId: user.id },
      include: { user: true },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(checkIns);
  }

  // Otherwise, return all check-ins (global)
  const checkIns = await prisma.checkIn.findMany({
    include: { user: true },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(checkIns);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { hours, tag, activities, date, department } = await req.json();
  if (!hours || !tag || !activities || !date || !department) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const checkIn = await prisma.checkIn.create({
    data: {
      userId: user.id,
      hours,
      tag,
      activities,
      date: new Date(date),
      department,
    },
  });
  return NextResponse.json(checkIn, { status: 201 });
}
