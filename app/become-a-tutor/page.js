"use client";

import { useState } from "react";

import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  TrendingUp,
  Star,
  Check,
  Loader2,
  X,
  Plus,
} from "lucide-react";

const STEPS = ["Your details", "Teaching info", "Review & submit"];

const SUBJECTS_LIST = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Computer Science",
  "Programming",
  "SEE",
  "+2 Science",
  "Engineering entrance",
  "Medical entrance",
  "IELTS",
];

const perks = [
  {
    icon: CalendarClock,
    title: "Set your own schedule",
    description:
      "Mark the days and times you're free. Students can only book within those slots — no surprise requests outside your availability.",
  },
  {
    icon: TrendingUp,
    title: "Your rate, your call",
    description:
      "You set the hourly rate. We don't cap it or negotiate it down. Your experience and subject expertise determine what you charge.",
  },
  {
    icon: BadgeCheck,
    title: "Verified badge",
    description:
      "Once your credentials are reviewed and approved, your profile shows a verified badge that students can trust.",
  },
  {
    icon: Star,
    title: "Rise through reviews",
    description:
      "Good teaching gets rewarded. Strong reviews and high completion rates push your profile up in search results.",
  },
];

const steps = [
  {
    number: "01",
    title: "Fill in this form",
    description:
      "Your name, subjects, experience, hourly rate, and a short bio. Takes about five minutes.",
  },
  {
    number: "02",
    title: "We review your credentials",
    description:
      "Our team checks the documents you upload. Most applications are reviewed within two business days.",
  },
  {
    number: "03",
    title: "Your profile goes live",
    description:
      "Once approved, you'll get a verified badge and students can start finding and booking you.",
  },
];

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  bio: "",
  subjects: [],
  experienceYears: "",
  hourlyRate: "",
  academicBackground: "",
  whyTeach: "",
};

export default function BecomeATutorPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY_FORM);
  const [subjectDraft, setSubjectDraft] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | submitted
  const [error, setError] = useState("");

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addSubject(val) {
    const trimmed = (val || subjectDraft).trim();
    if (trimmed && !form.subjects.includes(trimmed)) {
      update("subjects", [...form.subjects, trimmed]);
    }
    setSubjectDraft("");
  }

  function removeSubject(s) {
    update(
      "subjects",
      form.subjects.filter((x) => x !== s),
    );
  }

  function validateStep(index) {
    if (index === 0) {
      if (!form.name.trim()) return "Please enter your full name.";
      if (!form.email.trim() || !form.email.includes("@"))
        return "Please enter a valid email address.";
    }
    if (index === 1) {
      if (!form.subjects.length)
        return "Please add at least one subject you teach.";
      if (!form.experienceYears)
        return "Please enter your years of experience.";
      if (!form.hourlyRate) return "Please set your hourly rate.";
      if (!form.bio.trim()) return "Please write a short bio for your profile.";
    }
    return "";
  }

  function handleNext() {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setStep((s) => s + 1);
  }

  function handleBack() {
    setError("");
    setStep((s) => s - 1);
  }

  async function handleSubmit() {
    setError("");
    setStatus("submitting");
    try {
      await fetch("/api/tutor-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus("submitted");
    } catch {
      setStatus("idle");
      setError("Something went wrong. Please try again.");
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
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Apply to teach
              </span>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Teach on your schedule.{" "}
                <span className="text-emerald-600">Earn on your terms.</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                EduSphere connects tutors with students who are actively looking
                for their subject. You set your rate, your availability, and
                your teaching style — we handle the matching and booking.
              </p>
              <a
                href="#apply"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Apply now
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>

        {/* Perks */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Why tutors choose EduSphere
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {perks.map((perk) => {
                const Icon = perk.icon;
                return (
                  <div
                    key={perk.title}
                    className="rounded-2xl border border-slate-200 bg-white p-6"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Icon size={22} />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-slate-900">
                      {perk.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {perk.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-y border-slate-100 bg-slate-50/60 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              How the application works
            </h2>
            <div className="mt-10 grid gap-10 lg:grid-cols-3">
              {steps.map((s) => (
                <div key={s.number}>
                  <span className="text-5xl font-bold text-slate-200">
                    {s.number}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-slate-900">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {s.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application form */}
        <section id="apply" className="py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Start your application
            </h2>
            <p className="mt-2 text-slate-500">
              Takes about five minutes. We'll review it and get back to you
              within two business days.
            </p>

            {/* Step indicator */}
            <div className="mt-8 flex items-center gap-3">
              {STEPS.map((label, i) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition ${
                        i < step
                          ? "bg-emerald-600 text-white"
                          : i === step
                            ? "border-2 border-emerald-600 text-emerald-700"
                            : "border border-slate-200 text-slate-400"
                      }`}
                    >
                      {i < step ? <Check size={13} /> : i + 1}
                    </div>
                    <span
                      className={`text-sm font-medium hidden sm:block ${
                        i === step ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="h-px w-8 bg-slate-200" />
                  )}
                </div>
              ))}
            </div>

            {status === "submitted" ? (
              <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check size={22} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  Application received
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Thanks for applying. We'll review your details and get back to
                  you at <span className="font-medium">{form.email}</span>{" "}
                  within two business days.
                </p>
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                {/* Step 0: Personal details */}
                {step === 0 && (
                  <div className="space-y-5">
                    <h3 className="text-base font-semibold text-slate-900">
                      Your details
                    </h3>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Full name">
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => update("name", e.target.value)}
                          placeholder="Bikash Sharma"
                          className={input}
                        />
                      </Field>
                      <Field label="Email">
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          placeholder="you@example.com"
                          className={input}
                        />
                      </Field>
                    </div>

                    <Field label="Phone (optional)">
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        placeholder="+977 98XXXXXXXX"
                        className={input}
                      />
                    </Field>

                    <Field label="Academic background">
                      <input
                        type="text"
                        value={form.academicBackground}
                        onChange={(e) =>
                          update("academicBackground", e.target.value)
                        }
                        placeholder="e.g. B.Sc Physics, Tribhuvan University"
                        className={input}
                      />
                    </Field>
                  </div>
                )}

                {/* Step 1: Teaching info */}
                {step === 1 && (
                  <div className="space-y-5">
                    <h3 className="text-base font-semibold text-slate-900">
                      Teaching info
                    </h3>

                    <Field label="Subjects you teach">
                      <div className="mb-2 flex flex-wrap gap-2">
                        {form.subjects.map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                          >
                            {s}
                            <button
                              type="button"
                              onClick={() => removeSubject(s)}
                              className="text-emerald-500 hover:text-emerald-700"
                            >
                              <X size={11} />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {SUBJECTS_LIST.filter(
                          (s) => !form.subjects.includes(s),
                        ).map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => addSubject(s)}
                            className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            <Plus size={11} />
                            {s}
                          </button>
                        ))}
                      </div>
                      <input
                        value={subjectDraft}
                        onChange={(e) => setSubjectDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            addSubject();
                          }
                        }}
                        placeholder="Or type a subject and press Enter"
                        className={`mt-3 ${input}`}
                      />
                    </Field>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Years of experience">
                        <input
                          type="number"
                          min="0"
                          value={form.experienceYears}
                          onChange={(e) =>
                            update("experienceYears", e.target.value)
                          }
                          placeholder="e.g. 3"
                          className={input}
                        />
                      </Field>
                      <Field label="Hourly rate (Rs)">
                        <input
                          type="number"
                          min="0"
                          value={form.hourlyRate}
                          onChange={(e) => update("hourlyRate", e.target.value)}
                          placeholder="e.g. 800"
                          className={input}
                        />
                      </Field>
                    </div>

                    <Field label="Short bio">
                      <textarea
                        rows={4}
                        value={form.bio}
                        onChange={(e) => update("bio", e.target.value)}
                        placeholder="Tell students about your teaching style, what levels you cover, and what students can expect from a session with you..."
                        className={`resize-none ${input}`}
                      />
                    </Field>

                    <Field label="Why do you want to teach on EduSphere? (optional)">
                      <textarea
                        rows={3}
                        value={form.whyTeach}
                        onChange={(e) => update("whyTeach", e.target.value)}
                        placeholder="A few sentences is fine."
                        className={`resize-none ${input}`}
                      />
                    </Field>
                  </div>
                )}

                {/* Step 2: Review */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-base font-semibold text-slate-900">
                      Review your application
                    </h3>

                    <ReviewRow label="Name" value={form.name} />
                    <ReviewRow label="Email" value={form.email} />
                    {form.phone && (
                      <ReviewRow label="Phone" value={form.phone} />
                    )}
                    {form.academicBackground && (
                      <ReviewRow
                        label="Academic background"
                        value={form.academicBackground}
                      />
                    )}
                    <ReviewRow
                      label="Subjects"
                      value={
                        <div className="flex flex-wrap gap-1.5">
                          {form.subjects.map((s) => (
                            <span
                              key={s}
                              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      }
                    />
                    <ReviewRow
                      label="Experience"
                      value={`${form.experienceYears} years`}
                    />
                    <ReviewRow
                      label="Hourly rate"
                      value={`Rs ${form.hourlyRate}/hr`}
                    />
                    <ReviewRow label="Bio" value={form.bio} />

                    <p className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 text-xs leading-6 text-slate-500">
                      By submitting this application you agree that EduSphere
                      may review the information above for the purpose of
                      verifying your tutor profile. Your details will not be
                      shared publicly until your application is approved.
                    </p>
                  </div>
                )}

                {error && (
                  <p className="mt-4 text-sm font-medium text-red-600">
                    {error}
                  </p>
                )}

                {/* Navigation buttons */}
                <div className="mt-8 flex items-center justify-between gap-3">
                  {step > 0 ? (
                    <button
                      onClick={handleBack}
                      className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      Back
                    </button>
                  ) : (
                    <span />
                  )}

                  {step < STEPS.length - 1 ? (
                    <button
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Continue
                      <ArrowRight size={15} />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={status === "submitting"}
                      className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {status === "submitting" ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit application
                          <Check size={15} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

const input =
  "w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";

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

function ReviewRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 pb-4 sm:flex-row sm:gap-6">
      <span className="w-40 shrink-0 text-sm font-medium text-slate-500">
        {label}
      </span>
      <span className="text-sm text-slate-900">{value}</span>
    </div>
  );
}
