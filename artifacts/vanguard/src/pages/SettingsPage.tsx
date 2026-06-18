const SETTINGS_SECTIONS = [
  { label: "Account", desc: "Manage your account details, email, and password." },
  { label: "Profile", desc: "Edit your public profile information." },
  { label: "Privacy", desc: "Control who can see your activity and information." },
  { label: "Notifications", desc: "Configure how and when you receive notifications." },
  { label: "Security", desc: "Two-factor authentication and login activity." },
  { label: "Linked Accounts", desc: "Connect external accounts and social profiles." },
  { label: "Payments", desc: "Manage payment methods and billing information." },
  { label: "Trust & Verification", desc: "Manage your trust score and verification status." },
];

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="space-y-3">
        {SETTINGS_SECTIONS.map((section) => (
          <div key={section.label} className="rounded-lg border bg-card p-5 flex items-center justify-between cursor-pointer hover:bg-accent/50 transition-colors">
            <div>
              <p className="text-sm font-medium">{section.label}</p>
              <p className="text-xs text-muted-foreground">{section.desc}</p>
            </div>
            <span className="text-muted-foreground text-lg">›</span>
          </div>
        ))}
      </div>
    </div>
  );
}
