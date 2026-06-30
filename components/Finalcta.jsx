import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FinalCta() {
  return (
    <section className="bg-white pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-slate-900 px-8 py-14 sm:px-14 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Stop scrolling through profiles. Start your first lesson.
            </h2>
            <p className="mt-4 text-slate-300 leading-7">
              It takes less than five minutes to find a tutor who fits your
              subject, schedule, and budget.
            </p>
          </div>

          <Link
            href="/register"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-emerald-500 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-emerald-400"
          >
            Get started for free
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
