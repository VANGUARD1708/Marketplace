import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Loader2,
  Shield,
  Flame,
  Eye,
} from "lucide-react";

import {
  apiFetch,
  getToken,
} from "@/lib/api";

type Post = {
  id: number;
  userId: number;
  content: string;
  mediaUrl?: string;
  createdAt: string;

  trustScore?: number;
  views?: number;
  saves?: number;
  verified?: boolean;
  trending?: boolean;
  price?: number;
};

export default function FeedPage() {
  const qc = useQueryClient();

  const [draft, setDraft] =
    useState("");

  const isLoggedIn =
    Boolean(getToken());

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["feed"],
    queryFn: () =>
      apiFetch<{
        posts: Post[];
      }>("/feed"),
  });

  const createPost =
    useMutation({
      mutationFn: (
        content: string,
      ) =>
        apiFetch("/feed", {
          method: "POST",
          body: JSON.stringify({
            content,
          }),
        }),

      onSuccess: () => {
        qc.invalidateQueries({
          queryKey: ["feed"],
        });

        setDraft("");
      },
    });

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Vanguard Feed
        </h1>

        <p className="text-muted-foreground">
          Discover opportunities,
          deals, services and
          trusted sellers.
        </p>
      </div>

      {isLoggedIn && (
        <div className="rounded-2xl border bg-card p-4 mb-6">
          <textarea
            value={draft}
            onChange={(e) =>
              setDraft(
                e.target.value,
              )
            }
            placeholder="Share an update..."
            rows={3}
            className="w-full resize-none bg-transparent outline-none text-sm"
          />

          <div className="flex justify-end mt-3">
            <button
              disabled={
                !draft.trim() ||
                createPost.isPending
              }
              onClick={() =>
                createPost.mutate(
                  draft,
                )
              }
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground disabled:opacity-50"
            >
              {createPost.isPending
                ? "Posting..."
                : "Post"}
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-500 p-4 text-red-500">
          {String(error)}
        </div>
      )}

      <div className="space-y-6">
        {data?.posts?.map(
          (post) => (
            <div
              key={post.id}
              className="rounded-2xl border bg-card overflow-hidden"
            >
              {post.mediaUrl && (
                <img
                  src={
                    post.mediaUrl
                  }
                  alt=""
                  className="w-full h-80 object-cover"
                />
              )}

              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-11 w-11 rounded-full bg-muted flex items-center justify-center font-bold">
                    {
                      post.userId
                    }
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        User #
                        {
                          post.userId
                        }
                      </p>

                      {post.verified && (
                        <span className="text-xs px-2 py-0.5 rounded-full border">
                          ✅ Verified
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {new Date(
                        post.createdAt,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {post.trending && (
                    <span className="px-2 py-1 rounded-full border text-xs flex items-center gap-1">
                      <Flame className="h-3 w-3" />
                      Trending
                    </span>
                  )}

                  <span className="px-2 py-1 rounded-full border text-xs flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Guardian Protected
                  </span>

                  <span className="px-2 py-1 rounded-full border text-xs">
                    ⭐ Trust{" "}
                    {post.trustScore ??
                      80}
                  </span>
                </div>

                <div className="flex gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {post.views ??
                      120}
                  </span>

                  <span>
                    ❤️{" "}
                    {post.saves ??
                      24}
                  </span>
                </div>

                {post.price && (
                  <div className="mb-3">
                    <p className="text-2xl font-bold text-primary">
                      ₦
                      {post.price.toLocaleString()}
                    </p>
                  </div>
                )}

                <p className="mb-4">
                  {post.content}
                </p>

                <div className="flex items-center gap-4 border-t pt-3">
                  <button className="flex items-center gap-2 text-sm">
                    <Heart className="h-4 w-4" />
                    Like
                  </button>

                  <button className="flex items-center gap-2 text-sm">
                    <MessageCircle className="h-4 w-4" />
                    Chat
                  </button>

                  <button className="flex items-center gap-2 text-sm">
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>

                  <button className="flex items-center gap-2 text-sm ml-auto">
                    <Bookmark className="h-4 w-4" />
                    Save
                  </button>
                </div>
              </div>
            </div>
          ),
        )}

        {data?.posts?.length ===
          0 && (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold">
              No Posts Yet
            </h2>

            <p className="text-muted-foreground">
              Be the first to
              share something on
              Vanguard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}