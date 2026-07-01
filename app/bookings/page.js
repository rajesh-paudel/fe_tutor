"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { CalendarRange, Video, AlertCircle, FileText } from "lucide-react";

export default function BookingsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [userRole, setUserRole] = useState("student");
  const [meetingLinkDialogOpen, setMeetingLinkDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [meetingLinkInput, setMeetingLinkInput] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    setUserRole(localStorage.getItem("userRole") || "student");
    setIsLoaded(true);
  }, []);

  const bookingsQuery = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const response = await api.get("/bookings");
      return response.data.data;
    },
    enabled: isLoaded,
  });

  const cancelBookingMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/bookings/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Booking request canceled.");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Unable to cancel booking.");
    },
  });

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
      toast.success(data.message || "Booking status updated.");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setMeetingLinkDialogOpen(false);
      setSelectedBookingId(null);
      setMeetingLinkInput("");
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.error || "Unable to update booking status.",
      );
    },
  });

  if (!isLoaded) {
    return null;
  }

  const bookings = bookingsQuery.data || [];
  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending",
  );
  const resolvedBookings = bookings.filter(
    (booking) => booking.status !== "pending",
  );

  const statusClasses = {
    pending: "border-amber-200 bg-amber-50 text-amber-800",
    accepted: "border-emerald-200 bg-emerald-50 text-emerald-800",
    rejected: "border-rose-200 bg-rose-50 text-rose-800",
    cancelled: "border-slate-200 bg-slate-100 text-slate-600",
    completed: "border-sky-200 bg-sky-50 text-sky-800",
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 antialiased flex flex-col items-center justify-start">
      {/* Changed to max-w-2xl and ensured natural width containment */}
      <main className="w-full max-w-2xl px-4 py-16 sm:px-6">
        {/* Main Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold tracking-wider text-emerald-800 shadow-sm">
            <CalendarRange className="h-4 w-4 text-emerald-600" />
            BOOKING MANAGEMENT
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Your Booking History
          </h1>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-md">
            Manage requests you've sent as a student, cancel pending bookings
            before tutor approval, and review your sessions.
          </p>
        </div>

        {/* Counter Stats Layout */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm grid grid-cols-2 gap-4 text-center divide-x divide-slate-100">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Pending
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-800">
              {pendingBookings.length}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Resolved
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-800">
              {resolvedBookings.length}
            </p>
          </div>
        </div>

        {/* Bookings Stream Container */}
        <div className="space-y-5">
          {bookingsQuery.isLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center text-slate-500 shadow-sm">
              <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-emerald-600 mx-auto mb-3" />
              Loading bookings...
            </div>
          ) : bookings.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm max-w-sm mx-auto">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 mb-3">
                <AlertCircle className="h-5 w-5 text-slate-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">
                No sessions recorded
              </h3>
              <p className="mt-1.5 text-xs text-slate-500">
                Book a session from a tutor profile to view your active logs.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {[...pendingBookings, ...resolvedBookings].map((booking) => {
                const profileOwner =
                  userRole === "teacher"
                    ? booking.studentId
                    : booking.teacherId;
                const profileName =
                  profileOwner?.name ||
                  (userRole === "teacher" ? "Student" : "Tutor");
                const profileUrl = profileOwner?._id
                  ? `/profile/${profileOwner._id}`
                  : "/profile";

                return (
                  <div
                    key={booking._id}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-slate-300"
                  >
                    {/* Fixed Card Row Layout - keeps profile elements & actions nicely aligned without massive gaps */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <Link
                        href={profileUrl}
                        className="flex items-center gap-4 min-w-0"
                      >
                        <div className="flex  h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                          {profileOwner?.profileImage ? (
                            <img
                              src={profileOwner.profileImage}
                              alt={profileName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-semibold uppercase text-slate-500">
                              {profileName
                                .split(" ")
                                .map((p) => p[0] || "")
                                .slice(0, 2)
                                .join("")}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 ">
                          <h2 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors truncate">
                            {profileName}
                          </h2>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">
                            {booking.date} &bull; {booking.startTime} -{" "}
                            {booking.endTime}
                          </p>
                        </div>
                      </Link>

                      {/* Explicit Action Right Align Width Constraints */}
                      <div className="flex items-center gap-2 sm:justify-end shrink-0">
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                            statusClasses[booking.status] ||
                            "border-slate-200 bg-slate-100 text-slate-600"
                          }`}
                        >
                          {booking.status}
                        </span>

                        {userRole === "student" &&
                          booking.status === "pending" && (
                            <button
                              onClick={() =>
                                cancelBookingMutation.mutate(booking._id)
                              }
                              disabled={cancelBookingMutation.isPending}
                              className="rounded-full border border-rose-200 bg-white px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50"
                            >
                              {cancelBookingMutation.isPending
                                ? "Canceling..."
                                : "Cancel"}
                            </button>
                          )}

                        {userRole === "teacher" &&
                          booking.status === "pending" && (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedBookingId(booking._id);
                                  setMeetingLinkInput("");
                                  setMeetingLinkDialogOpen(true);
                                }}
                                className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-emerald-700"
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
                                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Compact Inner Note Wrapper */}
                    {booking.note && (
                      <div className="mt-4 flex gap-2 rounded-xl bg-slate-50/80 p-3 border border-slate-100 ">
                        <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <p className="text-xs leading-relaxed text-slate-600">
                          <span className="font-semibold text-slate-700">
                            Note:
                          </span>{" "}
                          {booking.note}
                        </p>
                      </div>
                    )}

                    {/* Call Interface Wrapper Block */}
                    {booking.meetingLink && booking.status === "accepted" && (
                      <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/40 p-3 text-xs text-emerald-900">
                        <div className="flex items-center gap-2 min-w-0">
                          <Video className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate font-medium text-slate-600">
                            {booking.meetingLink}
                          </span>
                        </div>
                        <a
                          href={booking.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 rounded-lg bg-emerald-600 px-2.5 py-1 font-bold text-white transition hover:bg-emerald-700"
                        >
                          Join
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Centered System Dialog */}
      {meetingLinkDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-100">
            <h3 className="text-base font-bold text-slate-900">
              Add Meeting URL Link
            </h3>
            <p className="mt-1 text-xs text-slate-500 leading-normal">
              Provide a direct live stream or meeting URL for your student.
            </p>
            <div className="mt-4">
              <input
                type="url"
                value={meetingLinkInput}
                onChange={(e) => setMeetingLinkInput(e.target.value)}
                placeholder="https://meet.google.com/abc-defg-hij"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
              />
            </div>
            <div className="mt-5 flex items-center justify-end gap-1.5">
              <button
                onClick={() => {
                  setMeetingLinkDialogOpen(false);
                  setSelectedBookingId(null);
                  setMeetingLinkInput("");
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
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
                className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
