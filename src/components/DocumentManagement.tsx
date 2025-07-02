"use client";

import { useState, useEffect } from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon as ClockIconSolid,
} from "@heroicons/react/24/outline";

interface Document {
  id: number;
  userId: number;
  filePath: string;
  type: string;
  status: string;
  createdAt: string;
  user?: { username: string };
  checkInId?: number;
  checkIn?: { id: number; tag: string; date: string; userId: number };
}

interface CheckIn {
  id: number;
  tag: string;
  date: string;
  userId: number;
  user?: { username: string };
}

export default function DocumentManagement() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState("purchase-order");
  const [uploadStatus, setUploadStatus] = useState("pending");
  const [uploadCheckInId, setUploadCheckInId] = useState<number | "">("");
  const [uploading, setUploading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState<number | null>(null);

  // Filters
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [analyzingId, setAnalyzingId] = useState<number | null>(null);
  const [analysisResult, setAnalysisResult] = useState<
    Record<number, Record<string, unknown>>
  >({});
  const [suggestingId, setSuggestingId] = useState<number | null>(null);
  const [suggestionResult, setSuggestionResult] = useState<
    Record<number, string | null>
  >({});

  const [nlsQuery, setNlsQuery] = useState("");
  const [nlsResults, setNlsResults] = useState<Document[] | null>(null);
  const [nlsLoading, setNlsLoading] = useState(false);
  const [nlsActive, setNlsActive] = useState(false);

  useEffect(() => {
    fetch("/api/documents")
      .then((res) => res.json())
      .then((data) => setDocuments(data));
    fetch("/api/checkins")
      .then((res) => res.json())
      .then((data) => setCheckIns(data));
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("type", uploadType);
    formData.append("status", uploadStatus);
    if (uploadCheckInId) formData.append("checkInId", String(uploadCheckInId));
    const res = await fetch("/api/documents", {
      method: "POST",
      body: formData,
    });
    setUploading(false);
    if (res.ok) {
      const newDoc = await res.json();
      setDocuments((prev) => [newDoc, ...prev]);
      setSelectedFile(null);
      setUploadType("purchase-order");
      setUploadStatus("pending");
      setUploadCheckInId("");
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    setStatusUpdating(id);
    const res = await fetch(`/api/documents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setStatusUpdating(null);
    if (res.ok) {
      const updated = await res.json();
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === id ? updated : doc))
      );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "in-review":
        return <ClockIconSolid className="h-5 w-5 text-yellow-500" />;
      case "rejected":
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "in-review":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter documents
  const filteredDocuments = documents.filter((document) => {
    const matchesStatus =
      selectedStatus === "all" || document.status === selectedStatus;
    const matchesType =
      selectedType === "all" || document.type === selectedType;
    const matchesSearch =
      searchQuery === "" ||
      document.filePath.toLowerCase().includes(searchQuery.toLowerCase()) ||
      document.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  // Get unique values for filters
  const statuses = ["pending", "in-review", "approved", "rejected"];
  const types = [
    "purchase-order",
    "quote",
    "requisition",
    "contract",
    ...Array.from(new Set(documents.map((d) => d.type))).filter(
      (t) => !["purchase-order", "quote", "requisition", "contract"].includes(t)
    ),
  ];

  const handleAnalyze = async (docId: number) => {
    setAnalyzingId(docId);
    setAnalysisResult((prev) => {
      const newResult = { ...prev };
      delete newResult[docId];
      return newResult;
    });
    const res = await fetch("/api/genai/analyze-document", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId: docId }),
    });
    setAnalyzingId(null);
    if (res.ok) {
      const data = await res.json();
      setAnalysisResult((prev) => ({ ...prev, [docId]: data.extractedInfo }));
    }
  };

  const handleSuggest = async (docId: number) => {
    setSuggestingId(docId);
    setSuggestionResult((prev) => {
      const newResult = { ...prev };
      delete newResult[docId];
      return newResult;
    });
    const res = await fetch("/api/genai/suggest-workflow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId: docId }),
    });
    setSuggestingId(null);
    if (res.ok) {
      const data = await res.json();
      setSuggestionResult((prev) => ({ ...prev, [docId]: data.suggestion }));
    }
  };

  const handleNlsSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlsQuery.trim()) return;
    setNlsLoading(true);
    setNlsActive(true);
    const res = await fetch("/api/genai/nls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: nlsQuery, context: "documents" }),
    });
    setNlsLoading(false);
    if (res.ok) {
      const data = await res.json();
      setNlsResults(data.results);
    }
  };

  const handleClearNls = () => {
    setNlsQuery("");
    setNlsResults(null);
    setNlsActive(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Document Management
        </h1>
        <p className="text-gray-600 mt-2">
          Upload and manage procurement documents with time tracking integration
        </p>
      </div>

      {/* NLS Search Bar */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center gap-4">
        <form onSubmit={handleNlsSearch} className="flex-1 flex gap-3">
          <input
            type="text"
            value={nlsQuery}
            onChange={(e) => setNlsQuery(e.target.value)}
            placeholder="Ask in natural language, e.g. 'show all approved purchase orders from last month'"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black placeholder-gray-400 px-3 py-2"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
            disabled={nlsLoading}
          >
            {nlsLoading ? "Searching..." : "Search"}
          </button>
        </form>
        {nlsActive && (
          <button
            onClick={handleClearNls}
            className="text-sm text-gray-600 hover:underline mt-2 md:mt-0"
          >
            Clear NLS Filter
          </button>
        )}
      </div>

      {/* Upload Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Upload Document
        </h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select File
              </label>
              <input
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.docx,.doc,.xlsx,.xls"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black placeholder-gray-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                required
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={uploadStatus}
                onChange={(e) => setUploadStatus(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                required
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link to Check-in (optional)
              </label>
              <select
                value={uploadCheckInId}
                onChange={(e) =>
                  setUploadCheckInId(
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
              >
                <option value="">None</option>
                {checkIns.map((ci) => (
                  <option key={ci.id} value={ci.id}>
                    #{ci.tag} ({ci.date}){" "}
                    {ci.user?.username ? `by ${ci.user.username}` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={uploading}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <FunnelIcon className="h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search file name or type..."
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black placeholder-gray-400"
              />
            </div>
          </div>
          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
            >
              <option value="all">All Types</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
            >
              <option value="all">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Document Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Documents (
            {nlsActive
              ? nlsResults
                ? nlsResults.length
                : 0
              : filteredDocuments.length}
            )
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploader
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Linked Check-in
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(nlsActive ? nlsResults || [] : filteredDocuments).length ===
                0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    {nlsLoading ? "Searching..." : "No results found."}
                  </td>
                </tr>
              )}
              {(nlsActive ? nlsResults || [] : filteredDocuments).map((doc) => (
                <>
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {doc.filePath.split("/").pop()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {doc.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          doc.status
                        )}`}
                      >
                        {getStatusIcon(doc.status)}
                        <span className="ml-1">
                          <select
                            value={doc.status}
                            onChange={(e) =>
                              handleStatusChange(doc.id, e.target.value)
                            }
                            className="bg-transparent border-none focus:ring-0 focus:outline-none text-xs font-medium text-black"
                            disabled={statusUpdating === doc.id}
                          >
                            {statuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {doc.user?.username || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {doc.checkIn
                        ? `#${doc.checkIn.tag} (${doc.checkIn.date})`
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(doc.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a
                        href={`/api/documents/${doc.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        download
                      >
                        Download
                      </a>
                      <button
                        className="text-purple-600 hover:underline mr-2"
                        onClick={() => handleAnalyze(doc.id)}
                        disabled={analyzingId === doc.id}
                      >
                        {analyzingId === doc.id ? "Analyzing..." : "Analyze"}
                      </button>
                      <button
                        className="text-green-600 hover:underline"
                        onClick={() => handleSuggest(doc.id)}
                        disabled={suggestingId === doc.id}
                      >
                        {suggestingId === doc.id
                          ? "Suggesting..."
                          : "Suggest Next Step"}
                      </button>
                    </td>
                  </tr>
                  {/* Inline analysis/suggestion results */}
                  {(analysisResult[doc.id] || suggestionResult[doc.id]) && (
                    <tr key={doc.id + "-genai"}>
                      <td
                        colSpan={7}
                        className="bg-gray-50 px-6 py-4 text-sm text-gray-700"
                      >
                        {analysisResult[doc.id] && (
                          <div className="mb-2">
                            <strong>Extracted Info:</strong>
                            <ul className="list-disc ml-6">
                              {Object.entries(analysisResult[doc.id]).map(
                                ([key, value]) =>
                                  Array.isArray(value) ? (
                                    <li key={key}>
                                      {key}:
                                      <ul className="list-disc ml-6">
                                        {value.map((item, idx) => (
                                          <li key={idx}>
                                            {Object.entries(item)
                                              .map(
                                                ([k, v]) => `${k}: ${String(v)}`
                                              )
                                              .join(", ")}
                                          </li>
                                        ))}
                                      </ul>
                                    </li>
                                  ) : (
                                    <li key={key}>
                                      {key}: {String(value)}
                                    </li>
                                  )
                              )}
                            </ul>
                          </div>
                        )}
                        {suggestionResult[doc.id] && (
                          <div>
                            <strong>Workflow Suggestion:</strong>{" "}
                            {suggestionResult[doc.id]}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
