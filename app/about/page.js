import {
  BookOpen,
  Sparkles,
  ShieldCheck,
  BrainCircuit,
  Target,
  Users,
} from "lucide-react";

const pillars = [
  {
    title: "Expert-led sessions",
    description:
      "Connect with experienced tutors who guide you through assignments, concepts, and exam prep at your own pace.",
    icon: Sparkles,
  },
  {
    title: "Trusted workflow",
    description:
      "Built-in booking approvals, profile management, and clear learning paths make every session predictable.",
    icon: ShieldCheck,
  },
  {
    title: "AI-supported learning",
    description:
      "Our Socratic AI assistant helps you think through problems and build real understanding, not just get answers.",
    icon: BrainCircuit,
  },
];

const values = [
  {
    title: "Evidence over guesswork",
    description:
      "Every tutor is shown with verified reviews, response time, and completed lessons, so you choose based on facts.",
    icon: Target,
  },
  {
    title: "Built around real students",
    description:
      "We design for SEE, +2, Bachelor's, and entrance prep schedules, not a generic one-size-fits-all classroom.",
    icon: Users,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Intro */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50/60 p-8 sm:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-50" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-50" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
              <BookOpen className="h-3.5 w-3.5" /> About EduSphere
            </div>

            <h1 className="mt-6 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              We started EduSphere because finding a good tutor shouldn't feel
              like a gamble.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Most students find tutors through word of mouth or a quick search,
              with no way to tell if someone's actually a good fit before paying
              for a session. EduSphere fixes that by putting verified reviews,
              real subject expertise, and clear scheduling in one place, so
              choosing a tutor is a decision you can trust.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { value: "500+", label: "Verified tutors" },
            { value: "10,000+", label: "Students taught" },
            { value: "40+", label: "Subjects covered" },
            { value: "4.9★", label: "Average rating" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
            >
              <p className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Pillars */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            How we think about learning
          </h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Three principles guide every feature we build, from how tutors are
            matched to how the AI assistant responds.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Values */}
        <section className="mt-16 grid gap-6 rounded-3xl border border-slate-200 bg-slate-50/60 p-8 sm:p-10 md:grid-cols-2">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <div key={value.title} className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {value.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {value.description}
                  </p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Closing */}
        <section className="mt-16 border-t border-slate-100 pt-10 text-center">
          <p className="mx-auto max-w-2xl text-slate-600">
            We're a small team based in Nepal, building EduSphere one feature at
            a time alongside the students and tutors who use it every day.
          </p>
        </section>
      </main>
    </div>
  );
}
