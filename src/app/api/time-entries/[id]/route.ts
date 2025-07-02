import { NextResponse } from "next/server";

// Mock database - in a real app, this would be in a separate file
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = parseInt((await params).id);
  const body = await request.json();
  const entryIndex = timeEntries.findIndex((entry) => entry.id === id);

  if (entryIndex === -1) {
    return NextResponse.json(
      { error: "Time entry not found" },
      { status: 404 }
    );
  }

  timeEntries[entryIndex] = {
    ...timeEntries[entryIndex],
    ...body,
  };

  return NextResponse.json(timeEntries[entryIndex]);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = parseInt((await params).id);
  const entryIndex = timeEntries.findIndex((entry) => entry.id === id);

  if (entryIndex === -1) {
    return NextResponse.json(
      { error: "Time entry not found" },
      { status: 404 }
    );
  }

  timeEntries = timeEntries.filter((entry) => entry.id !== id);
  return NextResponse.json({ success: true });
}
