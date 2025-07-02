import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { documentId } = await req.json();
  // Mocked suggestion logic
  let suggestion = "Review document details.";
  if (documentId % 3 === 0) suggestion = "Send for approval.";
  else if (documentId % 3 === 1) suggestion = "Request missing signature.";
  else if (documentId % 3 === 2) suggestion = "Archive document.";
  return NextResponse.json({ suggestion });
}
