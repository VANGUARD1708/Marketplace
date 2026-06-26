import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Heart, MessageCircle, Share2, Bookmark,
  Loader2, UserCircle, Image as ImageIcon, ChevronDown, ChevronUp, Send,
} from "lucide-react";
import { apiFetch, getToken } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

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
  isLiked: boolean;
  createdAt: string;
  authorName?: string;
  authorAvatar?: string;
  authorUsername?: string;
};

function CommentThread({ postId }: { postId: number }) {
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
          <div className="flex-1 min-w-0">
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
      {!isLoggedIn && comments.length === 0 && (
        <p className="text-xs text-muted-foreground text-center">Sign in to leave a comment.</p>
      )}
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  const qc = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const isLoggedIn = Boolean(getToken());

  const likeMutation = useMutation({
    mutationFn: () => apiFetch(`/feed/${post.id}/like`, { method: "POST" }),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ["feed"] });
      const prev = qc.getQueryData<{ posts: Post[] }>(["feed"]);
      qc.setQueryData<{ posts: Post[] }>(["feed"], (old) => {
        if (!old) return old;
        return {
          ...old,
          posts: old.posts.map((p) =>
            p.id === post.id
              ? { ...p, isLiked: !p.isLiked, likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1 }
              : p,
          ),
        };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["feed"], ctx.prev);
    },
  });

  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      {post.mediaUrl && (
        <img src={post.mediaUrl} alt="" className="w-full h-72 object-cover" />
      )}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
            {post.authorAvatar ? (
              <img src={post.authorAvatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <UserCircle className="h-7 w-7 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">
              {post.authorName ?? post.authorUsername ?? `User #${post.userId}`}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              {post.communityId && (
                <>
                  <span>·</span>
                  <Link href={`/communities/${post.communityId}`}>
                    <span className="text-primary hover:underline cursor-pointer">Community post</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm leading-relaxed mb-4">{post.content}</p>

        <div className="flex items-center gap-4 border-t pt-3">
          <button
            onClick={() => isLoggedIn && likeMutation.mutate()}
            disabled={!isLoggedIn}
            className={`flex items-center gap-1.5 text-sm transition ${
              post.isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
            } disabled:opacity-50`}
          >
            <Heart className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
            <span>{post.likesCount > 0 ? post.likesCount : "Like"}</span>
          </button>

          <button
            onClick={() => setShowComments((v) => !v)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <MessageCircle className="h-4 w-4" />
            {showComments ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            Comment
          </button>

          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
            <Share2 className="h-4 w-4" />
            Share
          </button>

          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition ml-auto">
            <Bookmark className="h-4 w-4" />
            Save
          </button>
        </div>

        {showComments && <CommentThread postId={post.id} />}
      </div>
    </div>
  );
}

export default function FeedPage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [draft, setDraft] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [showMedia, setShowMedia] = useState(false);

  const isLoggedIn = Boolean(getToken());

  const { data, isLoading, error } = useQuery({
    queryKey: ["feed"],
    queryFn: () => apiFetch<{ posts: Post[] }>("/feed"),
  });

  const createPost = useMutation({
    mutationFn: (payload: { content: string; mediaUrl?: string }) =>
      apiFetch("/feed", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feed"] });
      setDraft("");
      setMediaUrl("");
      setShowMedia(false);
      toast({ title: "Posted!" });
    },
    onError: () => toast({ title: "Failed to post", variant: "destructive" }),
  });

  const handleSubmit = () => {
    if (!draft.trim()) return;
    createPost.mutate({ content: draft, mediaUrl: mediaUrl.trim() || undefined });
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Vanguard Feed</h1>
        <p className="text-muted-foreground">Discover opportunities, deals, services and trusted sellers.</p>
      </div>

      {isLoggedIn && (
        <div className="rounded-2xl border bg-card p-4 mb-6">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Share an update, deal, or opportunity..."
            rows={3}
            className="w-full resize-none bg-transparent outline-none text-sm"
          />
          {showMedia && (
            <input
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="Image URL (optional)"
              className="w-full mt-2 px-3 py-2 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          )}
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={() => setShowMedia((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition"
            >
              <ImageIcon className="h-4 w-4" />
              {showMedia ? "Remove image" : "Add image"}
            </button>
            <button
              disabled={!draft.trim() || createPost.isPending}
              onClick={handleSubmit}
              className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:bg-primary/90 transition"
            >
              {createPost.isPending ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      )}

      {!isLoggedIn && (
        <div className="rounded-2xl border bg-card p-4 mb-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">Sign in to post and interact with the feed.</p>
          <Link href="/auth/login">
            <button className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition">
              Sign In
            </button>
          </Link>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-500 p-4 text-red-500 text-sm">
          Failed to load feed. Please try again.
        </div>
      )}

      <div className="space-y-5">
        {data?.posts?.map((post) => <PostCard key={post.id} post={post} />)}

        {data?.posts?.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold">No Posts Yet</h2>
            <p className="text-muted-foreground mt-1">
              Follow people or join communities to see posts here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
