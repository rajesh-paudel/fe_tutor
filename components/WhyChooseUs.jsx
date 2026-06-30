import {
  ShieldCheck,
  BrainCircuit,
  Star,
  CalendarClock,
  BookOpen,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified tutor profiles",
    description:
      "Every tutor lists real qualifications, teaching experience, and reviews from students who actually booked a session, not a star rating with no history behind it.",
  },
  {
    icon: BrainCircuit,
    title: "Matching, not searching",
    description:
      "Tell us your subject, level, and schedule, and we surface tutors who fit, instead of handing you a list of 500 profiles to filter through yourself.",
  },
  {
    icon: Star,
    title: "Rankings tutors earn",
    description:
      "A tutor's position is shaped by lesson completion, response time, and how often past students rebook them, so good teaching is what actually rises to the top.",
  },
  {
    icon: CalendarClock,
    title: "Scheduling without the back-and-forth",
    description:
      "See a tutor's real availability and book directly. No waiting two days for a reply just to find out they're full this week.",
  },
  {
    icon: BookOpen,
    title: "One dashboard for everything",
    description:
      "Bookings, lesson notes, study materials, and your AI assistant live in one place, so you're not piecing your learning together across five apps.",
  },
  {
    icon: TrendingUp,
    title: "Progress you can actually see",
    description:
      "Revisit past lessons and track what you've covered, so prepping for the next exam starts from where you left off, not from zero.",
  },
];

const matchFactors = [
  { label: "Subject expertise", value: 92 },
  { label: "Verified reviews", value: 88 },
  { label: "Response time", value: 81 },
  { label: "Schedule fit", value: 95 },
];

export default function WhyChoose() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="max-w-3xl flex flex-col items-center justify-center mx-auto">
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            Why EduSphere
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Built around how students
            <span className="block text-emerald-600">
              actually choose a tutor.
            </span>
          </h2>

          <p className="mt-8 text-lg leading-8 text-slate-600">
            Most tutoring sites are just a directory: scroll, guess, hope it
            works out. EduSphere replaces the guessing with evidence. Every
            match is backed by verified reviews, real performance history, and a
            fit check against what you're actually trying to learn.
          </p>
        </div>

        {/* Signature: how a match is scored */}
        <div className="mt-20 grid items-center gap-16 lg:grid-cols-2">
          <div>
            <h3 className="text-3xl font-bold tracking-tight text-slate-900">
              How we decide who to show you.
            </h3>

            <p className="mt-6 leading-8 text-slate-600">
              When you search for a tutor, we're not sorting by who paid for
              placement. Every active tutor gets scored against your request on
              a handful of concrete signals, and the ones who score highest show
              up first.
            </p>

            <p className="mt-6 leading-8 text-slate-600">
              That score updates as tutors teach more lessons and collect more
              reviews, so a tutor who's slipping in responsiveness or completion
              rate drops, and one who's earning strong feedback moves up.
              Nobody's position is permanent.
            </p>

            <p className="mt-6 leading-8 text-slate-600">
              It's the same logic whether you're cramming for SEE next month or
              looking for a long-term mentor through your Bachelor's degree.
            </p>
          </div>

          {/* Score card */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Example match
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  Physics tutor · +2 entrance prep
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
                94
              </div>
            </div>

            <div className="mt-8 space-y-5">
              {matchFactors.map((factor) => (
                <div key={factor.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      {factor.label}
                    </span>
                    <span className="text-slate-500">{factor.value}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{ width: `${factor.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-7 border-t border-slate-200 pt-5 text-sm leading-6 text-slate-500">
              Scores are calculated per search, based on your subject, level,
              and availability against each tutor's actual track record.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Icon size={28} />
                </div>

                <h3 className="text-xl font-semibold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
