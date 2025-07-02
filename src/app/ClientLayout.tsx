"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/components/AuthProvider";
import AppShell from "@/components/AppShell";
import React from "react";

const PUBLIC_ROUTES = ["/login", "/register", "/forgot", "/reset"];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  return isPublic ? (
    <>{children}</>
  ) : (
    <AuthProvider>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}
