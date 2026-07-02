"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ClipboardList,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  Inbox,
  Mail,
  Sparkles,
  UserCircle,
  Users,
  X,
  XCircle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Small shared building blocks                                       */
/* ------------------------------------------------------------------ */

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-2 px-6 py-10 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400">
        <Icon className="h-5 w-5" />
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
  className = "",
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconClass || "bg-emerald-50 text-emerald-600"}`}
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

function Avatar({ name, image, size = "h-10 w-10" }) {
  const initials = name
    ? name
        .split(" ")
        .map((part) => part[0] || "")
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "ST";

  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100`}
    >
      {image ? (
        <img
          src={image}
          alt={name || "Student"}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-xs font-semibold uppercase text-slate-600">
          {initials}
        </span>
      )}
    </div>
  );
}

function StatusPill({ status }) {
  const styles = {
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    accepted: "border-emerald-200 bg-emerald-50 text-emerald-700",
    rejected: "border-rose-200 bg-rose-50 text-rose-700",
  };
  return (
    <span
      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${
        styles[status] || "border-slate-200 bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
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
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-emerald-50 text-base font-semibold text-emerald-700">
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
          <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
            <GraduationCap className="h-3 w-3" />
            {role || "teacher"}
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

/* Reusable modal shell, styled to match the light card theme */
function Modal({
  open,
  onClose,
  accent = "emerald",
  title,
  subtitle,
  children,
}) {
  if (!open) return null;

  const accentRing = {
    emerald: "focus:border-emerald-500",
    indigo: "focus:border-indigo-500",
    amber: "focus:border-amber-500",
    purple: "focus:border-purple-500",
  }[accent];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-[2px]">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
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
        <div data-focus-ring={accentRing} className="mt-6">
          {children}
        </div>
      </div>
    </div>
  );
}

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition-colors focus:border-emerald-500 focus:bg-white focus:outline-none";

const CONTENT_META = {
  assignment: {
    label: "Assignment",
    icon: ClipboardList,
    badge: "bg-indigo-50 text-indigo-600 border-indigo-200",
  },
  resource: {
    label: "Resource",
    icon: FileText,
    badge: "bg-purple-50 text-purple-600 border-purple-200",
  },
};

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function TeacherDashboard() {
  const queryClient = useQueryClient();

  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentInstructions, setAssignmentInstructions] = useState("");
  const [assignmentSubject, setAssignmentSubject] = useState("");
  const [assignmentDueDate, setAssignmentDueDate] = useState("");
  const [assignmentAssignedStudentId, setAssignmentAssignedStudentId] =
    useState("");

  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceDescription, setResourceDescription] = useState("");
  const [resourceFile, setResourceFile] = useState(null);
  const [resourceAssignedStudentId, setResourceAssignedStudentId] =
    useState("");

  // Single source of truth for which modal is open: 'assignment' | 'resource' | null
  const [activeModal, setActiveModal] = useState(null);

  const [meetingLinkDialogOpen, setMeetingLinkDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [meetingLinkInput, setMeetingLinkInput] = useState("");
  const [selectedContent, setSelectedContent] = useState(null);

  const sessionKey =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || "guest"
      : "guest";

  const bookingsQuery = useQuery({
    queryKey: ["teacherBookings", sessionKey],
    queryFn: async () => (await api.get("/bookings")).data.data,
  });

  const assignmentsQuery = useQuery({
    queryKey: ["teacherAssignments", sessionKey],
    queryFn: async () => (await api.get("/assignments")).data.data,
  });

  const resourcesQuery = useQuery({
    queryKey: ["teacherResources", sessionKey],
    queryFn: async () => (await api.get("/resources")).data.data,
  });

  const profileQuery = useQuery({
    queryKey: ["teacherDashboardProfile", sessionKey],
    queryFn: async () => (await api.get("/profile/me")).data,
  });

  const contentDetailQuery = useQuery({
    queryKey: [
      "teacherContentDetail",
      sessionKey,
      selectedContent?.type,
      selectedContent?.id,
    ],
    enabled: Boolean(selectedContent?.type && selectedContent?.id),
    queryFn: async () => {
      const endpoint =
        selectedContent.type === "assignment" ? "assignments" : "resources";
      return (await api.get(`/${endpoint}/${selectedContent.id}`)).data.data;
    },
  });

  /* ---------------- derived data ---------------- */

  const studentNameMap = useMemo(() => {
    const map = new Map();
    (bookingsQuery.data || []).forEach((booking) => {
      if (booking.studentId?._id)
        map.set(booking.studentId._id, booking.studentId.name);
    });
    return map;
  }, [bookingsQuery.data]);

  const studentOptions = useMemo(
    () => [
      { _id: "", name: "All students" },
      ...Array.from(studentNameMap, ([_id, name]) => ({ _id, name })),
    ],
    [studentNameMap],
  );

  const pendingBookings = useMemo(
    () =>
      (bookingsQuery.data || [])
        .filter((b) => b.status === "pending")
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
    [bookingsQuery.data],
  );

  const upcomingBookings = useMemo(
    () =>
      (bookingsQuery.data || [])
        .filter((b) => b.status === "accepted")
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        ),
    [bookingsQuery.data],
  );

  const enrolledStudents = useMemo(() => {
    const map = new Map();
    (bookingsQuery.data || [])
      .filter((b) => b.status === "accepted" && b.studentId?._id)
      .forEach((b) => {
        if (!map.has(b.studentId._id)) {
          map.set(b.studentId._id, {
            _id: b.studentId._id,
            name: b.studentId.name,
            profileImage: b.studentId.profileImage,
            sessions: 0,
          });
        }
        map.get(b.studentId._id).sessions += 1;
      });
    return Array.from(map.values()).sort((a, b) => b.sessions - a.sessions);
  }, [bookingsQuery.data]);

  const contentFeed = useMemo(() => {
    const tag = (items, type) =>
      (items || []).map((item) => ({ ...item, _type: type }));
    return [
      ...tag(assignmentsQuery.data, "assignment"),
      ...tag(resourcesQuery.data, "resource"),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [assignmentsQuery.data, resourcesQuery.data]);

  const resolveAssignee = (item) => {
    const id =
      typeof item.assignedStudentId === "object"
        ? item.assignedStudentId?._id
        : item.assignedStudentId;
    if (!id) return "All students";
    return (
      studentNameMap.get(id) ||
      (typeof item.assignedStudentId === "object"
        ? item.assignedStudentId?.name
        : null) ||
      "Assigned"
    );
  };

  /* ---------------- mutations ---------------- */

  const createAssignmentMutation = useMutation({
    mutationFn: async (payload) =>
      (await api.post("/assignments", payload)).data,
    onSuccess: () => {
      toast.success("Assignment published.");
      setAssignmentTitle("");
      setAssignmentInstructions("");
      setAssignmentSubject("");
      setAssignmentDueDate("");
      setAssignmentAssignedStudentId("");
      setActiveModal(null);
      queryClient.invalidateQueries(["teacherAssignments"]);
    },
    onError: (err) =>
      toast.error(
        err.response?.data?.error || "Assignment could not be created.",
      ),
  });

  const uploadResourceMutation = useMutation({
    mutationFn: async (payload) =>
      (
        await api.post("/resources", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      ).data,
    onSuccess: () => {
      toast.success("Resource published and summarized.");
      setResourceTitle("");
      setResourceDescription("");
      setResourceFile(null);
      setResourceAssignedStudentId("");
      setActiveModal(null);
      queryClient.invalidateQueries(["teacherResources"]);
    },
    onError: (err) =>
      toast.error(err.response?.data?.error || "Resource upload failed."),
  });

  const bookingStatusMutation = useMutation({
    mutationFn: async ({ id, status, meetingLink }) => {
      const payload = { status };
      if (status === "accepted") payload.meetingLink = meetingLink;
      return (await api.put(`/bookings/${id}/status`, payload)).data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Schedule updated.");
      queryClient.invalidateQueries(["teacherBookings"]);
      setMeetingLinkDialogOpen(false);
      setSelectedBookingId(null);
      setMeetingLinkInput("");
    },
    onError: (err) =>
      toast.error(err.response?.data?.error || "Workflow mutation rejected."),
  });

  /* ---------------- handlers ---------------- */

  const openModal = (type) => {
    if (type === "assignment") setAssignmentAssignedStudentId("");
    if (type === "resource") setResourceAssignedStudentId("");
    setActiveModal(type);
  };

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

  const handleResourceSubmit = (e) => {
    e.preventDefault();
    if (!resourceFile) {
      toast.error("Please attach a resource file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", resourceTitle);
    formData.append("description", resourceDescription);
    formData.append("resourceFile", resourceFile);
    if (resourceAssignedStudentId) {
      formData.append("assignedStudentId", resourceAssignedStudentId);
    }

    uploadResourceMutation.mutate(formData);
  };

  const isLoading =
    bookingsQuery.isLoading ||
    assignmentsQuery.isLoading ||
    resourcesQuery.isLoading;

  const accountProfile = profileQuery.data?.data;
  const accountUser = accountProfile?.userId;
  const accountRole = profileQuery.data?.role || "teacher";

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-emerald-600">
              <Award className="h-4 w-4" /> Educator workspace control center
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
              Run your tutor business from one clean workspace
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Publish assignments and resources, manage booking requests, and
              keep track of your enrolled students.
            </p>
          </div>
          <div className="w-full lg:max-w-sm">
            <AccountCard user={accountUser} role={accountRole} />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:divide-x lg:divide-slate-200">
          {/* ---------------- LEFT COLUMN ---------------- */}
          <div className="space-y-6 lg:pr-8">
            {/* Content workspace */}
            <SectionCard
              icon={BookOpen}
              iconClass="bg-indigo-50 text-indigo-600"
              title="Content workspace"
              subtitle="Create and assign learning material"
            >
              <div className="px-5 py-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Assignments
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {assignmentsQuery.data?.length ?? 0}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Resources
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {resourcesQuery.data?.length ?? 0}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => openModal("assignment")}
                    className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
                  >
                    Publish assignment
                  </button>
                  <button
                    onClick={() => openModal("resource")}
                    className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm font-semibold text-purple-700 transition-colors hover:bg-purple-100"
                  >
                    Share resource
                  </button>
                </div>
              </div>

              {/* Recent content feed */}
              <div className="border-t border-slate-100 px-5 py-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Recent content
                </p>
                {contentFeed.length === 0 ? (
                  <EmptyState
                    icon={Sparkles}
                    title="Nothing published yet"
                    description="Assignments and resources you create will show up here."
                  />
                ) : (
                  <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
                    {contentFeed.map((item) => {
                      const meta = CONTENT_META[item._type];
                      const Icon = meta.icon;
                      return (
                        <button
                          type="button"
                          key={`${item._type}-${item._id}`}
                          onClick={() =>
                            setSelectedContent({
                              type: item._type,
                              id: item._id,
                            })
                          }
                          className="flex w-full items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-left transition-colors hover:border-emerald-200 hover:bg-emerald-50/60"
                        >
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${meta.badge}`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="truncate text-sm font-semibold text-slate-900">
                                {item.title}
                              </p>
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${meta.badge}`}
                              >
                                {meta.label}
                              </span>
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                              {item.subject && <span>{item.subject}</span>}
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />{" "}
                                {resolveAssignee(item)}
                              </span>
                            </div>
                          </div>
                          <span className="shrink-0 text-[11px] text-slate-400">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </SectionCard>

            {/* Enrolled students */}
            <SectionCard
              icon={GraduationCap}
              iconClass="bg-emerald-50 text-emerald-600"
              title="Enrolled students"
              subtitle="Students with a confirmed session"
            >
              {enrolledStudents.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No enrolled students yet"
                  description="Once you accept a booking, the student appears here."
                />
              ) : (
                <div className="grid gap-2 p-4 sm:grid-cols-2">
                  {enrolledStudents.map((student) => (
                    <Link
                      key={student._id}
                      href={`/students/${student._id}`}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition-colors hover:border-emerald-200 hover:bg-emerald-50/60"
                    >
                      <Avatar
                        name={student.name}
                        image={student.profileImage}
                        size="h-9 w-9"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {student.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {student.sessions} session
                          {student.sessions === 1 ? "" : "s"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          {/* ---------------- RIGHT COLUMN ---------------- */}
          <div className="space-y-6 lg:sticky lg:top-6 lg:h-fit lg:pl-8">
            {/* Booking requests - fixed height, scrollable */}
            <SectionCard
              icon={Inbox}
              iconClass="bg-amber-50 text-amber-600"
              title="Booking requests"
              subtitle={`${pendingBookings.length} pending`}
            >
              {pendingBookings.length === 0 ? (
                <EmptyState
                  icon={CheckCircle2}
                  title="All caught up"
                  description="New booking requests will land here."
                />
              ) : (
                <div className="max-h-[420px] min-h-[220px] space-y-3 overflow-y-auto p-4">
                  {pendingBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar
                          name={booking.studentId?.name}
                          image={booking.studentId?.profileImage}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {booking.studentId?.name || "Student"}
                            </p>
                            <StatusPill status={booking.status} />
                          </div>
                          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
                            <Calendar className="h-3 w-3" /> {booking.date}{" "}
                            &middot; {booking.startTime}–{booking.endTime}
                          </p>
                          {booking.note && (
                            <p className="mt-1.5 text-xs leading-5 text-slate-600">
                              {booking.note}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedBookingId(booking._id);
                            setMeetingLinkInput("");
                            setMeetingLinkDialogOpen(true);
                          }}
                          className="flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-emerald-500"
                        >
                          <CheckCircle2 className="h-3 w-3" /> Accept
                        </button>
                        <button
                          onClick={() =>
                            bookingStatusMutation.mutate({
                              id: booking._id,
                              status: "rejected",
                            })
                          }
                          disabled={bookingStatusMutation.isPending}
                          className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                        >
                          <XCircle className="h-3 w-3" /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            {/* Upcoming schedule - fixed height, scrollable */}
            <SectionCard
              icon={Clock}
              iconClass="bg-emerald-50 text-emerald-600"
              title="Upcoming schedule"
              subtitle={`${upcomingBookings.length} confirmed`}
            >
              {upcomingBookings.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title="No confirmed sessions yet"
                  description="Accepted bookings with a meeting link will appear here."
                />
              ) : (
                <div className="max-h-[360px] min-h-[220px] space-y-2 overflow-y-auto p-4">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3"
                    >
                      <Avatar
                        name={booking.studentId?.name}
                        image={booking.studentId?.profileImage}
                        size="h-9 w-9"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {booking.studentId?.name || "Student"}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          {booking.date} &middot; {booking.startTime}–
                          {booking.endTime}
                        </p>
                      </div>
                      {booking.meetingLink && (
                        <a
                          href={booking.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 rounded-full bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-emerald-500"
                        >
                          Join
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

      {/* ---------------- Meeting link dialog ---------------- */}
      <Modal
        open={meetingLinkDialogOpen}
        onClose={() => {
          setMeetingLinkDialogOpen(false);
          setSelectedBookingId(null);
          setMeetingLinkInput("");
        }}
        title="Enter meeting link before accepting"
        subtitle="This link will be saved for the student and used for your confirmed session."
      >
        <label className="block text-sm font-medium text-slate-700">
          Meeting link
          <input
            value={meetingLinkInput}
            onChange={(e) => setMeetingLinkInput(e.target.value)}
            placeholder="https://meet.jit.si/your-session-link"
            className={`mt-2 ${fieldClass}`}
          />
        </label>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={() => {
              setMeetingLinkDialogOpen(false);
              setSelectedBookingId(null);
              setMeetingLinkInput("");
            }}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
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
            className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
          >
            {bookingStatusMutation.isPending
              ? "Accepting..."
              : "Confirm accept"}
          </button>
        </div>
      </Modal>

      {/* ---------------- Content detail dialog ---------------- */}
      <Modal
        open={Boolean(selectedContent)}
        onClose={() => setSelectedContent(null)}
        accent={selectedContent?.type === "assignment" ? "indigo" : "purple"}
        title={
          selectedContent?.type === "assignment"
            ? "Assignment details"
            : "Resource details"
        }
      >
        {contentDetailQuery.isLoading ? (
          <div className="flex min-h-[160px] items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          </div>
        ) : contentDetailQuery.isError ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {contentDetailQuery.error?.response?.data?.error ||
              "Could not load this item."}
          </p>
        ) : selectedContent?.type === "assignment" ? (
          <div className="space-y-4">
            <div>
              <h4 className="text-base font-semibold text-slate-900">
                {contentDetailQuery.data?.title}
              </h4>
              <p className="mt-1 text-xs text-slate-500">
                {contentDetailQuery.data?.subject} - Due{" "}
                {contentDetailQuery.data?.dueDate
                  ? new Date(
                      contentDetailQuery.data.dueDate,
                    ).toLocaleDateString()
                  : "No due date"}
              </p>
            </div>
            <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-600">
              {contentDetailQuery.data?.instructions || "No instructions."}
            </p>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Submissions
              </p>
              <div className="mt-2 space-y-2">
                {contentDetailQuery.data?.submissions?.length ? (
                  contentDetailQuery.data.submissions.map((submission) => (
                    <a
                      key={submission._id}
                      href={submission.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <span>
                        {submission.studentId?.name || "Student"} -{" "}
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </span>
                      <ExternalLink className="h-4 w-4 text-slate-400" />
                    </a>
                  ))
                ) : (
                  <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
                    No submissions yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h4 className="text-base font-semibold text-slate-900">
                {contentDetailQuery.data?.title}
              </h4>
              <p className="mt-1 text-xs text-slate-500">
                {contentDetailQuery.data?.fileName || "Uploaded resource"} -{" "}
                {contentDetailQuery.data?.fileType || "File"}
              </p>
            </div>
            {contentDetailQuery.data?.description && (
              <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                {contentDetailQuery.data.description}
              </p>
            )}
            {contentDetailQuery.data?.aiSummary && (
              <p className="rounded-xl border border-purple-100 bg-purple-50/70 p-3 text-sm leading-6 text-slate-700">
                {contentDetailQuery.data.aiSummary}
              </p>
            )}
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={contentDetailQuery.data?.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-500"
              >
                <ExternalLink className="h-4 w-4" /> Open resource
              </a>
              <a
                href={contentDetailQuery.data?.fileUrl}
                download
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                <Download className="h-4 w-4" /> Download
              </a>
            </div>
          </div>
        )}
      </Modal>

      {/* ---------------- Assignment modal ---------------- */}
      <Modal
        open={activeModal === "assignment"}
        onClose={() => setActiveModal(null)}
        accent="indigo"
        title="Publish assignment"
        subtitle="Create a task for one student or all students."
      >
        <form onSubmit={handleAssignmentSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              value={assignmentTitle}
              onChange={(e) => setAssignmentTitle(e.target.value)}
              placeholder="Assignment title"
              className={fieldClass}
              required
            />
            <input
              value={assignmentSubject}
              onChange={(e) => setAssignmentSubject(e.target.value)}
              placeholder="Subject"
              className={fieldClass}
              required
            />
          </div>
          <textarea
            rows="4"
            value={assignmentInstructions}
            onChange={(e) => setAssignmentInstructions(e.target.value)}
            placeholder="Instructions"
            className={fieldClass}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              value={assignmentDueDate}
              onChange={(e) => setAssignmentDueDate(e.target.value)}
              type="date"
              className={fieldClass}
            />
            <select
              value={assignmentAssignedStudentId}
              onChange={(e) => setAssignmentAssignedStudentId(e.target.value)}
              className={fieldClass}
            >
              {studentOptions.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createAssignmentMutation.isPending}
              className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
            >
              {createAssignmentMutation.isPending
                ? "Publishing..."
                : "Publish assignment"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ---------------- Resource modal ---------------- */}
      <Modal
        open={activeModal === "resource"}
        onClose={() => setActiveModal(null)}
        accent="purple"
        title="Share learning resource"
        subtitle="Attach a PDF, document, image, slide deck, or spreadsheet for your students."
      >
        <form onSubmit={handleResourceSubmit} className="space-y-4">
          <input
            value={resourceTitle}
            onChange={(e) => setResourceTitle(e.target.value)}
            placeholder="Resource title"
            className={fieldClass}
            required
          />
          <input
            value={resourceDescription}
            onChange={(e) => setResourceDescription(e.target.value)}
            placeholder="Brief summary or description"
            className={fieldClass}
          />
          <label className="block rounded-xl border border-dashed border-purple-200 bg-purple-50/50 p-4 text-sm text-slate-600">
            <span className="font-semibold text-slate-800">Resource file</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,image/*"
              onChange={(e) => setResourceFile(e.target.files?.[0] || null)}
              className="mt-3 block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-purple-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-purple-500"
              required
            />
            {resourceFile && (
              <span className="mt-2 block text-xs text-slate-500">
                Selected: {resourceFile.name}
              </span>
            )}
          </label>
          <select
            value={resourceAssignedStudentId}
            onChange={(e) => setResourceAssignedStudentId(e.target.value)}
            className={fieldClass}
          >
            {studentOptions.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name}
              </option>
            ))}
          </select>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploadResourceMutation.isPending}
              className="rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-500 disabled:opacity-50"
            >
              {uploadResourceMutation.isPending
                ? "Sharing..."
                : "Share resource"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
