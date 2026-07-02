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
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const loginMutation = useMutation({
    mutationFn: async (payload) => {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      window.dispatchEvent(new Event("auth:changed"));

      const response = await api.post("/auth/login", payload);
      return response.data;
    },
    onSuccess: (data) => {
      if (!data?.token || !data?.user?.role) {
        const message = "Login response was incomplete. Please try again.";
        setLoginError(message);
        toast.error(message);
        return;
      }

      setLoginError("");
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userName", data.user.name || "");
      toast.success("Welcome back!");
      router.push("/dashboard");
    },
    onError: (error) => {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "We could not sign you in. Please check your details and try again.";

      setLoginError(message);
      toast.error(message);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.email || !formData.password) {
      const message = "Please enter your email and password.";
      setLoginError(message);
      toast.error(message);
      return;
    }
    setLoginError("");
    loginMutation.mutate(formData);
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
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Sign in to continue your lessons, bookings, and study tools.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Email address
            </label>
            <div className="relative w-full">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
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

          {loginError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {loginError}
            </div>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 text-sm font-semibold !text-white shadow-lg shadow-emerald-600/15 transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
            {!loginMutation.isPending && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          New to EduSphere?{" "}
          <Link
            href="/register"
            className="font-semibold text-emerald-700 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
