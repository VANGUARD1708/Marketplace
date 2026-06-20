import {
  User,
  Shield,
  Bell,
  CreditCard,
  Link2,
  Lock,
  BadgeCheck,
  Settings as SettingsIcon,
} from "lucide-react";

const SETTINGS_SECTIONS = [
  {
    label: "Account",
    desc: "Manage account details and login information.",
    icon: User,
  },
  {
    label: "Profile",
    desc: "Edit your public profile and bio.",
    icon: SettingsIcon,
  },
  {
    label: "Privacy",
    desc: "Control profile visibility and activity.",
    icon: Lock,
  },
  {
    label: "Notifications",
    desc: "Manage alerts and updates.",
    icon: Bell,
  },
  {
    label: "Security",
    desc: "Passwords and two-factor authentication.",
    icon: Shield,
  },
  {
    label: "Linked Accounts",
    desc: "Connect external services and profiles.",
    icon: Link2,
  },
  {
    label: "Payments",
    desc: "Wallets, cards and billing methods.",
    icon: CreditCard,
  },
  {
    label: "Trust & Verification",
    desc: "Manage trust score and verification.",
    icon: BadgeCheck,
  },
];

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Settings
        </h1>

        <p className="text-muted-foreground">
          Manage your Vanguard account.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-muted" />

          <div>
            <h2 className="font-semibold text-lg">
              Display Name
            </h2>

            <p className="text-sm text-muted-foreground">
              @username
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {SETTINGS_SECTIONS.map((section) => (
          <button
            key={section.label}
            className="w-full rounded-xl border bg-card p-5 flex items-center justify-between hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <section.icon className="h-5 w-5" />

              <div className="text-left">
                <p className="font-medium">
                  {section.label}
                </p>

                <p className="text-xs text-muted-foreground">
                  {section.desc}
                </p>
              </div>
            </div>

            <span className="text-lg text-muted-foreground">
              ›
            </span>
          </button>
        ))}
      </div>

      <div className="mt-8 rounded-xl border bg-card p-6">
        <h2 className="font-semibold mb-3">
          Account Status
        </h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">
              Verification
            </p>

            <p>Verified</p>
          </div>

          <div>
            <p className="text-muted-foreground">
              Trust Score
            </p>

            <p>95</p>
          </div>

          <div>
            <p className="text-muted-foreground">
              Two-Factor Auth
            </p>

            <p>Enabled</p>
          </div>

          <div>
            <p className="text-muted-foreground">
              Wallet Status
            </p>

            <p>Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}