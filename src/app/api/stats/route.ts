import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const checkIns = await prisma.checkIn.findMany({ include: { user: true } });
  const documents = await prisma.document.findMany({ include: { user: true } });

  const totalHours = checkIns.reduce(
    (sum: number, c: { hours: number }) => sum + c.hours,
    0
  );
  const totalDocuments = documents.length;
  const userIds = new Set(checkIns.map((c: { userId: number }) => c.userId));
  const activeUsers = userIds.size;
  const productivityScore =
    activeUsers > 0
      ? Math.round((totalHours * totalDocuments) / activeUsers)
      : 0;

  return NextResponse.json({
    totalHours,
    totalDocuments,
    activeUsers,
    productivityScore,
    checkIns,
    documents,
  });
}
