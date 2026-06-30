import {
  ShieldCheck,
  Star,
  Users,
  TrendingUp,
  BadgeCheck,
  BrainCircuit,
  Lock,
  Clock3,
} from "lucide-react";

const stats = [
  {
    value: "10,000+",
    label: "Active Students",
  },
  {
    value: "500+",
    label: "Verified Tutors",
  },
  {
    value: "40+",
    label: "Subjects Available",
  },
  {
    value: "4.9/5",
    label: "Average Student Rating",
  },
];

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Tutor Profiles",
    description:
      "Every educator builds a professional profile with qualifications, teaching experience, and verified student feedback.",
  },
  {
    icon: BrainCircuit,
    title: "AI Powered Learning",
    description:
      "Our AI assistant helps students understand concepts, solve problems, and revise lessons through guided explanations.",
  },
  {
    icon: BadgeCheck,
    title: "Quality-Based Recommendations",
    description:
      "Tutors are recommended using intelligent ranking algorithms rather than random ordering.",
  },
  {
    icon: Star,
    title: "Verified Reviews",
    description:
      "Every review comes from students who have completed real tutoring sessions.",
  },
  {
    icon: Clock3,
    title: "Easy Scheduling",
    description:
      "Book lessons based on your availability with an organized booking workflow.",
  },
  {
    icon: Lock,
    title: "Secure Learning Platform",
    description:
      "Your bookings, conversations, and educational resources are managed in one secure platform.",
  },
];

export default function TrustSection() {
  return (
    <section className="bg-[#090d16] py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}

        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
            Why Students Trust TutorHub
          </span>

          <h2 className="mt-6 text-4xl font-bold text-white md:text-5xl">
            Built Around Quality,
            <span className="block text-emerald-400">
              Transparency & Better Learning
            </span>
          </h2>

          <p className="mt-8 text-lg leading-8 text-gray-400">
            TutorHub isn't just another tutoring marketplace. Every feature has
            been designed to improve learning outcomes, simplify tutor
            discovery, and create an environment where both students and
            teachers can succeed. By combining intelligent technology with
            experienced educators, we help learners focus on what truly
            matters—building knowledge and achieving academic success.
          </p>
        </div>

        {/* Statistics */}

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-gray-800 bg-[#111827]/60 p-8 text-center"
            >
              <h3 className="text-5xl font-black text-emerald-400">
                {item.value}
              </h3>

              <p className="mt-4 text-gray-400">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Feature Grid */}

        <div className="mt-24 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-3xl border border-gray-800 bg-[#111827]/60 p-8 transition duration-300 hover:-translate-y-2 hover:border-emerald-500/40"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                  <Icon size={30} />
                </div>

                <h3 className="mt-6 text-2xl font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-5 leading-8 text-gray-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}

        <div className="mt-24 rounded-3xl border border-gray-800 bg-gradient-to-r from-[#111827] to-[#1e293b] p-10">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h3 className="text-3xl font-bold text-white">
                Learn With Confidence
              </h3>

              <p className="mt-6 leading-8 text-gray-300">
                From intelligent tutor recommendations and AI-assisted learning
                to verified reviews and progress tracking, TutorHub provides
                everything needed to make education more effective, accessible,
                and enjoyable for students while giving teachers the tools to
                build successful teaching careers.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-8">
                <Users className="mx-auto text-emerald-400" size={50} />

                <h4 className="mt-5 text-center text-2xl font-bold text-white">
                  Join Our Growing Community
                </h4>

                <p className="mt-4 text-center leading-7 text-gray-300">
                  Thousands of students and tutors are already learning,
                  teaching, and growing together through TutorHub.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
