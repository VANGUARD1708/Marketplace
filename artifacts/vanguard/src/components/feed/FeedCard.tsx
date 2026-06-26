import { useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark, Shield, Flame, MoreHorizontal } from "lucide-react";
import { Link } from "wouter";

type FeedPost = {
  id: number;
  userId: number;
  username?: string;
  displayName?: string;
  avatarInitial?: string;
  content: string;
  mediaUrl?: string;
  createdAt: string;
  trustScore?: number;
  views?: number;
  likes?: number;
  comments?: number;
  verified?: boolean;
  trending?: boolean;
  price?: number;
};

type FeedCardProps = {
  post: FeedPost;
  onLike?: (id: number) => void;
  onBookmark?: (id: number) => void;
};

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export function FeedCard({ post, onLike, onBookmark }: FeedCardProps) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes ?? 0);

  function handleLike() {
    setLiked((l) => !l);
    setLikeCount((c) => liked ? c - 1 : c + 1);
    onLike?.(post.id);
  }

  function handleBookmark() {
    setBookmarked((b) => !b);
    onBookmark?.(post.id);
  }

  const initial = post.avatarInitial ?? (post.displayName?.[0] ?? post.username?.[0] ?? "U");

  return (
    <div className="rounded-2xl border bg-card p-4 hover:shadow-sm transition">
      <div className="flex items-start gap-3 mb-3">
        <Link href={`/profile/${post.userId}`}>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0 cursor-pointer hover:opacity-80 transition">
            {initial}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={`/profile/${post.userId}`}>
              <span className="font-semibold text-sm hover:underline cursor-pointer">
                {post.displayName ?? post.username ?? `User ${post.userId}`}
              </span>
            </Link>
            {post.verified && (
              <span className="flex items-center gap-0.5 text-xs text-primary">
                <Shield className="h-3 w-3" /> Verified
              </span>
            )}
            {post.trending && (
              <span className="flex items-center gap-0.5 text-xs text-amber-600">
                <Flame className="h-3 w-3" /> Trending
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{timeAgo(post.createdAt)}</span>
            {post.trustScore !== undefined && (
              <span>· Trust {post.trustScore}</span>
            )}
          </div>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-muted transition text-muted-foreground" aria-label="More options">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <p className="text-sm leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>

      {post.mediaUrl && (
        <div className="rounded-xl overflow-hidden mb-3 bg-muted aspect-video flex items-center justify-center">
          <img src={post.mediaUrl} alt="Post media" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        </div>
      )}

      {post.price !== undefined && (
        <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-sm font-semibold">
          ₦{post.price.toLocaleString()}
        </div>
      )}

      <div className="flex items-center gap-1 pt-2 border-t">
        <button onClick={handleLike} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition ${liked ? "text-red-500 bg-red-50" : "text-muted-foreground hover:bg-muted"}`}>
          <Heart className={`h-4 w-4 ${liked ? "fill-red-500" : ""}`} /> {likeCount > 0 ? likeCount : ""}
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted transition">
          <MessageCircle className="h-4 w-4" /> {post.comments ? post.comments : ""}
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted transition">
          <Share2 className="h-4 w-4" />
        </button>
        <button onClick={handleBookmark} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium ml-auto transition ${bookmarked ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted"}`}>
          <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-primary" : ""}`} />
        </button>
        {post.views !== undefined && (
          <span className="text-xs text-muted-foreground">{post.views.toLocaleString()} views</span>
        )}
      </div>
    </div>
  );
}

export default FeedCard;
