import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, Users, Lock, Globe, Shield, Heart, MessageCircle,
  Share2, Loader2, UserCircle, ChevronDown, ChevronUp, Send,
} from "lucide-react";
import { apiFetch, getToken } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type Community = {
  id: number;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  isPrivate: boolean;
  isJoined: boolean;
  trustRequired: number;
  coverColor: string;
  createdAt: string;
};

type Comment = {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: string;
  authorName?: string;
  authorAvatar?: string;
  authorUsername?: string;
};

type Post = {
  id: number;
  userId: number;
  communityId: number | null;
  content: string;
  mediaUrl?: string;
  likesCount: number;
  isLiked?: boolean;
  createdAt: string;
  authorName?: string;
  authorAvatar?: string;
  authorUsername?: string;
};

type Member = {
  userId: number;
  joinedAt: string;
  displayName?: string;
  avatarUrl?: string;
  username?: string;
};

function CommentThread({ postId, communityId }: { postId: number; communityId: number }) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [draft, setDraft] = useState("");
  const isLoggedIn = Boolean(getToken());

  const { data: comments = [], isLoading } = useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: () => apiFetch<Comment[]>(`/feed/${postId}/comments`),
  });

  const addComment = useMutation({
    mutationFn: (content: string) =>
      apiFetch(`/feed/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ content }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comments", postId] });
      setDraft("");
    },
    onError: () => toast({ title: "Failed to post comment", variant: "destructive" }),
  });

  return (
    <div className="border-t pt-3 mt-1 space-y-3">
      {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mx-auto" />}
      {comments.map((c) => (
        <div key={c.id} className="flex gap-2.5">
          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            {c.authorAvatar ? (
              <img src={c.authorAvatar} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              <UserCircle className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <div className="bg-muted rounded-xl px-3 py-2">
              <p className="text-xs font-medium">{c.authorName ?? c.authorUsername ?? `User #${c.userId}`}</p>
              <p className="text-sm mt-0.5">{c.content}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1 pl-1">{new Date(c.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
      {isLoggedIn && (
        <div className="flex gap-2 items-center">
          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <UserCircle className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1 flex gap-2 items-center border rounded-xl px-3 py-1.5 bg-background">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && draft.trim()) {
                  e.preventDefault();
                  addComment.mutate(draft);
                }
              }}
              placeholder="Write a comment..."
              className="flex-1 bg-transparent text-sm outline-none"
            />
            <button
              onClick={() => draft.trim() && addComment.mutate(draft)}
              disabled={!draft.trim() || addComment.isPending}
              className="text-primary disabled:opacity-40"
            >
              {addComment.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CommunityPostCard({ post, communityId, onLike }: { post: Post; communityId: number; onLike: (id: number) => void }) {
  const [showComments, setShowComments] = useState(false);
  const isLoggedIn = Boolean(getToken());

  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      {post.mediaUrl && (
        <img src={post.mediaUrl} alt="" className="w-full h-64 object-cover" />
      )}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {post.authorAvatar ? (
              <img src={post.authorAvatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <UserCircle className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="font-medium text-sm">{post.authorName ?? post.authorUsername ?? `User #${post.userId}`}</p>
            <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <p className="text-sm mb-3">{post.content}</p>
        <div className="flex items-center gap-4 border-t pt-3">
          <button
            onClick={() => isLoggedIn && onLike(post.id)}
            disabled={!isLoggedIn}
            className={`flex items-center gap-1.5 text-sm transition ${post.isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"} disabled:opacity-50`}
          >
            <Heart className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
            {post.likesCount > 0 && <span>{post.likesCount}</span>}
          </button>
          <button
            onClick={() => setShowComments((v) => !v)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <MessageCircle className="h-4 w-4" />
            {showComments ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            Comment
          </button>
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition ml-auto">
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
        {showComments && <CommentThread postId={post.id} communityId={communityId} />}
      </div>
    </div>
  );
}

export default function CommunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const qc = useQueryClient();
  const communityId = Number(id);
  const isLoggedIn = Boolean(getToken());

  const [activeTab, setActiveTab] = useState<"posts" | "members">("posts");
  const [draft, setDraft] = useState("");

  const { data: community, isLoading: loadingCommunity } = useQuery<Community>({
    queryKey: ["community", communityId],
    queryFn: () => apiFetch<Community>(`/communities/${communityId}`),
  });

  const { data: postsData, isLoading: loadingPosts } = useQuery<{ posts: Post[] }>({
    queryKey: ["community-posts", communityId],
    queryFn: () => apiFetch<{ posts: Post[] }>(`/communities/${communityId}/posts`),
    enabled: activeTab === "posts",
  });

  const { data: members = [], isLoading: loadingMembers } = useQuery<Member[]>({
    queryKey: ["community-members", communityId],
    queryFn: () => apiFetch<Member[]>(`/communities/${communityId}/members`),
    enabled: activeTab === "members",
  });

  const joinMutation = useMutation({
    mutationFn: () => apiFetch(`/communities/${communityId}/join`, { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["community", communityId] });
      qc.invalidateQueries({ queryKey: ["communities"] });
      toast({ title: "Joined!" });
    },
    onError: () => toast({ title: "Failed to join", variant: "destructive" }),
  });

  const leaveMutation = useMutation({
    mutationFn: () => apiFetch(`/communities/${communityId}/leave`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["community", communityId] });
      qc.invalidateQueries({ queryKey: ["communities"] });
      toast({ title: "Left community" });
    },
    onError: () => toast({ title: "Failed to leave", variant: "destructive" }),
  });

  const createPost = useMutation({
    mutationFn: (content: string) =>
      apiFetch("/feed", {
        method: "POST",
        body: JSON.stringify({ content, communityId }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["community-posts", communityId] });
      setDraft("");
      toast({ title: "Posted!" });
    },
    onError: (err: any) => {
      const msg = err?.message ?? "Failed to post";
      toast({ title: msg, variant: "destructive" });
    },
  });

  const likeMutation = useMutation({
    mutationFn: (postId: number) => apiFetch(`/feed/${postId}/like`, { method: "POST" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["community-posts", communityId] }),
  });

  if (loadingCommunity) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!community) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <p className="text-muted-foreground">Community not found.</p>
        <button onClick={() => navigate("/communities")} className="mt-4 text-primary underline text-sm">
          Back to Communities
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <button
        onClick={() => navigate("/communities")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Communities
      </button>

      <div className={`rounded-2xl bg-gradient-to-br ${community.coverColor} p-6 mb-5 relative overflow-hidden`}>
        <div className="flex items-center gap-2 mb-2">
          {community.isPrivate ? (
            <Lock className="h-4 w-4 text-white/80" />
          ) : (
            <Globe className="h-4 w-4 text-white/80" />
          )}
          <span className="text-xs text-white/80 bg-black/20 px-2 py-0.5 rounded-full font-medium">
            {community.category}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">{community.name}</h1>
        <p className="text-sm text-white/80 mb-4 max-w-lg">{community.description}</p>
        <div className="flex items-center gap-4 text-sm text-white/80">
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            {community.memberCount.toLocaleString()} members
          </span>
          {community.trustRequired > 0 && (
            <span className="flex items-center gap-1.5">
              <Shield className="h-4 w-4" />
              Trust {community.trustRequired}+
            </span>
          )}
        </div>
        {isLoggedIn && (
          <button
            onClick={() => (community.isJoined ? leaveMutation.mutate() : joinMutation.mutate())}
            disabled={joinMutation.isPending || leaveMutation.isPending}
            className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-sm font-medium transition disabled:opacity-50 ${
              community.isJoined
                ? "bg-white/20 text-white hover:bg-white/30"
                : "bg-white text-gray-900 hover:bg-white/90"
            }`}
          >
            {community.isJoined ? "Leave" : "Join"}
          </button>
        )}
      </div>

      <div className="flex gap-1 mb-5 bg-muted rounded-xl p-1">
        {(["posts", "members"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition ${
              activeTab === t ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {activeTab === "posts" && (
        <div className="space-y-4">
          {isLoggedIn && community.isJoined && (
            <div className="rounded-2xl border bg-card p-4">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`Share something with ${community.name}...`}
                rows={3}
                className="w-full resize-none bg-transparent outline-none text-sm"
              />
              <div className="flex justify-end mt-2">
                <button
                  disabled={!draft.trim() || createPost.isPending}
                  onClick={() => createPost.mutate(draft)}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:bg-primary/90 transition"
                >
                  {createPost.isPending ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          )}

          {loadingPosts && (
            <div className="flex justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {postsData?.posts.map((post) => (
            <CommunityPostCard
              key={post.id}
              post={post}
              communityId={communityId}
              onLike={(id) => likeMutation.mutate(id)}
            />
          ))}

          {!loadingPosts && postsData?.posts.length === 0 && (
            <div className="text-center py-14">
              <MessageCircle className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="font-semibold">No posts yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                {community.isJoined ? "Be the first to post in this community." : "Join to see and create posts."}
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "members" && (
        <div className="space-y-2">
          {loadingMembers && (
            <div className="flex justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
          {members.map((m) => (
            <div key={m.userId} className="flex items-center gap-3 p-3 rounded-xl border bg-card hover:bg-muted/50 transition">
              <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                {m.avatarUrl ? (
                  <img src={m.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <UserCircle className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="font-medium text-sm">{m.displayName ?? m.username ?? `User #${m.userId}`}</p>
                <p className="text-xs text-muted-foreground">@{m.username ?? m.userId}</p>
              </div>
              <p className="ml-auto text-xs text-muted-foreground">
                Joined {new Date(m.joinedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
          {!loadingMembers && members.length === 0 && (
            <div className="text-center py-14">
              <Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="font-semibold">No members yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
