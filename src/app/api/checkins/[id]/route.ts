import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number((await context.params).id);
  const checkIn = await prisma.checkIn.findUnique({ where: { id } });
  if (!checkIn)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (checkIn.userId !== user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const data = await req.json();
  const updated = await prisma.checkIn.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number((await context.params).id);
  const checkIn = await prisma.checkIn.findUnique({ where: { id } });
  if (!checkIn)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (checkIn.userId !== user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const deleted = await prisma.checkIn.delete({ where: { id } });
  return NextResponse.json(deleted);
}
