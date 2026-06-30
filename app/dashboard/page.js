"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function DashboardIndex() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || !role) {
      toast.error("Session expired or unauthorized. Please re-authenticate.");
      router.push("/login");
      return;
    }

    // Role-Based Router Gateway multiplexer mappings
    if (role === "student") {
      router.replace("/dashboard/student");
    } else if (role === "teacher") {
      router.replace("/dashboard/teacher");
    } else {
      toast.error("Unknown administrative role parameters.");
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#090d16] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-t-transparent border-emerald-400 animate-spin" />
        <p className="text-xs font-mono text-gray-500 tracking-widest uppercase">
          Opening your dashboard...
        </p>
      </div>
    </div>
  );
}
