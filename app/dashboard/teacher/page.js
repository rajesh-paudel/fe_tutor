"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

import { Clock, Check, X, Award, FileText, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

export default function TeacherDashboard() {
  const queryClient = useQueryClient();

  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentInstructions, setAssignmentInstructions] = useState("");
  const [assignmentSubject, setAssignmentSubject] = useState("");
  const [assignmentDueDate, setAssignmentDueDate] = useState("");

  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceSubject, setResourceSubject] = useState("");
  const [resourceText, setResourceText] = useState("");
  const [resourceDescription, setResourceDescription] = useState("");

  const [quizTitle, setQuizTitle] = useState("");
  const [quizSubject, setQuizSubject] = useState("");
  const [quizQuestionsInput, setQuizQuestionsInput] = useState(
    '[{"question":"What is 2 + 2?","options":["3","4","5","6"],"correctAnswerIndex":1,"difficulty":"easy"}]',
  );

  const sessionKey =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || "guest"
      : "guest";

  const bookingsQuery = useQuery({
    queryKey: ["teacherBookings", sessionKey],
    queryFn: async () => {
      const response = await api.get("/bookings");
      return response.data.data;
    },
  });

  const studentOptions = bookingsQuery.data
    ? [
        { _id: "", name: "All students" },
        ...Array.from(
          bookingsQuery.data
            .filter((booking) => booking.studentId)
            .reduce((map, booking) => {
              map.set(booking.studentId._id, booking.studentId.name);
              return map;
            }, new Map()),
        ).map(([id, name]) => ({ _id: id, name })),
      ]
    : [{ _id: "", name: "All students" }];

  const assignmentsQuery = useQuery({
    queryKey: ["teacherAssignments", sessionKey],
    queryFn: async () => {
      const response = await api.get("/assignments");
      return response.data.data;
    },
  });

  const quizzesQuery = useQuery({
    queryKey: ["teacherQuizzes", sessionKey],
    queryFn: async () => {
      const response = await api.get("/quizzes");
      return response.data.data;
    },
  });

  const resourcesQuery = useQuery({
    queryKey: ["teacherResources", sessionKey],
    queryFn: async () => {
      const response = await api.get("/resources");
      return response.data.data;
    },
  });

  const createAssignmentMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.post("/assignments", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Assignment published.");
      setAssignmentTitle("");
      setAssignmentInstructions("");
      setAssignmentSubject("");
      setAssignmentDueDate("");
      setAssignmentAssignedStudentId("");
      queryClient.invalidateQueries(["teacherAssignments"]);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.error || "Assignment could not be created.",
      );
    },
  });

  const createQuizMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.post("/quizzes", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Quiz created.");
      setQuizTitle("");
      setQuizSubject("");
      setQuizQuestionsInput(
        '[{"question":"What is 2 + 2?","options":["3","4","5","6"],"correctAnswerIndex":1,"difficulty":"easy"}]',
      );
      setQuizAssignedStudentId("");
      queryClient.invalidateQueries(["teacherQuizzes"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Quiz could not be created.");
    },
  });

  const uploadResourceMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.post("/resources", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Resource published and summarized.");
      setResourceTitle("");
      setResourceSubject("");
      setResourceText("");
      setResourceDescription("");
      setResourceAssignedStudentId("");
      queryClient.invalidateQueries(["teacherResources"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Resource upload failed.");
    },
  });

  const [meetingLinkDialogOpen, setMeetingLinkDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [meetingLinkInput, setMeetingLinkInput] = useState("");
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [assignmentAssignedStudentId, setAssignmentAssignedStudentId] =
    useState("");
  const [quizAssignedStudentId, setQuizAssignedStudentId] = useState("");
  const [resourceAssignedStudentId, setResourceAssignedStudentId] =
    useState("");

  const bookingStatusMutation = useMutation({
    mutationFn: async ({ id, status, meetingLink }) => {
      const payload = { status };
      if (status === "accepted") {
        payload.meetingLink = meetingLink;
      }
      const response = await api.put(`/bookings/${id}/status`, payload);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Schedule updated.");
      queryClient.invalidateQueries(["teacherBookings"]);
      setMeetingLinkDialogOpen(false);
      setSelectedBookingId(null);
      setMeetingLinkInput("");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Workflow mutation rejected.");
    },
  });

  const handleAssignmentSubmit = (e) => {
    e.preventDefault();
    createAssignmentMutation.mutate({
      title: assignmentTitle,
      instructions: assignmentInstructions,
      subject: assignmentSubject,
      dueDate: assignmentDueDate,
      assignedStudentId: assignmentAssignedStudentId || undefined,
    });
  };

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    let parsedQuestions = [];
    try {
      parsedQuestions = JSON.parse(quizQuestionsInput);
    } catch {
      toast.error("Please provide valid JSON for quiz questions.");
      return;
    }
    createQuizMutation.mutate({
      title: quizTitle,
      subject: quizSubject,
      questions: parsedQuestions,
      isGeneratedByAI: false,
      assignedStudentId: quizAssignedStudentId || undefined,
    });
  };

  const handleResourceSubmit = (e) => {
    e.preventDefault();
    uploadResourceMutation.mutate({
      title: resourceTitle,
      description: resourceDescription,
      subject: resourceSubject,
      textContent: resourceText,
      fileType: "pdf",
      assignedStudentId: resourceAssignedStudentId || undefined,
    });
  };

  const isLoading =
    bookingsQuery.isLoading ||
    assignmentsQuery.isLoading ||
    quizzesQuery.isLoading ||
    resourcesQuery.isLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent border-emerald-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-gray-100">
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="border-b border-gray-800 pb-6">
          <div className="flex flex-wrap items-center gap-2 text-sm text-emerald-400">
            <Award className="h-5 w-5" /> Educator workspace control center
          </div>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
            Run your tutor business from one clean workspace
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Publish assignments, quizzes, and resources from one clean content
            workspace.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-8">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <BookOpen className="h-5 w-5 text-indigo-500" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Content workspace
                </h2>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                Create assignments, quizzes, and resources from separate modals.
                Assign to a specific student or make the content available to
                all.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                    Assignments
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {assignmentsQuery.data?.length ?? 0}
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                    Quizzes
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {quizzesQuery.data?.length ?? 0}
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                    Resources
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {resourcesQuery.data?.length ?? 0}
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <button
                  onClick={() => {
                    setAssignmentAssignedStudentId("");
                    setShowAssignmentModal(true);
                  }}
                  className="rounded-2xl border border-indigo-500 bg-indigo-500/10 px-4 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-500/20"
                >
                  Publish assignment
                </button>
                <button
                  onClick={() => {
                    setQuizAssignedStudentId("");
                    setShowQuizModal(true);
                  }}
                  className="rounded-2xl border border-amber-500 bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-600 transition hover:bg-amber-500/20"
                >
                  Create quiz
                </button>
                <button
                  onClick={() => {
                    setResourceAssignedStudentId("");
                    setShowResourceModal(true);
                  }}
                  className="rounded-2xl border border-purple-500 bg-purple-500/10 px-4 py-3 text-sm font-semibold text-purple-600 transition hover:bg-purple-500/20"
                >
                  Share resource
                </button>
              </div>
            </section>
          </div>

          <div className="space-y-4 ">
            <section className="rounded-2xl max-w-lg  border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <Clock className="h-5 w-5 text-emerald-500" />
                <h2 className="text-sm font-semibold text-slate-900">
                  Booking requests
                </h2>
              </div>
              <div className="mt-2 space-y-2">
                {bookingsQuery.data
                  ?.slice()
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime(),
                  )
                  .map((booking) => (
                    <div
                      key={booking._id}
                      className="ml-auto max-w-lg rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-200 border border-slate-300">
                          {booking.studentId?.profileImage ? (
                            <img
                              src={booking.studentId.profileImage}
                              alt={booking.studentId?.name || "Student"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-semibold uppercase text-slate-600">
                              {booking.studentId?.name
                                ? booking.studentId.name
                                    .split(" ")
                                    .map((part) => part[0] || "")
                                    .slice(0, 2)
                                    .join("")
                                : "ST"}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-900">
                                {booking.studentId?.name || "Student"}
                              </p>
                              <p className="mt-1 text-[11px] text-slate-500">
                                {booking.date} • {booking.startTime} -{" "}
                                {booking.endTime}
                              </p>
                            </div>
                            <span
                              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                                booking.status === "pending"
                                  ? "border-amber-200 bg-amber-50 text-amber-700"
                                  : booking.status === "accepted"
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                    : booking.status === "rejected"
                                      ? "border-rose-200 bg-rose-50 text-rose-700"
                                      : "border-slate-200 bg-slate-100 text-slate-600"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>
                          {booking.note && (
                            <p className="mt-1 text-sm leading-5 text-slate-600">
                              {booking.note}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {booking.status === "pending" ? (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedBookingId(booking._id);
                                  setMeetingLinkInput("");
                                  setMeetingLinkDialogOpen(true);
                                }}
                                className="rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-semibold text-white transition hover:bg-emerald-700"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() =>
                                  bookingStatusMutation.mutate({
                                    id: booking._id,
                                    status: "rejected",
                                  })
                                }
                                disabled={bookingStatusMutation.isPending}
                                className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-700 transition hover:bg-slate-50"
                              >
                                Reject
                              </button>
                            </>
                          ) : booking.status === "accepted" &&
                            booking.meetingLink ? (
                            <a
                              href={booking.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-semibold text-white transition hover:bg-emerald-700"
                            >
                              Join
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </section>

            {meetingLinkDialogOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4 py-6">
                <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
                  <h3 className="text-xl font-semibold text-slate-900">
                    Enter meeting link before accepting
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    This link will be saved for the student and used for your
                    confirmed session.
                  </p>
                  <label className="mt-6 block text-sm font-medium text-slate-700">
                    Meeting link
                    <input
                      value={meetingLinkInput}
                      onChange={(e) => setMeetingLinkInput(e.target.value)}
                      placeholder="https://meet.jit.si/your-session-link"
                      className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </label>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      onClick={() => {
                        setMeetingLinkDialogOpen(false);
                        setSelectedBookingId(null);
                        setMeetingLinkInput("");
                      }}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (!meetingLinkInput.trim()) {
                          toast.error("Please enter a meeting link.");
                          return;
                        }
                        bookingStatusMutation.mutate({
                          id: selectedBookingId,
                          status: "accepted",
                          meetingLink: meetingLinkInput.trim(),
                        });
                      }}
                      disabled={bookingStatusMutation.isPending}
                      className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
                    >
                      {bookingStatusMutation.isPending
                        ? "Accepting..."
                        : "Confirm accept"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {showAssignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 px-4 py-6">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-950 p-6 shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Publish assignment
                </h3>
                <p className="text-sm text-slate-400">
                  Create a task for one student or all students.
                </p>
              </div>
              <button
                onClick={() => setShowAssignmentModal(false)}
                className="text-slate-400 transition hover:text-white"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleAssignmentSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  value={assignmentTitle}
                  onChange={(e) => setAssignmentTitle(e.target.value)}
                  placeholder="Assignment title"
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
                <input
                  value={assignmentSubject}
                  onChange={(e) => setAssignmentSubject(e.target.value)}
                  placeholder="Subject"
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <textarea
                rows="4"
                value={assignmentInstructions}
                onChange={(e) => setAssignmentInstructions(e.target.value)}
                placeholder="Instructions"
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  value={assignmentDueDate}
                  onChange={(e) => setAssignmentDueDate(e.target.value)}
                  type="date"
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
                <select
                  value={assignmentAssignedStudentId}
                  onChange={(e) =>
                    setAssignmentAssignedStudentId(e.target.value)
                  }
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                >
                  {studentOptions.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowAssignmentModal(false)}
                  className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createAssignmentMutation.isPending}
                  className="rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-50"
                >
                  {createAssignmentMutation.isPending
                    ? "Publishing..."
                    : "Publish assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 px-4 py-6">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-950 p-6 shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Create quiz
                </h3>
                <p className="text-sm text-slate-400">
                  Draft questions and assign to a student or publish to all.
                </p>
              </div>
              <button
                onClick={() => setShowQuizModal(false)}
                className="text-slate-400 transition hover:text-white"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleQuizSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  placeholder="Quiz title"
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
                <input
                  value={quizSubject}
                  onChange={(e) => setQuizSubject(e.target.value)}
                  placeholder="Subject"
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <textarea
                rows="6"
                value={quizQuestionsInput}
                onChange={(e) => setQuizQuestionsInput(e.target.value)}
                placeholder='[{"question":"What is 2 + 2?","options":["3","4","5","6"],"correctAnswerIndex":1,"difficulty":"easy"}]'
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none font-mono"
              />
              <select
                value={quizAssignedStudentId}
                onChange={(e) => setQuizAssignedStudentId(e.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none"
              >
                {studentOptions.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name}
                  </option>
                ))}
              </select>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowQuizModal(false)}
                  className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createQuizMutation.isPending}
                  className="rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-400 disabled:opacity-50"
                >
                  {createQuizMutation.isPending ? "Creating..." : "Create quiz"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showResourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 px-4 py-6">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-950 p-6 shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Share learning resource
                </h3>
                <p className="text-sm text-slate-400">
                  Upload textual context materials or references for your
                  students.
                </p>
              </div>
              <button
                onClick={() => setShowResourceModal(false)}
                className="text-slate-400 transition hover:text-white"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleResourceSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  value={resourceTitle}
                  onChange={(e) => setResourceTitle(e.target.value)}
                  placeholder="Resource title"
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:border-purple-500 focus:outline-none"
                />
                <input
                  value={resourceSubject}
                  onChange={(e) => setResourceSubject(e.target.value)}
                  placeholder="Subject"
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <input
                value={resourceDescription}
                onChange={(e) => setResourceDescription(e.target.value)}
                placeholder="Brief summary or description description"
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:border-purple-500 focus:outline-none"
              />
              <textarea
                rows="5"
                value={resourceText}
                onChange={(e) => setResourceText(e.target.value)}
                placeholder="Paste structural raw resource text content here..."
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:border-purple-500 focus:outline-none"
              />
              <select
                value={resourceAssignedStudentId}
                onChange={(e) => setResourceAssignedStudentId(e.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:border-purple-500 focus:outline-none"
              >
                {studentOptions.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name}
                  </option>
                ))}
              </select>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowResourceModal(false)}
                  className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadResourceMutation.isPending}
                  className="rounded-2xl bg-purple-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-400 disabled:opacity-50"
                >
                  {uploadResourceMutation.isPending
                    ? "Sharing..."
                    : "Share resource"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
