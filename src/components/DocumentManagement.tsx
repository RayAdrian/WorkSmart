"use client";

import { useState, useEffect } from "react";
import {
  DocumentIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon as ClockIconSolid,
} from "@heroicons/react/24/outline";

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  status: "pending" | "in-review" | "approved" | "rejected";
  uploadedBy: string;
  uploadedDate: string;
  linkedTimeEntries: string[];
  description: string;
  tags: string[];
}

export default function DocumentManagement() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadTags, setUploadTags] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Document | null>(null);

  // Filters
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Mock data - in real app, this would come from API
    const mockDocuments: Document[] = [
      {
        id: "1",
        name: "Purchase Order - Vendor ABC.pdf",
        type: "purchase-order",
        size: "2.4 MB",
        status: "approved",
        uploadedBy: "Jane Smith",
        uploadedDate: "2024-01-15",
        linkedTimeEntries: ["1", "2"],
        description: "Purchase order for office supplies from Vendor ABC",
        tags: ["procurement", "office-supplies"],
      },
      {
        id: "2",
        name: "Contract Review - Project X.docx",
        type: "contract",
        size: "1.8 MB",
        status: "in-review",
        uploadedBy: "John Doe",
        uploadedDate: "2024-01-14",
        linkedTimeEntries: ["3"],
        description: "Contract review document for Project X implementation",
        tags: ["contract", "project-x"],
      },
      {
        id: "3",
        name: "Quote Comparison - IT Services.xlsx",
        type: "quote",
        size: "3.2 MB",
        status: "pending",
        uploadedBy: "Mike Johnson",
        uploadedDate: "2024-01-13",
        linkedTimeEntries: [],
        description: "Comparison of IT service provider quotes",
        tags: ["it-services", "quotes"],
      },
      {
        id: "4",
        name: "Requisition Form - Equipment.pdf",
        type: "requisition",
        size: "1.1 MB",
        status: "rejected",
        uploadedBy: "Sarah Wilson",
        uploadedDate: "2024-01-12",
        linkedTimeEntries: ["4"],
        description: "Equipment requisition form for new office setup",
        tags: ["equipment", "office-setup"],
      },
    ];
    setDocuments(mockDocuments);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const newDocument: Document = {
      id: Date.now().toString(),
      name: selectedFile.name,
      type: getFileType(selectedFile.name),
      size: formatFileSize(selectedFile.size),
      status: "pending",
      uploadedBy: "Current User", // In real app, get from auth
      uploadedDate: new Date().toISOString().split("T")[0],
      linkedTimeEntries: [],
      description: uploadDescription,
      tags: uploadTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    };

    setDocuments((prev) => [newDocument, ...prev]);
    setSelectedFile(null);
    setUploadDescription("");
    setUploadTags("");
  };

  const getFileType = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "purchase-order";
    if (ext === "docx" || ext === "doc") return "contract";
    if (ext === "xlsx" || ext === "xls") return "quote";
    return "requisition";
  };

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const handleEdit = (document: Document) => {
    setEditingId(document.id);
    setEditForm({ ...document });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    setDocuments((prev) =>
      prev.map((item) => (item.id === editForm.id ? editForm : item))
    );
    setEditingId(null);
    setEditForm(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      setDocuments((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
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
      document.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      document.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      document.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesStatus && matchesType && matchesSearch;
  });

  // Get unique values for filters
  const statuses = ["pending", "in-review", "approved", "rejected"];
  const types = [...new Set(documents.map((d) => d.type))];

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

      {/* Upload Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Upload Document
        </h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select File
              </label>
              <input
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.docx,.doc,.xlsx,.xls"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={uploadTags}
                onChange={(e) => setUploadTags(e.target.value)}
                placeholder="procurement, vendor, contract"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={uploadDescription}
              onChange={(e) => setUploadDescription(e.target.value)}
              rows={3}
              placeholder="Brief description of the document..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!selectedFile}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Upload Document
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
                placeholder="Search documents..."
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() +
                    status.slice(1).replace("-", " ")}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() +
                    type.slice(1).replace("-", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Documents ({filteredDocuments.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((document) => (
                <tr key={document.id} className="hover:bg-gray-50">
                  {editingId === document.id ? (
                    // Edit Form
                    <>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editForm?.name || ""}
                          onChange={(e) =>
                            setEditForm((prev) =>
                              prev ? { ...prev, name: e.target.value } : null
                            )
                          }
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={editForm?.status || "pending"}
                          onChange={(e) =>
                            setEditForm((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    status: e.target
                                      .value as Document["status"],
                                  }
                                : null
                            )
                          }
                          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() +
                                status.slice(1).replace("-", " ")}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {document.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {document.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {document.uploadedBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {document.uploadedDate}
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
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <DocumentIcon className="h-8 w-8 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {document.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {document.description}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {document.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(document.status)}
                          <span
                            className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              document.status
                            )}`}
                          >
                            {document.status.charAt(0).toUpperCase() +
                              document.status.slice(1).replace("-", " ")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {document.type.charAt(0).toUpperCase() +
                          document.type.slice(1).replace("-", " ")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {document.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {document.uploadedBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {document.uploadedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(document)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(document.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                          {document.linkedTimeEntries.length > 0 && (
                            <div className="flex items-center text-gray-500">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              <span className="text-xs">
                                {document.linkedTimeEntries.length}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
