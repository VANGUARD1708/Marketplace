import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, Share2, Bookmark, Loader2 } from "lucide-react";
import { apiFetch, getToken } from "@/lib/api";

type Post = { id: number; userId: number; content: string; mediaUrl?: string; createdAt: string };

export default function FeedPage() {
  const qc = useQueryClient();
  const [draft, setDraft] = useState("");
  const isLoggedIn = Boolean(getToken());

  const { data, isLoading, error } = useQuery({
    queryKey: ["feed"],
    queryFn: () => apiFetch<{ posts: Post[] }>("/feed"),
  });

  const createPost = useMutation({
    mutationFn: (content: string) => apiFetch("/feed", { method: "POST", body: JSON.stringify({ content }) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["feed"] }); setDraft(""); },
  });

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Feed</h1>
      <p className="text-muted-foreground mb-6">Latest posts from your network.</p>

      {isLoggedIn && (
        <div className="rounded-xl border bg-card p-4 mb-6">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="What's on your mind?"
            rows={3}
            className="w-full resize-none bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
          <div className="flex justify-end mt-2">
            <button
              disabled={!draft.trim() || createPost.isPending}
              onClick={() => createPost.mutate(draft)}
              className="px-4 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
            >
              {createPost.isPending ? "Posting…" : "Post"}
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
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error.message}
        </div>
      )}

      <div className="space-y-4">
        {data?.posts.map((post) => (
          <div key={post.id} className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                {post.userId}
              </div>
              <div>
                <p className="text-sm font-medium">User #{post.userId}</p>
                <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <p className="text-sm mb-4">{post.content}</p>
            {post.mediaUrl && <img src={post.mediaUrl} alt="" className="rounded-lg mb-4 max-h-72 w-full object-cover" />}
            <div className="flex gap-5 text-sm text-muted-foreground border-t pt-3">
              <button className="flex items-center gap-1.5 hover:text-foreground transition-colors"><Heart className="h-4 w-4" /> Like</button>
              <button className="flex items-center gap-1.5 hover:text-foreground transition-colors"><MessageCircle className="h-4 w-4" /> Comment</button>
              <button className="flex items-center gap-1.5 hover:text-foreground transition-colors"><Share2 className="h-4 w-4" /> Share</button>
              <button className="flex items-center gap-1.5 hover:text-foreground transition-colors ml-auto"><Bookmark className="h-4 w-4" /> Save</button>
            </div>
          </div>
        ))}

        {data?.posts.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium mb-1">No posts yet</p>
            <p className="text-sm">Be the first to post something.</p>
          </div>
        )}
      </div>
    </div>
  );
}
