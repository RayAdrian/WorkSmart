"use client";

import { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

interface CheckIn {
  id: string;
  hours: number;
  tag: string;
  activities: string;
  date: string;
  user: string;
  department: string;
}

export default function CheckInSystem() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [timeEntry, setTimeEntry] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<CheckIn | null>(null);

  // Filters
  const [selectedTag, setSelectedTag] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    // Mock data - in real app, this would come from API
    const mockCheckIns: CheckIn[] = [
      {
        id: "1",
        hours: 5.5,
        tag: "project-x",
        activities: "fix login issue and implement user authentication",
        date: "2024-01-15",
        user: "John Doe",
        department: "Engineering",
      },
      {
        id: "2",
        hours: 2.0,
        tag: "procurement",
        activities: "vendor negotiation and contract review",
        date: "2024-01-15",
        user: "Jane Smith",
        department: "Procurement",
      },
      {
        id: "3",
        hours: 3.5,
        tag: "marketing",
        activities: "campaign design and content creation",
        date: "2024-01-15",
        user: "Mike Johnson",
        department: "Marketing",
      },
      {
        id: "4",
        hours: 4.0,
        tag: "project-x",
        activities: "code review and bug fixes",
        date: "2024-01-14",
        user: "Sarah Wilson",
        department: "Engineering",
      },
      {
        id: "5",
        hours: 1.5,
        tag: "hr",
        activities: "interview scheduling and candidate review",
        date: "2024-01-14",
        user: "Lisa Brown",
        department: "HR",
      },
    ];
    setCheckIns(mockCheckIns);
  }, []);

  const parseTimeEntry = (entry: string): Omit<CheckIn, "id"> | null => {
    // Format: <number> [hr | hrs] #<tag> <activities>
    const regex = /^(\d+(?:\.\d+)?)\s*(hr|hrs)\s*#(\w+)\s+(.+)$/i;
    const match = entry.match(regex);

    if (!match) return null;

    return {
      hours: parseFloat(match[1]),
      tag: match[3],
      activities: match[4].trim(),
      date: new Date().toISOString().split("T")[0],
      user: "Current User", // In real app, get from auth
      department: "Engineering", // In real app, get from user profile
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!timeEntry.trim()) return;

    const parsed = parseTimeEntry(timeEntry);
    if (!parsed) {
      alert("Invalid format. Use: <number> hrs #<tag> <activities>");
      return;
    }

    const newCheckIn: CheckIn = {
      id: Date.now().toString(),
      ...parsed,
    };

    setCheckIns((prev) => [newCheckIn, ...prev]);
    setTimeEntry("");
  };

  const handleEdit = (checkIn: CheckIn) => {
    setEditingId(checkIn.id);
    setEditForm({ ...checkIn });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    setCheckIns((prev) =>
      prev.map((item) => (item.id === editForm.id ? editForm : item))
    );
    setEditingId(null);
    setEditForm(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this check-in?")) {
      setCheckIns((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  // Filter check-ins
  const filteredCheckIns = checkIns.filter((checkIn) => {
    const matchesTag = selectedTag === "all" || checkIn.tag === selectedTag;
    const matchesDate = selectedDate === "all" || checkIn.date === selectedDate;
    const matchesSearch =
      searchQuery === "" ||
      checkIn.activities.toLowerCase().includes(searchQuery.toLowerCase()) ||
      checkIn.tag.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTag && matchesDate && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCheckIns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCheckIns = filteredCheckIns.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Get unique values for filters
  const tags = [...new Set(checkIns.map((c) => c.tag))];
  const dates = [...new Set(checkIns.map((c) => c.date))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Check-in System</h1>
        <p className="text-gray-600 mt-2">
          Track your daily work activities and time spent on tasks
        </p>
      </div>

      {/* Time Entry Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Add Time Entry
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Entry Format:{" "}
              <span className="text-gray-500">
                &quot;5.5 hrs #project-x fix login issue&quot;
              </span>
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={timeEntry}
                onChange={(e) => setTimeEntry(e.target.value)}
                placeholder="e.g., 2.5 hrs #procurement vendor meeting"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Entry
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <FunnelIcon className="h-5 w-5 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search activities or tags..."
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tag Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tag
            </label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Tags</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  #{tag}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Dates</option>
              {dates.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Check-ins List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Check-ins ({filteredCheckIns.length})
            </h2>
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1}-
              {Math.min(startIndex + itemsPerPage, filteredCheckIns.length)} of{" "}
              {filteredCheckIns.length}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tag
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activities
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedCheckIns.map((checkIn) => (
                <tr key={checkIn.id} className="hover:bg-gray-50">
                  {editingId === checkIn.id ? (
                    // Edit Form
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          step="0.5"
                          value={editForm?.hours || 0}
                          onChange={(e) =>
                            setEditForm((prev) =>
                              prev
                                ? { ...prev, hours: parseFloat(e.target.value) }
                                : null
                            )
                          }
                          className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={editForm?.tag || ""}
                          onChange={(e) =>
                            setEditForm((prev) =>
                              prev ? { ...prev, tag: e.target.value } : null
                            )
                          }
                          className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editForm?.activities || ""}
                          onChange={(e) =>
                            setEditForm((prev) =>
                              prev
                                ? { ...prev, activities: e.target.value }
                                : null
                            )
                          }
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="date"
                          value={editForm?.date || ""}
                          onChange={(e) =>
                            setEditForm((prev) =>
                              prev ? { ...prev, date: e.target.value } : null
                            )
                          }
                          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {checkIn.user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {checkIn.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={handleUpdate}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    // Display Mode
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {checkIn.hours} hrs
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          #{checkIn.tag}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {checkIn.activities}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {checkIn.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {checkIn.user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {checkIn.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(checkIn)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(checkIn.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
