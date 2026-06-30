import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const goals = [
  { label: "SEE preparation", count: "120+ tutors" },
  { label: "+2 Science", count: "95+ tutors" },
  { label: "Bachelor's coursework", count: "140+ tutors" },
  { label: "Engineering entrance", count: "60+ tutors" },
  { label: "Medical entrance (MBBS)", count: "40+ tutors" },
  { label: "Programming & web dev", count: "85+ tutors" },
  { label: "IELTS / English", count: "70+ tutors" },
  { label: "Mathematics", count: "110+ tutors" },
];

export default function BrowseByGoal() {
  return (
    <section className="bg-slate-50/60 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
              Browse by goal
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Whatever you're studying for, there's a tutor for it.
            </h2>
          </div>

          <Link
            href="/tutors"
            className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            View all subjects
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          {goals.map((goal) => (
            <Link
              key={goal.label}
              href={`/tutors?goal=${encodeURIComponent(goal.label)}`}
              className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              <span className="font-medium text-slate-800 group-hover:text-emerald-700">
                {goal.label}
              </span>
              <span className="text-slate-400">{goal.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
