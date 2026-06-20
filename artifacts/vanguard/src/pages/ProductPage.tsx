import { useEffect, useState } from "react";
import { useRoute } from "wouter";

type Listing = {
  id: number;
  sellerId: number;
  title: string;
  description?: string;
  price: number | string;
  category?: string;
  condition?: string;
  status: string;
};

export default function ProductPage() {
  const [, params] = useRoute("/marketplace/:id");

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadListing() {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/marketplace/listings/${params?.id}`,
        );

        if (!response.ok) {
          throw new Error("Failed to load listing");
        }

        const data = await response.json();

        setListing(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load listing");
      } finally {
        setLoading(false);
      }
    }

    if (params?.id) {
      loadListing();
    }
  }, [params?.id]);

  if (loading) {
    return (
      <div className="p-8">
        <p>Loading listing...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="p-8">
        <div className="rounded-lg border p-4">
          {error || "Listing not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="h-96 rounded-xl bg-muted flex items-center justify-center">
            Product Image
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">
            {listing.title}
          </h1>

          <p className="text-2xl font-bold text-primary mb-4">
            ₦{listing.price}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {listing.category && (
              <span className="px-3 py-1 rounded-full border text-sm">
                {listing.category}
              </span>
            )}

            {listing.condition && (
              <span className="px-3 py-1 rounded-full border text-sm">
                {listing.condition}
              </span>
            )}

            <span className="px-3 py-1 rounded-full border text-sm">
              {listing.status}
            </span>
          </div>

          <div className="rounded-xl border p-4 mb-6">
            <h2 className="font-semibold mb-2">
              Description
            </h2>

            <p className="text-sm text-muted-foreground">
              {listing.description ||
                "No description provided."}
            </p>
          </div>

          <div className="rounded-xl border p-4 mb-6">
            <h2 className="font-semibold mb-2">
              Seller Information
            </h2>

            <p className="text-sm text-muted-foreground">
              Seller ID: {listing.sellerId}
            </p>
          </div>

          <div className="space-y-3">
            <button className="w-full py-3 rounded-md bg-primary text-primary-foreground font-medium">
              Buy Now
            </button>

            <button className="w-full py-3 rounded-md border font-medium">
              Chat Seller
            </button>

            <button className="w-full py-3 rounded-md border font-medium">
              Save Listing
            </button>

            <button className="w-full py-3 rounded-md border font-medium">
              Report Listing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}