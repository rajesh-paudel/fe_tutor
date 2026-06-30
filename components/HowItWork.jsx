const steps = [
  {
    number: "01",
    title: "Tell us what you need",
    description:
      "Pick your subject, level, and whether you want a one-off session before an exam or ongoing weekly classes.",
  },
  {
    number: "02",
    title: "Compare real tutors",
    description:
      "See verified reviews, response time, and actual availability for each match, no messaging ten people just to find out who's free.",
  },
  {
    number: "03",
    title: "Book and start learning",
    description:
      "Confirm a time slot directly on the tutor's calendar. Your first session is usually within the same week.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
            How it works
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            From searching to your first lesson, in three steps.
          </h2>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-bold text-slate-200">
                  {step.number}
                </span>
                <h3 className="text-xl font-semibold text-slate-900">
                  {step.title}
                </h3>
              </div>
              <p className="mt-4 max-w-sm text-slate-600 leading-7">
                {step.description}
              </p>

              {index < steps.length - 1 && (
                <div className="absolute right-[-1.5rem] top-2 hidden h-px w-12 bg-slate-200 lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
