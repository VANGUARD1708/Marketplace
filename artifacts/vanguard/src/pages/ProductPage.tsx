export default function ProductPage() {
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Product Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="h-80 bg-muted rounded-lg" />
        <div>
          <div className="h-6 w-3/4 bg-muted rounded mb-3" />
          <div className="h-4 w-1/3 bg-muted rounded mb-4" />
          <p className="text-sm text-muted-foreground mb-6">
            Product description placeholder — not yet implemented.
          </p>
          <div className="rounded-lg border bg-card p-4 mb-4">
            <p className="text-sm font-medium mb-1">Seller Profile</p>
            <p className="text-xs text-muted-foreground">Trust Score: — | Reviews: —</p>
          </div>
          <button className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium mb-2">
            Buy Now
          </button>
          <button className="w-full px-4 py-2 rounded-md border text-sm font-medium">
            Chat with Seller
          </button>
        </div>
      </div>
    </div>
  );
}
