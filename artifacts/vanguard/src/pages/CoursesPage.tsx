import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  BookOpen, Search, Star, Shield, Loader2, Users, Clock, ChevronRight, Plus,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

type Course = {
  id: number; instructorId: number; title: string; description?: string;
  category?: string; price: string; duration?: string;
  lessonCount?: number; enrollmentCount?: number; status: string; createdAt: string;
};

const CATEGORIES = ["All", "Tech", "Business", "Design", "Marketing", "Finance", "Language", "Health", "Arts"];
const LEVELS = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All Levels");

  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ["courses"],
    queryFn: () => apiFetch<Course[]>("/courses"),
  });

  const filtered = courses.filter((c) => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || c.category === category;
    return matchSearch && matchCat && c.status === "published";
  });

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Courses</h1>
          <p className="text-sm text-muted-foreground">Learn from verified experts on Vanguard</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2">
          <Plus className="h-4 w-4" /> Create Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Total Courses", value: courses.length },
          { label: "Total Students", value: courses.reduce((sum, c) => sum + (c.enrollmentCount ?? 0), 0) },
          { label: "Categories", value: CATEGORIES.length - 1 },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border bg-card p-3 text-center">
            <p className="text-lg font-bold">{typeof value === "number" ? value.toLocaleString() : value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses..."
          className="w-full rounded-xl border bg-card pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-2">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
              category === c ? "bg-primary text-primary-foreground" : "border hover:bg-muted"
            }`}>
            {c}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 mb-5">
        {LEVELS.map((l) => (
          <button key={l} onClick={() => setLevel(l)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
              level === l ? "bg-secondary text-secondary-foreground" : "border hover:bg-muted"
            }`}>
            {l}
          </button>
        ))}
      </div>

      {isLoading && <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>}
      {error && <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive mb-4">{String(error)}</div>}

      {filtered.length === 0 && !isLoading && (
        <div className="text-center py-12 border rounded-2xl bg-card">
          <BookOpen className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium">No courses found</p>
          <p className="text-sm text-muted-foreground mt-1">Be the first to create a course!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((course) => (
          <Link key={course.id} href={`/courses/${course.id}`}>
            <div className="rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition cursor-pointer">
              <div className="h-40 bg-gradient-to-br from-indigo-100 to-purple-50 flex items-center justify-center relative">
                <BookOpen className="h-14 w-14 text-indigo-300" />
                {course.category && (
                  <span className="absolute top-2 left-2 text-xs bg-black/50 text-white px-2 py-0.5 rounded-full">{course.category}</span>
                )}
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-full">
                  <Shield className="h-2.5 w-2.5" /> Verified
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-1 line-clamp-2">{course.title}</h3>
                {course.description && (
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{course.description}</p>
                )}
                <div className="flex gap-1 items-center mb-2">
                  {[1,2,3,4,5].map((s) => <Star key={s} className="h-3 w-3 text-amber-400 fill-amber-400" />)}
                  <span className="text-xs text-muted-foreground">(4.7)</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                  {course.lessonCount && <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {course.lessonCount} lessons</span>}
                  {course.duration && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {course.duration}</span>}
                  {course.enrollmentCount && <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {course.enrollmentCount} students</span>}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-primary font-bold">₦{Number(course.price).toLocaleString()}</p>
                  <span className="text-xs text-primary flex items-center gap-0.5">View <ChevronRight className="h-3 w-3" /></span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
