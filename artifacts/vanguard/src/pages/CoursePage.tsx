import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import {
  BookOpen, Star, Shield, CheckCircle, Loader2, ChevronLeft,
  Users, Clock, Play, Lock, ArrowRight,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

const ME = 1;

type Course = {
  id: number; instructorId: number; title: string; description?: string;
  category?: string; price: string; duration?: string; lessonCount?: number;
  enrollmentCount?: number; status: string; createdAt: string;
};
type Lesson = { id: number; courseId: number; title: string; duration?: string; order: number; isFree: boolean };
type TrustData = { trustScore: number; level: string };

export default function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();

  const { data: course, isLoading, error } = useQuery({
    queryKey: ["course", id],
    queryFn: () => apiFetch<Course>(`/courses/${id}`),
    enabled: Boolean(id),
  });

  const { data: lessons = [] } = useQuery({
    queryKey: ["lessons", id],
    queryFn: () => apiFetch<Lesson[]>(`/courses/${id}/lessons`),
    enabled: Boolean(id),
  });

  const { data: trust } = useQuery({
    queryKey: ["trust", course?.instructorId],
    queryFn: () => apiFetch<TrustData>(`/trust/${course?.instructorId}`),
    enabled: Boolean(course?.instructorId),
  });

  const enroll = useMutation({
    mutationFn: () => apiFetch(`/courses/${id}/enroll`, {
      method: "POST",
      body: JSON.stringify({ userId: ME }),
    }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["course", id] }),
  });

  if (isLoading) {
    return <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;
  }

  if (error || !course) {
    return (
      <div className="p-8 text-center">
        <BookOpen className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
        <p className="font-medium">Course not found</p>
        <Link href="/courses"><button className="mt-3 text-primary text-sm hover:underline">← Back to Courses</button></Link>
      </div>
    );
  }

  const WHAT_YOULL_LEARN = [
    "Practical skills you can apply immediately",
    "Industry-standard techniques",
    "Expert-guided, structured learning",
    "Certificate on completion",
    "Guardian-verified content",
  ];

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
        <Link href="/courses"><span className="hover:text-foreground cursor-pointer flex items-center gap-1"><ChevronLeft className="h-4 w-4" /> Courses</span></Link>
        {course.category && <><span>/</span><span>{course.category}</span></>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Hero */}
          <div className="rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-50 h-52 flex flex-col items-center justify-center relative overflow-hidden">
            <BookOpen className="h-16 w-16 text-indigo-400 mb-3" />
            {course.category && (
              <span className="absolute top-3 left-3 text-xs bg-black/50 text-white px-2.5 py-1 rounded-full">{course.category}</span>
            )}
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              <Shield className="h-3 w-3" /> Verified Instructor
            </div>
          </div>

          {/* Title + meta */}
          <div>
            <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-2">
              {course.lessonCount && <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {course.lessonCount} lessons</span>}
              {course.duration && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {course.duration}</span>}
              {course.enrollmentCount && <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {course.enrollmentCount.toLocaleString()} students</span>}
            </div>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((s) => <Star key={s} className="h-4 w-4 text-amber-400 fill-amber-400" />)}
              <span className="text-sm font-medium ml-1">4.7</span>
              <span className="text-sm text-muted-foreground">(238 reviews)</span>
            </div>
          </div>

          {/* What you'll learn */}
          <div className="rounded-2xl border bg-card p-5">
            <h3 className="font-semibold mb-3">What You'll Learn</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {WHAT_YOULL_LEARN.map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" /> {item}
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="rounded-2xl border bg-card p-5">
            <h3 className="font-semibold mb-3">Course Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {course.description ?? "No description provided."}
            </p>
          </div>

          {/* Lessons */}
          <div className="rounded-2xl border bg-card p-5">
            <h3 className="font-semibold mb-4">Course Content</h3>
            {lessons.length === 0 ? (
              <p className="text-sm text-muted-foreground">Lesson list will appear here.</p>
            ) : (
              <div className="space-y-2">
                {lessons.sort((a, b) => a.order - b.order).map((lesson) => (
                  <div key={lesson.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${lesson.isFree ? "bg-emerald-100" : "bg-muted"}`}>
                      {lesson.isFree ? <Play className="h-3.5 w-3.5 text-emerald-600" /> : <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{lesson.title}</p>
                      {lesson.duration && <p className="text-xs text-muted-foreground">{lesson.duration}</p>}
                    </div>
                    {lesson.isFree && <span className="text-xs text-emerald-600 font-medium shrink-0">Free preview</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border bg-card p-5 sticky top-4">
            <div className="mb-4">
              <p className="text-3xl font-bold text-primary">₦{Number(course.price).toLocaleString()}</p>
            </div>

            {/* Instructor */}
            <Link href={`/profile/${course.instructorId}`}>
              <div className="rounded-xl border p-3 flex items-center gap-3 hover:shadow-md transition cursor-pointer mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                  {course.instructorId}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">Instructor #{course.instructorId}</p>
                  {trust && <p className="text-xs text-muted-foreground">Trust {trust.trustScore} · {trust.level}</p>}
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>

            <div className="space-y-2">
              <button onClick={() => enroll.mutate()} disabled={enroll.isPending || course.status !== "published"}
                className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                {enroll.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Enrolling…</> : "Enroll Now"}
              </button>
              {enroll.isSuccess && (
                <p className="text-xs text-emerald-600 text-center flex items-center justify-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> Enrolled! Start learning.
                </p>
              )}
            </div>

            <div className="mt-4 space-y-2 text-sm">
              {[
                { label: "Lessons", value: course.lessonCount ?? "—" },
                { label: "Duration", value: course.duration ?? "Self-paced" },
                { label: "Students", value: course.enrollmentCount?.toLocaleString() ?? "0" },
                { label: "Certificate", value: "Yes" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
