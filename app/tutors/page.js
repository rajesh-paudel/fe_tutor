"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";
import {
  Search,
  Star,
  ArrowRight,
  SlidersHorizontal,
  X,
  GraduationCap,
} from "lucide-react";

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Computer Science",
  "Programming",
  "SEE",
  "+2 Science",
  "Bachelor",
  "Engineering",
  "Medical",
];

const LEVELS = ["SEE", "+2", "Bachelor's", "Entrance prep", "Professional"];

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "rating", label: "Highest rated" },
  { value: "experience", label: "Most experienced" },
  { value: "price_low", label: "Price: low to high" },
  { value: "price_high", label: "Price: high to low" },
];

const DEFAULT_FILTERS = {
  search: "",
  subject: "",
  level: "",
  minPrice: "",
  maxPrice: "",
  minRating: "",
  sort: "recommended",
};

export default function TutorsPage() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState(() => ({
    ...DEFAULT_FILTERS,
    // Pre-populate from URL on first render
    subject: searchParams.get("subject") || "",
  }));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // If the URL param changes (e.g. browser back/forward), sync into filters
  useEffect(() => {
    const urlSubject = searchParams.get("subject") || "";
    setFilters((prev) => ({ ...prev, subject: urlSubject }));
  }, [searchParams]);

  const tutorsQuery = useQuery({
    queryKey: ["publicTutors", filters],
    queryFn: async () => {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.subject) params.subject = filters.subject;
      if (filters.level) params.level = filters.level;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.minRating) params.minRating = filters.minRating;
      if (filters.sort) params.sort = filters.sort;
      const response = await api.get("/tutors/search", { params });
      return response.data.data;
    },
  });

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => key !== "sort" && value,
  ).length;

  const tutors = tutorsQuery.data || [];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Find a tutor that fits your study style.
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Filter by subject, level, and budget to see tutors who actually
            match what you need.
          </p>
        </div>

        {/* Active subject pill from URL */}
        {filters.subject && (
          <div className="mt-5 flex items-center gap-2">
            <span className="text-sm text-slate-500">Filtered by:</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              {filters.subject}
              <button
                onClick={() => updateFilter("subject", "")}
                className="text-emerald-500 hover:text-emerald-700"
              >
                <X size={13} />
              </button>
            </span>
          </div>
        )}

        {/* Search bar */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              placeholder="Search by tutor name or subject"
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </label>

          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400 lg:hidden"
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-xs text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          <select
            value={filters.sort}
            onChange={(e) => updateFilter("sort", e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[260px_1fr]">
          {/* Filter sidebar - desktop */}
          <aside className="hidden lg:block">
            <FilterPanel
              filters={filters}
              updateFilter={updateFilter}
              clearFilters={clearFilters}
              activeFilterCount={activeFilterCount}
            />
          </aside>

          {/* Results */}
          <div>
            <p className="text-sm text-slate-500">
              {tutorsQuery.isLoading
                ? "Searching tutors..."
                : `${tutors.length} tutor${tutors.length === 1 ? "" : "s"} found`}
            </p>

            {tutorsQuery.isLoading && (
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <TutorCardSkeleton key={i} />
                ))}
              </div>
            )}

            {tutorsQuery.isError && (
              <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
                Could not load tutors right now. Please try refreshing the page.
              </div>
            )}

            {!tutorsQuery.isLoading &&
              !tutorsQuery.isError &&
              tutors.length === 0 && (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-10 text-center">
                  <p className="font-semibold text-slate-900">
                    No tutors match these filters
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Try widening your budget or removing a filter.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

            {!tutorsQuery.isLoading && tutors.length > 0 && (
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {tutors.map((tutor) => (
                  <TutorCard key={tutor.teacherId} tutor={tutor} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm overflow-y-auto bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <div className="mt-6">
              <FilterPanel
                filters={filters}
                updateFilter={updateFilter}
                clearFilters={clearFilters}
                activeFilterCount={activeFilterCount}
              />
            </div>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-6 w-full rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Show results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterPanel({
  filters,
  updateFilter,
  clearFilters,
  activeFilterCount,
}) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Filters</h3>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Subject */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Subject
        </p>
        <div className="mt-3 space-y-2">
          {SUBJECTS.map((subj) => (
            <label
              key={subj}
              className="flex items-center gap-2 text-sm text-slate-700"
            >
              <input
                type="radio"
                name="subject"
                checked={filters.subject === subj}
                onChange={() => updateFilter("subject", subj)}
                className="h-4 w-4 border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              {subj}
            </label>
          ))}
          {filters.subject && (
            <button
              onClick={() => updateFilter("subject", "")}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Clear subject
            </button>
          )}
        </div>
      </div>

      {/* Level */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Level
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {LEVELS.map((level) => (
            <button
              key={level}
              onClick={() =>
                updateFilter("level", filters.level === level ? "" : level)
              }
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                filters.level === level
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Hourly rate (Rs)
        </p>
        <div className="mt-3 flex items-center gap-3">
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => updateFilter("minPrice", e.target.value)}
            placeholder="Min"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
          <span className="text-slate-400">–</span>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
            placeholder="Max"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Minimum rating
        </p>
        <div className="mt-3 flex gap-2">
          {[4.5, 4, 3.5].map((rating) => (
            <button
              key={rating}
              onClick={() =>
                updateFilter(
                  "minRating",
                  filters.minRating === String(rating) ? "" : String(rating),
                )
              }
              className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                filters.minRating === String(rating)
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <Star size={12} className="fill-current text-amber-400" />
              {rating}+
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TutorCard({ tutor }) {
  const initials = (tutor.name || "T")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-emerald-200 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-base font-semibold text-emerald-700">
          {tutor.profileImage ? (
            <img
              src={tutor.profileImage}
              alt={tutor.name || "Tutor"}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="leading-none">{initials}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="truncate text-base font-semibold text-slate-900">
              {tutor.name}
            </h2>
            {tutor.recommendationScore != null && (
              <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                {tutor.recommendationScore.toFixed(0)}% match
              </span>
            )}
          </div>

          <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {tutor.averageRating || "New"} · {tutor.experienceYears || 0} yrs
            experience
          </div>

          <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            <GraduationCap size={12} />
            Tutor
          </span>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {(tutor.subjects?.length ? tutor.subjects : ["General tutoring"])
              .slice(0, 3)
              .map((subj) => (
                <span
                  key={subj}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                >
                  {subj}
                </span>
              ))}
          </div>
        </div>
      </div>

      {tutor.bio && (
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
          {tutor.bio}
        </p>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">
            Hourly rate
          </p>
          <p className="text-base font-semibold text-slate-900">
            Rs {tutor.hourlyRate}/hr
          </p>
        </div>
        <a
          href={`/tutors/${tutor.teacherId}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          View profile
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

function TutorCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-full bg-slate-100" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-slate-100" />
          <div className="h-3 w-1/2 rounded bg-slate-100" />
        </div>
      </div>
      <div className="mt-4 h-3 w-full rounded bg-slate-100" />
      <div className="mt-2 h-3 w-3/4 rounded bg-slate-100" />
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="h-4 w-16 rounded bg-slate-100" />
        <div className="h-8 w-24 rounded bg-slate-100" />
      </div>
    </div>
  );
}
