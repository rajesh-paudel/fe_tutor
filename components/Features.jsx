"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Award,
  Calendar,
  CheckCircle2,
  MessageCircle,
  NotebookPen,
  Sparkles,
  Users,
} from "lucide-react";
import {
  fadeLeft,
  fadeRight,
  fadeUp,
  scaleIn,
  stagger,
  viewport,
} from "./ScrollMotion";
import ai from "../assets/ai.png";
import quiz from "../assets/quiz.png";
import request from "../assets/request.png";
import workspace from "../assets/workspace.png";
import matching from "../assets/matching.png";

function MockupFrame({ children, accent, image, imageAlt }) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -8, rotate: -0.5, transition: { duration: 0.25 } }}
      className="relative"
    >
      <motion.div
        className={`pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] blur-2xl ${accent.glow}`}
        animate={{ opacity: [0.45, 0.8, 0.45], scale: [1, 1.06, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
        <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        </div>
        {image ? (
          <motion.div
            initial={{ scale: 1.04 }}
            whileInView={{ scale: 1 }}
            viewport={viewport}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={image}
              alt={imageAlt}
              className="h-auto w-full"
              sizes="(min-width: 1024px) 560px, 100vw"
            />
          </motion.div>
        ) : (
          <div className="bg-slate-50/60 p-5">{children}</div>
        )}
      </div>
    </motion.div>
  );
}

const ACCENTS = {
  emerald: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    glow: "bg-emerald-100/60",
  },
  indigo: {
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
    glow: "bg-indigo-100/60",
  },
  amber: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    glow: "bg-amber-100/60",
  },
  purple: {
    badge: "bg-purple-50 text-purple-700 border-purple-200",
    glow: "bg-purple-100/60",
  },
};

const FEATURES = [
  {
    eyebrow: "For students",
    icon: Calendar,
    accent: "emerald",
    title: "Book a tutor without the back-and-forth",
    description:
      "Browse ranked tutors by subject and rate, send a request, and see every booking status update live: pending, accepted, with a meeting link ready when it is confirmed.",
    bullets: [
      "Recommendation-ranked tutor search",
      "Live booking status, no email chasing",
      "One click to join when it is time",
    ],
    image: request,
    imageAlt: "Booking requests list showing pending and accepted sessions",
  },
  {
    eyebrow: "For tutors",
    icon: Award,
    accent: "indigo",
    title: "Run your whole practice from one workspace",
    description:
      "Publish assignments, quizzes, and resources in seconds, assign them to one student or your whole roster, and see requests and enrolled students without switching tabs.",
    bullets: [
      "Assign content to one student or everyone",
      "Booking requests and schedule in one view",
      "See your enrolled roster at a glance",
    ],
    image: workspace,
    imageAlt: "Tutor workspace dashboard with content stats and quick actions",
  },
  {
    eyebrow: "AI-powered",
    icon: MessageCircle,
    accent: "emerald",
    title: "Get unstuck any time, not just during sessions",
    description:
      "The AI Study Assistant walks through problems with guided hints instead of just handing over answers, available between tutoring sessions whenever a question comes up.",
    bullets: [
      "Guided hints, not just answers",
      "Available 24/7 between sessions",
      "Picks up context from the question asked",
    ],
    image: ai,
    imageAlt: "AI Study Assistant chat guiding a student through a problem",
  },
  {
    eyebrow: "AI-powered",
    icon: NotebookPen,
    accent: "amber",
    title: "A fresh practice quiz every week",
    description:
      "A short, AI-generated quiz refreshes weekly for each student and is auto-graded the moment it is submitted, so practice stays consistent without manual grading.",
    bullets: [
      "Auto-graded on submission",
      "New questions every week",
      "Results shown immediately, no waiting",
    ],
    image: quiz,
    imageAlt: "Weekly AI quiz with multiple choice question and score",
  },
  {
    eyebrow: "Matching",
    icon: Users,
    accent: "purple",
    title: "Matched with tutors who actually fit",
    description:
      "The recommendation engine ranks tutors by subject fit, rating, and experience, so the first few results are usually the right ones, not a list to sort through.",
    bullets: [
      "Ranked by fit, not just alphabetically",
      "Rating and experience shown up front",
      "Filter by subject and budget",
    ],
    image: matching,
    imageAlt: "Ranked tutor matches with subject, rate, and rating",
  },
];

function FeatureRow({ feature, reversed }) {
  const accent = ACCENTS[feature.accent];
  const Icon = feature.icon;
  const copyVariant = reversed ? fadeLeft : fadeRight;
  const imageVariant = reversed ? fadeRight : fadeLeft;

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${reversed ? "lg:[&>*:first-child]:order-2" : ""}`}
    >
      <motion.div variants={copyVariant}>
        <motion.span
          variants={fadeUp}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${accent.badge}`}
        >
          <Icon className="h-3.5 w-3.5" /> {feature.eyebrow}
        </motion.span>
        <motion.h3
          variants={fadeUp}
          className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
        >
          {feature.title}
        </motion.h3>
        <motion.p
          variants={fadeUp}
          className="mt-3 text-base leading-relaxed text-slate-600"
        >
          {feature.description}
        </motion.p>
        <motion.ul variants={stagger} className="mt-5 space-y-2.5">
          {feature.bullets.map((bullet) => (
            <motion.li
              key={bullet}
              variants={fadeUp}
              className="flex items-start gap-2.5 text-sm text-slate-600"
            >
              <CheckCircle2
                className={`mt-0.5 h-4 w-4 shrink-0 ${accent.badge.split(" ")[1]}`}
              />
              {bullet}
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>

      <motion.div variants={imageVariant}>
        <MockupFrame
          accent={accent}
          image={feature.image}
          imageAlt={feature.imageAlt}
        />
      </motion.div>
    </motion.div>
  );
}

export default function Features() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0.18, 0.65], [70, -55]);

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28">
      <motion.div
        style={{ y }}
        className="pointer-events-none absolute right-0 top-32 h-72 w-72 rounded-full bg-sky-50 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
          >
            <Sparkles className="h-3.5 w-3.5" /> Everything in one place
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl"
          >
            Built for how tutoring actually works
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-3 text-base text-slate-500">
            One workspace for booking sessions, publishing coursework, and
            getting help for students and tutors alike.
          </motion.p>
        </motion.div>

        <div className="mt-20 space-y-24">
          {FEATURES.map((feature, index) => (
            <FeatureRow
              key={feature.title}
              feature={feature}
              reversed={index % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
