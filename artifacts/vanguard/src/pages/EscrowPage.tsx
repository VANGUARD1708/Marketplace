import {
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const escrows = [
  {
    id: 1,
    product: "iPhone 15 Pro Max",
    buyer: "Michael",
    seller: "John Electronics",
    amount: "₦850,000",
    status: "Active",
  },
  {
    id: 2,
    product: "MacBook Pro",
    buyer: "David",
    seller: "Tech Store",
    amount: "₦1,500,000",
    status: "Released",
  },
  {
    id: 3,
    product: "Gaming Monitor",
    buyer: "Sarah",
    seller: "Digital Hub",
    amount: "₦350,000",
    status: "Disputed",
  },
];

export default function EscrowPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Escrow Center
        </h1>

        <p className="text-muted-foreground">
          Manage protected transactions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border p-5 bg-card">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-5 w-5" />
            <span className="font-medium">
              Active
            </span>
          </div>

          <p className="text-3xl font-bold">
            12
          </p>
        </div>

        <div className="rounded-xl border p-5 bg-card">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">
              Released
            </span>
          </div>

          <p className="text-3xl font-bold">
            45
          </p>
        </div>

        <div className="rounded-xl border p-5 bg-card">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">
              Disputes
            </span>
          </div>

          <p className="text-3xl font-bold">
            2
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground">
          Active Escrows
        </button>

        <button className="px-4 py-2 rounded-md border">
          Released Escrows
        </button>

        <button className="px-4 py-2 rounded-md border">
          Disputed Escrows
        </button>
      </div>

      <div className="space-y-4">
        {escrows.map((escrow) => (
          <div
            key={escrow.id}
            className="rounded-xl border bg-card p-5"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {escrow.product}
                </h3>

                <p className="text-sm text-muted-foreground">
                  Protected Transaction
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />

                <span className="text-sm font-medium">
                  {escrow.status}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">
                  Buyer
                </p>

                <p>{escrow.buyer}</p>
              </div>

              <div>
                <p className="text-muted-foreground">
                  Seller
                </p>

                <p>{escrow.seller}</p>
              </div>

              <div>
                <p className="text-muted-foreground">
                  Amount
                </p>

                <p>{escrow.amount}</p>
              </div>

              <div>
                <p className="text-muted-foreground">
                  Status
                </p>

                <p>{escrow.status}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground">
                View Details
              </button>

              <button className="px-4 py-2 rounded-md border">
                Open Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}