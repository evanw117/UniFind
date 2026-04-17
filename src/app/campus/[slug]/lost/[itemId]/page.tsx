"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/app/AuthContext";
import {
  ArrowLeft,
  Smartphone,
  Watch,
  BookOpen,
  Key,
  DollarSign,
  Layers,
  CheckCircle2,
} from "lucide-react";

const CATEGORIES = [
  { id: "electronics", name: "Electronics", icon: Smartphone, color: "text-indigo-600" },
  { id: "accessories", name: "Wearables / Watches", icon: Watch, color: "text-pink-600" },
  { id: "books", name: "Books & Stationery", icon: BookOpen, color: "text-amber-600" },
  { id: "keys", name: "Keys & IDs", icon: Key, color: "text-sky-600" },
  { id: "wallets", name: "Wallets & Money", icon: DollarSign, color: "text-emerald-600" },
  { id: "other", name: "Miscellaneous", icon: Layers, color: "text-slate-600" },
];

const getCategory = (categoryId: string) => CATEGORIES.find((category) => category.id === categoryId);
const fallbackImage = "https://placehold.co/900x600/E5E7EB/374151?text=No+Image";

const getCampusDisplayName = (slug: string) => {
  const cleaned = slug.trim().toLowerCase();
  if (cleaned === "atu-galway" || cleaned === "atu galway") return "ATU Galway";
  if (cleaned === "nuig-galway" || cleaned === "nuig galway" || cleaned === "nuig") return "University of Galway";
  return "Campus Lost & Found";
};

interface LostItem {
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
  returned_at: string | null;
  owner_claim_user_id: string | null;
  owner_confirmed_at: string | null;
  return_points_awarded: number | null;
  item_value_tier: "low" | "medium" | "high" | null;
  estimated_points: number | null;
  reward_review_status: string | null;
  reward_review_reason: string | null;
}

type ConfirmReturnResponse = {
  success: boolean;
  awarded_points: number;
  already_confirmed: boolean;
  reward_review_status?: string;
  reward_review_reason?: string | null;
};

export default function LostItemDetailPage() {
  const { session, user } = useAuth();
  const params = useParams();
  const pathname = usePathname();
  const [item, setItem] = useState<LostItem | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmingReturn, setConfirmingReturn] = useState(false);
  const [returnSuccess, setReturnSuccess] = useState<string | null>(null);
  const [returnError, setReturnError] = useState<string | null>(null);

  const slug = useMemo(() => {
    if (!params?.slug) return "";
    return Array.isArray(params.slug) ? params.slug[0] : params.slug;
  }, [params]);

  const itemId = useMemo(() => {
    if (params?.itemId) return Array.isArray(params.itemId) ? params.itemId[0] : params.itemId;
    if (params?.id) return Array.isArray(params.id) ? params.id[0] : params.id;
    if (pathname) {
      const segments = pathname.split("/").filter(Boolean);
      if (segments.length >= 4) return segments[3];
    }
    return "";
  }, [params, pathname]);

  useEffect(() => {
    if (!itemId || !supabase) {
      setIsLoading(false);
      return;
    }

    const client = supabase;
    setIsLoading(true);
    setFetchError(null);

    const fetchItem = async () => {
      try {
        const { data, error } = await client
          .from("lost_and_found_items")
          .select("*")
          .eq("id", itemId)
          .single();

        if (error) {
          setFetchError(error.message);
          setItem(null);
        } else {
          setItem(data as LostItem);
        }
      } catch (error) {
        setFetchError(error instanceof Error ? error.message : "Unknown error fetching item details.");
        setItem(null);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchItem();
  }, [itemId]);

  async function handleConfirmReturn() {
    if (!itemId || !session?.access_token) {
      setReturnError("Please sign in before confirming a return.");
      return;
    }

    setConfirmingReturn(true);
    setReturnError(null);
    setReturnSuccess(null);

    try {
      const response = await fetch("/api/confirm-return", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
          accessToken: session.access_token,
        }),
      });

      const payload = (await response.json()) as ConfirmReturnResponse | { error?: string };

      if (!response.ok || !("success" in payload)) {
        throw new Error("error" in payload ? payload.error || "Unable to confirm return." : "Unable to confirm return.");
      }

      const confirmedAt = new Date().toISOString();

      setItem((current) =>
        current
          ? {
              ...current,
              returned_at: confirmedAt,
              owner_claim_user_id: user?.id ?? current.owner_claim_user_id,
              owner_confirmed_at: confirmedAt,
              return_points_awarded: payload.awarded_points,
              reward_review_status: payload.reward_review_status ?? current.reward_review_status,
              reward_review_reason: payload.reward_review_reason ?? current.reward_review_reason,
            }
          : current,
      );

      setReturnSuccess(
        payload.already_confirmed
          ? payload.reward_review_status === "pending_review"
            ? "Receipt was already confirmed and the finder reward is still pending review."
            : `This return was already confirmed. ${payload.awarded_points} points were awarded previously.`
          : payload.reward_review_status === "pending_review"
            ? "Receipt confirmed. The finder reward is now pending review because this return needs an extra anti-abuse check."
            : "Receipt confirmed. The finder reward has been released.",
      );
    } catch (error) {
      setReturnError(error instanceof Error ? error.message : "Unable to confirm return.");
    } finally {
      setConfirmingReturn(false);
    }
  }

  if (!supabase) {
    return (
      <div className="min-h-screen bg-[#F6FAFD] px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 text-center shadow-xl">
          <p className="text-lg font-semibold text-red-600">Supabase client not configured.</p>
          <p className="mt-3 text-slate-600">Please check your environment variables and try again.</p>
        </div>
      </div>
    );
  }

  if (!itemId) {
    return (
      <div className="min-h-screen bg-[#F6FAFD] px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 text-center shadow-xl">
          <h1 className="mb-4 text-3xl font-bold text-slate-900">Invalid item detail route</h1>
          <p className="mb-4 text-slate-600">The route parameter for the item ID is missing.</p>
          <Link
            href={`/campus/${encodeURIComponent(slug)}/lost`}
            className="inline-flex items-center justify-center rounded-2xl bg-[#4B7C9B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3A627B]"
          >
            Back to lost items
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6FAFD] px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 text-center shadow-xl">
          <p className="text-xl font-semibold text-slate-900">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-[#F6FAFD] px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 text-center shadow-xl">
          <h1 className="mb-4 text-3xl font-bold text-slate-900">Item could not be loaded</h1>
          <p className="mb-4 text-slate-600">
            We could not find a lost item matching <strong>{itemId}</strong>.
          </p>
          {fetchError && <p className="mb-4 text-sm text-red-600">Error: {fetchError}</p>}
          <Link
            href={`/campus/${encodeURIComponent(slug)}/lost`}
            className="inline-flex items-center justify-center rounded-2xl bg-[#4B7C9B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3A627B]"
          >
            Back to lost items
          </Link>
        </div>
      </div>
    );
  }

  const category = getCategory(item.category);
  const isLost = item.status === true;
  const isFound = item.status === false;
  const statusLabel = isLost ? "Missing" : "Found";
  const statusClasses = isLost
    ? "border-red-100 bg-red-50 text-red-700"
    : "border-emerald-100 bg-emerald-50 text-emerald-700";
  const campusName = getCampusDisplayName(slug);
  const isFinder = Boolean(user?.id && item.reporter_user_id === user.id);
  const canConfirmReturn = isFound && Boolean(user?.id) && !isFinder && !item.owner_confirmed_at;

  const claimParams = new URLSearchParams({
    subject: `Claim item: ${item.title}`,
    message: `Hi UniFind team,\n\nI would like to claim the item "${item.title}" reported at ${item.location} on ${new Date(item.date_reported).toLocaleDateString()}.\n\nPlease let me know the next steps.\n\nThanks.`,
  });

  return (
    <div className="-mt-24 min-h-[calc(100vh-6rem)] bg-[#F6FAFD] pt-24">
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] ring-1 ring-slate-200">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-3">
                <span className="inline-flex rounded-full bg-[#4B7C9B]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-[#4B7C9B]">
                  Lost item detail
                </span>
                <div className="space-y-2">
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                    {item.title}
                  </h1>
                  <p className="max-w-2xl leading-7 text-slate-600">
                    View the full report, location details, and claim steps for this item reported at {campusName}.
                  </p>
                </div>
              </div>

              <Link
                href={`/campus/${slug}/lost`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 shadow-sm transition hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to lost items
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.35)] ring-1 ring-slate-200">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Report summary</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">Fast access</h2>
            <div className="mt-6 grid gap-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Status</p>
                <p className="mt-2 font-semibold text-slate-900">{statusLabel}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Category</p>
                <p className="mt-2 flex items-center gap-2 font-semibold text-slate-900">
                  {category && <category.icon className={`h-4 w-4 ${category.color}`} />}
                  {category?.name || "Other"}
                </p>
              </div>
              {item.returned_at && (
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-emerald-700">Returned</p>
                  <p className="mt-2 font-semibold text-emerald-900">
                    Confirmed on {new Date(item.returned_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.4fr_0.95fr]">
          <section className="space-y-8">
            <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-xl ring-1 ring-slate-200">
              <div className="bg-slate-100 p-6">
                <img
                  src={item.image_url || fallbackImage}
                  alt={item.title}
                  className="mx-auto h-[420px] w-full max-w-4xl object-contain"
                  onError={(e) => {
                    e.currentTarget.src = fallbackImage;
                  }}
                />
              </div>
              <div className="p-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-400">{campusName}</p>
                    <h2 className="mt-2 text-4xl font-extrabold text-slate-900">{item.title}</h2>
                  </div>
                  <span className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold ${statusClasses}`}>
                    {statusLabel}
                  </span>
                </div>

                <p className="mt-6 leading-8 text-slate-600">{item.description}</p>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-slate-200 bg-[#F8FBFF] p-6">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Reported</p>
                    <p className="mt-3 text-lg font-semibold text-slate-900">
                      {new Date(item.date_reported).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-200 bg-[#F8FBFF] p-6">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Location</p>
                    <p className="mt-3 text-lg font-semibold text-slate-900">{item.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[1.75rem] bg-white p-8 shadow-xl ring-1 ring-slate-200">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Item details</p>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">Quick summary</h2>
              <dl className="mt-8 space-y-4 text-sm text-slate-600">
                <div className="rounded-3xl border border-slate-100 bg-slate-50 px-4 py-4">
                  <dt className="text-xs uppercase tracking-[0.22em] text-slate-500">Campus</dt>
                  <dd className="mt-2 text-base font-semibold text-slate-900">{campusName}</dd>
                </div>
                <div className="rounded-3xl border border-slate-100 bg-slate-50 px-4 py-4">
                  <dt className="text-xs uppercase tracking-[0.22em] text-slate-500">Category</dt>
                  <dd className="mt-2 flex items-center gap-2 text-base font-semibold text-slate-900">
                    {category && <category.icon className={`h-4 w-4 ${category.color}`} />}
                    {category?.name || "Other"}
                  </dd>
                </div>
                {item.item_value_tier && (
                  <div className="rounded-3xl border border-slate-100 bg-slate-50 px-4 py-4">
                    <dt className="text-xs uppercase tracking-[0.22em] text-slate-500">Reward tier</dt>
                    <dd className="mt-2 text-base font-semibold capitalize text-slate-900">
                      {item.item_value_tier} value
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {isFound && (
              <div className="rounded-[1.75rem] bg-[#F3F8FC] p-8 shadow-sm ring-1 ring-[#4B7C9B]/10">
                <p className="text-sm uppercase tracking-[0.24em] text-[#4B7C9B]">Return reward</p>
                <h3 className="mt-3 text-2xl font-bold text-slate-900">Found item workflow</h3>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {item.owner_confirmed_at
                    ? item.reward_review_status === "pending_review"
                      ? "The owner has confirmed receipt. The finder reward is being held for an anti-abuse review before any points are released."
                      : `The owner has confirmed receipt and ${item.return_points_awarded ?? 0} return points were released to the finder.`
                    : "Once the owner receives this item back, they should confirm receipt here. The finder cannot approve their own reward."}
                </p>

                {item.reward_review_status === "pending_review" && item.reward_review_reason && (
                  <div className="mt-4 rounded-2xl bg-amber-50 p-3 text-sm text-amber-800">
                    {item.reward_review_reason}
                  </div>
                )}

                {returnSuccess && (
                  <div className="mt-4 rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-700">
                    {returnSuccess}
                  </div>
                )}
                {returnError && (
                  <div className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700">
                    {returnError}
                  </div>
                )}

                {canConfirmReturn && (
                  <button
                    onClick={handleConfirmReturn}
                    disabled={confirmingReturn}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-700 disabled:opacity-60"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {confirmingReturn ? "Confirming..." : "I received this item back"}
                  </button>
                )}

                {!canConfirmReturn && !item.owner_confirmed_at && (
                  <div className="mt-6 rounded-2xl bg-white p-4 text-sm text-slate-600 ring-1 ring-slate-200">
                    {isFinder
                      ? "The owner must confirm receipt of this item before any finder reward can be released."
                      : "Sign in with the account that recovered this item to confirm receipt and trigger the secure reward check."}
                  </div>
                )}
              </div>
            )}

            <div className="rounded-[1.75rem] bg-[#F3F8FC] p-8 shadow-sm ring-1 ring-[#4B7C9B]/10">
              <p className="text-sm uppercase tracking-[0.24em] text-[#4B7C9B]">Claim this item</p>
              <h3 className="mt-3 text-2xl font-bold text-slate-900">Ready to claim?</h3>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Send a claim request through UniFind and we&apos;ll help connect you with the owner.
              </p>
              <Link
                href={`/contact?${claimParams.toString()}`}
                className="mt-6 inline-flex w-full items-center justify-center rounded-3xl bg-[#4B7C9B] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#3A627B]"
              >
                Claim this item
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
