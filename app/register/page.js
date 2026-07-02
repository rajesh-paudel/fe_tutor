"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";
import {
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  KeyRound,
  Mail,
  User,
  UsersRound,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [showPassword, setShowPassword] = useState(false);

  const registerMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.post("/auth/register", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Account created. Please sign in.");
      router.push("/login");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.error ||
          "We could not create your account. Please try again.",
      );
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }
    registerMutation.mutate(formData);
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 p-4">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-emerald-50 to-transparent" />

      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Join EduSphere as a student or tutor.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Full name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rajesh Paudel"
                className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-950 transition-colors focus:border-emerald-500 focus:outline-none"
                value={formData.name}
                onChange={(event) =>
                  setFormData({ ...formData, name: event.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-950 transition-colors focus:border-emerald-500 focus:outline-none"
                value={formData.email}
                onChange={(event) =>
                  setFormData({ ...formData, email: event.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Password
            </label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm text-slate-950 transition-colors focus:border-emerald-500 focus:outline-none"
                value={formData.password}
                onChange={(event) =>
                  setFormData({ ...formData, password: event.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 transition-colors hover:text-slate-600 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Account type
            </label>
            <div className="mt-1 grid grid-cols-2 gap-3">
              <button
                type="button"
                className={`flex items-center justify-center gap-2 rounded-lg border py-3 text-sm font-medium transition-all ${formData.role === "student" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-600"}`}
                onClick={() => setFormData({ ...formData, role: "student" })}
              >
                <UsersRound className="h-4 w-4" /> Student
              </button>
              <button
                type="button"
                className={`flex items-center justify-center gap-2 rounded-lg border py-3 text-sm font-medium transition-all ${formData.role === "teacher" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-600"}`}
                onClick={() => setFormData({ ...formData, role: "teacher" })}
              >
                <GraduationCap className="h-4 w-4" /> Tutor
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 text-sm font-semibold !text-white shadow-lg shadow-emerald-600/15 transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {registerMutation.isPending
              ? "Creating account..."
              : "Create account"}
            {!registerMutation.isPending && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-emerald-700 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
