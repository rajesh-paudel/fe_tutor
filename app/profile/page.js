"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  Star,
  Clock,
  X,
  Plus,
  Pencil,
  Check,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import toast from "react-hot-toast";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const ACADEMIC_LEVELS = ["SEE", "+2", "Bachelor's", "Master's", "Professional"];

const ROLE_BADGES = {
  teacher: {
    label: "Teacher",
    icon: GraduationCap,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  student: {
    label: "Student",
    icon: BookOpen,
    className: "bg-sky-50 text-sky-700 border-sky-200",
  },
};

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserRole(localStorage.getItem("userRole"));
    }
  }, []);

  const profileQuery = useQuery({
    queryKey: ["profilePage"],
    queryFn: async () => {
      const response = await api.get("/profile/me");
      return response.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload) => {
      const endpoint =
        userRole === "teacher" ? "/profile/teacher" : "/profile/student";
      const response = await api.put(endpoint, payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Saved.");
      queryClient.invalidateQueries(["profilePage"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Unable to update profile.");
    },
  });

  const profile = profileQuery.data?.data;
  const userInfo = profile?.userId;
  const displayRole = profileQuery.data?.role || userRole;
  const roleBadge = ROLE_BADGES[displayRole];
  const RoleBadgeIcon = roleBadge?.icon;
  const initials = (userInfo?.name || "U")
    .trim()
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (profileQuery.isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-40 rounded-3xl bg-slate-100" />
            <div className="h-40 rounded-3xl bg-slate-100" />
            <div className="h-40 rounded-3xl bg-slate-100" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header card */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50/60 p-8 sm:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-50" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-2xl font-semibold text-emerald-700">
                {initials}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    {userInfo?.name || "Your profile"}
                  </h1>
                  {roleBadge && RoleBadgeIcon && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${roleBadge.className}`}
                    >
                      <RoleBadgeIcon size={12} />
                      {roleBadge.label}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-500">{userInfo?.email}</p>
              </div>
            </div>

            <div className="flex gap-6 sm:gap-8">
              {userRole === "teacher" ? (
                <>
                  <Stat
                    icon={Star}
                    value={profile?.averageRating?.toFixed(1) || "—"}
                    label={`${profile?.reviewCount || 0} reviews`}
                  />
                  <Stat
                    icon={GraduationCap}
                    value={`${profile?.experienceYears || 0} yrs`}
                    label="Experience"
                  />
                </>
              ) : (
                <Stat
                  icon={BookOpen}
                  value={profile?.completedSessions || 0}
                  label="Sessions completed"
                />
              )}
            </div>
          </div>
        </section>

        {/* Sections */}
        <div className="mt-8 space-y-6">
          {userRole === "teacher" ? (
            <>
              <BioSection profile={profile} onSave={updateMutation.mutate} />
              <SubjectsSection
                profile={profile}
                onSave={updateMutation.mutate}
              />
              <TeachingLevelsSection
                profile={profile}
                onSave={updateMutation.mutate}
              />
              <RateExperienceSection
                profile={profile}
                onSave={updateMutation.mutate}
              />
              <AvailabilitySection
                profile={profile}
                onSave={updateMutation.mutate}
              />
            </>
          ) : (
            <>
              <AcademicLevelSection
                profile={profile}
                onSave={updateMutation.mutate}
              />
              <InterestsSection
                profile={profile}
                onSave={updateMutation.mutate}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

/* ---------- Shared building blocks ---------- */

function Stat({ icon: Icon, value, label }) {
  return (
    <div className="text-center sm:text-left">
      <div className="flex items-center justify-center gap-1.5 text-xl font-bold text-slate-900 sm:justify-start">
        <Icon size={18} className="text-emerald-600" />
        {value}
      </div>
      <p className="mt-0.5 text-xs text-slate-500">{label}</p>
    </div>
  );
}

// A self-contained section: shows a view, flips to an edit form,
// saves only its own slice of the profile, and reverts on cancel.
function EditableSection({
  title,
  description,
  isEmpty,
  emptyLabel,
  renderView,
  renderEdit,
  onSave,
  buildPayload,
  isPending,
}) {
  const [isEditing, setIsEditing] = useState(false);

  function handleSave() {
    onSave(buildPayload(), {
      onSuccess: () => setIsEditing(false),
    });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            <Pencil size={13} />
            Edit
          </button>
        )}
      </div>

      <div className="mt-5">
        {isEditing ? (
          <div className="space-y-4">
            {renderEdit()}
            <div className="flex gap-3 pt-1">
              <button
                onClick={handleSave}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Check size={14} />
                {isPending ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : isEmpty ? (
          <p className="text-sm text-slate-400">{emptyLabel}</p>
        ) : (
          renderView()
        )}
      </div>
    </div>
  );
}

/* ---------- Teacher sections ---------- */

function BioSection({ profile, onSave }) {
  const [bio, setBio] = useState(profile?.bio || "");

  useEffect(() => setBio(profile?.bio || ""), [profile?.bio]);

  return (
    <EditableSection
      title="Bio"
      isEmpty={!profile?.bio}
      emptyLabel="Add a short bio so students know your teaching style."
      onSave={onSave}
      buildPayload={() => ({ bio })}
      renderView={() => (
        <p className="text-sm leading-6 text-slate-600">{profile.bio}</p>
      )}
      renderEdit={() => (
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          placeholder="Tell students about your teaching style and experience..."
          className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      )}
    />
  );
}

function SubjectsSection({ profile, onSave }) {
  const [subjects, setSubjects] = useState(profile?.subjects || []);

  useEffect(() => setSubjects(profile?.subjects || []), [profile?.subjects]);

  return (
    <EditableSection
      title="Subjects you teach"
      isEmpty={!profile?.subjects?.length}
      emptyLabel="Add the subjects you tutor so students can find you."
      onSave={onSave}
      buildPayload={() => ({ subjects })}
      renderView={() => (
        <div className="flex flex-wrap gap-2">
          {profile.subjects.map((s) => (
            <span
              key={s}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
            >
              {s}
            </span>
          ))}
        </div>
      )}
      renderEdit={() => (
        <TagInput
          values={subjects}
          onChange={setSubjects}
          placeholder="Type a subject and press Enter"
        />
      )}
    />
  );
}

function TeachingLevelsSection({ profile, onSave }) {
  const [teachingLevels, setTeachingLevels] = useState(
    profile?.teachingLevels || [],
  );

  return (
    <EditableSection
      title="Teaching levels"
      isEmpty={!profile?.teachingLevels?.length}
      emptyLabel="Add the levels you teach so level filters can find you."
      onSave={onSave}
      buildPayload={() => ({ teachingLevels })}
      renderView={() => (
        <div className="flex flex-wrap gap-2">
          {profile.teachingLevels.map((level) => (
            <span
              key={level}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
            >
              {level}
            </span>
          ))}
        </div>
      )}
      renderEdit={() => (
        <TagInput
          values={teachingLevels}
          onChange={setTeachingLevels}
          placeholder="Type a level and press Enter"
        />
      )}
    />
  );
}

function RateExperienceSection({ profile, onSave }) {
  const [hourlyRate, setHourlyRate] = useState(profile?.hourlyRate ?? "");
  const [experienceYears, setExperienceYears] = useState(
    profile?.experienceYears ?? "",
  );

  useEffect(() => {
    setHourlyRate(profile?.hourlyRate ?? "");
    setExperienceYears(profile?.experienceYears ?? "");
  }, [profile?.hourlyRate, profile?.experienceYears]);

  return (
    <EditableSection
      title="Rate & experience"
      isEmpty={!profile?.hourlyRate && !profile?.experienceYears}
      emptyLabel="Set your hourly rate and experience."
      onSave={onSave}
      buildPayload={() => ({
        hourlyRate: hourlyRate ? Number(hourlyRate) : undefined,
        experienceYears: experienceYears ? Number(experienceYears) : undefined,
      })}
      renderView={() => (
        <div className="flex gap-10">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">
              Hourly rate
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              Rs {profile.hourlyRate}/hr
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">
              Experience
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {profile.experienceYears} yrs
            </p>
          </div>
        </div>
      )}
      renderEdit={() => (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Hourly rate (Rs)">
            <input
              type="number"
              min="0"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </Field>
          <Field label="Years of experience">
            <input
              type="number"
              min="0"
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </Field>
        </div>
      )}
    />
  );
}

function AvailabilitySection({ profile, onSave }) {
  const [availability, setAvailability] = useState(
    profile?.weeklyAvailability || [],
  );

  useEffect(
    () => setAvailability(profile?.weeklyAvailability || []),
    [profile?.weeklyAvailability],
  );

  const activeDays = (profile?.weeklyAvailability || []).filter(
    (d) => d.slots?.length,
  );

  return (
    <EditableSection
      title="Weekly availability"
      description="The time slots you're usually free to teach."
      isEmpty={activeDays.length === 0}
      emptyLabel="Add the days and times you're available to teach."
      onSave={onSave}
      buildPayload={() => ({ weeklyAvailability: availability })}
      renderView={() => (
        <div className="space-y-2">
          {activeDays.map((d) => (
            <div key={d.day} className="flex items-center gap-3 text-sm">
              <span className="w-28 shrink-0 font-medium text-slate-700">
                {d.day}
              </span>
              <span className="flex flex-wrap gap-2 text-slate-500">
                {d.slots.map((s, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs"
                  >
                    <Clock size={11} />
                    {s.startTime}–{s.endTime}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      )}
      renderEdit={() => (
        <AvailabilityEditor value={availability} onChange={setAvailability} />
      )}
    />
  );
}

/* ---------- Student sections ---------- */

function AcademicLevelSection({ profile, onSave }) {
  const [academicLevel, setAcademicLevel] = useState(
    profile?.academicLevel || "",
  );

  useEffect(
    () => setAcademicLevel(profile?.academicLevel || ""),
    [profile?.academicLevel],
  );

  return (
    <EditableSection
      title="Academic level"
      isEmpty={!profile?.academicLevel}
      emptyLabel="Set your current academic level."
      onSave={onSave}
      buildPayload={() => ({ academicLevel })}
      renderView={() => (
        <p className="text-sm font-medium text-slate-700">
          {profile.academicLevel}
        </p>
      )}
      renderEdit={() => (
        <select
          value={academicLevel}
          onChange={(e) => setAcademicLevel(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="">Select your level</option>
          {ACADEMIC_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      )}
    />
  );
}

function InterestsSection({ profile, onSave }) {
  const [interests, setInterests] = useState(profile?.interests || []);

  useEffect(() => setInterests(profile?.interests || []), [profile?.interests]);

  return (
    <EditableSection
      title="Interests"
      isEmpty={!profile?.interests?.length}
      emptyLabel="Add subjects or topics you're interested in learning."
      onSave={onSave}
      buildPayload={() => ({ interests })}
      renderView={() => (
        <div className="flex flex-wrap gap-2">
          {profile.interests.map((i) => (
            <span
              key={i}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
            >
              {i}
            </span>
          ))}
        </div>
      )}
      renderEdit={() => (
        <TagInput
          values={interests}
          onChange={setInterests}
          placeholder="Type a subject or topic and press Enter"
        />
      )}
    />
  );
}

/* ---------- Inputs ---------- */

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

function TagInput({ values, onChange, placeholder }) {
  const [draft, setDraft] = useState("");

  function addTag() {
    const trimmed = draft.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setDraft("");
  }

  function removeTag(tag) {
    onChange(values.filter((v) => v !== tag));
  }

  return (
    <div className="rounded-xl border border-slate-300 p-2 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
      <div className="flex flex-wrap gap-2">
        {values.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-emerald-500 hover:text-emerald-700"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag();
            }
          }}
          onBlur={addTag}
          placeholder={values.length === 0 ? placeholder : ""}
          className="min-w-[140px] flex-1 border-none px-1.5 py-1 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
      </div>
    </div>
  );
}

function AvailabilityEditor({ value, onChange }) {
  function getDaySlots(day) {
    return value.find((d) => d.day === day)?.slots || [];
  }

  function addSlot(day) {
    const existing = value.find((d) => d.day === day);
    const newSlot = { startTime: "10:00", endTime: "11:00" };

    if (existing) {
      onChange(
        value.map((d) =>
          d.day === day ? { ...d, slots: [...d.slots, newSlot] } : d,
        ),
      );
    } else {
      onChange([...value, { day, slots: [newSlot] }]);
    }
  }

  function updateSlot(day, index, field, val) {
    onChange(
      value.map((d) =>
        d.day === day
          ? {
              ...d,
              slots: d.slots.map((s, i) =>
                i === index ? { ...s, [field]: val } : s,
              ),
            }
          : d,
      ),
    );
  }

  function removeSlot(day, index) {
    onChange(
      value.map((d) =>
        d.day === day
          ? { ...d, slots: d.slots.filter((_, i) => i !== index) }
          : d,
      ),
    );
  }

  return (
    <div className="space-y-4">
      {DAYS.map((day) => {
        const slots = getDaySlots(day);
        return (
          <div
            key={day}
            className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4 sm:flex-row sm:items-start"
          >
            <p className="w-28 shrink-0 pt-2 text-sm font-medium text-slate-700">
              {day}
            </p>

            <div className="flex-1 space-y-2">
              {slots.length === 0 && (
                <p className="pt-1.5 text-sm text-slate-400">Not available</p>
              )}

              {slots.map((slot, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Clock size={14} className="shrink-0 text-slate-400" />
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) =>
                      updateSlot(day, index, "startTime", e.target.value)
                    }
                    className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                  <span className="text-slate-400">to</span>
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) =>
                      updateSlot(day, index, "endTime", e.target.value)
                    }
                    className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeSlot(day, index)}
                    className="text-slate-400 hover:text-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addSlot(day)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                <Plus size={14} /> Add time slot
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
