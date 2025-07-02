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
      <div className="flex">
        {!hideNav && <Sidebar />}
        <main
          className={
            !hideNav
              ? "flex-1 pt-4 pb-8 px-2 sm:px-4 md:pl-64 transition-all duration-200"
              : "w-full"
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
}
