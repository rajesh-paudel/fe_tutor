"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, scaleIn, stagger, viewport } from "./ScrollMotion";

const goals = [
  {
    label: "SEE preparation",
    subject: "SEE",
    count: "120+ tutors",
    description:
      "Core subjects covered: English, Math, Science, Social Studies.",
    color: "bg-emerald-50 border-emerald-200 hover:border-emerald-400",
    accent: "text-emerald-700",
  },
  {
    label: "+2 Science",
    subject: "+2 Science",
    count: "95+ tutors",
    description: "Physics, Chemistry, Biology, and Maths for NEB exams.",
    color: "bg-sky-50 border-sky-200 hover:border-sky-400",
    accent: "text-sky-700",
  },
  {
    label: "Bachelor's coursework",
    subject: "Bachelor",
    count: "140+ tutors",
    description: "BBA, BCA, B.Sc, B.Ed and other undergraduate subjects.",
    color: "bg-violet-50 border-violet-200 hover:border-violet-400",
    accent: "text-violet-700",
  },
  {
    label: "Engineering entrance",
    subject: "Engineering",
    count: "60+ tutors",
    description: "IOE and CEE prep with focused Physics and Math coaching.",
    color: "bg-orange-50 border-orange-200 hover:border-orange-400",
    accent: "text-orange-700",
  },
  {
    label: "Medical entrance",
    subject: "Medical",
    count: "40+ tutors",
    description: "MBBS entrance prep: Biology, Chemistry, and Physics.",
    color: "bg-rose-50 border-rose-200 hover:border-rose-400",
    accent: "text-rose-700",
  },
  {
    label: "Programming & web dev",
    subject: "Programming",
    count: "85+ tutors",
    description: "Python, JavaScript, React, and more from working developers.",
    color: "bg-slate-50 border-slate-200 hover:border-slate-400",
    accent: "text-slate-700",
  },
  {
    label: "IELTS / English",
    subject: "English",
    count: "70+ tutors",
    description:
      "Speaking, writing, and listening from experienced IELTS trainers.",
    color: "bg-teal-50 border-teal-200 hover:border-teal-400",
    accent: "text-teal-700",
  },
  {
    label: "Mathematics",
    subject: "Mathematics",
    count: "110+ tutors",
    description: "From basic arithmetic to calculus and discrete math.",
    color: "bg-amber-50 border-amber-200 hover:border-amber-400",
    accent: "text-amber-700",
  },
];

export default function BrowseByGoal() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"
        >
          <div className="max-w-xl">
            <motion.span
              variants={fadeUp}
              className="block text-sm font-semibold uppercase tracking-wider text-emerald-600"
            >
              Browse by goal
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            >
              Whatever you&apos;re studying for,{" "}
              <span className="text-emerald-600">
                there&apos;s a tutor for it.
              </span>
            </motion.h2>
          </div>

          <motion.div variants={fadeUp}>
            <Link
              href="/tutors"
              className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              View all tutors
              <ArrowUpRight size={16} />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {goals.map((goal, index) => (
            <motion.div
              key={goal.label}
              variants={scaleIn}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              custom={index}
              className="h-full"
            >
              <Link
                href={`/tutors?subject=${encodeURIComponent(goal.subject)}`}
                className={`group flex h-full flex-col justify-between rounded-2xl border p-6 transition ${goal.color}`}
              >
                <div>
                  <h3 className={`text-base font-semibold ${goal.accent}`}>
                    {goal.label}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {goal.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">
                    {goal.count}
                  </span>
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm transition group-hover:shadow-md ${goal.accent}`}
                  >
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
