import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Shield,
} from "lucide-react";

const transactions = [
  {
    id: 1,
    type: "Deposit",
    amount: "+ ₦50,000",
    date: "Today",
  },
  {
    id: 2,
    type: "Escrow Payment",
    amount: "- ₦20,000",
    date: "Yesterday",
  },
  {
    id: 3,
    type: "Refund",
    amount: "+ ₦5,000",
    date: "2 days ago",
  },
];

export default function WalletPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Wallet
        </h1>

        <p className="text-muted-foreground">
          Manage your Vanguard funds
        </p>
      </div>

      <div className="rounded-2xl bg-primary text-primary-foreground p-6 mb-8">
        <p className="text-sm opacity-80">
          Total Balance
        </p>

        <h2 className="text-4xl font-bold mt-2">
          ₦0.00
        </h2>

        <p className="text-sm opacity-80 mt-2">
          Available for purchases and withdrawals
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">
            Available
          </p>

          <p className="text-xl font-bold">
            ₦0.00
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">
            Pending
          </p>

          <p className="text-xl font-bold">
            ₦0.00
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">
            Escrow
          </p>

          <p className="text-xl font-bold">
            ₦0.00
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">
            Reserved
          </p>

          <p className="text-xl font-bold">
            ₦0.00
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <button className="rounded-xl bg-primary text-primary-foreground py-3 font-medium">
          Deposit
        </button>

        <button className="rounded-xl border py-3 font-medium">
          Withdraw
        </button>

        <button className="rounded-xl border py-3 font-medium">
          Transfer
        </button>

        <button className="rounded-xl border py-3 font-medium">
          History
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl border p-5 bg-card">
          <div className="flex items-center gap-3 mb-3">
            <Wallet className="h-5 w-5" />
            <h3 className="font-semibold">
              Wallet Status
            </h3>
          </div>

          <p className="text-sm text-muted-foreground">
            Your wallet is active and ready
            for deposits, transfers and
            purchases.
          </p>
        </div>

        <div className="rounded-xl border p-5 bg-card">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="h-5 w-5" />
            <h3 className="font-semibold">
              Escrow Protection
            </h3>
          </div>

          <p className="text-sm text-muted-foreground">
            Funds placed in escrow remain
            protected until both parties
            complete the transaction.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        <div className="p-4 border-b">
          <h2 className="font-semibold">
            Recent Transactions
          </h2>
        </div>

        <div className="divide-y">
          {transactions.map(
            (transaction) => (
              <div
                key={transaction.id}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {transaction.amount.startsWith(
                    "+"
                  ) ? (
                    <ArrowDownLeft className="h-5 w-5" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5" />
                  )}

                  <div>
                    <p className="font-medium">
                      {transaction.type}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {transaction.date}
                    </p>
                  </div>
                </div>

                <span className="font-semibold">
                  {transaction.amount}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}