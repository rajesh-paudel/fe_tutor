import Link from "next/link";
import { ArrowRight, GraduationCap, BookOpen } from "lucide-react";

export default function JoinSplit() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Student side */}
          <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-emerald-50 p-8 sm:p-10">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-100" />

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <BookOpen size={22} />
              </div>

              <h3 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
                Looking for a tutor?
              </h3>
              <p className="mt-3 max-w-sm text-slate-600 leading-7">
                Search by subject, see verified reviews, and book a session in
                minutes. No spreadsheets, no Facebook groups, no guessing who's
                actually good.
              </p>

              <ul className="mt-6 space-y-2 text-sm text-slate-600">
                {[
                  "500+ verified tutors across 40+ subjects",
                  "Real reviews from students who actually attended",
                  "Book directly — no back-and-forth messaging",
                  "AI assistant available between sessions",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    {point}
                  </li>
                ))}
              </ul>

              <Link
                href="/tutors"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Find a tutor
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Tutor side */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 p-8 sm:p-10">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/5" />

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white">
                <GraduationCap size={22} />
              </div>

              <h3 className="mt-6 text-2xl font-bold tracking-tight text-white">
                Are you a tutor?
              </h3>
              <p className="mt-3 max-w-sm leading-7 text-slate-300">
                Build a profile, set your own schedule and rate, and get matched
                with students who are genuinely looking for your subject. No
                commission on bookings below a certain threshold.
              </p>

              <ul className="mt-6 space-y-2 text-sm text-slate-300">
                {[
                  "Set your own hourly rate and availability",
                  "Students find you through AI-powered matching",
                  "Manage bookings from one dashboard",
                  "Build a reputation through verified student reviews",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                    {point}
                  </li>
                ))}
              </ul>

              <Link
                href="/become-a-tutor"
                className="mt-8 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Apply as a tutor
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
