export default function WalletPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Wallet</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Available Balance", value: "$0.00" },
          { label: "Pending Balance", value: "$0.00" },
          { label: "Escrow Balance", value: "$0.00" },
          { label: "Reserved Balance", value: "$0.00" },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border bg-card p-5">
            <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
            <p className="text-2xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-3 mb-8">
        <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">
          Deposit
        </button>
        <button className="px-4 py-2 rounded-md border text-sm font-medium">
          Withdraw
        </button>
      </div>
      <div className="rounded-lg border bg-card">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Transaction History</h2>
        </div>
        <div className="p-4">
          <p className="text-sm text-muted-foreground">Transaction history placeholder — not yet implemented.</p>
        </div>
      </div>
    </div>
  );
}
