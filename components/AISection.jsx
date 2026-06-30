import Image from "next/image";
import {
  BrainCircuit,
  Bot,
  Code2,
  BookOpen,
  Lightbulb,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const aiFeatures = [
  {
    icon: BrainCircuit,
    title: "Concept Explanations",
    description:
      "Understand difficult topics through simple, step-by-step explanations instead of memorizing answers.",
  },
  {
    icon: Code2,
    title: "Programming Help",
    description:
      "Debug code, understand algorithms, and receive hints without instantly revealing the complete solution.",
  },
  {
    icon: BookOpen,
    title: "Smart Summaries",
    description:
      "Turn lengthy notes and chapters into concise summaries that are easier to revise before examinations.",
  },
  {
    icon: Lightbulb,
    title: "Practice Questions",
    description:
      "Generate quizzes and practice problems tailored to your current topic and learning level.",
  },
];

export default function AISection() {
  return (
    <section className="bg-[#090d16] py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}

        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300">
            <Sparkles size={16} />
            AI Learning Assistant
          </span>

          <h2 className="mt-6 text-4xl font-bold text-white md:text-5xl">
            Your Personal AI Tutor,
            <span className="block text-cyan-400">Available Anytime.</span>
          </h2>

          <p className="mt-8 text-lg leading-8 text-gray-400">
            Learning doesn't stop after your tutoring session ends. TutorHub's
            integrated AI Assistant is available 24/7 to help students review
            concepts, solve problems, prepare for exams, generate study plans,
            and answer academic questions. Rather than simply giving answers,
            the assistant encourages understanding through guided explanations,
            helping students develop confidence and stronger problem-solving
            skills.
          </p>
        </div>

        {/* Main Layout */}

        <div className="mt-20 grid items-center gap-16 lg:grid-cols-2">
          {/* Image */}

          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-gray-800">
              <Image
                src="/images/ai.jpg"
                alt="AI Assistant"
                width={700}
                height={700}
                className="w-full object-cover"
              />
            </div>

            {/* Floating Card */}

            <div className="absolute -bottom-8 left-8 rounded-2xl border border-cyan-500/20 bg-[#111827]/90 p-5 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-cyan-500/20 p-3">
                  <Bot className="text-cyan-400" size={24} />
                </div>

                <div>
                  <p className="font-semibold text-white">
                    AI Assistant Online
                  </p>

                  <p className="text-sm text-gray-400">
                    Ready to answer your questions
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}

          <div>
            <h3 className="text-3xl font-bold text-white">
              More Than Just A Chatbot
            </h3>

            <p className="mt-6 leading-8 text-gray-400">
              Our AI assistant works alongside your teachers, not in place of
              them. It acts as your personal study companion by helping you
              understand concepts, review lessons, and prepare for exams
              whenever you need additional guidance.
            </p>

            <p className="mt-6 leading-8 text-gray-400">
              Whether you're solving mathematical equations, learning a
              programming language, studying science, practicing English, or
              revising university materials, the AI adapts to your learning
              needs and encourages deeper understanding through interactive
              explanations.
            </p>

            {/* Features */}

            <div className="mt-10 grid gap-6">
              {aiFeatures.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="flex gap-5 rounded-2xl border border-gray-800 bg-[#111827]/60 p-5 hover:border-cyan-500/40 transition"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                      <Icon size={24} />
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white">
                        {feature.title}
                      </h4>

                      <p className="mt-2 text-gray-400 leading-7">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              href="/register"
              className="mt-10 inline-flex items-center gap-3 rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-white transition hover:bg-cyan-400"
            >
              Experience AI Learning
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
