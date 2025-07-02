"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { username, logout } = useAuth();
  const pathname = usePathname();

  // Hide sidebar/header on login page
  const hideNav = pathname === "/login";

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideNav && <Header username={username} onLogout={logout} />}
      <div className="flex h-screen">
        {!hideNav && <Sidebar />}
        <main
          className={
            !hideNav
              ? "flex-1 pt-12 pb-8 px-2 sm:px-4 md:px-32 transition-all duration-200 overflow-y-auto"
              : "w-full"
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
}
