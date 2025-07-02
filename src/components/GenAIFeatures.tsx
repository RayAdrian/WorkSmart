"use client";

import { useState, useEffect } from "react";
import {
  SparklesIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  LightBulbIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

interface AIInsight {
  id: string;
  type: "categorization" | "analysis" | "suggestion" | "insight" | "anomaly";
  title: string;
  description: string;
  confidence: number;
  timestamp: string;
  status: "processing" | "completed" | "error";
  data?: Record<string, unknown>;
}

interface TimeInsight {
  category: string;
  hours: number;
  percentage: number;
  trend: "up" | "down" | "stable";
  recommendation: string;
}

interface SearchResult {
  id: string;
  type: string;
  title: string;
  description: string;
  relevance: number;
  date: string;
}

interface Anomaly {
  id: string;
  type: string;
  description: string;
  severity: "high" | "medium" | "low";
  timestamp: string;
  details: string;
}

export default function GenAIFeatures() {
  const [activeTab, setActiveTab] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [timeInsights, setTimeInsights] = useState<TimeInsight[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);

  useEffect(() => {
    // Mock data - in real app, this would come from API
    setInsights([
      {
        id: "1",
        type: "categorization",
        title: "Smart Tagging Applied",
        description:
          "Automatically categorized 15 time entries with 95% confidence",
        confidence: 95,
        timestamp: "2024-01-15T10:30:00Z",
        status: "completed",
        data: {
          entriesProcessed: 15,
          tagsApplied: ["procurement", "project-x", "marketing"],
          accuracy: 0.95,
        },
      },
      {
        id: "2",
        type: "analysis",
        title: "Document Analysis Complete",
        description: "Extracted key information from Purchase Order document",
        confidence: 88,
        timestamp: "2024-01-15T09:15:00Z",
        status: "completed",
        data: {
          documentName: "Purchase Order - Vendor ABC.pdf",
          extractedFields: ["vendor_name", "total_amount", "delivery_date"],
          processingTime: "2.3s",
        },
      },
      {
        id: "3",
        type: "suggestion",
        title: "Workflow Recommendation",
        description: "Suggested next steps for contract review process",
        confidence: 92,
        timestamp: "2024-01-15T08:45:00Z",
        status: "completed",
        data: {
          workflow: "contract_review",
          suggestedSteps: [
            "legal_review",
            "stakeholder_approval",
            "final_signature",
          ],
          estimatedTime: "3-5 days",
        },
      },
    ]);

    setTimeInsights([
      {
        category: "Project X Development",
        hours: 45.5,
        percentage: 35,
        trend: "up",
        recommendation: "Consider allocating more resources to meet deadline",
      },
      {
        category: "Procurement Activities",
        hours: 28.2,
        percentage: 22,
        trend: "stable",
        recommendation: "Current allocation is optimal for workload",
      },
      {
        category: "Document Processing",
        hours: 18.7,
        percentage: 14,
        trend: "down",
        recommendation: "Efficiency improved - consider process optimization",
      },
      {
        category: "Meetings & Coordination",
        hours: 15.3,
        percentage: 12,
        trend: "up",
        recommendation: "Monitor meeting frequency to maintain productivity",
      },
    ]);

    setAnomalies([
      {
        id: "1",
        type: "time_entry",
        description: "Unusual 12-hour work session detected",
        severity: "medium",
        timestamp: "2024-01-14T22:00:00Z",
        details:
          "User logged 12 hours in a single day, significantly above average",
      },
      {
        id: "2",
        type: "document_processing",
        description: "Document processing time exceeded threshold",
        severity: "low",
        timestamp: "2024-01-13T15:30:00Z",
        details: "Contract review took 3 days instead of typical 1-2 days",
      },
    ]);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    // Mock search - in real app, this would call AI search API
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: "1",
          type: "time_entry",
          title: "Project X Development",
          description:
            "5.5 hrs #project-x fix login issue and implement user authentication",
          relevance: 0.95,
          date: "2024-01-15",
        },
        {
          id: "2",
          type: "document",
          title: "Purchase Order - Vendor ABC",
          description: "Procurement document for office supplies",
          relevance: 0.87,
          date: "2024-01-15",
        },
        {
          id: "3",
          type: "time_entry",
          title: "Procurement Activities",
          description:
            "2.0 hrs #procurement vendor negotiation and contract review",
          relevance: 0.82,
          date: "2024-01-15",
        },
      ];

      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1500);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "categorization":
        return <TagIcon className="h-5 w-5 text-blue-500" />;
      case "analysis":
        return <DocumentTextIcon className="h-5 w-5 text-green-500" />;
      case "suggestion":
        return <LightBulbIcon className="h-5 w-5 text-yellow-500" />;
      case "insight":
        return <ChartBarIcon className="h-5 w-5 text-purple-500" />;
      case "anomaly":
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <SparklesIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowPathIcon className="h-4 w-4 text-red-500 rotate-45" />;
      case "down":
        return <ArrowPathIcon className="h-4 w-4 text-green-500 -rotate-45" />;
      default:
        return <ArrowPathIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">GenAI Features</h1>
        <p className="text-gray-600 mt-2">
          Intelligent automation and insights powered by AI
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              {
                id: "search",
                name: "Natural Language Search",
                icon: MagnifyingGlassIcon,
              },
              {
                id: "categorization",
                name: "Smart Categorization",
                icon: TagIcon,
              },
              {
                id: "analysis",
                name: "Document Analysis",
                icon: DocumentTextIcon,
              },
              {
                id: "suggestions",
                name: "Workflow Suggestions",
                icon: LightBulbIcon,
              },
              { id: "insights", name: "Time Insights", icon: ChartBarIcon },
              {
                id: "anomalies",
                name: "Anomaly Detection",
                icon: ExclamationTriangleIcon,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-5 w-5 inline mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Natural Language Search */}
          {activeTab === "search" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Natural Language Search
                </h3>
                <p className="text-gray-600 mb-4">
                  Ask questions about your data in natural language
                </p>

                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g., How much time did I spend on procurement last week?"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={isSearching}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isSearching ? (
                        <>
                          <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                          Search
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {searchResults.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">
                      Search Results
                    </h4>
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        className="p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-gray-900">
                              {result.title}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {result.description}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {result.date}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {result.type}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              {Math.round(result.relevance * 100)}% relevant
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Smart Categorization */}
          {activeTab === "categorization" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Smart Categorization
                </h3>
                <p className="text-gray-600 mb-4">
                  AI automatically tags and categorizes your time entries and
                  documents
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <SparklesIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-900">
                      Auto-categorization is active and learning from your
                      patterns
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Recent Categorizations
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Time entries processed</span>
                        <span className="font-medium">1,247</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Documents categorized</span>
                        <span className="font-medium">89</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Accuracy rate</span>
                        <span className="font-medium text-green-600">95%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Popular Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "project-x",
                        "procurement",
                        "marketing",
                        "hr",
                        "finance",
                      ].map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Document Analysis */}
          {activeTab === "analysis" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Document Analysis
                </h3>
                <p className="text-gray-600 mb-4">
                  AI extracts key information from uploaded documents
                </p>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Recent Analysis Results
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900">
                          Purchase Order - Vendor ABC.pdf
                        </h5>
                        <p className="text-sm text-gray-600">
                          Extracted: vendor name, total amount, delivery date
                        </p>
                      </div>
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900">
                          Contract Review - Project X.docx
                        </h5>
                        <p className="text-sm text-gray-600">
                          Extracted: contract terms, parties, effective date
                        </p>
                      </div>
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Workflow Suggestions */}
          {activeTab === "suggestions" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Workflow Suggestions
                </h3>
                <p className="text-gray-600 mb-4">
                  AI recommends next steps based on your current activities
                </p>

                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <LightBulbIcon className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-900">
                          Contract Review Workflow
                        </h4>
                        <p className="text-sm text-yellow-800 mt-1">
                          Based on your recent document upload, here are the
                          recommended next steps:
                        </p>
                        <ul className="text-sm text-yellow-800 mt-2 space-y-1">
                          <li>
                            • Schedule legal review meeting (estimated: 2-3
                            days)
                          </li>
                          <li>
                            • Obtain stakeholder approval (estimated: 1-2 days)
                          </li>
                          <li>• Prepare final signature package</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <LightBulbIcon className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">
                          Procurement Optimization
                        </h4>
                        <p className="text-sm text-blue-800 mt-1">
                          Consider consolidating vendor negotiations to reduce
                          processing time by 30%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Time Insights */}
          {activeTab === "insights" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Time Insights
                </h3>
                <p className="text-gray-600 mb-4">
                  AI-generated insights about your time usage patterns
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-4">
                      Time Distribution
                    </h4>
                    <div className="space-y-3">
                      {timeInsights.map((insight) => (
                        <div
                          key={insight.category}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center">
                            {getTrendIcon(insight.trend)}
                            <div className="ml-3">
                              <h5 className="font-medium text-gray-900">
                                {insight.category}
                              </h5>
                              <p className="text-sm text-gray-600">
                                {insight.hours} hours ({insight.percentage}%)
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 max-w-xs">
                              {insight.recommendation}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-4">
                      Productivity Trends
                    </h4>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          87%
                        </div>
                        <div className="text-sm text-gray-600">
                          Overall Productivity Score
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Most productive day</span>
                          <span className="font-medium">Wednesday</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Peak hours</span>
                          <span className="font-medium">9 AM - 11 AM</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Focus time</span>
                          <span className="font-medium">6.2 hours/day</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Anomaly Detection */}
          {activeTab === "anomalies" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Anomaly Detection
                </h3>
                <p className="text-gray-600 mb-4">
                  AI identifies unusual patterns in your time entries and
                  document processing
                </p>

                <div className="space-y-4">
                  {anomalies.map((anomaly) => (
                    <div
                      key={anomaly.id}
                      className="bg-white border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {anomaly.description}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {anomaly.details}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              Detected on{" "}
                              {new Date(anomaly.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(
                            anomaly.severity
                          )}`}
                        >
                          {anomaly.severity} severity
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-900">
                      No critical anomalies detected in the last 24 hours
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Insights Feed */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent AI Insights
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
              >
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{insight.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {insight.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>{new Date(insight.timestamp).toLocaleString()}</span>
                    <span>{insight.confidence}% confidence</span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        insight.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : insight.status === "processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {insight.status}
                    </span>
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
