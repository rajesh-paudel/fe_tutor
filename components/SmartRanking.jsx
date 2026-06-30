import Image from "next/image";
import {
  Star,
  BrainCircuit,
  Clock3,
  BadgeCheck,
  TrendingUp,
  Users,
} from "lucide-react";

const rankingFactors = [
  {
    icon: Star,
    title: "Verified Student Reviews",
    score: "35%",
    description:
      "Ratings and detailed reviews from real students help identify tutors who consistently deliver excellent learning experiences.",
  },
  {
    icon: BadgeCheck,
    title: "Teaching Experience",
    score: "20%",
    description:
      "Experienced tutors with proven subject knowledge receive higher confidence scores within the recommendation engine.",
  },
  {
    icon: BrainCircuit,
    title: "Subject Expertise",
    score: "15%",
    description:
      "Tutors are ranked based on specialization and their success in the subjects they teach.",
  },
  {
    icon: Clock3,
    title: "Response Time",
    score: "10%",
    description:
      "Students shouldn't wait days for replies. Faster responses improve tutor visibility.",
  },
  {
    icon: TrendingUp,
    title: "Lesson Completion",
    score: "10%",
    description:
      "Tutors who consistently complete scheduled sessions build stronger platform trust.",
  },
  {
    icon: Users,
    title: "Student Retention",
    score: "10%",
    description:
      "Students returning for additional lessons indicate long-term teaching quality.",
  },
];

export default function SmartRanking() {
  return (
    <section className="bg-[#0d111d] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
            Intelligent Recommendation Engine
          </span>

          <h2 className="mt-6 text-4xl font-bold text-white md:text-5xl">
            Finding the Right Tutor
            <span className="block text-emerald-400">
              Should Never Be Guesswork.
            </span>
          </h2>

          <p className="mt-8 text-lg leading-8 text-gray-400">
            Most tutoring platforms simply display every tutor in the same list.
            TutorHub is different. Our intelligent recommendation engine
            evaluates multiple performance indicators to highlight tutors who
            consistently provide outstanding educational experiences. Instead of
            spending hours comparing profiles, students receive personalized
            recommendations based on quality, expertise, reviews, availability,
            and learning preferences.
          </p>
        </div>

        <div className="mt-20 grid gap-16 lg:grid-cols-2 items-center">
          {/* LEFT */}

          <div>
            <Image
              src="/images/ranking.jpg"
              alt="Tutor Recommendation"
              width={700}
              height={700}
              className="rounded-3xl border border-gray-800"
            />
          </div>

          {/* RIGHT */}

          <div>
            <h3 className="text-3xl font-bold text-white">
              How TutorHub Recommends Teachers
            </h3>

            <p className="mt-6 leading-8 text-gray-400">
              Our recommendation algorithm doesn't simply reward popularity.
              Instead, it evaluates teaching quality using verified educational
              metrics. Every lesson, review, booking, and interaction helps
              build a tutor's professional reputation while ensuring students
              receive reliable recommendations they can trust.
            </p>

            <div className="mt-10 space-y-6">
              {rankingFactors.map((factor) => {
                const Icon = factor.icon;

                return (
                  <div
                    key={factor.title}
                    className="rounded-2xl border border-gray-800 bg-[#111827]/60 p-6 transition hover:border-emerald-500/40"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                          <Icon size={24} />
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-white">
                            {factor.title}
                          </h4>

                          <p className="mt-2 leading-7 text-gray-400">
                            {factor.description}
                          </p>
                        </div>
                      </div>

                      <span className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-400">
                        {factor.score}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dashboard */}

        <div className="mt-24 rounded-3xl border border-gray-800 bg-gradient-to-r from-[#111827] to-[#1e293b] p-10">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="text-3xl font-bold text-white">
                Example Recommendation Score
              </h3>

              <p className="mt-6 leading-8 text-gray-400">
                Every tutor receives a dynamic recommendation score that changes
                over time based on performance. This helps new tutors grow while
                rewarding experienced educators who consistently deliver
                high-quality lessons and maintain excellent student
                relationships.
              </p>
            </div>

            <div className="rounded-2xl bg-[#090d16] p-8 border border-gray-800">
              <div className="flex justify-between">
                <span className="text-gray-400">Recommendation Score</span>
                <span className="text-emerald-400 font-bold">96.4 / 100</span>
              </div>

              <div className="mt-5 h-3 rounded-full bg-gray-800 overflow-hidden">
                <div className="h-full w-[96%] rounded-full bg-emerald-500"></div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex justify-between text-gray-300">
                  <span>Student Reviews</span>
                  <span>★★★★★</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Teaching Experience</span>
                  <span>8 Years</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Response Time</span>
                  <span>8 Minutes</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Lesson Completion</span>
                  <span>99%</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Student Retention</span>
                  <span>94%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
