import {
  ShieldCheck,
  FileText,
  Building2,
  User,
  Award,
} from "lucide-react";

export default function VerificationPage() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Verification Center
        </h1>

        <p className="text-muted-foreground">
          Increase trust and unlock verified badges.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border bg-card p-4">
          <User className="h-5 w-5 mb-2" />
          <p className="text-sm">Identity</p>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <Building2 className="h-5 w-5 mb-2" />
          <p className="text-sm">Business</p>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <Award className="h-5 w-5 mb-2" />
          <p className="text-sm">Professional</p>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <ShieldCheck className="h-5 w-5 mb-2" />
          <p className="text-sm">Trust Badge</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 mb-6">
        <h2 className="font-semibold mb-4">
          Professional Certificate
        </h2>

        <div className="border-2 border-dashed rounded-lg p-8 text-center mb-4">
          <FileText className="h-8 w-8 mx-auto mb-3" />

          <p className="text-sm text-muted-foreground">
            Upload certificate or licence
          </p>
        </div>

        <input
          type="text"
          placeholder="Certificate Number"
          className="w-full rounded-md border px-3 py-2 mb-4"
        />

        <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground">
          Submit Verification
        </button>
      </div>

      <div className="rounded-xl border bg-card p-6 mb-6">
        <h2 className="font-semibold mb-4">
          Verification Status
        </h2>

        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-muted-foreground" />

          <span className="text-sm text-muted-foreground">
            No active verification requests
          </span>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="font-semibold mb-3">
          Verified Benefits
        </h2>

        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>✓ Verified profile badge</li>
          <li>✓ Higher marketplace trust</li>
          <li>✓ Better search visibility</li>
          <li>✓ Access to premium features</li>
          <li>✓ Increased buyer confidence</li>
        </ul>
      </div>
    </div>
  );
}