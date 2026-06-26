import { apiFetch } from "@/lib/api";

export interface Listing {
  id: number;
  sellerId: number;
  title: string;
  description?: string;
  price: string;
  category?: string;
  condition?: string;
  location?: string;
  status: string;
  createdAt: string;
}

export interface ListingQuery {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}

export const listingsApi = {
  list: (query?: ListingQuery) => {
    const params = new URLSearchParams();
    if (query?.q) params.set("q", query.q);
    if (query?.category) params.set("category", query.category);
    if (query?.minPrice != null) params.set("minPrice", String(query.minPrice));
    if (query?.maxPrice != null) params.set("maxPrice", String(query.maxPrice));
    if (query?.page) params.set("page", String(query.page));
    if (query?.pageSize) params.set("pageSize", String(query.pageSize));
    const qs = params.toString();
    return apiFetch<{ items: Listing[]; total: number; page: number }>(`/listings${qs ? `?${qs}` : ""}`);
  },

  getById: (id: number) => apiFetch<Listing>(`/listings/${id}`),

  create: (data: Partial<Listing>) =>
    apiFetch<Listing>("/listings", { method: "POST", body: JSON.stringify(data) }),

  update: (id: number, data: Partial<Listing>) =>
    apiFetch<Listing>(`/listings/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (id: number) =>
    apiFetch<{ success: boolean }>(`/listings/${id}`, { method: "DELETE" }),

  mine: () => apiFetch<Listing[]>("/listings/mine"),

  search: (q: string) => apiFetch<Listing[]>(`/listings/search?q=${encodeURIComponent(q)}`),

  suggestions: (q: string) =>
    apiFetch<string[]>(`/search/suggestions?q=${encodeURIComponent(q)}`),
};
