"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Star, ArrowRight } from "lucide-react";

export default function TutorsPage() {
  const [subject, setSubject] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const tutorsQuery = useQuery({
    queryKey: ["publicTutors", subject, maxPrice],
    queryFn: async () => {
      const params = {};
      if (subject) params.subject = subject;
      if (maxPrice) params.maxPrice = maxPrice;
      const response = await api.get("/tutors/search", { params });
      return response.data.data;
    },
  });

  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-950/90 p-8 sm:p-10">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Find a tutor that fits your study style.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-400">
            Browse available educators by subject, experience level, and price
            range.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Search by subject"
                className="w-full rounded-xl border border-gray-800 bg-gray-950 py-3 pl-10 pr-3 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </label>
            <input
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max budget per hour"
              type="number"
              className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          {tutorsQuery.data?.map((tutor) => (
            <div
              key={tutor.teacherId}
              className="rounded-2xl border border-gray-800 bg-gray-900/70 p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {tutor.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-400">
                    {tutor.subjects?.join(", ") || "General tutoring"}
                  </p>
                </div>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  {tutor.recommendationScore?.toFixed(2)}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm text-amber-400">
                <Star className="h-4 w-4 fill-current" />{" "}
                {tutor.averageRating || 0} • {tutor.experienceYears || 0} yrs
                experience
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                    Hourly rate
                  </p>
                  <p className="text-lg font-semibold text-white">
                    ${tutor.hourlyRate}/hr
                  </p>
                </div>
                <a
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400"
                >
                  Book now <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
