import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import {
  BookOpen, Shield, CheckCircle, Loader2, ChevronLeft,
  Users, Clock, Play, Lock, ArrowRight, CheckCircle2,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

const ME = 1;

type Course = {
  id: number; instructorId: number; title: string; description?: string;
  category?: string; price: string; duration?: string; lessonCount?: number;
  enrollmentCount?: number; status: string; createdAt: string;
};
type Lesson = { id: number; courseId: number; title: string; content?: string; duration?: string; order: number; isFree: boolean };
type Enrollment = { id: number; courseId: number; studentId: number; status: string; enrolledAt: string };
type Progress = { id: number; enrollmentId: number; lessonId: number; completed: boolean; completedAt: string | null };
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

  // Check if current user is already enrolled
  const { data: myEnrollments = [], refetch: refetchEnrollment } = useQuery({
    queryKey: ["myEnrollment", id, ME],
    queryFn: () => apiFetch<Enrollment[]>(`/courses/${id}/enrollments?studentId=${ME}`),
    enabled: Boolean(id),
  });
  const enrollment = myEnrollments[0] ?? null;

  // Fetch lesson progress if enrolled
  const { data: progressRecords = [], refetch: refetchProgress } = useQuery({
    queryKey: ["progress", id, enrollment?.id],
    queryFn: () => apiFetch<Progress[]>(`/courses/${id}/progress?enrollmentId=${enrollment!.id}`),
    enabled: Boolean(enrollment),
  });

  const completedIds = new Set(progressRecords.filter((p) => p.completed).map((p) => p.lessonId));
  const progressPct = lessons.length > 0 ? Math.round((completedIds.size / lessons.length) * 100) : 0;

  const enroll = useMutation({
    mutationFn: () => apiFetch(`/courses/${id}/enroll`, {
      method: "POST",
      body: JSON.stringify({ userId: ME }),
    }),
    onSuccess: () => {
      refetchEnrollment();
      qc.invalidateQueries({ queryKey: ["course", id] });
    },
  });

  const markComplete = useMutation({
    mutationFn: (lessonId: number) => apiFetch(`/courses/${id}/progress`, {
      method: "POST",
      body: JSON.stringify({
        enrollmentId: enrollment!.id,
        studentId: ME,
        lessonId,
        completed: true,
      }),
    }),
    onSuccess: () => refetchProgress(),
  });

  const markIncomplete = useMutation({
    mutationFn: (lessonId: number) => apiFetch(`/courses/${id}/progress`, {
      method: "POST",
      body: JSON.stringify({
        enrollmentId: enrollment!.id,
        studentId: ME,
        lessonId,
        completed: false,
      }),
    }),
    onSuccess: () => refetchProgress(),
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

  const isOwnCourse = course.instructorId === ME;
  const isEnrolled = Boolean(enrollment);
  const sortedLessons = [...lessons].sort((a, b) => a.order - b.order);

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
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {(course.lessonCount ?? 0) > 0 && <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {course.lessonCount} lessons</span>}
              {course.duration && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {course.duration}</span>}
              {(course.enrollmentCount ?? 0) > 0 && <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {course.enrollmentCount!.toLocaleString()} students</span>}
            </div>
          </div>

          {/* Progress bar — only shown if enrolled */}
          {isEnrolled && lessons.length > 0 && (
            <div className="rounded-2xl border bg-card p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Your Progress</h3>
                <span className="text-sm font-bold text-primary">{progressPct}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5 mb-2">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{completedIds.size} of {lessons.length} lessons completed</p>
            </div>
          )}

          {/* Description */}
          {course.description && (
            <div className="rounded-2xl border bg-card p-5">
              <h3 className="font-semibold mb-3">Course Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {course.description}
              </p>
            </div>
          )}

          {/* Lessons */}
          <div className="rounded-2xl border bg-card p-5">
            <h3 className="font-semibold mb-4">Course Content</h3>
            {sortedLessons.length === 0 ? (
              <p className="text-sm text-muted-foreground">No lessons available yet.</p>
            ) : (
              <div className="space-y-2">
                {sortedLessons.map((lesson) => {
                  const isDone = completedIds.has(lesson.id);
                  const canAccess = isEnrolled || lesson.isFree;
                  return (
                    <div key={lesson.id} className={`flex items-center gap-3 py-2.5 px-1 border-b last:border-0 rounded-lg ${isDone ? "bg-emerald-50/50" : ""}`}>
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${isDone ? "bg-emerald-100" : lesson.isFree ? "bg-primary/10" : "bg-muted"}`}>
                        {isDone
                          ? <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          : canAccess
                            ? <Play className="h-3.5 w-3.5 text-primary" />
                            : <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isDone ? "text-emerald-800" : ""}`}>{lesson.title}</p>
                        {lesson.duration && <p className="text-xs text-muted-foreground">{lesson.duration}</p>}
                      </div>
                      {lesson.isFree && !isEnrolled && <span className="text-xs text-primary font-medium shrink-0">Free preview</span>}
                      {isEnrolled && (
                        <button
                          onClick={() => isDone ? markIncomplete.mutate(lesson.id) : markComplete.mutate(lesson.id)}
                          disabled={markComplete.isPending || markIncomplete.isPending}
                          className={`text-xs font-medium px-2.5 py-1 rounded-lg shrink-0 transition ${isDone ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "border hover:bg-muted"}`}
                        >
                          {isDone ? "Completed ✓" : "Mark done"}
                        </button>
                      )}
                    </div>
                  );
                })}
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

            {/* Enroll / Enrolled state */}
            {isOwnCourse ? (
              <div className="w-full rounded-xl border bg-muted py-3 text-center text-sm text-muted-foreground font-medium">
                You created this course
              </div>
            ) : isEnrolled ? (
              <div className="space-y-2">
                <div className="w-full rounded-xl bg-emerald-100 border border-emerald-200 py-3 text-center text-sm font-semibold text-emerald-800 flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4" /> Enrolled
                </div>
                {progressPct === 100 && (
                  <p className="text-xs text-emerald-600 text-center font-medium">🎉 Course completed!</p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <button onClick={() => enroll.mutate()} disabled={enroll.isPending || course.status !== "published"}
                  className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                  {enroll.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Enrolling…</> : "Enroll Now"}
                </button>
                {enroll.error && (
                  <p className="text-xs text-destructive text-center">{(enroll.error as Error).message}</p>
                )}
              </div>
            )}

            <div className="mt-4 space-y-2 text-sm">
              {[
                { label: "Lessons", value: course.lessonCount ?? "—" },
                { label: "Duration", value: course.duration ?? "Self-paced" },
                { label: "Students", value: course.enrollmentCount?.toLocaleString() ?? "0" },
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
