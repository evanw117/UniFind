"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../AuthContext";
import {
  Edit3,
  Trash2,
  Save,
  X,
  MapPin,
  CalendarDays,
  Tag,
  FolderOpen,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

type ReportItem = {
  id: string;
  created_at: string;
  campus_slug: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date_reported: string;
  status: boolean;
  image_url: string | null;
  reporter_user_id: string | null;
  item_value_tier: "low" | "medium" | "high" | null;
  estimated_points: number | null;
  returned_at: string | null;
  owner_confirmed_at: string | null;
  reward_review_status: string | null;
  reward_review_reason: string | null;
};

type EditFormState = {
  title: string;
  description: string;
  category: string;
  location: string;
  date_reported: string;
};

const emptyEditState: EditFormState = {
  title: "",
  description: "",
  category: "",
  location: "",
  date_reported: "",
};

const fallbackImage = "https://placehold.co/600x400/E2E8F0/475569?text=UniFind";

function formatCampus(slug: string) {
  if (slug === "atu-galway") return "ATU Galway";
  if (slug === "nuig-galway") return "University of Galway";
  return slug.replace(/-/g, " ");
}

export default function MyReportsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>(emptyEditState);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, router, user]);

  useEffect(() => {
    let ignore = false;

    async function loadReports() {
      if (isLoading) return;

      if (!supabase || !user) {
        if (!ignore) {
          setReports([]);
          setLoadingReports(false);
        }
        return;
      }

      setLoadingReports(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("lost_and_found_items")
        .select("*")
        .eq("reporter_user_id", user.id)
        .order("created_at", { ascending: false });

      if (!ignore) {
        if (fetchError) {
          setError(fetchError.message);
          setReports([]);
        } else {
          setReports((data as ReportItem[]) ?? []);
        }
        setLoadingReports(false);
      }
    }

    void loadReports();

    return () => {
      ignore = true;
    };
  }, [isLoading, user]);

  const groupedReports = useMemo(
    () => ({
      found: reports.filter((report) => report.status === false),
      lost: reports.filter((report) => report.status === true),
    }),
    [reports],
  );

  const totalReturns = useMemo(
    () => reports.filter((report) => Boolean(report.returned_at)).length,
    [reports],
  );

  function startEdit(report: ReportItem) {
    setEditingId(report.id);
    setEditForm({
      title: report.title,
      description: report.description,
      category: report.category,
      location: report.location,
      date_reported: report.date_reported,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(emptyEditState);
  }

  async function saveEdit(reportId: string) {
    if (!supabase) {
      setError("Database connection not available.");
      return;
    }

    setSaving(true);
    setError(null);

    const { error: updateError } = await supabase
      .from("lost_and_found_items")
      .update({
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        category: editForm.category.trim(),
        location: editForm.location.trim(),
        date_reported: editForm.date_reported,
      })
      .eq("id", reportId);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    setReports((current) =>
      current.map((report) =>
        report.id === reportId
          ? {
              ...report,
              title: editForm.title.trim(),
              description: editForm.description.trim(),
              category: editForm.category.trim(),
              location: editForm.location.trim(),
              date_reported: editForm.date_reported,
            }
          : report,
      ),
    );

    setSaving(false);
    cancelEdit();
  }

  async function deleteReport(reportId: string) {
    if (!supabase) {
      setError("Database connection not available.");
      return;
    }

    const confirmed = window.confirm("Delete this report? This cannot be undone.");
    if (!confirmed) return;

    setDeletingId(reportId);
    setError(null);

    const { error: deleteError } = await supabase
      .from("lost_and_found_items")
      .delete()
      .eq("id", reportId);

    if (deleteError) {
      setError(deleteError.message);
      setDeletingId(null);
      return;
    }

    setReports((current) => current.filter((report) => report.id !== reportId));
    if (editingId === reportId) cancelEdit();
    setDeletingId(null);
  }

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f8fbff_0%,#eef5fb_100%)]">
        <p className="text-lg font-medium text-slate-700">Loading your reports...</p>
      </div>
    );
  }

  const renderReportCard = (report: ReportItem) => {
    const isEditing = editingId === report.id;
    const isFound = report.status === false;

    return (
      <article
        key={report.id}
        className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_24px_70px_-40px_rgba(15,23,42,0.35)]"
      >
        <div className="grid lg:grid-cols-[260px_1fr]">
          <div className="relative min-h-[220px] bg-slate-100">
            <img
              src={report.image_url || fallbackImage}
              alt={report.title}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.src = fallbackImage;
              }}
            />
            <div className="absolute inset-x-4 top-4 flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] ${
                  isFound
                    ? "bg-amber-300 text-slate-900"
                    : "bg-sky-700 text-white"
                }`}
              >
                {isFound ? "Found report" : "Lost report"}
              </span>
              {report.returned_at && (
                <span className="rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-white">
                  Returned
                </span>
              )}
              {report.reward_review_status === "pending_review" && (
                <span className="rounded-full bg-amber-400 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-900">
                  Review hold
                </span>
              )}
            </div>
          </div>

          <div className="p-5 sm:p-7">
            <div className="flex flex-col gap-5 xl:flex-row xl:justify-between">
              <div className="min-w-0 flex-1 space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    {formatCampus(report.campus_slug)}
                  </p>
                  {!isEditing ? (
                    <>
                      <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                        {report.title}
                      </h2>
                      <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                        {report.description}
                      </p>
                    </>
                  ) : (
                    <div className="grid gap-3">
                      <input
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm((current) => ({ ...current, title: e.target.value }))
                        }
                        className="rounded-xl border border-slate-300 px-4 py-3 text-base"
                        placeholder="Title"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm((current) => ({
                            ...current,
                            description: e.target.value,
                          }))
                        }
                        rows={4}
                        className="rounded-xl border border-slate-300 px-4 py-3 text-base"
                        placeholder="Description"
                      />
                    </div>
                  )}
                </div>

                <div className="grid gap-3 text-sm text-slate-500 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="mb-1 flex items-center gap-2 text-slate-400">
                      <MapPin className="h-4 w-4" />
                      Location
                    </div>
                    {isEditing ? (
                      <input
                        value={editForm.location}
                        onChange={(e) =>
                          setEditForm((current) => ({ ...current, location: e.target.value }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
                      />
                    ) : (
                      <p className="font-medium text-slate-800">{report.location}</p>
                    )}
                  </div>

                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="mb-1 flex items-center gap-2 text-slate-400">
                      <Tag className="h-4 w-4" />
                      Category
                    </div>
                    {isEditing ? (
                      <input
                        value={editForm.category}
                        onChange={(e) =>
                          setEditForm((current) => ({ ...current, category: e.target.value }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
                      />
                    ) : (
                      <p className="font-medium capitalize text-slate-800">{report.category}</p>
                    )}
                  </div>

                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="mb-1 flex items-center gap-2 text-slate-400">
                      <CalendarDays className="h-4 w-4" />
                      Reported
                    </div>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editForm.date_reported}
                        onChange={(e) =>
                          setEditForm((current) => ({
                            ...current,
                            date_reported: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
                      />
                    ) : (
                      <p className="font-medium text-slate-800">
                        {new Date(report.date_reported).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="mb-1 flex items-center gap-2 text-slate-400">
                      <Sparkles className="h-4 w-4" />
                      Rewards
                    </div>
                    {isFound && report.estimated_points ? (
                      <div className="space-y-1">
                        <p className="font-medium text-slate-800">
                          {report.estimated_points} pts
                          {report.item_value_tier ? ` · ${report.item_value_tier}` : ""}
                        </p>
                        {report.reward_review_status === "pending_review" && (
                          <p className="text-xs font-medium text-amber-700">Reward pending review</p>
                        )}
                      </div>
                    ) : (
                      <p className="font-medium text-slate-800">Not reward-bearing</p>
                    )}
                  </div>
                </div>

                {report.reward_review_status === "pending_review" && report.reward_review_reason && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    {report.reward_review_reason}
                  </div>
                )}
              </div>

              <div className="flex shrink-0 flex-wrap gap-2 xl:w-[160px] xl:flex-col">
                {!isEditing ? (
                  <>
                    <button
                      onClick={() => startEdit(report)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => void deleteReport(report.id)}
                      disabled={deletingId === report.id}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-100 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-200 disabled:opacity-60"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deletingId === report.id ? "Deleting..." : "Delete"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => void saveEdit(report.id)}
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                    >
                      <Save className="h-4 w-4" />
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-200"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#eef5fb_45%,#fff8ef_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white px-6 py-8 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.35)] sm:px-8 sm:py-10">
          <div className="absolute -right-20 top-0 h-48 w-48 rounded-full bg-sky-100 blur-3xl" />
          <div className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-amber-100 blur-3xl" />

          <div className="relative z-10 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">
                My Reports
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Everything you&apos;ve submitted
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                Review the lost and found items attached to your account, refine the details,
                or remove posts you no longer want live.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Total reports
                </p>
                <p className="mt-3 text-3xl font-black text-slate-950">{reports.length}</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Confirmed returns
                </p>
                <p className="mt-3 text-3xl font-black text-slate-950">{totalReturns}</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Ownership
                </p>
                <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                  <ShieldCheck className="h-4 w-4" />
                  Only your posts
                </p>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 p-4 text-red-700 shadow-sm">{error}</div>
        )}

        <section className="mt-8 space-y-10">
          {loadingReports ? (
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-slate-600">Loading your reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
              <FolderOpen className="mx-auto h-12 w-12 text-slate-300" />
              <h2 className="mt-4 text-2xl font-bold text-slate-900">No reports yet</h2>
              <p className="mx-auto mt-3 max-w-xl text-slate-500">
                Once you submit a lost or found item, it will show up here with edit and delete controls.
              </p>
            </div>
          ) : (
            <>
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Found Items ({groupedReports.found.length})
                  </h2>
                </div>
                {groupedReports.found.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
                    No found-item reports yet.
                  </div>
                ) : (
                  groupedReports.found.map(renderReportCard)
                )}
              </section>

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Lost Items ({groupedReports.lost.length})
                  </h2>
                </div>
                {groupedReports.lost.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
                    No lost-item reports yet.
                  </div>
                ) : (
                  groupedReports.lost.map(renderReportCard)
                )}
              </section>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
