import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET() {
  // Return all documents, with user and check-in info
  const documents = await prisma.document.findMany({
    include: { user: true, checkIn: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(documents);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  const fileName = Date.now() + "_" + file.name;
  const filePath = path.join(uploadsDir, fileName);
  await fs.writeFile(filePath, buffer);

  const type = formData.get("type")?.toString() || "other";
  const status = formData.get("status")?.toString() || "pending";
  const checkInIdRaw = formData.get("checkInId");
  const checkInId = checkInIdRaw
    ? parseInt(checkInIdRaw.toString())
    : undefined;

  const document = await prisma.document.create({
    data: {
      userId: user.id,
      filePath: `/uploads/${fileName}`,
      url: null,
      type,
      status,
      checkInId,
    },
  });
  return NextResponse.json(document, { status: 201 });
}
