import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { documentId } = await req.json();
  // Mocked extracted info
  const extractedInfo = {
    vendor: "Acme Corp.",
    amount: "$1,250.00",
    date: "2024-07-01",
    poNumber: `PO-${documentId || "12345"}`,
    items: [
      { name: "Widget A", qty: 10, price: "$50.00" },
      { name: "Widget B", qty: 5, price: "$100.00" },
    ],
  };
  return NextResponse.json({ extractedInfo });
}
