"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Clock,
  Check,
  X,
  DollarSign,
  Briefcase,
  Award,
  FileText,
  UserCheck,
  BookOpen,
  NotebookPen,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

export default function TeacherDashboard() {
  const queryClient = useQueryClient();

  const [hourlyRate, setHourlyRate] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [bio, setBio] = useState("");
  const [subjects, setSubjects] = useState("");
  const [weeklyAvailability, setWeeklyAvailability] = useState("");

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

  const profileQuery = useQuery({
    queryKey: ["teacherProfile"],
    queryFn: async () => {
      const response = await api.get("/profile/me");
      return response.data.data;
    },
  });

  const bookingsQuery = useQuery({
    queryKey: ["teacherBookings"],
    queryFn: async () => {
      const response = await api.get("/bookings");
      return response.data.data;
    },
  });

  const assignmentsQuery = useQuery({
    queryKey: ["teacherAssignments"],
    queryFn: async () => {
      const response = await api.get("/assignments");
      return response.data.data;
    },
  });

  const quizzesQuery = useQuery({
    queryKey: ["teacherQuizzes"],
    queryFn: async () => {
      const response = await api.get("/quizzes");
      return response.data.data;
    },
  });

  const resourcesQuery = useQuery({
    queryKey: ["teacherResources"],
    queryFn: async () => {
      const response = await api.get("/resources");
      return response.data.data;
    },
  });

  useEffect(() => {
    if (profileQuery.data) {
      setHourlyRate(profileQuery.data.hourlyRate ?? "");
      setExperienceYears(profileQuery.data.experienceYears ?? "");
      setBio(profileQuery.data.bio ?? "");
      setSubjects((profileQuery.data.subjects || []).join(", "));
      setWeeklyAvailability(profileQuery.data.weeklyAvailability || "");
    }
  }, [profileQuery.data]);

  const updateProfileMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.put("/profile/teacher", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Professional profile updated successfully.");
      queryClient.invalidateQueries(["teacherProfile"]);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.error || "Failed to update profile indicators.",
      );
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
      queryClient.invalidateQueries(["teacherResources"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Resource upload failed.");
    },
  });

  const bookingStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await api.put(`/bookings/${id}/status`, { status });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Schedule updated.");
      queryClient.invalidateQueries(["teacherBookings"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Workflow mutation rejected.");
    },
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      hourlyRate: Number(hourlyRate),
      experienceYears: Number(experienceYears),
      bio,
      subjects: subjects
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      weeklyAvailability,
    });
  };

  const handleAssignmentSubmit = (e) => {
    e.preventDefault();
    createAssignmentMutation.mutate({
      title: assignmentTitle,
      instructions: assignmentInstructions,
      subject: assignmentSubject,
      dueDate: assignmentDueDate,
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
    });
  };

  const isLoading =
    profileQuery.isLoading ||
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
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="border-b border-gray-800 pb-6">
          <div className="flex flex-wrap items-center gap-2 text-sm text-emerald-400">
            <Award className="h-5 w-5" /> Educator workspace control center
          </div>
          <h1 className="mt-2 text-3xl font-extrabold text-white">
            Run your tutor business from one clean workspace
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-400">
            Manage your profile, publish assignments and quizzes, share
            resources, and respond to booking requests.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-8">
            <section className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
              <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                <UserCheck className="h-5 w-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">
                  Profile & availability
                </h2>
              </div>
              <div
                className={`mt-4 rounded-lg border p-3 text-sm font-semibold ${profileQuery.data?.verificationStatus === "approved" ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" : "border-amber-500/20 bg-amber-500/5 text-amber-400"}`}
              >
                Verification status:{" "}
                {profileQuery.data?.verificationStatus || "pending"}
              </div>
              <form onSubmit={handleProfileSubmit} className="mt-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm text-gray-400">
                    <span className="mb-2 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                      <DollarSign className="h-3 w-3" /> Hourly rate
                    </span>
                    <input
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      type="number"
                      className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </label>
                  <label className="text-sm text-gray-400">
                    <span className="mb-2 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                      <Briefcase className="h-3 w-3" /> Experience
                    </span>
                    <input
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      type="number"
                      className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </label>
                </div>
                <label className="block text-sm text-gray-400">
                  <span className="mb-2 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                    <Sparkles className="h-3 w-3" /> Subjects
                  </span>
                  <input
                    value={subjects}
                    onChange={(e) => setSubjects(e.target.value)}
                    placeholder="Math, Physics, Java"
                    className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                  />
                </label>
                <label className="block text-sm text-gray-400">
                  <span className="mb-2 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                    <Clock className="h-3 w-3" /> Weekly availability
                  </span>
                  <input
                    value={weeklyAvailability}
                    onChange={(e) => setWeeklyAvailability(e.target.value)}
                    placeholder="Mon-Fri 18:00-21:00"
                    className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                  />
                </label>
                <label className="block text-sm text-gray-400">
                  <span className="mb-2 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                    <FileText className="h-3 w-3" /> Bio
                  </span>
                  <textarea
                    rows="4"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                  />
                </label>
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="w-full rounded-lg bg-emerald-500 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-50"
                >
                  {updateProfileMutation.isPending
                    ? "Saving..."
                    : "Save profile"}
                </button>
              </form>
            </section>

            <section className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
              <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                <BookOpen className="h-5 w-5 text-indigo-400" />
                <h2 className="text-lg font-semibold text-white">
                  Publish an assignment
                </h2>
              </div>
              <form
                onSubmit={handleAssignmentSubmit}
                className="mt-5 space-y-4"
              >
                <input
                  value={assignmentTitle}
                  onChange={(e) => setAssignmentTitle(e.target.value)}
                  placeholder="Assignment title"
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
                <input
                  value={assignmentSubject}
                  onChange={(e) => setAssignmentSubject(e.target.value)}
                  placeholder="Subject"
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
                <textarea
                  rows="3"
                  value={assignmentInstructions}
                  onChange={(e) => setAssignmentInstructions(e.target.value)}
                  placeholder="Instructions"
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
                <input
                  value={assignmentDueDate}
                  onChange={(e) => setAssignmentDueDate(e.target.value)}
                  type="date"
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={createAssignmentMutation.isPending}
                  className="w-full rounded-lg bg-indigo-500 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-50"
                >
                  {createAssignmentMutation.isPending
                    ? "Publishing..."
                    : "Publish assignment"}
                </button>
              </form>
            </section>
          </div>

          <div className="space-y-8">
            <section className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
              <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                <Clock className="h-5 w-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">
                  Booking requests
                </h2>
              </div>
              <div className="mt-4 space-y-3">
                {bookingsQuery.data?.map((booking) => (
                  <div
                    key={booking._id}
                    className="rounded-xl border border-gray-800 bg-gray-950/70 p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">
                          {booking.studentId?.name || "Student"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {booking.date} • {booking.startTime} -{" "}
                          {booking.endTime}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {booking.status === "pending" ? (
                          <>
                            <button
                              onClick={() =>
                                bookingStatusMutation.mutate({
                                  id: booking._id,
                                  status: "accepted",
                                })
                              }
                              className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-400 transition hover:bg-emerald-500 hover:text-white"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                bookingStatusMutation.mutate({
                                  id: booking._id,
                                  status: "rejected",
                                })
                              }
                              className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 transition hover:bg-red-500 hover:text-white"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-emerald-400">
                            {booking.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
              <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                <NotebookPen className="h-5 w-5 text-amber-400" />
                <h2 className="text-lg font-semibold text-white">
                  Create a quiz
                </h2>
              </div>
              <form onSubmit={handleQuizSubmit} className="mt-5 space-y-4">
                <input
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  placeholder="Quiz title"
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
                <input
                  value={quizSubject}
                  onChange={(e) => setQuizSubject(e.target.value)}
                  placeholder="Subject"
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
                <textarea
                  rows="6"
                  value={quizQuestionsInput}
                  onChange={(e) => setQuizQuestionsInput(e.target.value)}
                  placeholder='[{"question":"What is 2 + 2?","options":["3","4","5","6"],"correctAnswerIndex":1,"difficulty":"easy"}]'
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none font-mono"
                />
                <button
                  type="submit"
                  disabled={createQuizMutation.isPending}
                  className="w-full rounded-lg bg-amber-500 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-400 disabled:opacity-50"
                >
                  {createQuizMutation.isPending ? "Creating..." : "Create quiz"}
                </button>
              </form>
            </section>

            <section className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
              <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                <FileText className="h-5 w-5 text-purple-400" />
                <h2 className="text-lg font-semibold text-white">
                  Share a resource
                </h2>
              </div>
              <form onSubmit={handleResourceSubmit} className="mt-5 space-y-4">
                <input
                  value={resourceTitle}
                  onChange={(e) => setResourceTitle(e.target.value)}
                  placeholder="Resource title"
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                />
                <input
                  value={resourceSubject}
                  onChange={(e) => setResourceSubject(e.target.value)}
                  placeholder="Subject"
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                />
                <input
                  value={resourceDescription}
                  onChange={(e) => setResourceDescription(e.target.value)}
                  placeholder="Short description"
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                />
                <textarea
                  rows="4"
                  value={resourceText}
                  onChange={(e) => setResourceText(e.target.value)}
                  placeholder="Paste lecture notes or study content"
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={uploadResourceMutation.isPending}
                  className="w-full rounded-lg bg-purple-500 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-400 disabled:opacity-50"
                >
                  {uploadResourceMutation.isPending
                    ? "Publishing..."
                    : "Publish resource"}
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
