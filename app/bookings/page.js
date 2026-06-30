"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CalendarRange, Clock3 } from "lucide-react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    api
      .get("/bookings")
      .then((response) => setBookings(response.data.data || []))
      .catch(() => setBookings([]));
  }, []);

  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100">
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-950/90 p-8 sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.25em] text-emerald-400">
            <CalendarRange className="h-3.5 w-3.5" /> Your booking history
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Track your upcoming and completed sessions.
          </h1>
          <div className="mt-8 space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="rounded-2xl border border-gray-800 bg-gray-900/70 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">
                      {booking.teacherId?.name ||
                        booking.studentId?.name ||
                        "Session"}
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      {booking.date} • {booking.startTime} - {booking.endTime}
                    </p>
                  </div>
                  <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400">
                    {booking.status}
                  </div>
                </div>
                {booking.meetingLink && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                    <Clock3 className="h-4 w-4" />{" "}
                    <span>{booking.meetingLink}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
