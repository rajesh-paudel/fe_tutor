"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Sparkles,
  CalendarRange,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);

  useEffect(() => {
    function syncAuthState() {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("userRole"));
    }

    queueMicrotask(syncAuthState);
    window.addEventListener("auth:changed", syncAuthState);
    return () => window.removeEventListener("auth:changed", syncAuthState);
  }, [pathname]);

  function confirmSignOut() {
    localStorage.clear();
    window.dispatchEvent(new Event("auth:changed"));
    setToken(null);
    setRole(null);
    setSignOutDialogOpen(false);
    setIsOpen(false);
    toast.success("Signed out successfully.");
    router.push("/");
  }

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 shadow-sm shadow-slate-200/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Branding */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 transition-colors group-hover:border-emerald-300">
                <GraduationCap className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-950">
                Edu<span className="text-emerald-600">Sphere</span>
              </span>
            </Link>

            {/* Center Navigation Links */}
            <div className="hidden md:flex items-center gap-8 text-[14px]">
              <Link
                href="/"
                className={`transition-colors ${pathname === "/" ? "text-emerald-700 font-medium" : "text-slate-600 hover:text-slate-950"}`}
              >
                Home
              </Link>

              {role !== "teacher" && (
                <Link
                  href="/tutors"
                  className={`flex items-center gap-1 transition-colors ${pathname === "/tutors" ? "text-emerald-700 font-medium" : "text-slate-600 hover:text-slate-950"}`}
                >
                  Find a tutor
                </Link>
              )}

              {token && (
                <>
                  <Link
                    href="/bookings"
                    className={`flex items-center gap-1 transition-colors ${pathname === "/bookings" ? "text-emerald-700 font-medium" : "text-slate-600 hover:text-slate-950"}`}
                  >
                    <CalendarRange className="h-4 w-4" /> Bookings
                  </Link>
                  <Link
                    href="/dashboard"
                    className={`flex items-center gap-1 transition-colors ${pathname.startsWith("/dashboard") ? "text-emerald-700 font-medium" : "text-slate-600 hover:text-slate-950"}`}
                  >
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  {role === "student" && (
                    <Link
                      href="/ai-study"
                      className={`flex items-center gap-1 transition-colors ${pathname === "/ai-study" ? "text-emerald-700 font-medium" : "text-slate-600 hover:text-slate-950"}`}
                    >
                      <Sparkles className="h-4 w-4 text-emerald-600" /> AI Study
                    </Link>
                  )}
                </>
              )}

              <Link
                href="/about"
                className={`flex items-center gap-1 transition-colors ${pathname === "/about" ? "text-emerald-700 font-medium" : "text-slate-600 hover:text-slate-950"}`}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className={`flex items-center gap-1 transition-colors ${pathname === "/contact" ? "text-emerald-700 font-medium" : "text-slate-600 hover:text-slate-950"}`}
              >
                Contact
              </Link>
            </div>

            {/* Right side actions */}
            <div className="hidden md:flex items-center gap-3">
              {token ? (
                <button
                  onClick={() => setSignOutDialogOpen(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition-colors hover:border-red-300 hover:bg-red-100"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-600/15 transition-colors hover:bg-emerald-500"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-600 hover:text-slate-950 focus:outline-none"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Dropdown Menu */}
        {isOpen && (
          <div className="space-y-2 border-t border-slate-200 bg-white px-4 pb-4 pt-2 md:hidden">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              About
            </Link>
            {role !== "teacher" && (
              <Link
                href="/tutors"
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Tutors
              </Link>
            )}
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              Contact
            </Link>

            {token ? (
              <>
                <Link
                  href="/bookings"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100"
                >
                  Bookings
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setSignOutDialogOpen(true);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-base font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-center text-sm font-bold text-slate-700"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg bg-emerald-600 px-3 py-2.5 text-center text-sm font-bold text-white"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Sign out confirmation dialog */}
      {signOutDialogOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setSignOutDialogOpen(false)}
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">
              Sign out of EduSphere?
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              You&apos;ll need to sign in again to access your dashboard and
              bookings.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSignOutDialogOpen(false)}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmSignOut}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
