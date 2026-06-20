const listings = [
  {
    id: 1,
    title: "iPhone 13 Pro",
    price: "$650",
    location: "Lagos",
    seller: "John",
  },
  {
    id: 2,
    title: "MacBook Air M2",
    price: "$900",
    location: "Abuja",
    seller: "Sarah",
  },
  {
    id: 3,
    title: "Gaming Laptop",
    price: "$1200",
    location: "Port Harcourt",
    seller: "Mike",
  },
  {
    id: 4,
    title: "Samsung S24",
    price: "$700",
    location: "Enugu",
    seller: "David",
  },
];

export default function MarketplacePage() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground">
            Buy and sell safely on Vanguard
          </p>
        </div>

        <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">
          + Create Listing
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="search"
          placeholder="Search products..."
          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
        />

        <select className="rounded-md border px-3 py-2 text-sm">
          <option>All Categories</option>
          <option>Electronics</option>
          <option>Fashion</option>
          <option>Vehicles</option>
          <option>Services</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="rounded-lg border bg-card overflow-hidden hover:shadow-md transition"
          >
            <div className="h-44 bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">
                Product Image
              </span>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">
                {listing.title}
              </h3>

              <p className="text-primary font-bold mb-2">
                {listing.price}
              </p>

              <p className="text-sm text-muted-foreground">
                📍 {listing.location}
              </p>

              <p className="text-sm text-muted-foreground mb-4">
                Seller: {listing.seller}
              </p>

              <button className="w-full rounded-md border py-2 text-sm font-medium">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}