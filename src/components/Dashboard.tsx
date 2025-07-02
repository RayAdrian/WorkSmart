/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  ClockIcon,
  DocumentIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CheckIn {
  id: number;
  userId: number;
  hours: number;
  tag: string;
  activities: string;
  date: string;
  department: string;
  user?: { username: string };
}

interface DashboardStats {
  totalHours: number;
  totalDocuments: number;
  activeUsers: number;
  productivityScore: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalHours: 0,
    totalDocuments: 0,
    activeUsers: 0,
    productivityScore: 0,
  });
  const [recentCheckIns, setRecentCheckIns] = useState<CheckIn[]>([]);
  const [timeChartData, setTimeChartData] = useState<any>(null);
  const [tagChartData, setTagChartData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats({
          totalHours: data.totalHours,
          totalDocuments: data.totalDocuments,
          activeUsers: data.activeUsers,
          productivityScore: data.productivityScore,
        });
        // --- Charts ---
        const checkIns: CheckIn[] = data.checkIns;
        // Line chart: hours per day (last 7 days)
        const days: string[] = [];
        const hoursPerDay: number[] = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const label = d.toLocaleDateString(undefined, { weekday: "short" });
          days.push(label);
          const dayStr = d.toISOString().split("T")[0];
          const total = checkIns
            .filter((c) => c.date.startsWith(dayStr))
            .reduce((sum, c) => sum + c.hours, 0);
          hoursPerDay.push(total);
        }
        setTimeChartData({
          labels: days,
          datasets: [
            {
              label: "Hours Logged",
              data: hoursPerDay,
              borderColor: "rgb(59, 130, 246)",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              tension: 0.4,
            },
          ],
        });
        // Bar chart: hours by tag (top 5 tags)
        const tagTotals: Record<string, number> = {};
        for (const c of checkIns) {
          tagTotals[c.tag] = (tagTotals[c.tag] || 0) + c.hours;
        }
        const sortedTags = Object.entries(tagTotals)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);
        setTagChartData({
          labels: sortedTags.map(([tag]) => tag),
          datasets: [
            {
              label: "Hours by Tag",
              data: sortedTags.map(([, hours]) => hours),
              backgroundColor: [
                "rgba(59, 130, 246, 0.8)",
                "rgba(16, 185, 129, 0.8)",
                "rgba(245, 158, 11, 0.8)",
                "rgba(239, 68, 68, 0.8)",
                "rgba(139, 92, 246, 0.8)",
              ],
            },
          ],
        });
      });
    fetch("/api/checkins")
      .then((res) => res.json())
      .then((checkIns: CheckIn[]) => {
        if (Array.isArray(checkIns)) {
          const sorted = [...checkIns].sort((a, b) =>
            b.date.localeCompare(a.date)
          );
          setRecentCheckIns(sorted.slice(0, 3));
        } else {
          setRecentCheckIns([]);
        }
      });
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome to Meridian Time Management System
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalHours}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DocumentIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Documents</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalDocuments}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.activeUsers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ArrowTrendingUpIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Productivity</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.productivityScore}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Weekly Time Tracking
          </h3>
          {timeChartData && (
            <Line data={timeChartData} options={chartOptions} />
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Hours by Tag
          </h3>
          {tagChartData && <Bar data={tagChartData} options={chartOptions} />}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Check-ins
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentCheckIns.map((checkIn) => (
              <div
                key={checkIn.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ClockIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {checkIn.hours} hrs
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        #{checkIn.tag}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {checkIn.activities}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {checkIn.date}
                      </span>
                      <span>{checkIn.user?.username}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
