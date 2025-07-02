"use client";

import {
  HomeIcon,
  ClockIcon,
  DocumentIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { id: "dashboard", name: "Dashboard", icon: HomeIcon, href: "/dashboard" },
  { id: "checkin", name: "Check-in System", icon: ClockIcon, href: "/checkin" },
  {
    id: "documents",
    name: "Documents",
    icon: DocumentIcon,
    href: "/documents",
  },
  { id: "genai", name: "GenAI Features", icon: SparklesIcon, href: "/genai" },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Show sidebar always on md+, toggle on mobile
  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md bg-white shadow-lg"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900">
                WorkSmart
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="md:hidden p-1 rounded-md text-gray-400 hover:text-gray-500"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
