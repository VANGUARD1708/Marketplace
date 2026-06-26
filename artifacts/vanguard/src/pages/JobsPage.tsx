import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Briefcase, Search, MapPin, DollarSign, Clock, Shield, Loader2,
  SlidersHorizontal, Building2, CheckCircle2,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

type Job = {
  id: number; employerId: number; title: string; description?: string;
  jobType?: string; location?: string; salaryMin?: string; salaryMax?: string;
  skills?: string; status: string; createdAt: string;
};

const JOB_TYPES = ["All", "Full-time", "Part-time", "Contract", "Remote", "Freelance"];

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => apiFetch<Job[]>("/jobs"),
  });

  const filtered = jobs.filter((j) => {
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase());
    const matchType = type === "All" || j.jobType === type;
    return matchSearch && matchType && j.status === "active";
  });

  function formatSalary(min?: string, max?: string) {
    if (!min && !max) return "Salary not listed";
    if (min && max) return `₦${Number(min).toLocaleString()} – ₦${Number(max).toLocaleString()}`;
    if (min) return `₦${Number(min).toLocaleString()}+`;
    return `Up to ₦${Number(max).toLocaleString()}`;
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Jobs</h1>
          <p className="text-sm text-muted-foreground">Find your next opportunity on Vanguard</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2">
          <Briefcase className="h-4 w-4" /> Post a Job
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Active Jobs", value: jobs.filter((j) => j.status === "active").length, icon: Briefcase },
          { label: "Remote Roles", value: jobs.filter((j) => j.jobType === "Remote").length, icon: CheckCircle2 },
          { label: "Companies", value: new Set(jobs.map((j) => j.employerId)).size, icon: Building2 },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border bg-card p-3 text-center">
            <Icon className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
            <p className="text-lg font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search job titles, skills..."
            className="w-full rounded-xl border bg-card pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <button className="flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm hover:bg-muted transition">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
      </div>

      {/* Type filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5">
        {JOB_TYPES.map((t) => (
          <button key={t} onClick={() => setType(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
              type === t ? "bg-primary text-primary-foreground" : "border hover:bg-muted"
            }`}>
            {t}
          </button>
        ))}
      </div>

      {isLoading && <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>}

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive mb-4">{String(error)}</div>
      )}

      {/* Job list */}
      <div className="space-y-3">
        {filtered.length === 0 && !isLoading && (
          <div className="text-center py-12 border rounded-2xl bg-card">
            <Briefcase className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="font-medium">No jobs found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}
        {filtered.map((job) => {
          const skills = job.skills ? job.skills.split(",").map((s) => s.trim()) : [];
          return (
            <Link key={job.id} href={`/jobs/${job.id}`}>
              <div className="rounded-2xl border bg-card p-5 hover:shadow-md transition cursor-pointer">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">Employer #{job.employerId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Shield className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs text-primary font-medium">Verified</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                  {job.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>}
                  {job.jobType && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {job.jobType}</span>}
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {formatSalary(job.salaryMin, job.salaryMax)}
                  </span>
                </div>

                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {skills.slice(0, 5).map((s) => (
                      <span key={s} className="text-xs border px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{new Date(job.createdAt).toLocaleDateString()}</p>
                  <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium">Apply</button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
