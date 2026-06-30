import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Subtle background texture */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-emerald-50" />
        <div className="absolute top-1/3 -left-40 h-[360px] w-[360px] rounded-full bg-cyan-50" />
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.04]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M40 0H0V40"
                fill="none"
                stroke="#0f172a"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="grid items-center gap-16 lg:grid-cols-12">
          {/* Left: Copy */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700">
              Now matching students in Nepal with verified tutors
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Find a tutor who actually
              <span className="text-emerald-600"> gets how you learn.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              EduSphere connects students with tutors for SEE, +2, Bachelor's,
              engineering and medical entrance prep, programming, languages, and
              professional courses. Every tutor profile shows real student
              reviews, response time, and subject expertise, so you can pick
              someone based on evidence, not a guess.
            </p>

            <p className="mt-4 max-w-xl text-base leading-7 text-slate-500">
              Between sessions, our AI Study Assistant is there to help you work
              through a tricky problem, review a chapter, or generate a quick
              practice quiz.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/tutors"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-7 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Browse tutor
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/bookings"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-7 py-3.5 text-base font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                View Bookings
              </Link>
            </div>

            {/* Trust row */}
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-slate-100 pt-8">
              <div>
                <p className="text-2xl font-bold text-slate-900">500+</p>
                <p className="text-sm text-slate-500">Verified tutors</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <p className="text-2xl font-bold text-slate-900">10,000+</p>
                <p className="text-sm text-slate-500">Students taught</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <p className="text-2xl font-bold text-slate-900">40+</p>
                <p className="text-sm text-slate-500">Subjects covered</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <Star size={18} className="fill-amber-400 text-amber-400" />
                <p className="text-2xl font-bold text-slate-900">4.9</p>
                <p className="text-sm text-slate-500">average rating</p>
              </div>
            </div>
          </div>

          {/* Right: Lightweight visual proof, no stock image */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
              <p className="text-sm font-medium text-slate-400">
                Recently matched
              </p>

              <div className="mt-4 space-y-4">
                {[
                  {
                    name: "Anjali R.",
                    subject: "Physics · +2",
                    note: "Booked a tutor for entrance prep in under 10 minutes.",
                  },
                  {
                    name: "Sujan K.",
                    subject: "Python · Programming",
                    note: "Found a tutor who teaches with real projects.",
                  },
                  {
                    name: "Prakriti T.",
                    subject: "English · IELTS",
                    note: "Switched tutors once and finally found the right fit.",
                  },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {item.name}{" "}
                        <span className="font-normal text-slate-400">
                          · {item.subject}
                        </span>
                      </p>
                      <p className="mt-1 text-sm text-slate-500">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
