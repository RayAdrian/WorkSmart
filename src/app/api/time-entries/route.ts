import { NextResponse } from "next/server";

// Mock database
let timeEntries = [
  {
    id: 1,
    time: "2 hrs",
    project: "Project X",
    description: "Writing report",
    date: "2024-03-20",
    userId: 1,
  },
  {
    id: 2,
    time: "1.5 hrs",
    project: "Project Y",
    description: "Code review",
    date: "2024-03-19",
    userId: 1,
  },
  {
    id: 3,
    time: "3 hrs",
    project: "Project Z",
    description: "Team meeting",
    date: "2024-03-18",
    userId: 1,
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag");
  const date = searchParams.get("date");
  const userId = searchParams.get("userId");

  let filteredEntries = [...timeEntries];

  if (tag && tag !== "all") {
    filteredEntries = filteredEntries.filter((entry) =>
      entry.project.toLowerCase().includes(tag.toLowerCase())
    );
  }

  if (date && date !== "all") {
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    filteredEntries = filteredEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      switch (date) {
        case "today":
          return entryDate.toDateString() === new Date().toDateString();
        case "week":
          return entryDate >= startOfWeek;
        case "month":
          return entryDate >= startOfMonth;
        default:
          return true;
      }
    });
  }

  if (userId && userId !== "all") {
    filteredEntries = filteredEntries.filter(
      (entry) => entry.userId === parseInt(userId)
    );
  }

  return NextResponse.json(filteredEntries);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newEntry = {
    id: timeEntries.length + 1,
    ...body,
    date: new Date().toISOString().split("T")[0],
    userId: 1, // Mock user ID
  };

  timeEntries.unshift(newEntry);
  return NextResponse.json(newEntry, { status: 201 });
}
