"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  CalendarDays,
  Clock,
  GraduationCap,
  Send,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { getSocket } from "@/lib/socket";

const DEFAULT_BOOKING = {
  date: "",
  startTime: "14:00",
  endTime: "15:00",
  subject: "",
  note: "",
};

export default function PublicProfilePage() {
  const params = useParams();
  const userId = params?.id;
  const queryClient = useQueryClient();
  const [bookingForm, setBookingForm] = useState(DEFAULT_BOOKING);
  const [reviewForm, setReviewForm] = useState({ rating: "5", comment: "" });
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [loadingChat, setLoadingChat] = useState(false);
  const bottomRef = useRef(null);

  const viewerRole =
    typeof window !== "undefined" ? localStorage.getItem("userRole") : null;

  const sessionKey =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || "guest"
      : "guest";

  const profileQuery = useQuery({
    queryKey: ["publicProfile", sessionKey, userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const response = await api.get(`/profile/${userId}`);
      return response.data;
    },
  });

  const reviewsQuery = useQuery({
    queryKey: ["teacherReviews", sessionKey, userId],
    enabled: Boolean(userId) && profileQuery.data?.role === "teacher",
    queryFn: async () => {
      const response = await api.get(`/reviews/teacher/${userId}`);
      return response.data.data;
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.post("/bookings", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Booking request sent.");
      setBookingForm(DEFAULT_BOOKING);
      queryClient.invalidateQueries(["studentBookings"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Booking request failed.");
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.post("/reviews", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Review submitted.");
      setReviewForm({ rating: "5", comment: "" });
      queryClient.invalidateQueries(["teacherReviews", userId]);
      queryClient.invalidateQueries(["publicProfile", userId]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Review could not be saved.");
    },
  });

  useEffect(() => {
    if (!userId || typeof window === "undefined") return;

    const socket = getSocket();
    if (!socket) return;

    socket.on("new_message", (message) => {
      if (message.conversationId === conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("new_message");
    };
  }, [conversationId, userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const profile = profileQuery.data?.data;
  const role = profileQuery.data?.role;
  const user = profile?.userId;
  const isTeacher = role === "teacher";
  const avatarSrc = user?.profileImage || profile?.profileImage || "";

  const initials = useMemo(() => {
    return (user?.name || "U")
      .trim()
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [user?.name]);

  const availability = Array.isArray(profile?.weeklyAvailability)
    ? profile.weeklyAvailability
    : [];

  function updateBookingField(field, value) {
    setBookingForm((current) => ({ ...current, [field]: value }));
  }

  function submitBooking(event) {
    event.preventDefault();
    bookingMutation.mutate({ teacherId: userId, ...bookingForm });
  }

  function submitReview(event) {
    event.preventDefault();
    reviewMutation.mutate({
      teacherId: userId,
      rating: Number(reviewForm.rating),
      comment: reviewForm.comment,
    });
  }

  async function openChat() {
    if (!userId || !user?.name) return;

    try {
      setLoadingChat(true);
      const response = await api.post("/chat/conversations", {
        receiverId: userId,
      });
      const conversation = response.data?.data;
      const currentConversationId = conversation?._id;
      setConversationId(currentConversationId);
      setChatOpen(true);

      const messagesResponse = await api.get(
        `/chat/conversations/${currentConversationId}/messages`,
      );
      setMessages(messagesResponse.data?.data || []);

      const socket = getSocket();
      socket?.emit("join_conversation", {
        conversationId: currentConversationId,
        receiverId: userId,
      });
    } catch (err) {
      toast.error(err.response?.data?.error || "Unable to open chat.");
    } finally {
      setLoadingChat(false);
    }
  }

  function sendMessage(event) {
    event.preventDefault();
    if (!chatInput.trim() || !conversationId || !userId) return;

    const socket = getSocket();
    socket?.emit("send_message", {
      conversationId,
      receiverId: userId,
      content: chatInput.trim(),
    });
    setChatInput("");
  }

  if (profileQuery.isLoading) {
    return (
      <div className="min-h-screen bg-white px-4 py-16">
        <div className="mx-auto max-w-5xl animate-pulse space-y-6">
          <div className="h-48 rounded-3xl bg-slate-100" />
          <div className="h-72 rounded-3xl bg-slate-100" />
        </div>
      </div>
    );
  }

  if (profileQuery.isError || !profile) {
    return (
      <div className="min-h-screen bg-white px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <h1 className="text-xl font-semibold text-slate-900">
            Profile not found
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            This public profile is unavailable.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-slate-50/70 p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-2xl font-semibold text-emerald-700">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={user?.name || "Profile picture"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="leading-none">{initials}</span>
                )}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-bold tracking-tight">
                    {user?.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    {isTeacher ? (
                      <GraduationCap size={12} />
                    ) : (
                      <BookOpen size={12} />
                    )}
                    {isTeacher ? "Teacher" : "Student"}
                  </span>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  {isTeacher
                    ? profile.bio ||
                      "This teacher is still completing their profile."
                    : `Academic level: ${profile.academicLevel || "Not added yet"}`}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:items-end">
              {isTeacher && (
                <div className="grid grid-cols-3 gap-3 text-center">
                  <Stat value={profile.averageRating || "New"} label="Rating" />
                  <Stat value={profile.reviewCount || 0} label="Reviews" />
                  <Stat
                    value={`${profile.experienceYears || 0}`}
                    label="Years"
                  />
                </div>
              )}
              <button
                onClick={openChat}
                disabled={loadingChat}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingChat ? "Opening..." : "Start conversation"}
              </button>
            </div>
          </div>
        </section>

        {chatOpen && (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                Chat with {user?.name}
              </h2>
              <button
                onClick={() => setChatOpen(false)}
                className="text-sm font-medium text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
            </div>
            <div className="h-64 space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
              {messages.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Start the conversation by sending a message.
                </p>
              ) : (
                messages.map((message) => {
                  const isMine =
                    message.senderId === localStorage.getItem("userId") ||
                    message.senderId === localStorage.getItem("token");
                  return (
                    <div
                      key={message._id}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${isMine ? "bg-emerald-600 text-white" : "bg-white text-slate-700"}`}
                      >
                        {message.content}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={sendMessage} className="mt-3 flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                <Send size={16} />
              </button>
            </form>
          </section>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold">
                {isTeacher ? "Teaching profile" : "Student profile"}
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <InfoBlock
                  title={isTeacher ? "Subjects" : "Interests"}
                  items={isTeacher ? profile.subjects : profile.interests}
                  fallback="Not added yet"
                />
                {isTeacher ? (
                  <InfoBlock
                    title="Teaching levels"
                    items={profile.teachingLevels}
                    fallback="Not added yet"
                  />
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-400">
                      Academic level
                    </p>
                    <p className="mt-2 text-sm text-slate-700">
                      {profile.academicLevel || "Not added yet"}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {isTeacher && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-lg font-semibold">Availability</h2>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {availability.length > 0 ? (
                    availability.map((day) => (
                      <div
                        key={day.day}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <p className="font-medium text-slate-900">{day.day}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {day.slots?.length
                            ? day.slots
                                .map(
                                  (slot) =>
                                    `${slot.startTime || "?"} - ${
                                      slot.endTime || "?"
                                    }`,
                                )
                                .join(", ")
                            : "No slots listed"}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      No availability has been listed yet. You can still request
                      a preferred time.
                    </p>
                  )}
                </div>
              </section>
            )}

            {isTeacher && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <h2 className="text-lg font-semibold">Student reviews</h2>
                </div>
                <div className="mt-4 space-y-3">
                  {reviewsQuery.data?.length ? (
                    reviewsQuery.data.map((review) => (
                      <div
                        key={review._id}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium text-slate-900">
                            {review.studentId?.name || "Student"}
                          </p>
                          <span className="text-sm font-semibold text-amber-500">
                            {review.rating}/5
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">
                          {review.comment}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No reviews yet.</p>
                  )}
                </div>
              </section>
            )}
          </div>

          {isTeacher && (
            <aside className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-lg font-semibold">Request booking</h2>
                </div>
                {viewerRole === "student" ? (
                  <form onSubmit={submitBooking} className="mt-5 space-y-4">
                    <input
                      type="date"
                      required
                      value={bookingForm.date}
                      onChange={(event) =>
                        updateBookingField("date", event.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="time"
                        required
                        value={bookingForm.startTime}
                        onChange={(event) =>
                          updateBookingField("startTime", event.target.value)
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                      />
                      <input
                        type="time"
                        required
                        value={bookingForm.endTime}
                        onChange={(event) =>
                          updateBookingField("endTime", event.target.value)
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <input
                      value={bookingForm.subject}
                      onChange={(event) =>
                        updateBookingField("subject", event.target.value)
                      }
                      placeholder="Subject"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                    />
                    <textarea
                      rows={3}
                      value={bookingForm.note}
                      onChange={(event) =>
                        updateBookingField("note", event.target.value)
                      }
                      placeholder="What do you want help with?"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={bookingMutation.isPending}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                    >
                      <Send size={15} />
                      {bookingMutation.isPending
                        ? "Sending..."
                        : "Send request"}
                    </button>
                  </form>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">
                    Log in as a student to request a session.
                  </p>
                )}
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <h2 className="text-lg font-semibold">Rate teacher</h2>
                </div>
                {viewerRole === "student" ? (
                  <form onSubmit={submitReview} className="mt-5 space-y-4">
                    <select
                      value={reviewForm.rating}
                      onChange={(event) =>
                        setReviewForm((current) => ({
                          ...current,
                          rating: event.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                    >
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <option key={rating} value={rating}>
                          {rating} stars
                        </option>
                      ))}
                    </select>
                    <textarea
                      rows={3}
                      required
                      value={reviewForm.comment}
                      onChange={(event) =>
                        setReviewForm((current) => ({
                          ...current,
                          comment: event.target.value,
                        }))
                      }
                      placeholder="Share your learning experience"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={reviewMutation.isPending}
                      className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-400 disabled:opacity-60"
                    >
                      {reviewMutation.isPending
                        ? "Submitting..."
                        : "Submit review"}
                    </button>
                    <p className="text-xs leading-5 text-slate-400">
                      Reviews are accepted after a completed booking with this
                      teacher.
                    </p>
                  </form>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">
                    Log in as a student after a completed session to review.
                  </p>
                )}
              </section>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <p className="text-lg font-semibold text-slate-900">{value}</p>
      <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
    </div>
  );
}

function InfoBlock({ title, items, fallback }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-wider text-slate-400">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items?.length ? (
          items.map((item) => (
            <span
              key={item}
              className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-700"
            >
              {item}
            </span>
          ))
        ) : (
          <p className="text-sm text-slate-500">{fallback}</p>
        )}
      </div>
    </div>
  );
}
