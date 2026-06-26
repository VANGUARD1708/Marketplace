import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import {
  Briefcase, MapPin, Clock, DollarSign, Shield, CheckCircle2,
  Loader2, ChevronLeft, Building2, Send, Star, ArrowRight,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

const ME = 1;

type Job = {
  id: number; employerId: number; title: string; description?: string;
  requirements?: string; jobType?: string; location?: string;
  salaryMin?: string; salaryMax?: string; skills?: string; status: string; createdAt: string;
};
type TrustData = { trustScore: number; level: string; badges: string[] };

export default function JobPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const [cover, setCover] = useState("");
  const [applied, setApplied] = useState(false);

  const { data: job, isLoading, error } = useQuery({
    queryKey: ["job", id],
    queryFn: () => apiFetch<Job>(`/jobs/${id}`),
    enabled: Boolean(id),
  });

  const { data: trust } = useQuery({
    queryKey: ["trust", job?.employerId],
    queryFn: () => apiFetch<TrustData>(`/trust/${job?.employerId}`),
    enabled: Boolean(job?.employerId),
  });

  const apply = useMutation({
    mutationFn: () => apiFetch(`/jobs/${id}/apply`, {
      method: "POST",
      body: JSON.stringify({ applicantId: ME, coverLetter: cover }),
    }),
    onSuccess: () => { setApplied(true); qc.invalidateQueries({ queryKey: ["job", id] }); },
  });

  if (isLoading) {
    return <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;
  }

  if (error || !job) {
    return (
      <div className="p-8 text-center">
        <Briefcase className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
        <p className="font-medium">Job not found</p>
        <Link href="/jobs"><button className="mt-3 text-primary text-sm hover:underline">← Back to Jobs</button></Link>
      </div>
    );
  }

  const skills = job.skills ? job.skills.split(",").map((s) => s.trim()) : [];
  const requirements = job.requirements ? job.requirements.split("\n").filter(Boolean) : [];

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
        <Link href="/jobs"><span className="hover:text-foreground cursor-pointer flex items-center gap-1"><ChevronLeft className="h-4 w-4" /> Jobs</span></Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header */}
          <div className="rounded-2xl border bg-card p-5">
            <div className="flex items-start gap-4 mb-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold mb-1">{job.title}</h1>
                <Link href={`/profile/${job.employerId}`}>
                  <p className="text-sm text-primary hover:underline cursor-pointer">Employer #{job.employerId}</p>
                </Link>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-xs text-primary font-medium">Verified</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {job.location && <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>}
              {job.jobType && <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {job.jobType}</span>}
              {(job.salaryMin || job.salaryMax) && (
                <span className="flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5" />
                  {job.salaryMin && job.salaryMax
                    ? `₦${Number(job.salaryMin).toLocaleString()} – ₦${Number(job.salaryMax).toLocaleString()}`
                    : job.salaryMin ? `₦${Number(job.salaryMin).toLocaleString()}+` : `Up to ₦${Number(job.salaryMax).toLocaleString()}`}
                </span>
              )}
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="rounded-2xl border bg-card p-5">
              <h3 className="font-semibold mb-3">Skills Required</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span key={s} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="rounded-2xl border bg-card p-5">
            <h3 className="font-semibold mb-3">Job Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {job.description ?? "No description provided."}
            </p>
          </div>

          {/* Requirements */}
          {requirements.length > 0 && (
            <div className="rounded-2xl border bg-card p-5">
              <h3 className="font-semibold mb-3">Requirements</h3>
              <ul className="space-y-2">
                {requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Apply */}
          {!applied ? (
            <div className="rounded-2xl border bg-card p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Send className="h-4 w-4" /> Apply for this Job</h3>
              <div className="mb-3">
                <label className="text-sm font-medium block mb-1.5">Cover Letter (optional)</label>
                <textarea value={cover} onChange={(e) => setCover(e.target.value)}
                  rows={4} placeholder="Tell the employer why you're a great fit..."
                  className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
              </div>
              <button onClick={() => apply.mutate()} disabled={apply.isPending || job.status !== "active"}
                className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                {apply.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : "Submit Application"}
              </button>
              {apply.error && <p className="text-xs text-destructive mt-2">{(apply.error as Error).message}</p>}
            </div>
          ) : (
            <div className="rounded-2xl border bg-emerald-50 border-emerald-200 p-5 flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-semibold text-emerald-800">Application Submitted!</p>
                <p className="text-sm text-emerald-700">The employer will review your application and get back to you.</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Employer card */}
          <Link href={`/profile/${job.employerId}`}>
            <div className="rounded-2xl border bg-card p-5 hover:shadow-md transition cursor-pointer">
              <p className="text-sm font-semibold mb-0.5">About the Employer</p>
              <div className="flex items-center gap-3 mt-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                  {job.employerId}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Employer #{job.employerId}</p>
                  {trust && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-muted-foreground">Trust {trust.trustScore} · {trust.level}</span>
                    </div>
                  )}
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </Link>

          {/* Job meta */}
          <div className="rounded-2xl border bg-card p-5 space-y-3 text-sm">
            <h4 className="font-semibold">Job Details</h4>
            {[
              { label: "Type", value: job.jobType ?? "—" },
              { label: "Location", value: job.location ?? "Remote" },
              { label: "Status", value: job.status },
              { label: "Posted", value: new Date(job.createdAt).toLocaleDateString() },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium capitalize">{value}</span>
              </div>
            ))}
          </div>

          {/* Guardian */}
          <div className="rounded-xl border bg-primary/5 border-primary/20 p-4 flex items-start gap-2">
            <Shield className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Guardian Verified</span> — this employer has been verified by Vanguard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
