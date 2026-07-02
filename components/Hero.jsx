"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Star } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const RECENT_MATCHES = [
  {
    name: "Anjali R.",
    subject: "Physics · +2",
    note: "Booked a tutor for entrance prep in under 10 minutes.",
  },
  {
    name: "Sujan K.",
    subject: "Python · Programming",
    note: "Found a tutor who teaches with real projects.",
  },
  {
    name: "Prakriti T.",
    subject: "English · IELTS",
    note: "Switched tutors once and finally found the right fit.",
  },
];

const listVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0 },
};

function RecentMatchesCard() {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 150,
    damping: 20,
  });

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="relative" style={{ perspective: 1200 }}>
      {/* Ambient animated glow behind the card */}
      <motion.div
        className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-br from-emerald-200/40 via-cyan-100/30 to-transparent blur-3xl"
        animate={{ scale: [1, 1.08, 1], rotate: [0, 8, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-sm"
      >
        {/* Floating "live" badge */}
        <motion.div
          className="absolute -top-3 -right-3 flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-md"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ transform: "translateZ(40px)" }}
        >
          <span className="relative flex h-2 w-2">
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full bg-emerald-400"
              animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Live matches
        </motion.div>

        <p className="text-sm font-medium text-slate-400">Recently matched</p>

        <motion.div
          className="mt-4 space-y-4"
          variants={listVariants}
          initial="hidden"
          animate="show"
        >
          {RECENT_MATCHES.map((item, index) => (
            <motion.div
              key={item.name}
              variants={rowVariants}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ transform: "translateZ(20px)" }}
              className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4"
            >
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                <motion.span
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "conic-gradient(from 0deg, #10b981, #67e8f9, #10b981)",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  aria-hidden="true"
                />
                <span className="relative flex h-[34px] w-[34px] items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                  {item.name.charAt(0)}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800">
                  {item.name}{" "}
                  <span className="font-normal text-slate-400">
                    · {item.subject}
                  </span>
                </p>
                <p className="mt-1 text-sm text-slate-500">{item.note}</p>
              </div>

              <motion.div
                className="mt-0.5 shrink-0 text-emerald-500"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.4 + index * 0.15,
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                }}
              >
                <CheckCircle2 className="h-4 w-4" />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Subtle background texture */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-emerald-50" />
        <div className="absolute top-1/3 -left-40 h-[360px] w-[360px] rounded-full bg-cyan-50" />
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.04]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M40 0H0V40"
                fill="none"
                stroke="#0f172a"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="grid items-center gap-16 lg:grid-cols-12">
          {/* Left: Copy */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700">
              Now matching students in Nepal with verified tutors
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Find a tutor who actually
              <span className="text-emerald-600"> gets how you learn.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              EduSphere connects students with tutors for SEE, +2, Bachelor's,
              engineering and medical entrance prep, programming, languages, and
              professional courses. Every tutor profile shows real student
              reviews, response time, and subject expertise, so you can pick
              someone based on evidence, not a guess.
            </p>

            <p className="mt-4 max-w-xl text-base leading-7 text-slate-500">
              Between sessions, our AI Study Assistant is there to help you work
              through a tricky problem, review a chapter, or generate a quick
              practice quiz.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/tutors"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-7 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Browse tutor
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/bookings"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-7 py-3.5 text-base font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                View Bookings
              </Link>
            </div>

            {/* Trust row */}
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-slate-100 pt-8">
              <div>
                <p className="text-2xl font-bold text-slate-900">5+</p>
                <p className="text-sm text-slate-500">Verified tutors</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <p className="text-2xl font-bold text-slate-900">10+</p>
                <p className="text-sm text-slate-500">Students taught</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <p className="text-2xl font-bold text-slate-900">15+</p>
                <p className="text-sm text-slate-500">Subjects covered</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <Star size={18} className="fill-amber-400 text-amber-400" />
                <p className="text-2xl font-bold text-slate-900">4.9</p>
                <p className="text-sm text-slate-500">average rating</p>
              </div>
            </div>
          </div>

          {/* Right: animated visual proof card */}
          <div className="lg:col-span-5">
            <RecentMatchesCard />
          </div>
        </div>
      </div>
    </section>
  );
}
