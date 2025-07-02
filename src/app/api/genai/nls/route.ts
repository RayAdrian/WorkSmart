/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

const mockDocuments = [
  {
    id: 1,
    type: "purchase-order",
    status: "approved",
    createdAt: "2024-06-15",
    user: { username: "alice" },
    filePath: "/uploads/po1.pdf",
  },
  {
    id: 2,
    type: "quote",
    status: "pending",
    createdAt: "2024-07-01",
    user: { username: "bob" },
    filePath: "/uploads/quote1.pdf",
  },
  {
    id: 3,
    type: "purchase-order",
    status: "approved",
    createdAt: "2024-06-20",
    user: { username: "carol" },
    filePath: "/uploads/po2.pdf",
  },
];

const mockCheckins = [
  {
    id: 1,
    tag: "meeting",
    activities: "Project kickoff",
    date: "2024-07-01",
    hours: 2,
    user: { username: "alice" },
  },
  {
    id: 2,
    tag: "procurement",
    activities: "Vendor call",
    date: "2024-06-15",
    hours: 1.5,
    user: { username: "bob" },
  },
];

export async function POST(req: Request) {
  const { query, context } = await req.json();
  let results: any[] = [];
  if (context === "documents") {
    results = mockDocuments.filter((doc) => {
      if (/approved/i.test(query) && doc.status !== "approved") return false;
      if (/purchase order/i.test(query) && doc.type !== "purchase-order")
        return false;
      if (/quote/i.test(query) && doc.type !== "quote") return false;
      if (/last month/i.test(query)) {
        // Only June 2024 in mock
        return doc.createdAt.startsWith("2024-06");
      }
      return true;
    });
  } else if (context === "checkins") {
    results = mockCheckins.filter((ci) => {
      if (/meeting/i.test(query) && ci.tag !== "meeting") return false;
      if (/procurement/i.test(query) && ci.tag !== "procurement") return false;
      return true;
    });
  }
  return NextResponse.json({ results });
}
