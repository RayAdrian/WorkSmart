import { NextResponse } from "next/server";

// Mock database
const documents = [
  {
    id: 1,
    name: "Q1 Report.pdf",
    status: "approved",
    size: "2.4 MB",
    uploadedAt: "2024-03-20",
    userId: 1,
  },
  {
    id: 2,
    name: "Project Plan.docx",
    status: "in review",
    size: "1.8 MB",
    uploadedAt: "2024-03-19",
    userId: 1,
  },
  {
    id: 3,
    name: "Meeting Notes.pdf",
    status: "pending",
    size: "0.5 MB",
    uploadedAt: "2024-03-18",
    userId: 1,
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const userId = searchParams.get("userId");

  let filteredDocs = [...documents];

  if (status && status !== "all") {
    filteredDocs = filteredDocs.filter((doc) => doc.status === status);
  }

  if (userId && userId !== "all") {
    filteredDocs = filteredDocs.filter(
      (doc) => doc.userId === parseInt(userId)
    );
  }

  return NextResponse.json(filteredDocs);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newDoc = {
    id: documents.length + 1,
    ...body,
    status: "pending",
    uploadedAt: new Date().toISOString().split("T")[0],
    userId: 1, // Mock user ID
  };

  documents.unshift(newDoc);
  return NextResponse.json(newDoc, { status: 201 });
}
