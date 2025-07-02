import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import path from "path";
import { promises as fs } from "fs";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = Number((await params).id);
  const data = await req.json();
  const document = await prisma.document.update({ where: { id }, data });
  return NextResponse.json(document);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = Number((await params).id);
  const document = await prisma.document.delete({ where: { id } });
  return NextResponse.json(document);
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = Number((await params).id);
  const document = await prisma.document.findUnique({ where: { id } });
  if (!document) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const filePath = document.filePath;
  const absPath = path.join(process.cwd(), "public", filePath);
  try {
    const fileBuffer = await fs.readFile(absPath);
    const fileName = path.basename(filePath);
    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename=\"${fileName}\"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = Number((await params).id);
  const { status, checkInId } = await req.json();
  const data: Record<string, unknown> = {};
  if (status) data.status = status;
  if (typeof checkInId !== "undefined") data.checkInId = checkInId;
  const document = await prisma.document.update({ where: { id }, data });
  return NextResponse.json(document);
}
