export default function Testimonials() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <span className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
          What students say
        </span>

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          {/* Featured quote */}
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

          {/* Two smaller quotes */}
          <div className="space-y-8 lg:col-span-5">
            <div className="border-l-2 border-emerald-200 pl-6">
              <p className="text-slate-700 leading-7">
                "The booking calendar alone saved me hours. I knew exactly when
                my tutor was free instead of going back and forth on Messenger."
              </p>
              <p className="mt-3 text-sm font-medium text-slate-900">
                Sujan Khadka
                <span className="font-normal text-slate-500">
                  {" "}
                  · Computer Science, Bachelor's
                </span>
              </p>
            </div>

            <div className="border-l-2 border-emerald-200 pl-6">
              <p className="text-slate-700 leading-7">
                "I switched tutors once when the first one wasn't explaining
                things the way I needed. Took five minutes to find someone else
                who clicked better."
              </p>
              <p className="mt-3 text-sm font-medium text-slate-900">
                Prakriti Tamang
                <span className="font-normal text-slate-500">
                  {" "}
                  · IELTS preparation
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
