"use client";

import { useState } from "react";
import Link from "next/link";

import {
  ArrowRight,
  MapPin,
  Clock,
  Briefcase,
  X,
  Loader2,
  Check,
} from "lucide-react";

const OPEN_ROLES = [
  {
    id: "fullstack-dev",
    title: "Full-Stack Developer",
    team: "Engineering",
    type: "Full-time",
    location: "Kathmandu / Remote (Nepal)",
    description:
      "We're a small team building EduSphere from the ground up. You'd work across the Next.js frontend and Node/Express backend, own features end-to-end, and have a real say in how we build things. We move fast and don't have layers of process.",
    responsibilities: [
      "Build and maintain features across the student and tutor dashboards",
      "Work on the recommendation engine and booking system",
      "Review code, write tests, and care about reliability",
      "Help shape technical decisions early on",
    ],
    requirements: [
      "Comfortable with React/Next.js and Node.js",
      "Experience with MongoDB or similar NoSQL databases",
      "Can work independently and communicate clearly",
      "Based in Nepal or willing to work Nepal timezone",
    ],
    nice: [
      "Experience with AI/LLM integrations",
      "Familiarity with TanStack Query, Tailwind, or similar",
    ],
  },
  {
    id: "ui-designer",
    title: "UI/UX Designer",
    team: "Design",
    type: "Full-time",
    location: "Kathmandu / Remote (Nepal)",
    description:
      "We care a lot about how EduSphere feels to use. You'd own the design side — from user flows and wireframes to final UI — working directly with the engineering team. This is a hands-on role, not a slides-and-handoff one.",
    responsibilities: [
      "Design student and tutor-facing screens from flows to polished UI",
      "Run lightweight user research to understand how people actually use the product",
      "Maintain and evolve the design system",
      "Work closely with the engineering team during implementation",
    ],
    requirements: [
      "Strong portfolio of product UI work",
      "Proficient in Figma",
      "Can translate vague product requirements into clear interfaces",
      "Attention to accessibility and responsive design",
    ],
    nice: [
      "Experience designing for education or marketplace products",
      "Some frontend knowledge (HTML/CSS or Tailwind)",
    ],
  },
  {
    id: "growth-marketing",
    title: "Growth & Marketing Associate",
    team: "Marketing",
    type: "Full-time",
    location: "Kathmandu",
    description:
      "EduSphere is growing in Nepal. You'd own the channels that bring students and tutors to the platform — content, social, partnerships with schools and colleges, and anything else that works. We don't have a playbook for this yet, which means you'd write it.",
    responsibilities: [
      "Grow student and tutor signups across organic and paid channels",
      "Build partnerships with schools, colleges, and coaching centres",
      "Own social media presence and content calendar",
      "Track what's working and cut what isn't",
    ],
    requirements: [
      "1–3 years in marketing, growth, or a similar role",
      "Strong written Nepali and English",
      "Comfortable with data — can read a dashboard and draw conclusions",
      "Local network in the Nepal education sector is a strong plus",
    ],
    nice: [
      "Experience running paid campaigns (Meta, Google)",
      "Background in edtech or student-facing products",
    ],
  },
  {
    id: "content-writer",
    title: "Content Writer",
    team: "Content",
    type: "Part-time / Contract",
    location: "Remote (Nepal)",
    description:
      "We need someone who can write clearly about education — blog posts, SEO content, help articles, and email copy. You'd work closely with marketing and product to make sure EduSphere communicates well at every touchpoint.",
    responsibilities: [
      "Write blog posts and SEO articles on study tips, exam prep, and tutoring",
      "Draft help centre content and FAQs",
      "Write emails and in-product copy",
      "Edit and proofread content from other team members",
    ],
    requirements: [
      "Excellent written English (Nepali a strong bonus)",
      "Understand how SEO works at a basic level",
      "Can research unfamiliar topics and write clearly about them",
      "Reliable with deadlines",
    ],
    nice: [
      "Background in education or tutoring",
      "Experience with tools like Notion, Webflow, or similar",
    ],
  },
];

const TYPE_STYLES = {
  "Full-time": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Part-time / Contract": "bg-amber-50 text-amber-700 border-amber-200",
};

const EMPTY_FORM = { name: "", email: "", linkedin: "", note: "" };

export default function CareersPage() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState("idle");
  const [formError, setFormError] = useState("");

  function openModal(role) {
    setSelectedRole(role);
    setForm(EMPTY_FORM);
    setStatus("idle");
    setFormError("");
  }

  function closeModal() {
    setSelectedRole(null);
  }

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleApply(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setFormError("Please fill in your name and email.");
      return;
    }
    setFormError("");
    setStatus("submitting");
    try {
      await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole.title, ...form }),
      });
      setStatus("submitted");
    } catch {
      setStatus("idle");
      setFormError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-slate-100 py-20 sm:py-24">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-50" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-50" />

          <div className="relative mx-auto max-w-7xl px-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              We're hiring
            </span>
            <h1 className="mt-6 max-w-2xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Help us build the tutoring platform Nepal deserves.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              EduSphere is a small team working on a real problem. If you want
              to build something that directly affects how students learn, we'd
              like to hear from you.
            </p>
          </div>
        </section>

        {/* Tutor highlight */}
        <section className="border-b border-slate-100 bg-slate-50/60 py-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:flex-row sm:items-center sm:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                  Also open
                </p>
                <h3 className="mt-1 text-xl font-bold text-slate-900">
                  Tutor positions
                </h3>
                <p className="mt-2 max-w-lg text-sm text-slate-600">
                  We're always looking for verified tutors across all subjects.
                  Set your own rate and schedule, get matched with students, and
                  build a reputation through real reviews.
                </p>
              </div>
              <Link
                href="/become-a-tutor"
                className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Apply as a tutor
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        {/* Open roles */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Open roles
            </h2>
            <p className="mt-2 text-slate-500">
              {OPEN_ROLES.length} positions currently open
            </p>

            <div className="mt-10 space-y-5">
              {OPEN_ROLES.map((role) => (
                <div
                  key={role.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-slate-300 hover:shadow-sm sm:p-8"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {role.title}
                        </h3>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                            TYPE_STYLES[role.type] || TYPE_STYLES["Full-time"]
                          }`}
                        >
                          {role.type}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Briefcase size={13} />
                          {role.team}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} />
                          {role.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={13} />
                          {role.type}
                        </span>
                      </div>

                      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
                        {role.description}
                      </p>

                      <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            You'll work on
                          </p>
                          <ul className="mt-2 space-y-1.5">
                            {role.responsibilities.map((r) => (
                              <li
                                key={r}
                                className="flex items-start gap-2 text-sm text-slate-600"
                              >
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            What we're looking for
                          </p>
                          <ul className="mt-2 space-y-1.5">
                            {role.requirements.map((r) => (
                              <li
                                key={r}
                                className="flex items-start gap-2 text-sm text-slate-600"
                              >
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                                {r}
                              </li>
                            ))}
                          </ul>
                          {role.nice?.length > 0 && (
                            <>
                              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Nice to have
                              </p>
                              <ul className="mt-2 space-y-1.5">
                                {role.nice.map((r) => (
                                  <li
                                    key={r}
                                    className="flex items-start gap-2 text-sm text-slate-500"
                                  >
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-200" />
                                    {r}
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => openModal(role)}
                      className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Apply
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* General interest */}
        <section className="border-t border-slate-100 bg-slate-50/60 py-16">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <h2 className="text-xl font-bold text-slate-900">
              Don't see a role that fits?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">
              If you're genuinely excited about what we're building, send us a
              message anyway. We read every email.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
            >
              Get in touch
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>

      {/* Application modal */}
      {selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border  p-5 border-slate-200 bg-white shadow-xl">
            {/* Modal header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-xs font-medium text-slate-400">
                  Applying for
                </p>
                <h3 className="mt-0.5 text-base font-semibold text-slate-900">
                  {selectedRole.title}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-6">
              {status === "submitted" ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Check size={22} />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">
                    Application sent
                  </h3>
                  <p className="mt-2 max-w-xs text-sm text-slate-500">
                    Thanks for applying for the{" "}
                    <span className="font-medium">{selectedRole.title}</span>{" "}
                    role. We'll be in touch at{" "}
                    <span className="font-medium">{form.email}</span> if there's
                    a good fit.
                  </p>
                  <button
                    onClick={closeModal}
                    className="mt-6 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full name">
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        placeholder="Bikash Sharma"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Email">
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder="you@example.com"
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  <Field label="LinkedIn or portfolio (optional)">
                    <input
                      type="url"
                      value={form.linkedin}
                      onChange={(e) => update("linkedin", e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className={inputCls}
                    />
                  </Field>

                  <Field label="Why are you a good fit for this role?">
                    <textarea
                      rows={4}
                      value={form.note}
                      onChange={(e) => update("note", e.target.value)}
                      placeholder="A few sentences is fine. Tell us what you've done and why this role interests you."
                      className={`resize-none ${inputCls}`}
                    />
                  </Field>

                  {formError && (
                    <p className="text-sm font-medium text-red-600">
                      {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send application"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}
