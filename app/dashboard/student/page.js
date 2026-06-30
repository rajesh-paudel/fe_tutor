"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";

import {
  Search,
  Sparkles,
  Star,
  Clock,
  BookOpen,
  FileText,
  NotebookPen,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

const getDefaultBookingDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 3);
  return date.toISOString().split("T")[0];
};

export default function StudentDashboard() {
  const queryClient = useQueryClient();
  const [subject, setSubject] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [submissionUrls, setSubmissionUrls] = useState({});
  const [answerMap, setAnswerMap] = useState({});

  const marketplaceQuery = useQuery({
    queryKey: ["rankedTutors", subject, maxPrice],
    queryFn: async () => {
      const params = {};
      if (subject) params.subject = subject;
      if (maxPrice) params.maxPrice = maxPrice;
      const response = await api.get("/tutors/search", { params });
      return response.data.data;
    },
  });

  const resourcesQuery = useQuery({
    queryKey: ["studentResources", subject],
    queryFn: async () => {
      const params = {};
      if (subject) params.subject = subject;
      const response = await api.get("/resources", { params });
      return response.data.data;
    },
  });

  const assignmentsQuery = useQuery({
    queryKey: ["studentAssignments"],
    queryFn: async () => {
      const response = await api.get("/assignments");
      return response.data.data;
    },
  });

  const quizzesQuery = useQuery({
    queryKey: ["studentQuizzes"],
    queryFn: async () => {
      const response = await api.get("/quizzes");
      return response.data.data;
    },
  });

  const bookingsQuery = useQuery({
    queryKey: ["studentBookings"],
    queryFn: async () => {
      const response = await api.get("/bookings");
      return response.data.data;
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async ({ teacherId, date, startTime, endTime }) => {
      const response = await api.post("/bookings", {
        teacherId,
        date,
        startTime,
        endTime,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Booking request sent. Your tutor will review it shortly.");
      queryClient.invalidateQueries(["studentBookings"]);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.error || "Booking request could not be placed.",
      );
    },
  });

  const submitAssignmentMutation = useMutation({
    mutationFn: async ({ assignmentId, fileUrl }) => {
      const response = await api.post(`/assignments/${assignmentId}/submit`, {
        fileUrl,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Assignment submission recorded.");
      queryClient.invalidateQueries(["studentAssignments"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Submission failed.");
    },
  });

  const submitQuizMutation = useMutation({
    mutationFn: async ({ quizId, studentAnswers }) => {
      const response = await api.post(`/quizzes/${quizId}/submit`, {
        studentAnswers,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Quiz evaluated successfully.");
      queryClient.invalidateQueries(["studentQuizzes"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Quiz submission failed.");
    },
  });

  const handleBookingRequest = (teacherId) => {
    bookingMutation.mutate({
      teacherId,
      date: getDefaultBookingDate(),
      startTime: "14:00",
      endTime: "15:00",
    });
  };

  const handleAssignmentSubmit = (assignmentId) => {
    const fileUrl = submissionUrls[assignmentId]?.trim();
    if (!fileUrl) {
      toast.error("Please add a file URL before submitting.");
      return;
    }
    submitAssignmentMutation.mutate({ assignmentId, fileUrl });
  };

  const handleQuizSubmit = (quiz) => {
    const selectedAnswers = quiz.questions.map((_, index) => {
      const value = answerMap[quiz._id]?.[index];
      return value ?? -1;
    });
    submitQuizMutation.mutate({
      quizId: quiz._id,
      studentAnswers: selectedAnswers,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50/60 p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-50" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <GraduationCap className="h-3.5 w-3.5" /> Student dashboard
              </div>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                Your tutor marketplace and study workspace
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Find tutors, manage bookings, and work through assignments and
                quizzes in one place.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">
                  Active bookings
                </p>
                <p className="mt-1 text-xl font-semibold text-slate-900">
                  {bookingsQuery.data?.length || 0}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">
                  Study tools
                </p>
                <p className="mt-1 text-xl font-semibold text-slate-900">
                  {(assignmentsQuery.data?.length || 0) +
                    (quizzesQuery.data?.length || 0)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Study Assistant promo */}
        <Link
          href="/dashboard/student/ai-study"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 transition hover:border-emerald-300 hover:bg-emerald-50"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <Sparkles size={22} />
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                Stuck on something? Ask the AI Study Assistant.
              </p>
              <p className="text-sm text-slate-500">
                Get guided hints on any problem, available anytime between
                tutoring sessions.
              </p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-emerald-600 transition group-hover:translate-x-1" />
        </Link>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            {/* Tutor marketplace */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Find the right tutor
                  </h2>
                  <p className="text-sm text-slate-500">
                    Tutors are ranked using the recommendation engine.
                  </p>
                </div>
                <div className="grid w-full grid-cols-1 gap-3 sm:w-auto sm:grid-cols-2">
                  <label className="relative block">
                    <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Subject"
                      className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
                    />
                  </label>
                  <input
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max Rs/hr"
                    type="number"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {marketplaceQuery.isLoading && (
                  <p className="text-sm text-slate-400">
                    Loading tutor recommendations…
                  </p>
                )}
                {marketplaceQuery.data?.map((tutor) => (
                  <div
                    key={tutor.teacherId}
                    className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {tutor.name}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {tutor.subjects?.join(", ") || "General tutoring"}
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                        {tutor.recommendationScore?.toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-sm text-amber-500">
                      <Star className="h-4 w-4 fill-current" />{" "}
                      <span className="text-slate-600">
                        {tutor.averageRating || 0} •{" "}
                        {tutor.experienceYears || 0} yrs
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-400">
                          Rate
                        </p>
                        <p className="text-lg font-semibold text-slate-900">
                          Rs {tutor.hourlyRate}/hr
                        </p>
                      </div>
                      <button
                        onClick={() => handleBookingRequest(tutor.teacherId)}
                        className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                      >
                        Request slot
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Resources & Assignments */}
            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-lg font-semibold text-slate-900">
                    Learning resources
                  </h2>
                </div>
                <div className="mt-4 space-y-3">
                  {resourcesQuery.data?.map((resource) => (
                    <div
                      key={resource._id}
                      className="rounded-xl border border-slate-200 bg-slate-50/60 p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-slate-900">
                            {resource.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {resource.subject} •{" "}
                            {resource.teacherId?.name || "Tutor"}
                          </p>
                        </div>
                        <span className="rounded-full border border-slate-200 px-2 py-1 text-[10px] uppercase tracking-wider text-slate-500">
                          {resource.fileType || "PDF"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500 line-clamp-3">
                        {resource.aiSummary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  <h2 className="text-lg font-semibold text-slate-900">
                    Assignments
                  </h2>
                </div>
                <div className="mt-4 space-y-3">
                  {assignmentsQuery.data?.map((assignment) => (
                    <div
                      key={assignment._id}
                      className="rounded-xl border border-slate-200 bg-slate-50/60 p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-slate-900">
                            {assignment.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {assignment.subject} • Due{" "}
                            {new Date(assignment.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] uppercase tracking-wider text-indigo-600">
                          {assignment.submissions?.length || 0} submits
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">
                        {assignment.instructions}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <input
                          placeholder="Submission URL"
                          value={submissionUrls[assignment._id] || ""}
                          onChange={(e) =>
                            setSubmissionUrls((prev) => ({
                              ...prev,
                              [assignment._id]: e.target.value,
                            }))
                          }
                          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                        />
                        <button
                          onClick={() => handleAssignmentSubmit(assignment._id)}
                          className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Quizzes */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-2">
                <NotebookPen className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Quizzes & practice
                </h2>
              </div>
              <div className="mt-4 space-y-4">
                {quizzesQuery.data?.map((quiz) => (
                  <div
                    key={quiz._id}
                    className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900">
                          {quiz.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {quiz.subject} • {quiz.teacherId?.name || "Tutor"}
                        </p>
                      </div>
                      <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] uppercase tracking-wider text-amber-600">
                        {quiz.questions?.length || 0} Qs
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      {quiz.questions?.map((question, questionIndex) => (
                        <div
                          key={`${quiz._id}-${questionIndex}`}
                          className="rounded-lg border border-slate-200 bg-white p-3"
                        >
                          <p className="text-sm text-slate-700">
                            {question.question}
                          </p>
                          <div className="mt-2 grid gap-2">
                            {question.options?.map((option, optionIndex) => (
                              <label
                                key={`${quiz._id}-${questionIndex}-${optionIndex}`}
                                className="flex items-center gap-2 text-sm text-slate-600"
                              >
                                <input
                                  type="radio"
                                  name={`${quiz._id}-${questionIndex}`}
                                  checked={
                                    (answerMap[quiz._id]?.[questionIndex] ??
                                      -1) === optionIndex
                                  }
                                  onChange={() =>
                                    setAnswerMap((prev) => ({
                                      ...prev,
                                      [quiz._id]: {
                                        ...(prev[quiz._id] || {}),
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
                      onClick={() => handleQuizSubmit(quiz)}
                      className="mt-4 rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-amber-400"
                    >
                      Submit quiz
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* My bookings */}
          <div className="space-y-8">
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-slate-900">
                  My bookings
                </h2>
              </div>
              <div className="mt-4 space-y-3">
                {bookingsQuery.data?.map((booking) => (
                  <div
                    key={booking._id}
                    className="rounded-xl border border-slate-200 bg-slate-50/60 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900">
                          {booking.teacherId?.name || "Tutor"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {booking.date} • {booking.startTime} -{" "}
                          {booking.endTime}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-wider ${
                          booking.status === "accepted"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    {booking.meetingLink && (
                      <p className="mt-2 text-xs text-slate-400">
                        Meeting: {booking.meetingLink}
                      </p>
                    )}
                  </div>
                ))}

                {bookingsQuery.data?.length === 0 && (
                  <p className="text-sm text-slate-400">
                    No bookings yet. Find a tutor above to get started.
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
