export interface TimeEntry {
  id: number;
  time: string;
  project: string;
  description: string;
  date: string;
  userId: number;
}

export interface Document {
  id: number;
  name: string;
  status: string;
  size: string;
  uploadedAt: string;
  userId: number;
}

export interface Stats {
  projects: { total: number; change: string; changeType: string };
  team: { total: number; change: string; changeType: string };
  events: { total: number; change: string; changeType: string };
  hours: { total: number; change: string; changeType: string };
}

export interface TimeDistribution {
  labels: string[];
  data: number[];
}

export interface ProjectDistribution {
  labels: string[];
  data: number[];
}

export interface StatsResponse {
  stats: Stats;
  timeDistribution: TimeDistribution;
  projectDistribution: ProjectDistribution;
}

export interface TimeEntryCreate {
  time: string;
  project: string;
  description: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
  }[];
}
