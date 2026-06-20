import { useState } from "react";
import { useLocation } from "wouter";

export default function CreateListingPage() {
  const [, navigate] = useLocation();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField(
    field: keyof typeof form,
    value: string,
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const response = await fetch(
        "/api/marketplace/listings",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            sellerId: 1,
            title: form.title,
            description:
              form.description,
            price: Number(form.price),
            category: form.category,
            condition: form.condition,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          "Failed to create listing",
        );
      }

      const listing =
        await response.json();

      setSuccess(
        "Listing created successfully",
      );

      setTimeout(() => {
        navigate(
          `/marketplace/${listing.id}`,
        );
      }, 1000);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to create listing",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Create Listing
        </h1>

        <p className="text-muted-foreground mt-2">
          Sell products on Vanguard
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="rounded-xl border p-6 bg-card">
          <label className="block text-sm font-medium mb-2">
            Product Title
          </label>

          <input
            value={form.title}
            onChange={(e) =>
              updateField(
                "title",
                e.target.value,
              )
            }
            required
            className="w-full border rounded-md px-3 py-2"
            placeholder="iPhone 15 Pro Max"
          />
        </div>

        <div className="rounded-xl border p-6 bg-card">
          <label className="block text-sm font-medium mb-2">
            Description
          </label>

          <textarea
            value={form.description}
            onChange={(e) =>
              updateField(
                "description",
                e.target.value,
              )
            }
            rows={5}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Describe your item..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border p-6 bg-card">
            <label className="block text-sm font-medium mb-2">
              Price
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) =>
                updateField(
                  "price",
                  e.target.value,
                )
              }
              required
              className="w-full border rounded-md px-3 py-2"
              placeholder="1000"
            />
          </div>

          <div className="rounded-xl border p-6 bg-card">
            <label className="block text-sm font-medium mb-2">
              Category
            </label>

            <select
              value={form.category}
              onChange={(e) =>
                updateField(
                  "category",
                  e.target.value,
                )
              }
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">
                Select Category
              </option>
              <option>
                Electronics
              </option>
              <option>
                Fashion
              </option>
              <option>
                Vehicles
              </option>
              <option>
                Real Estate
              </option>
              <option>
                Services
              </option>
            </select>
          </div>
        </div>

        <div className="rounded-xl border p-6 bg-card">
          <label className="block text-sm font-medium mb-2">
            Condition
          </label>

          <select
            value={form.condition}
            onChange={(e) =>
              updateField(
                "condition",
                e.target.value,
              )
            }
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">
              Select Condition
            </option>
            <option>
              Brand New
            </option>
            <option>
              Used
            </option>
            <option>
              Refurbished
            </option>
          </select>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500 p-4 text-red-500">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-green-500 p-4 text-green-600">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-md bg-primary text-primary-foreground font-medium"
        >
          {loading
            ? "Creating Listing..."
            : "Create Listing"}
        </button>
      </form>
    </div>
  );
}