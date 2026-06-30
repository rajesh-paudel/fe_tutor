"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { UserCircle2, Save, GraduationCap } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [userRole, setUserRole] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: "",
    subjects: "",
    academicLevel: "",
    interests: "",
  });

  const profileQuery = useQuery({
    queryKey: ["profilePage"],
    queryFn: async () => {
      const response = await api.get("/profile/me");
      return response.data.data;
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserRole(localStorage.getItem("userRole"));
    }

    if (profileQuery.data) {
      setForm({
        name: profileQuery.data.userId?.name || "",
        email: profileQuery.data.userId?.email || "",
        bio: profileQuery.data.bio || "",
        subjects: (profileQuery.data.subjects || []).join(", "),
        academicLevel: profileQuery.data.academicLevel || "",
        interests: (profileQuery.data.interests || []).join(", "),
      });
    }
  }, [profileQuery.data]);

  const updateMutation = useMutation({
    mutationFn: async (payload) => {
      const role =
        typeof window !== "undefined"
          ? localStorage.getItem("userRole")
          : userRole;
      const endpoint =
        role === "teacher" ? "/profile/teacher" : "/profile/student";
      const response = await api.put(endpoint, payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully.");
      queryClient.invalidateQueries(["profilePage"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Unable to update profile.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("userRole")
        : userRole;
    const payload =
      role === "teacher"
        ? {
            bio: form.bio,
            subjects: form.subjects
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
          }
        : {
            academicLevel: form.academicLevel,
            interests: form.interests
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
          };
    updateMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-950/90 p-8 sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.25em] text-emerald-400">
            <UserCircle2 className="h-3.5 w-3.5" /> Your profile
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Keep your learning profile polished and up to date.
          </h1>
          <form
            onSubmit={handleSubmit}
            className="mt-8 grid gap-4 md:grid-cols-2"
          >
            <label className="block text-sm text-gray-400">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                Name
              </span>
              <input
                value={form.name}
                readOnly
                className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-3 text-sm text-white"
              />
            </label>
            <label className="block text-sm text-gray-400">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                Email
              </span>
              <input
                value={form.email}
                readOnly
                className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-3 text-sm text-white"
              />
            </label>
            {userRole === "teacher" ? (
              <>
                <label className="block text-sm text-gray-400 md:col-span-2">
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                    Bio
                  </span>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows="4"
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none"
                  />
                </label>
                <label className="block text-sm text-gray-400 md:col-span-2">
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                    Subjects
                  </span>
                  <input
                    value={form.subjects}
                    onChange={(e) =>
                      setForm({ ...form, subjects: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none"
                  />
                </label>
              </>
            ) : (
              <>
                <label className="block text-sm text-gray-400">
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                    Academic level
                  </span>
                  <input
                    value={form.academicLevel}
                    onChange={(e) =>
                      setForm({ ...form, academicLevel: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none"
                  />
                </label>
                <label className="block text-sm text-gray-400">
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                    Interests
                  </span>
                  <input
                    value={form.interests}
                    onChange={(e) =>
                      setForm({ ...form, interests: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none"
                  />
                </label>
              </>
            )}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />{" "}
                {updateMutation.isPending ? "Saving..." : "Save profile"}
              </button>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}
