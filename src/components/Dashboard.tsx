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

interface DashboardStats {
  totalHours: number;
  totalDocuments: number;
  activeUsers: number;
  productivityScore: number;
}

interface RecentCheckIn {
  id: string;
  hours: number;
  tag: string;
  activities: string;
  date: string;
  user: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalHours: 0,
    totalDocuments: 0,
    activeUsers: 0,
    productivityScore: 0,
  });

  const [recentCheckIns, setRecentCheckIns] = useState<RecentCheckIn[]>([]);

  useEffect(() => {
    // Mock data - in real app, this would come from API
    setStats({
      totalHours: 1247.5,
      totalDocuments: 89,
      activeUsers: 67,
      productivityScore: 87,
    });

    setRecentCheckIns([
      {
        id: "1",
        hours: 5.5,
        tag: "project-x",
        activities: "fix login issue and implement user authentication",
        date: "2024-01-15",
        user: "John Doe",
      },
      {
        id: "2",
        hours: 2.0,
        tag: "procurement",
        activities: "vendor negotiation and contract review",
        date: "2024-01-15",
        user: "Jane Smith",
      },
      {
        id: "3",
        hours: 3.5,
        tag: "marketing",
        activities: "campaign design and content creation",
        date: "2024-01-15",
        user: "Mike Johnson",
      },
    ]);
  }, []);

  const timeChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Hours Logged",
        data: [8.5, 7.2, 9.1, 6.8, 8.9, 4.2, 2.1],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const tagChartData = {
    labels: ["Project-X", "Procurement", "Marketing", "HR", "Finance"],
    datasets: [
      {
        label: "Hours by Tag",
        data: [45, 32, 28, 15, 12],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(139, 92, 246, 0.8)",
        ],
      },
    ],
  };

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
          <Line data={timeChartData} options={chartOptions} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Hours by Tag
          </h3>
          <Bar data={tagChartData} options={chartOptions} />
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
                      <span>{checkIn.user}</span>
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
