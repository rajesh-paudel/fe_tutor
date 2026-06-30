"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Search,
  Sparkles,
  Star,
  HelpCircle,
  Send,
  Clock,
  BookOpen,
  FileText,
  NotebookPen,
  GraduationCap,
  CheckCircle2,
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
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
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

  const socraticMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.post("/ai/homework-helper", payload);
      return response.data;
    },
    onSuccess: (data) => {
      setAiResponse(data.aiHint);
      toast.success("AI guidance is ready.");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "AI helper could not respond.");
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

  const handleAiSubmit = (e) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;
    socraticMutation.mutate({
      studentQuestion: aiQuestion,
      subjectContext: subject || "Computer Science",
    });
  };

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
    <div className="min-h-screen bg-[#090d16] flex flex-col justify-between text-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-grow">
        <section className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-950/90 p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-emerald-400">
                <GraduationCap className="h-3.5 w-3.5" /> Student learning hub
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                Your tutor marketplace and study workspace
              </h1>
              <p className="max-w-2xl text-sm text-gray-400">
                Find tutors, manage bookings, access resources, and work through
                assignments and quizzes in one place.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-gray-800 bg-gray-950/70 p-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  Active bookings
                </p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {bookingsQuery.data?.length || 0}
                </p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-950/70 p-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  Study tools
                </p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {assignmentsQuery.data?.length || 0} +{" "}
                  {quizzesQuery.data?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-8">
          <div className="space-y-8">
            <section className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Find the right tutor
                  </h2>
                  <p className="text-sm text-gray-400">
                    Tutors are ranked using the backend recommendation engine.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full sm:w-auto">
                  <label className="relative block">
                    <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Subject"
                      className="w-full rounded-lg border border-gray-800 bg-gray-950 py-2.5 pl-10 pr-3 text-sm text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </label>
                  <input
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max $/hr"
                    type="number"
                    className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {marketplaceQuery.isLoading && (
                  <p className="text-sm text-gray-500">
                    Loading tutor recommendations…
                  </p>
                )}
                {marketplaceQuery.data?.map((tutor) => (
                  <div
                    key={tutor.teacherId}
                    className="rounded-xl border border-gray-800 bg-gray-950/70 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-white">
                          {tutor.name}
                        </h3>
                        <p className="mt-1 text-xs text-gray-400">
                          {tutor.subjects?.join(", ") || "General tutoring"}
                        </p>
                      </div>
                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
                        {tutor.recommendationScore?.toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-sm text-amber-400">
                      <Star className="h-4 w-4 fill-current" />{" "}
                      {tutor.averageRating || 0} • {tutor.experienceYears || 0}{" "}
                      yrs
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                          Rate
                        </p>
                        <p className="text-lg font-semibold text-white">
                          ${tutor.hourlyRate}/hr
                        </p>
                      </div>
                      <button
                        onClick={() => handleBookingRequest(tutor.teacherId)}
                        className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400"
                      >
                        Request slot
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-emerald-400" />
                  <h2 className="text-lg font-semibold text-white">
                    Learning resources
                  </h2>
                </div>
                <div className="mt-4 space-y-3">
                  {resourcesQuery.data?.map((resource) => (
                    <div
                      key={resource._id}
                      className="rounded-xl border border-gray-800 bg-gray-950/70 p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-white">
                            {resource.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {resource.subject} •{" "}
                            {resource.teacherId?.name || "Tutor"}
                          </p>
                        </div>
                        <span className="rounded-full border border-gray-700 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-gray-400">
                          {resource.fileType || "PDF"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                        {resource.aiSummary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-400" />
                  <h2 className="text-lg font-semibold text-white">
                    Assignments
                  </h2>
                </div>
                <div className="mt-4 space-y-3">
                  {assignmentsQuery.data?.map((assignment) => (
                    <div
                      key={assignment._id}
                      className="rounded-xl border border-gray-800 bg-gray-950/70 p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-white">
                            {assignment.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {assignment.subject} • Due{" "}
                            {new Date(assignment.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="rounded-full border border-indigo-400/20 bg-indigo-400/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-indigo-300">
                          {assignment.submissions?.length || 0} submits
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
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
                          className="flex-1 rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                        />
                        <button
                          onClick={() => handleAssignmentSubmit(assignment._id)}
                          className="rounded-lg bg-indigo-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
              <div className="flex items-center gap-2">
                <NotebookPen className="h-5 w-5 text-amber-400" />
                <h2 className="text-lg font-semibold text-white">
                  Quizzes & practice
                </h2>
              </div>
              <div className="mt-4 space-y-4">
                {quizzesQuery.data?.map((quiz) => (
                  <div
                    key={quiz._id}
                    className="rounded-xl border border-gray-800 bg-gray-950/70 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">{quiz.title}</p>
                        <p className="text-xs text-gray-400">
                          {quiz.subject} • {quiz.teacherId?.name || "Tutor"}
                        </p>
                      </div>
                      <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-amber-300">
                        {quiz.questions?.length || 0} Qs
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      {quiz.questions?.map((question, questionIndex) => (
                        <div
                          key={`${quiz._id}-${questionIndex}`}
                          className="rounded-lg border border-gray-800 bg-gray-950 p-3"
                        >
                          <p className="text-sm text-gray-200">
                            {question.question}
                          </p>
                          <div className="mt-2 grid gap-2">
                            {question.options?.map((option, optionIndex) => (
                              <label
                                key={`${quiz._id}-${questionIndex}-${optionIndex}`}
                                className="flex items-center gap-2 text-sm text-gray-400"
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
                                  className="h-4 w-4 border-gray-700 bg-gray-900"
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

          <div className="space-y-8">
            <section className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
              <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                <HelpCircle className="h-5 w-5 text-indigo-400" />
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white">
                  AI doubt solver
                </h2>
              </div>
              <p className="mt-3 text-sm text-gray-400">
                Paste a problem or theory question and get guided hints from the
                Socratic engine.
              </p>
              <form onSubmit={handleAiSubmit} className="mt-4 space-y-3">
                <textarea
                  rows="4"
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  placeholder="Describe the challenge you are facing…"
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={socraticMutation.isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-50"
                >
                  {socraticMutation.isPending ? "Thinking…" : "Ask the AI"}
                  <Send className="h-4 w-4" />
                </button>
              </form>
              {aiResponse && (
                <div className="mt-4 rounded-lg border border-gray-800 bg-gray-950/70 p-3 text-sm text-gray-300 whitespace-pre-wrap">
                  {aiResponse}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">
                  My bookings
                </h2>
              </div>
              <div className="mt-4 space-y-3">
                {bookingsQuery.data?.map((booking) => (
                  <div
                    key={booking._id}
                    className="rounded-xl border border-gray-800 bg-gray-950/70 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">
                          {booking.teacherId?.name || "Tutor"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {booking.date} • {booking.startTime} -{" "}
                          {booking.endTime}
                        </p>
                      </div>
                      <span
                        className={`rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.2em] ${booking.status === "accepted" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : "border-amber-500/20 bg-amber-500/10 text-amber-400"}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    {booking.meetingLink && (
                      <p className="mt-2 text-xs text-gray-500">
                        Meeting: {booking.meetingLink}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
