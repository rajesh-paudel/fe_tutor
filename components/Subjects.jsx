import Link from "next/link";
import {
  Calculator,
  Atom,
  FlaskConical,
  BookOpen,
  Globe,
  Code2,
  BrainCircuit,
  Database,
  Palette,
  Briefcase,
  Landmark,
  ArrowRight,
} from "lucide-react";

const subjects = [
  {
    title: "Computer Science",
    tutors: "120+ Tutors",
    icon: Code2,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    description:
      "Programming, Data Structures, Algorithms, DBMS, Operating Systems, Web Development, AI, and more.",
  },
  {
    title: "Mathematics",
    tutors: "95+ Tutors",
    icon: Calculator,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    description:
      "Build strong analytical skills with expert guidance from school mathematics to advanced university courses.",
  },
  {
    title: "Physics",
    tutors: "70+ Tutors",
    icon: Atom,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    description:
      "Master mechanics, electricity, optics, thermodynamics, and modern physics through conceptual learning.",
  },
  {
    title: "Chemistry",
    tutors: "65+ Tutors",
    icon: FlaskConical,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    description:
      "Understand physical, organic, and inorganic chemistry with interactive problem-solving sessions.",
  },
  {
    title: "English",
    tutors: "80+ Tutors",
    icon: Globe,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    description:
      "Improve grammar, speaking, writing, IELTS preparation, and communication skills.",
  },
  {
    title: "Artificial Intelligence",
    tutors: "40+ Tutors",
    icon: BrainCircuit,
    color: "text-cyan-300",
    bg: "bg-cyan-500/10",
    description:
      "Learn Machine Learning, Neural Networks, Deep Learning, and modern AI technologies.",
  },
  {
    title: "Data Science",
    tutors: "45+ Tutors",
    icon: Database,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    description:
      "Data Analysis, Python, SQL, Statistics, Visualization, and predictive analytics.",
  },
  {
    title: "Graphic Design",
    tutors: "35+ Tutors",
    icon: Palette,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    description:
      "Master Photoshop, Illustrator, Figma, UI/UX Design, and creative digital skills.",
  },
  {
    title: "Business & Accounting",
    tutors: "60+ Tutors",
    icon: Briefcase,
    color: "text-green-400",
    bg: "bg-green-500/10",
    description:
      "Financial Accounting, Economics, Business Studies, Marketing, and Entrepreneurship.",
  },
  {
    title: "Entrance Preparation",
    tutors: "50+ Tutors",
    icon: Landmark,
    color: "text-red-400",
    bg: "bg-red-500/10",
    description:
      "Prepare for SEE, +2, Bachelor's, Engineering, Medical, Loksewa, and competitive examinations.",
  },
];

export default function Subjects() {
  return (
    <section className="bg-[#090d16] py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}

        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
            Explore Subjects
          </span>

          <h2 className="mt-6 text-4xl font-bold text-white md:text-5xl">
            Learn Without Limits
          </h2>

          <p className="mt-8 text-lg leading-8 text-gray-400">
            Whether you're preparing for school examinations, university
            courses, professional certifications, or simply exploring a new
            skill, TutorHub connects you with passionate educators across a wide
            range of academic and professional subjects. Every subject includes
            experienced tutors, personalized learning paths, and AI support
            designed to help you reach your goals faster.
          </p>
        </div>

        {/* Cards */}

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {subjects.map((subject) => {
            const Icon = subject.icon;

            return (
              <div
                key={subject.title}
                className="group rounded-3xl border border-gray-800 bg-[#111827]/70 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-500/40"
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl ${subject.bg} ${subject.color}`}
                >
                  <Icon size={30} />
                </div>

                <h3 className="mt-6 text-2xl font-semibold text-white">
                  {subject.title}
                </h3>

                <p className="mt-2 text-sm font-medium text-emerald-400">
                  {subject.tutors}
                </p>

                <p className="mt-5 leading-7 text-gray-400">
                  {subject.description}
                </p>

                <Link
                  href="/tutors"
                  className="mt-8 inline-flex items-center gap-2 font-medium text-white transition group-hover:text-emerald-400"
                >
                  Browse Tutors
                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}

        <div className="mt-24 rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 p-10">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h3 className="text-3xl font-bold text-white">
                Can't Find Your Subject?
              </h3>

              <p className="mt-6 leading-8 text-gray-300">
                TutorHub continues to grow every day with educators from
                different academic disciplines and professional industries. New
                tutors join our platform regularly, bringing expertise in
                emerging technologies, languages, creative fields, and
                specialized examination preparation.
              </p>
            </div>

            <div className="flex justify-center lg:justify-end">
              <Link
                href="/tutors"
                className="rounded-xl bg-emerald-500 px-8 py-4 text-lg font-semibold text-white transition hover:bg-emerald-400"
              >
                Explore All Subjects
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
