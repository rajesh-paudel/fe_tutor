"use client";

import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  MessageCircle,
  NotebookPen,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mockup frame — browser-style chrome wrapping each abstract preview */
/*  Swap the mockup body for a real <img src="/screenshots/x.png" />   */
/*  once you have actual product screenshots.                         */
/* ------------------------------------------------------------------ */

function MockupFrame({ children, accent }) {
  return (
    <div className="relative">
      <div
        className={`pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] blur-2xl ${accent.glow}`}
        aria-hidden="true"
      />
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
        <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        </div>
        <div className="bg-slate-50/60 p-5">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Per-feature abstract mockups                                       */
/* ------------------------------------------------------------------ */

function BookingMockup() {
  const rows = [
    { name: "Aarav Sharma", meta: "Physics · Tue 4:00 PM", status: "accepted" },
    { name: "Priya Karki", meta: "Calculus · Thu 6:30 PM", status: "pending" },
    {
      name: "Sujal Thapa",
      meta: "Chemistry · Fri 2:00 PM",
      status: "accepted",
    },
  ];
  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div
          key={row.name}
          className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-600">
            {row.name
              .split(" ")
              .map((p) => p[0])
              .join("")}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-800">
              {row.name}
            </p>
            <p className="truncate text-[11px] text-slate-500">{row.meta}</p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
              row.status === "accepted"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {row.status}
          </span>
        </div>
      ))}
    </div>
  );
}

function TeacherOverviewMockup() {
  const stats = [
    { label: "Assignments", value: "12" },
    { label: "Quizzes", value: "5" },
    { label: "Resources", value: "9" },
  ];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-100 bg-white p-3 text-center"
          >
            <p className="text-lg font-bold text-slate-900">{s.value}</p>
            <p className="mt-0.5 text-[9px] uppercase tracking-wide text-slate-400">
              {s.label}
            </p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-indigo-100 bg-indigo-50 py-2.5 text-center text-[10px] font-semibold text-indigo-600">
          + Assignment
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50 py-2.5 text-center text-[10px] font-semibold text-amber-600">
          + Quiz
        </div>
        <div className="rounded-xl border border-purple-100 bg-purple-50 py-2.5 text-center text-[10px] font-semibold text-purple-600">
          + Resource
        </div>
      </div>
    </div>
  );
}

function AIChatMockup() {
  return (
    <div className="space-y-2.5">
      <div className="ml-auto max-w-[75%] rounded-2xl rounded-tr-sm bg-slate-900 px-3.5 py-2.5 text-[11px] text-white">
        Why does the derivative of sin(x) become cos(x)?
      </div>
      <div className="mr-auto max-w-[85%] rounded-2xl rounded-tl-sm border border-emerald-100 bg-emerald-50 px-3.5 py-2.5 text-[11px] leading-relaxed text-slate-700">
        Let's build it from the limit definition — think about what happens to
        the slope as <span className="font-semibold text-emerald-700">h</span>{" "}
        approaches zero...
      </div>
      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2">
        <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
        <span className="text-[11px] text-slate-400">Ask a follow-up…</span>
      </div>
    </div>
  );
}

function QuizMockup() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-800">
          Weekly quiz · Algebra
        </p>
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-semibold uppercase text-amber-600">
          5 Qs
        </span>
      </div>
      <div className="rounded-xl border border-slate-100 bg-white p-3">
        <p className="text-[11px] text-slate-700">Solve for x: 2x + 6 = 14</p>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {["x = 2", "x = 4", "x = 6", "x = 8"].map((opt, i) => (
            <div
              key={opt}
              className={`rounded-lg border px-2 py-1.5 text-center text-[10px] ${
                i === 1
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "border-slate-100 text-slate-500"
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-2 text-[11px] font-medium text-emerald-700">
        <CheckCircle2 className="h-3.5 w-3.5" /> Scored 4 / 5 — nice work
      </div>
    </div>
  );
}

function AssignmentMockup() {
  const items = [
    {
      title: "Photosynthesis lab report",
      status: "Submitted",
      accent: "emerald",
    },
    { title: "Trig identities worksheet", status: "Pending", accent: "amber" },
    { title: "Essay: Cold War origins", status: "Pending", accent: "amber" },
  ];
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.title}
          className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600">
            <FileText className="h-3.5 w-3.5" />
          </div>
          <p className="flex-1 truncate text-[11px] font-medium text-slate-800">
            {item.title}
          </p>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold ${
              item.accent === "emerald"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {item.status}
          </span>
        </div>
      ))}
    </div>
  );
}

function MatchingMockup() {
  const tutors = [
    { name: "Bikash Rai", subject: "Physics · Rs 900/hr", rating: "4.9" },
    { name: "Anjali Gurung", subject: "English · Rs 700/hr", rating: "4.8" },
  ];
  return (
    <div className="space-y-2">
      {tutors.map((t) => (
        <div
          key={t.name}
          className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-600">
            {t.name
              .split(" ")
              .map((p) => p[0])
              .join("")}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-800">
              {t.name}
            </p>
            <p className="truncate text-[11px] text-slate-500">{t.subject}</p>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            <Star className="h-2.5 w-2.5 fill-current" /> {t.rating}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Feature data                                                       */
/* ------------------------------------------------------------------ */

const ACCENTS = {
  emerald: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: "bg-emerald-600",
    glow: "bg-emerald-100/60",
  },
  indigo: {
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: "bg-indigo-600",
    glow: "bg-indigo-100/60",
  },
  amber: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    icon: "bg-amber-500",
    glow: "bg-amber-100/60",
  },
  purple: {
    badge: "bg-purple-50 text-purple-700 border-purple-200",
    icon: "bg-purple-600",
    glow: "bg-purple-100/60",
  },
};

const FEATURES = [
  {
    eyebrow: "For students",
    icon: Calendar,
    accent: "emerald",
    title: "Book a tutor without the back-and-forth",
    description:
      "Browse ranked tutors by subject and rate, send a request, and see every booking's status update live — pending, accepted, with a meeting link ready when it's confirmed.",
    bullets: [
      "Recommendation-ranked tutor search",
      "Live booking status, no email chasing",
      "One click to join when it's time",
    ],
    Mockup: BookingMockup,
  },
  {
    eyebrow: "For tutors",
    icon: Award,
    accent: "indigo",
    title: "Run your whole practice from one workspace",
    description:
      "Publish assignments, quizzes, and resources in seconds, assign them to one student or your whole roster, and see requests and enrolled students without switching tabs.",
    bullets: [
      "Assign content to one student or everyone",
      "Booking requests and schedule in one view",
      "See your enrolled roster at a glance",
    ],
    Mockup: TeacherOverviewMockup,
  },
  {
    eyebrow: "AI-powered",
    icon: MessageCircle,
    accent: "emerald",
    title: "Get unstuck any time, not just during sessions",
    description:
      "The AI Study Assistant walks through problems with guided hints instead of just handing over answers — available between tutoring sessions whenever a question comes up.",
    bullets: [
      "Guided hints, not just answers",
      "Available 24/7 between sessions",
      "Picks up context from the question asked",
    ],
    Mockup: AIChatMockup,
  },
  {
    eyebrow: "AI-powered",
    icon: NotebookPen,
    accent: "amber",
    title: "A fresh practice quiz every week",
    description:
      "A short, AI-generated quiz refreshes weekly for each student, auto-graded the moment it's submitted — so practice stays consistent without any manual grading on the tutor's side.",
    bullets: [
      "Auto-graded on submission",
      "New questions every week",
      "Results shown immediately, no waiting",
    ],
    Mockup: QuizMockup,
  },
  {
    eyebrow: "For students",
    icon: FileText,
    accent: "indigo",
    title: "Assignments and resources, always in reach",
    description:
      "Every assignment shows its status at a glance — pending or submitted — with full instructions and a one-field submission flow. Shared resources come with an AI-written summary so it's clear what's inside before opening it.",
    bullets: [
      "Clear pending vs. submitted status",
      "Submit with just a file link",
      "AI summaries on every shared resource",
    ],
    Mockup: AssignmentMockup,
  },
  {
    eyebrow: "Matching",
    icon: Users,
    accent: "purple",
    title: "Matched with tutors who actually fit",
    description:
      "The recommendation engine ranks tutors by subject fit, rating, and experience — so the first few results are usually the right ones, not a list to sort through.",
    bullets: [
      "Ranked by fit, not just alphabetically",
      "Rating and experience shown up front",
      "Filter by subject and budget",
    ],
    Mockup: MatchingMockup,
  },
];

/* ------------------------------------------------------------------ */
/*  Feature row                                                        */
/* ------------------------------------------------------------------ */

function FeatureRow({ feature, reversed }) {
  const accent = ACCENTS[feature.accent];
  const Icon = feature.icon;
  const Mockup = feature.Mockup;

  return (
    <div
      className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${reversed ? "lg:[&>*:first-child]:order-2" : ""}`}
    >
      <div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${accent.badge}`}
        >
          <Icon className="h-3.5 w-3.5" /> {feature.eyebrow}
        </span>
        <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {feature.title}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-slate-600">
          {feature.description}
        </p>
        <ul className="mt-5 space-y-2.5">
          {feature.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-2.5 text-sm text-slate-600"
            >
              <CheckCircle2
                className={`mt-0.5 h-4 w-4 shrink-0 ${accent.badge.split(" ")[1]}`}
              />
              {bullet}
            </li>
          ))}
        </ul>
      </div>
      <MockupFrame accent={accent}>
        <Mockup />
      </MockupFrame>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                             */
/* ------------------------------------------------------------------ */

export default function Features() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" /> Everything in one place
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Built for how tutoring actually works
          </h2>
          <p className="mt-3 text-base text-slate-500">
            One workspace for booking sessions, publishing coursework, and
            getting help — for students and tutors alike.
          </p>
        </div>

        <div className="mt-20 space-y-24">
          {FEATURES.map((feature, index) => (
            <FeatureRow
              key={feature.title}
              feature={feature}
              reversed={index % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
