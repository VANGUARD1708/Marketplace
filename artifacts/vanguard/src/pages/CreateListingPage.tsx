import { useState } from "react";
import { useLocation } from "wouter";
import { Loader2, Upload, Package, ChevronLeft, CheckCircle2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

const CATEGORIES = ["Electronics", "Fashion", "Vehicles", "Real Estate", "Services", "Food & Agriculture", "Home & Garden", "Sports", "Books", "Other"];
const CONDITIONS = ["Brand New", "Like New", "Good", "Fair", "For Parts"];

export default function CreateListingPage() {
  const [, navigate] = useLocation();

  const [form, setForm] = useState({
    title: "", description: "", price: "", category: "", condition: "", location: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.price) return;
    setError("");
    setLoading(true);
    try {
      const listing = await apiFetch<{ id: number }>("/marketplace/listings", {
        method: "POST",
        body: JSON.stringify({
          sellerId: 1,
          title: form.title,
          description: form.description,
          price: Number(form.price),
          category: form.category,
          condition: form.condition,
          location: form.location,
        }),
      });
      setSuccess(true);
      setTimeout(() => navigate(`/marketplace/${listing.id}`), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create listing. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 p-8 text-center">
        <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold mb-1">Listing Created!</h2>
        <p className="text-sm text-muted-foreground">Redirecting to your listing…</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-7">
        <button onClick={() => navigate("/marketplace")} className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Create Listing</h1>
          <p className="text-sm text-muted-foreground">Sell on Vanguard with Guardian protection</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image upload placeholder */}
        <div className="rounded-2xl border-2 border-dashed bg-card p-8 text-center cursor-pointer hover:border-primary/40 transition">
          <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium mb-1">Upload Photos</p>
          <p className="text-sm text-muted-foreground">Drag & drop or click to browse · up to 10 images</p>
          <button type="button" className="mt-3 px-4 py-2 rounded-lg border text-sm hover:bg-muted transition">
            Choose Files
          </button>
        </div>

        {/* Title */}
        <div className="rounded-2xl border bg-card p-5">
          <label className="block text-sm font-semibold mb-2">Product Title <span className="text-red-500">*</span></label>
          <input value={form.title} onChange={(e) => update("title", e.target.value)} required
            className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="e.g. iPhone 15 Pro Max 256GB" maxLength={100} />
          <p className="text-xs text-muted-foreground mt-1">{form.title.length}/100</p>
        </div>

        {/* Description */}
        <div className="rounded-2xl border bg-card p-5">
          <label className="block text-sm font-semibold mb-2">Description</label>
          <textarea value={form.description} onChange={(e) => update("description", e.target.value)}
            rows={4} maxLength={2000}
            className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            placeholder="Describe your item, its features, any defects..." />
          <p className="text-xs text-muted-foreground mt-1">{form.description.length}/2000</p>
        </div>

        {/* Price & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border bg-card p-5">
            <label className="block text-sm font-semibold mb-2">Price (₦) <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₦</span>
              <input type="number" min="0" step="1" value={form.price} onChange={(e) => update("price", e.target.value)} required
                className="w-full rounded-xl border bg-background pl-7 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="50000" />
            </div>
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <label className="block text-sm font-semibold mb-2">Category</label>
            <select value={form.category} onChange={(e) => update("category", e.target.value)}
              className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20">
              <option value="">Select Category</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Condition & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border bg-card p-5">
            <label className="block text-sm font-semibold mb-2">Condition</label>
            <select value={form.condition} onChange={(e) => update("condition", e.target.value)}
              className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20">
              <option value="">Select Condition</option>
              {CONDITIONS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <label className="block text-sm font-semibold mb-2">Location</label>
            <input value={form.location} onChange={(e) => update("location", e.target.value)}
              className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="e.g. Lagos, Abuja" />
          </div>
        </div>

        {/* Guardian info */}
        <div className="rounded-xl border bg-primary/5 border-primary/20 p-4 flex items-start gap-3">
          <Package className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Guardian AI will review</span> your listing for authenticity and flag any suspicious content before publishing.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
        )}

        <button type="submit" disabled={loading || !form.title || !form.price}
          className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating Listing…</> : "Publish Listing"}
        </button>
      </form>
    </div>
  );
}
