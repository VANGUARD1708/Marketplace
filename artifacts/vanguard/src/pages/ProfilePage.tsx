import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";

import {
  ShieldCheck,
  Star,
  Package,
  Briefcase,
  Award,
  Users,
  Loader2,
  Eye,
  MessageCircle,
  Share2,
  TrendingUp,
} from "lucide-react";

import { apiFetch } from "@/lib/api";
import TrustBadge from "@/components/guardian/TrustBadge";

type Profile = {
  id: number;
  userId: number;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  coverPhotoUrl?: string;
  location?: string;
  website?: string;
};

type TrustData = {
  userId: number;
  trustScore: number;
  badge: string;
};

type Review = {
  id: number;
  reviewerId: number;
  rating: string;
  comment?: string;
  createdAt: string;
};

const TABS = [
  "Overview",
  "Products",
  "Services",
  "Reviews",
  "Certificates",
  "Followers",
];

export default function ProfilePage() {
  const params = useParams<{ id?: string }>();

  const userId = Number(
    params.id ?? 1,
  );

  const [tab, setTab] =
    useState("Overview");

  const {
    data: profile,
    isLoading: loadingProfile,
  } = useQuery({
    queryKey: [
      "profile",
      userId,
    ],
    queryFn: () =>
      apiFetch<Profile>(
        `/profiles/${userId}`,
      ),
  });

  const { data: trust } =
    useQuery({
      queryKey: [
        "trust",
        userId,
      ],
      queryFn: () =>
        apiFetch<TrustData>(
          `/trust/${userId}`,
        ),
    });

  const {
    data: followers = [],
  } = useQuery({
    queryKey: [
      "followers",
      userId,
    ],
    queryFn: () =>
      apiFetch<unknown[]>(
        `/profiles/${userId}/followers`,
      ),
  });

  const {
    data: following = [],
  } = useQuery({
    queryKey: [
      "following",
      userId,
    ],
    queryFn: () =>
      apiFetch<unknown[]>(
        `/profiles/${userId}/following`,
      ),
  });

  const {
    data: reviews = [],
    isLoading:
      loadingReviews,
  } = useQuery({
    queryKey: [
      "reviews",
      userId,
    ],
    queryFn: () =>
      apiFetch<Review[]>(
        `/reviews/${userId}`,
      ),
    enabled:
      tab === "Reviews",
  });

  if (loadingProfile) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div
        className="h-56 bg-muted relative"
        style={
          profile?.coverPhotoUrl
            ? {
                backgroundImage: `url(${profile.coverPhotoUrl})`,
                backgroundSize:
                  "cover",
                backgroundPosition:
                  "center",
              }
            : {}
        }
      >
        <div className="absolute -bottom-14 left-6">
          {profile?.avatarUrl ? (
            <img
              src={
                profile.avatarUrl
              }
              alt="avatar"
              className="h-28 w-28 rounded-full border-4 border-background object-cover"
            />
          ) : (
            <div className="h-28 w-28 rounded-full bg-secondary border-4 border-background flex items-center justify-center text-3xl font-bold">
              {(
                profile?.displayName ??
                "U"
              )[0].toUpperCase()}
            </div>
          )}
        </div>
      </div>

      <div className="pt-20 px-4 md:px-8 pb-8">
        <div className="flex flex-col md:flex-row md:justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">
                {profile?.displayName ??
                  `User #${userId}`}
              </h1>

              {trust &&
                trust.trustScore >=
                  60 && (
                  <ShieldCheck className="h-5 w-5 text-primary" />
                )}
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              <TrustBadge badge="verified_user" />
              <TrustBadge badge="trusted_seller" />
              <TrustBadge badge="guardian_protected" />
            </div>

            {profile?.location && (
              <p className="text-sm text-muted-foreground mt-3">
                📍{" "}
                {
                  profile.location
                }
              </p>
            )}

            {profile?.bio && (
              <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                {profile.bio}
              </p>
            )}

            {profile?.website && (
              <a
                href={
                  profile.website
                }
                target="_blank"
                rel="noreferrer"
                className="text-primary text-sm hover:underline"
              >
                {
                  profile.website
                }
              </a>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() =>
                apiFetch(
                  `/profiles/${userId}/follow`,
                  {
                    method:
                      "POST",
                    body: JSON.stringify(
                      {
                        followerId: 1,
                      },
                    ),
                  },
                )
              }
              className="px-5 py-2 rounded-xl bg-primary text-primary-foreground"
            >
              Follow
            </button>

            <button className="px-5 py-2 rounded-xl border flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Message
            </button>

            <button className="px-5 py-2 rounded-xl border flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>