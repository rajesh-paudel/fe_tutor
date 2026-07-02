"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  FileText,
  GraduationCap,
  Mail,
  NotebookPen,
  Sparkles,
  UserCircle,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Shared building blocks                                             */
/* ------------------------------------------------------------------ */

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex min-h-[160px] flex-col items-center justify-center gap-2 px-6 py-8 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  );
}

function SectionCard({
  icon: Icon,
  iconClass,
  title,
  subtitle,
  action,
  children,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconClass}`}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Modal({ open, onClose, title, subtitle, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-[2px]">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

function AccountCard({ user, role }) {
  const name = user?.name || "Your account";
  const initials = name
    .trim()
    .split(" ")
    .map((part) => part[0] || "")
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-sky-50 text-base font-semibold text-sky-700">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            initials
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">
            {name}
          </p>
          <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{user?.email || "Email not added"}</span>
          </p>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-700">
            <BookOpen className="h-3 w-3" />
            {role || "student"}
          </span>
        </div>
      </div>
      <Link
        href="/profile"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
      >
        <UserCircle className="h-4 w-4" />
        View profile
      </Link>
    </div>
  );
}

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition-colors focus:border-emerald-500 focus:bg-white focus:outline-none";

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function StudentDashboard() {
  const queryClient = useQueryClient();
  const [submissionUrls, setSubmissionUrls] = useState({});
  const [answerMap, setAnswerMap] = useState({});
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [activeResource, setActiveResource] = useState(null);
  // Session-only fallback: ids the student has submitted THIS session.
  // If the API returns a per-assignment submission marker, that takes priority (see hasSubmitted below).
  const [locallySubmitted, setLocallySubmitted] = useState(new Set());
  // Quiz completion result. Seeded from the API if it tells us; otherwise session-only.
  const [quizResult, setQuizResult] = useState(null);

  const sessionKey =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || "guest"
      : "guest";

  const resourcesQuery = useQuery({
    queryKey: ["studentResources", sessionKey],
    queryFn: async () => (await api.get("/resources")).data.data,
  });

  const assignmentsQuery = useQuery({
    queryKey: ["studentAssignments", sessionKey],
    queryFn: async () => (await api.get("/assignments")).data.data,
  });

  const quizzesQuery = useQuery({
    queryKey: ["studentWeeklyQuiz", sessionKey],
    queryFn: async () => (await api.get("/quizzes/weekly")).data,
  });

  const bookingsQuery = useQuery({
    queryKey: ["studentBookings", sessionKey],
    queryFn: async () => (await api.get("/bookings")).data.data,
  });

  const profileQuery = useQuery({
    queryKey: ["studentDashboardProfile", sessionKey],
    queryFn: async () => (await api.get("/profile/me")).data,
  });

  const submitAssignmentMutation = useMutation({
    mutationFn: async ({ assignmentId, fileUrl }) =>
      (await api.post(`/assignments/${assignmentId}/submit`, { fileUrl })).data,
    onSuccess: (data, variables) => {
      toast.success(data.message || "Assignment submission recorded.");
      setLocallySubmitted((prev) => new Set(prev).add(variables.assignmentId));
      queryClient.invalidateQueries(["studentAssignments"]);
    },
    onError: (err) =>
      toast.error(err.response?.data?.error || "Submission failed."),
  });

  const submitQuizMutation = useMutation({
    mutationFn: async ({ quizId, studentAnswers }) =>
      (await api.post(`/quizzes/${quizId}/submit`, { studentAnswers })).data,
    onSuccess: (data, variables) => {
      toast.success(data.message || "Quiz evaluated successfully.");
      setQuizResult({
        score: data.score ?? data.results?.scorePercentage ?? null,
        total:
          data.total ?? data.results?.totalQuestions ?? variables.total ?? null,
        message: data.message || null,
      });
      queryClient.invalidateQueries(["studentWeeklyQuiz"]);
    },
    onError: (err) =>
      toast.error(err.response?.data?.error || "Quiz submission failed."),
  });

  const weeklyQuiz = quizzesQuery.data?.data;
  const nextWeeklyQuizAt = quizzesQuery.data?.nextWeeklyQuizAt;

  const alreadySubmittedQuiz =
    quizzesQuery.data?.alreadySubmitted ??
    quizzesQuery.data?.submitted ??
    weeklyQuiz?.submitted ??
    weeklyQuiz?.isSubmitted;
  const resolvedQuizResult =
    quizResult ||
    (alreadySubmittedQuiz
      ? {
          score: quizzesQuery.data?.score ?? weeklyQuiz?.score ?? null,
          total:
            quizzesQuery.data?.total ?? weeklyQuiz?.questions?.length ?? null,
          message: null,
        }
      : null);

  const hasSubmittedAssignment = (assignment) =>
    locallySubmitted.has(assignment._id) ||
    Boolean(assignment.mySubmission) ||
    Boolean(assignment.hasSubmitted);

  const handleAssignmentSubmit = (assignmentId) => {
    const fileUrl = submissionUrls[assignmentId]?.trim();
    if (!fileUrl) {
      toast.error("Please add a file URL before submitting.");
      return;
    }
    submitAssignmentMutation.mutate({ assignmentId, fileUrl });
  };

  const handleQuizSubmit = () => {
    if (!weeklyQuiz) return;
    const selectedAnswers = weeklyQuiz.questions.map(
      (_, index) => answerMap[weeklyQuiz._id]?.[index] ?? -1,
    );
    if (selectedAnswers.some((a) => a === -1)) {
      toast.error("Please answer every question before submitting.");
      return;
    }
    submitQuizMutation.mutate({
      quizId: weeklyQuiz._id,
      studentAnswers: selectedAnswers,
      total: weeklyQuiz.questions.length,
    });
  };

  const bookings = bookingsQuery.data || [];
  const accountProfile = profileQuery.data?.data;
  const accountUser = accountProfile?.userId;
  const accountRole = profileQuery.data?.role || "student";

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_1fr_1fr]">
          <AccountCard user={accountUser} role={accountRole} />
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-slate-400">
              Active bookings
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {bookings.length}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-slate-400">
              Study tools
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {(assignmentsQuery.data?.length || 0) + (weeklyQuiz ? 1 : 0)}
            </p>
          </div>
        </div>

        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50/60 p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-50" />
          <div className="relative max-w-2xl">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <GraduationCap className="h-3.5 w-3.5" /> Student dashboard
              </div>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                Your study workspace
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Track bookings, work through assignments and quizzes, and get
                help whenever you&apos;re stuck.
              </p>
            </div>
          </div>
        </section>

        {/* CTA row — find a tutor + AI study assistant, side by side so neither dominates */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/tutors"
            className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-emerald-300 hover:bg-slate-50"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Find a tutor</p>
                <p className="text-sm text-slate-500">
                  Browse ranked tutors by subject and rate.
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-slate-600" />
          </Link>

          <Link
            href="/ai-study"
            className="group flex items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  Ask the AI Study Assistant
                </p>
                <p className="text-sm text-slate-500">
                  Guided hints anytime between sessions.
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-emerald-600 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:divide-x lg:divide-slate-200">
          {/* ---------------- LEFT COLUMN ---------------- */}
          <div className="space-y-6 lg:pr-8">
            {/* Resources — compact list */}
            <SectionCard
              icon={BookOpen}
              iconClass="bg-emerald-50 text-emerald-600"
              title="Learning resources"
              subtitle={`${resourcesQuery.data?.length ?? 0} shared by your tutors`}
            >
              {resourcesQuery.isLoading ? (
                <p className="px-5 py-6 text-sm text-slate-400">
                  Loading resources…
                </p>
              ) : !resourcesQuery.data?.length ? (
                <EmptyState
                  icon={BookOpen}
                  title="No resources yet"
                  description="Your tutor's shared materials will show up here."
                />
              ) : (
                <div className="max-h-[280px] space-y-2 overflow-y-auto p-4">
                  {resourcesQuery.data.map((resource) => (
                    <button
                      key={resource._id}
                      onClick={() => setActiveResource(resource)}
                      className="flex w-full items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-left transition-colors hover:border-emerald-200 hover:bg-emerald-50/50"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {resource.title}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {resource.teacherId?.name || "Tutor"}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                    </button>
                  ))}
                </div>
              )}
            </SectionCard>

            {/* Assignments — compact list, full detail + submit lives in the modal */}
            <SectionCard
              icon={FileText}
              iconClass="bg-indigo-50 text-indigo-600"
              title="Assignments"
              subtitle={`${assignmentsQuery.data?.length ?? 0} assigned to you`}
            >
              {assignmentsQuery.isLoading ? (
                <p className="px-5 py-6 text-sm text-slate-400">
                  Loading assignments…
                </p>
              ) : !assignmentsQuery.data?.length ? (
                <EmptyState
                  icon={FileText}
                  title="No assignments yet"
                  description="New tasks from your tutor will appear here."
                />
              ) : (
                <div className="max-h-[280px] space-y-2 overflow-y-auto p-4">
                  {assignmentsQuery.data.map((assignment) => {
                    const submitted = hasSubmittedAssignment(assignment);
                    return (
                      <button
                        key={assignment._id}
                        onClick={() => setActiveAssignment(assignment)}
                        className="flex w-full items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-left transition-colors hover:border-indigo-200 hover:bg-indigo-50/50"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {assignment.title}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {assignment.subject} &middot; Due{" "}
                            {new Date(assignment.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                            submitted
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-amber-200 bg-amber-50 text-amber-700"
                          }`}
                        >
                          {submitted ? "Submitted" : "Pending"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </SectionCard>

            {/* Weekly quiz */}
            <SectionCard
              icon={NotebookPen}
              iconClass="bg-amber-50 text-amber-600"
              title="Weekly AI quiz"
              subtitle="One practice quiz, refreshed weekly"
            >
              <div className="p-5">
                {quizzesQuery.isLoading && (
                  <p className="text-sm text-slate-400">
                    Preparing your weekly practice quiz…
                  </p>
                )}

                {quizzesQuery.isError && (
                  <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                    {quizzesQuery.error?.response?.data?.error ||
                      "Your weekly quiz is not available yet."}
                  </p>
                )}

                {weeklyQuiz && resolvedQuizResult && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <p className="font-semibold text-slate-900">
                        Quiz completed
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      {resolvedQuizResult.message ||
                        (resolvedQuizResult.score != null &&
                        resolvedQuizResult.total != null
                          ? `You scored ${resolvedQuizResult.score} out of ${resolvedQuizResult.total}.`
                          : "Your answers have been submitted and evaluated.")}
                    </p>
                    {nextWeeklyQuizAt && (
                      <p className="mt-2 text-xs text-slate-500">
                        Next quiz opens{" "}
                        {new Date(nextWeeklyQuizAt).toLocaleString()}.
                      </p>
                    )}
                  </div>
                )}

                {weeklyQuiz && !resolvedQuizResult && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900">
                          {weeklyQuiz.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {weeklyQuiz.subject} &middot; AI generated
                        </p>
                      </div>
                      <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] uppercase tracking-wider text-amber-600">
                        {weeklyQuiz.questions?.length || 0} Qs
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      {weeklyQuiz.questions?.map((question, questionIndex) => (
                        <div
                          key={`${weeklyQuiz._id}-${questionIndex}`}
                          className="rounded-lg border border-slate-200 bg-white p-3"
                        >
                          <p className="text-sm text-slate-700">
                            {question.questionText || question.question}
                          </p>
                          <div className="mt-2 grid gap-2">
                            {question.options?.map((option, optionIndex) => (
                              <label
                                key={`${weeklyQuiz._id}-${questionIndex}-${optionIndex}`}
                                className="flex items-center gap-2 text-sm text-slate-600"
                              >
                                <input
                                  type="radio"
                                  name={`${weeklyQuiz._id}-${questionIndex}`}
                                  checked={
                                    (answerMap[weeklyQuiz._id]?.[
                                      questionIndex
                                    ] ?? -1) === optionIndex
                                  }
                                  onChange={() =>
                                    setAnswerMap((prev) => ({
                                      ...prev,
                                      [weeklyQuiz._id]: {
                                        ...(prev[weeklyQuiz._id] || {}),
                                        [questionIndex]: optionIndex,
                                      },
                                    }))
                                  }
                                  className="h-4 w-4 border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                />
                                {option}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleQuizSubmit}
                      disabled={submitQuizMutation.isPending}
                      className="mt-4 rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-400 disabled:opacity-50"
                    >
                      {submitQuizMutation.isPending
                        ? "Submitting..."
                        : "Submit quiz"}
                    </button>
                  </div>
                )}
              </div>
            </SectionCard>
          </div>

          {/* ---------------- RIGHT COLUMN ---------------- */}
          <div className="space-y-6 lg:sticky lg:top-6 lg:h-fit lg:pl-8">
            <SectionCard
              icon={Clock}
              iconClass="bg-emerald-50 text-emerald-600"
              title="My bookings"
              subtitle={`${bookings.length} total`}
            >
              {bookingsQuery.isLoading ? (
                <p className="px-5 py-6 text-sm text-slate-400">
                  Loading bookings…
                </p>
              ) : !bookings.length ? (
                <EmptyState
                  icon={Clock}
                  title="No bookings yet"
                  description="Find a tutor to request your first session."
                />
              ) : (
                <div className="max-h-[480px] min-h-[220px] space-y-2 overflow-y-auto p-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="rounded-xl border border-slate-100 bg-slate-50/60 p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {booking.teacherId?.name || "Tutor"}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {booking.date} &middot; {booking.startTime}–
                            {booking.endTime}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                            booking.status === "accepted"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      {booking.meetingLink && (
                        <a
                          href={booking.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:underline"
                        >
                          Join meeting <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </main>

      {/* ---------------- Resource modal ---------------- */}
      <Modal
        open={!!activeResource}
        onClose={() => setActiveResource(null)}
        title={activeResource?.title}
        subtitle={activeResource?.teacherId?.name || "Tutor"}
      >
        {activeResource && (
          <div className="space-y-4">
            <span className="inline-flex rounded-full border border-slate-200 px-2 py-1 text-[10px] uppercase tracking-wider text-slate-500">
              {(activeResource.fileType || "file").split("/").pop()}
            </span>
            <p className="text-sm leading-6 text-slate-600">
              {activeResource.aiSummary ||
                "No summary available for this resource."}
            </p>
            {activeResource.fileUrl && (
              <a
                href={activeResource.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
              >
                Open resource <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </Modal>

      {/* ---------------- Assignment modal (view + submit) ---------------- */}
      <Modal
        open={!!activeAssignment}
        onClose={() => setActiveAssignment(null)}
        title={activeAssignment?.title}
        subtitle={
          activeAssignment
            ? `${activeAssignment.subject} · Due ${new Date(activeAssignment.dueDate).toLocaleDateString()}`
            : ""
        }
      >
        {activeAssignment && (
          <div className="space-y-5">
            <p className="text-sm leading-6 text-slate-600">
              {activeAssignment.instructions ||
                "No additional instructions provided."}
            </p>

            {hasSubmittedAssignment(activeAssignment) ? (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-sm font-medium text-emerald-700">
                <CheckCircle2 className="h-4 w-4" /> Submission recorded for
                this assignment.
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">
                  Submission URL
                  <input
                    placeholder="https://drive.google.com/..."
                    value={submissionUrls[activeAssignment._id] || ""}
                    onChange={(e) =>
                      setSubmissionUrls((prev) => ({
                        ...prev,
                        [activeAssignment._id]: e.target.value,
                      }))
                    }
                    className={`mt-2 ${fieldClass}`}
                  />
                </label>
                <button
                  onClick={() => handleAssignmentSubmit(activeAssignment._id)}
                  disabled={submitAssignmentMutation.isPending}
                  className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
                >
                  {submitAssignmentMutation.isPending
                    ? "Submitting..."
                    : "Submit assignment"}
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
