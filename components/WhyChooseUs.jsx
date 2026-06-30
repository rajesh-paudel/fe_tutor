import Image from "next/image";
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
    title: "Verified & Trusted Tutors",
    description:
      "Every tutor builds a professional profile showcasing qualifications, teaching experience, subjects, and verified student reviews so learners can make confident decisions.",
  },
  {
    icon: BrainCircuit,
    title: "AI Smart Recommendations",
    description:
      "Instead of displaying random tutor listings, our recommendation engine analyzes multiple factors to suggest tutors that best match your learning style and academic goals.",
  },
  {
    icon: Star,
    title: "Quality Based Ranking",
    description:
      "Tutor rankings are influenced by teaching quality, review scores, student retention, lesson completion, responsiveness, and overall learning satisfaction.",
  },
  {
    icon: CalendarClock,
    title: "Flexible Scheduling",
    description:
      "Book one-time sessions or recurring classes based on your availability without the hassle of endless messaging.",
  },
  {
    icon: BookOpen,
    title: "Everything in One Dashboard",
    description:
      "Assignments, bookings, notes, study resources, upcoming lessons, and AI assistance are all available in one organized workspace.",
  },
  {
    icon: TrendingUp,
    title: "Continuous Learning",
    description:
      "Track your progress, revisit previous lessons, and receive personalized recommendations as your learning journey evolves.",
  },
];

export default function WhyChoose() {
  return (
    <section className="bg-[#0d111d] py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}

        <div className="max-w-3xl">
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
            Why Choose TutorHub
          </span>

          <h2 className="mt-6 text-4xl font-bold text-white md:text-5xl">
            Learning Designed Around Students,
            <span className="block text-emerald-400">
              Powered by Intelligent Technology.
            </span>
          </h2>

          <p className="mt-8 text-lg leading-8 text-gray-400">
            Finding the right tutor shouldn't depend on luck or scrolling
            through hundreds of social media posts. TutorHub combines modern
            technology with quality education to create an intelligent learning
            experience. Every recommendation is backed by verified reviews,
            performance metrics, teaching expertise, and AI-powered matching,
            helping students spend less time searching and more time learning.
          </p>
        </div>

        {/* Image + Story */}

        <div className="mt-20 grid items-center gap-16 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl border border-gray-800">
            <Image
              src="/images/students.jpg"
              alt="Students studying"
              width={700}
              height={700}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-transparent" />
          </div>

          <div>
            <h3 className="text-3xl font-bold text-white">
              Education Should Be Personalized.
            </h3>

            <p className="mt-6 leading-8 text-gray-400">
              Every student learns differently. Some require detailed
              explanations and long-term mentorship, while others simply need a
              few sessions before an important examination. TutorHub recognizes
              these differences by helping students discover educators who match
              their individual learning preferences instead of simply listing
              every available tutor.
            </p>

            <p className="mt-6 leading-8 text-gray-400">
              Our recommendation engine considers multiple indicators including
              teaching experience, verified student feedback, lesson completion
              rates, response time, subject expertise, and overall tutor
              performance. This creates a smarter matching experience that
              increases student satisfaction and learning outcomes.
            </p>

            <p className="mt-6 leading-8 text-gray-400">
              Whether you're preparing for university examinations, improving
              programming skills, mastering mathematics, or learning a new
              language, TutorHub provides an organized environment where
              education becomes easier, more accessible, and more enjoyable for
              both students and teachers.
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
                className="rounded-2xl border border-gray-800 bg-[#111827]/60 p-8 transition duration-300 hover:-translate-y-2 hover:border-emerald-500/40"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Icon size={28} />
                </div>

                <h3 className="text-xl font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-400">
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
