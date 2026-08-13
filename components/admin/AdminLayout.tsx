"use client";

import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import { useAuth } from "@/lib/useAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { authState } = useAuth(true, "ADMIN");

  if (authState === "CHECKING") {
    return (
      <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center text-sm font-medium text-[#1c1c1a]">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8F6F2] font-sans text-[#1c1c1a]">
      <AdminSidebar />
      <div className="flex-1 lg:ml-[240px] flex flex-col min-h-screen relative">
        <AdminTopbar />
        <main className="flex-1 w-full px-6 md:px-8 lg:px-12 py-8 mx-auto max-w-[1600px]">
          {children}
        </main>
      </div>
    </div>
  );
}
