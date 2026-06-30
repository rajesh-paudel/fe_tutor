import Image from "next/image";
import Link from "next/link";
import {
  Search,
  BrainCircuit,
  CalendarCheck2,
  GraduationCap,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discover the Right Tutor",
    icon: Search,
    description:
      "Search tutors by subject, price, experience, language, availability, or teaching style. Instead of browsing endless profiles, quickly narrow down the educators that fit your academic goals.",
  },
  {
    number: "02",
    title: "Receive AI Recommendations",
    icon: BrainCircuit,
    description:
      "Our intelligent recommendation engine analyzes tutor quality, verified reviews, teaching experience, student satisfaction, and your learning preferences to suggest the tutors most likely to help you succeed.",
  },
  {
    number: "03",
    title: "Book Your Lesson",
    icon: CalendarCheck2,
    description:
      "Choose a suitable time, send a booking request, and manage your upcoming classes through your personal dashboard without unnecessary communication delays.",
  },
  {
    number: "04",
    title: "Learn with Expert Guidance",
    icon: GraduationCap,
    description:
      "Attend live tutoring sessions, receive notes, assignments, and learning materials, while communicating directly with your tutor throughout your learning journey.",
  },
  {
    number: "05",
    title: "Improve Every Day",
    icon: TrendingUp,
    description:
      "Track your learning progress, revisit previous lessons, receive personalized AI support, and continue improving with recommendations based on your performance.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#0d111d] py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}

        <div className="text-center max-w-3xl mx-auto">
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300">
            Student Journey
          </span>

          <h2 className="mt-6 text-4xl font-bold text-white md:text-5xl">
            From Finding a Tutor
            <span className="block text-cyan-400">To Achieving Your Goals</span>
          </h2>

          <p className="mt-8 text-lg leading-8 text-gray-400">
            TutorHub simplifies every stage of learning by bringing intelligent
            tutor discovery, AI-powered assistance, scheduling, communication,
            and progress tracking into one seamless platform.
          </p>
        </div>

        {/* Image + Steps */}

        <div className="mt-20 grid gap-16 lg:grid-cols-2">
          {/* Left */}

          <div className="relative">
            <Image
              src="/images/how-it-works.jpg"
              width={700}
              height={800}
              alt="Learning Journey"
              className="rounded-3xl border border-gray-800"
            />

            <div className="absolute bottom-8 left-8 rounded-2xl bg-[#090d16]/90 backdrop-blur-xl border border-gray-800 p-6">
              <h4 className="text-white font-semibold">
                Personalized Learning
              </h4>

              <p className="mt-2 text-gray-400 text-sm leading-6">
                AI recommendations + professional tutors + learning analytics
                create a personalized education experience.
              </p>
            </div>
          </div>

          {/* Right */}

          <div className="space-y-8">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="flex gap-6 rounded-2xl border border-gray-800 bg-[#111827]/60 p-6 transition hover:border-cyan-500/40"
                >
                  <div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                      <Icon size={28} />
                    </div>
                  </div>

                  <div>
                    <span className="text-cyan-400 font-bold">
                      STEP {step.number}
                    </span>

                    <h3 className="mt-2 text-2xl font-semibold text-white">
                      {step.title}
                    </h3>

                    <p className="mt-3 leading-7 text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}

        <div className="mt-24 rounded-3xl border border-gray-800 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 p-10">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h3 className="text-3xl font-bold text-white">
                Ready to Start Learning?
              </h3>

              <p className="mt-5 leading-8 text-gray-300">
                Join thousands of students already learning through TutorHub.
                Discover qualified tutors, receive AI-powered guidance, and
                build your skills through personalized education designed around
                your goals.
              </p>
            </div>

            <div className="flex justify-center lg:justify-end">
              <Link
                href="/register"
                className="inline-flex items-center gap-3 rounded-xl bg-cyan-500 px-8 py-4 font-semibold text-white transition hover:bg-cyan-400"
              >
                Create Free Account
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
