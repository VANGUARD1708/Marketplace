export interface User {
  id: number;
  email: string;
  username: string;
  role?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Profile {
  id: number;
  userId: number;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  coverPhotoUrl?: string;
  location?: string;
  website?: string;
}

export interface TrustScore {
  userId: number;
  score: number;
  level: "New" | "Moderate" | "Trusted" | "Elite";
  badges: string[];
}

export interface Listing {
  id: number;
  sellerId: number;
  title: string;
  description?: string;
  price: string;
  category?: string;
  condition?: string;
  location?: string;
  status: "active" | "sold" | "paused" | "deleted";
  viewCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Review {
  id: number;
  reviewerId: number;
  revieweeId: number;
  rating: string;
  comment?: string;
  createdAt: string;
}

export interface Wallet {
  id: number;
  userId: number;
  availableBalance: string;
  pendingBalance: string;
  escrowBalance: string;
  currency: string;
}

export interface Transaction {
  id: number;
  type: string;
  amount: string;
  fee: string;
  reference: string;
  status: "pending" | "completed" | "failed" | "reversed";
  createdAt: string;
}

export interface Escrow {
  id: number;
  buyerId: number;
  sellerId: number;
  listingId?: number;
  amount: string;
  fee: string;
  status: "pending" | "funded" | "released" | "refunded" | "disputed" | "cancelled";
  autoReleaseAt?: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  type: string;
  title: string;
  body: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Company {
  id: number;
  name: string;
  ownerId: number;
  description?: string;
  logoUrl?: string;
  website?: string;
  status: "active" | "suspended" | "pending";
}

export interface Conversation {
  id: number;
  participants: number[];
  lastMessage?: string;
  lastMessageAt?: string;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  createdAt: string;
}

export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
}

export type LoadingState = "idle" | "loading" | "success" | "error";
