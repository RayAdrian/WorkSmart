import { NextResponse } from "next/server";

// Mock database
const stats = {
  projects: {
    total: 12,
    change: "+2.5%",
    changeType: "positive",
  },
  team: {
    total: 24,
    change: "+1",
    changeType: "positive",
  },
  events: {
    total: 8,
    change: "-2",
    changeType: "negative",
  },
  hours: {
    total: 1234,
    change: "+12%",
    changeType: "positive",
  },
};

const timeDistribution = {
  labels: ["Project X", "Project Y", "Project Z", "Meetings", "Research"],
  data: [12, 19, 8, 5, 7],
};

const projectDistribution = {
  labels: ["Development", "Design", "Planning", "Review", "Documentation"],
  data: [30, 25, 20, 15, 10],
};

export async function GET() {
  return NextResponse.json({
    stats,
    timeDistribution,
    projectDistribution,
  });
}
