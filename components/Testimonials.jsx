const secondary = [
  {
    initials: "SK",
    name: "Sujan Khadka",
    context: "Computer Science, Bachelor's",
    quote:
      "The booking calendar alone saved me hours. I knew exactly when my tutor was free instead of going back and forth on Messenger.",
  },
  {
    initials: "PT",
    name: "Prakriti Tamang",
    context: "IELTS preparation",
    quote:
      "I switched tutors once when the first one wasn't explaining things the way I needed. Took five minutes to find someone else who clicked better.",
  },
  {
    initials: "RB",
    name: "Roshan Bhattarai",
    context: "SEE preparation",
    quote:
      "My SEE results went from a C to an A in Maths. I don't think that happens without the tutor EduSphere matched me with.",
  },
  {
    initials: "SM",
    name: "Srijana Maharjan",
    context: "Medical entrance, MBBS",
    quote:
      "Finding a Biology tutor who'd actually done the MBBS entrance made a huge difference. The subject filter got me there without guessing.",
  },
  {
    initials: "DT",
    name: "Dipesh Thapa",
    context: "Python · Programming",
    quote:
      "My tutor gave me actual projects to build, not just theory. I checked his reviews first and they said exactly that — so I knew going in.",
  },
  {
    initials: "AS",
    name: "Asmita Shrestha",
    context: "+2 Science, NEB",
    quote:
      "I used the AI assistant between sessions to get unstuck on problems without waiting for my next booking. Really useful during exam week.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <span className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
          What students say
        </span>

        {/* Featured quote + two side quotes */}
        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <blockquote className="text-2xl font-medium leading-snug text-slate-900 sm:text-3xl">
              "I'd tried two tutors before through a Facebook group and neither
              worked out. On EduSphere I could actually see how other students
              rated them before booking, which made the decision a lot less
              stressful."
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                AR
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Anjali Rai
                </p>
                <p className="text-sm text-slate-500">
                  +2 Science, preparing for engineering entrance
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8 lg:col-span-5">
            {secondary.slice(0, 2).map((t) => (
              <div key={t.name} className="border-l-2 border-emerald-200 pl-6">
                <p className="leading-7 text-slate-700">{t.quote}</p>
                <p className="mt-3 text-sm font-medium text-slate-900">
                  {t.name}
                  <span className="font-normal text-slate-500">
                    {" "}
                    · {t.context}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Remaining testimonials as cards */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {secondary.slice(2).map((t) => (
            <div
              key={t.name}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-6"
            >
              <p className="text-sm leading-7 text-slate-600">{t.quote}</p>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {t.name}
                  </p>
                  <p className="text-xs text-slate-500">{t.context}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
