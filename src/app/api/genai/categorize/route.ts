import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { description } = await req.json();
  // Simple mock: keyword-based
  let tag = "general";
  if (description) {
    if (/meeting|call|sync/i.test(description)) tag = "meeting";
    else if (/procure|purchase|order|vendor/i.test(description))
      tag = "procurement";
    else if (/report|analysis|review/i.test(description)) tag = "reporting";
    else if (/design|ui|ux/i.test(description)) tag = "design";
    else if (/code|dev|bug|feature/i.test(description)) tag = "development";
  }
  return NextResponse.json({ tag });
}
