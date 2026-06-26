import { Router } from "express";
import { db } from "@workspace/db";
import {
  coursesTable,
  courseLessonsTable,
  courseEnrollmentsTable,
  courseProgressTable,
} from "@workspace/db";
import { eq, and, ilike, desc, count } from "drizzle-orm";

const router = Router();

async function enrichCourse(course: typeof coursesTable.$inferSelect) {
  const [lessonCountResult] = await db
    .select({ value: count() })
    .from(courseLessonsTable)
    .where(eq(courseLessonsTable.courseId, course.id));

  const [enrollmentCountResult] = await db
    .select({ value: count() })
    .from(courseEnrollmentsTable)
    .where(eq(courseEnrollmentsTable.courseId, course.id));

  return {
    id: course.id,
    instructorId: course.teacherId,
    title: course.title,
    description: course.description,
    category: course.category,
    price: course.price,
    duration: null,
    lessonCount: Number(lessonCountResult?.value ?? 0),
    enrollmentCount: Number(enrollmentCountResult?.value ?? 0),
    status: course.status,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
  };
}

function mapLesson(lesson: typeof courseLessonsTable.$inferSelect, index: number) {
  return {
    id: lesson.id,
    courseId: lesson.courseId,
    title: lesson.title,
    content: lesson.content,
    videoUrl: lesson.videoUrl,
    order: lesson.sortOrder,
    duration: null,
    isFree: index === 0,
  };
}

// GET /api/courses — list courses with optional filters
router.get("/", async (req, res) => {
  try {
    const { search, category, status } = req.query;

    const conditions = [];
    if (search) conditions.push(ilike(coursesTable.title, `%${search}%`));
    if (category && category !== "All") conditions.push(eq(coursesTable.category, String(category)));
    if (status) conditions.push(eq(coursesTable.status, String(status)));

    const courses = await db.query.coursesTable.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: [desc(coursesTable.createdAt)],
    });

    const enriched = await Promise.all(courses.map(enrichCourse));
    return res.json(enriched);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load courses" });
  }
});

// POST /api/courses — create a course (instructor only)
router.post("/", async (req, res) => {
  try {
    const { instructorId, teacherId, title, description, category, price, status } = req.body;
    const resolvedTeacherId = instructorId ?? teacherId;

    if (!resolvedTeacherId || !title) {
      return res.status(400).json({ error: "instructorId and title are required" });
    }

    const [course] = await db
      .insert(coursesTable)
      .values({
        teacherId: Number(resolvedTeacherId),
        title: String(title),
        description: description ?? null,
        category: category ?? null,
        price: price ?? "0",
        status: status ?? "draft",
      })
      .returning();

    return res.status(201).json(await enrichCourse(course));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create course" });
  }
});

// GET /api/courses/:id — get single course
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const course = await db.query.coursesTable.findFirst({
      where: eq(coursesTable.id, id),
    });

    if (!course) return res.status(404).json({ error: "Course not found" });

    return res.json(await enrichCourse(course));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load course" });
  }
});

// PATCH /api/courses/:id — update course (instructor who owns it only)
router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const { instructorId, title, description, category, price, status } = req.body;
    if (!instructorId) {
      return res.status(400).json({ error: "instructorId is required to update a course" });
    }

    const existing = await db.query.coursesTable.findFirst({ where: eq(coursesTable.id, id) });
    if (!existing) return res.status(404).json({ error: "Course not found" });
    if (existing.teacherId !== Number(instructorId)) {
      return res.status(403).json({ error: "Only the course instructor can update this course" });
    }

    const [updated] = await db
      .update(coursesTable)
      .set({
        ...(title !== undefined && { title: String(title) }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(price !== undefined && { price: String(price) }),
        ...(status !== undefined && { status }),
        updatedAt: new Date(),
      })
      .where(eq(coursesTable.id, id))
      .returning();

    return res.json(await enrichCourse(updated));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update course" });
  }
});

// DELETE /api/courses/:id — instructor only
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const instructorId = Number(req.body.instructorId ?? req.query.instructorId);
    if (!instructorId) {
      return res.status(400).json({ error: "instructorId is required to delete a course" });
    }

    const existing = await db.query.coursesTable.findFirst({ where: eq(coursesTable.id, id) });
    if (!existing) return res.status(404).json({ error: "Course not found" });
    if (existing.teacherId !== instructorId) {
      return res.status(403).json({ error: "Only the course instructor can delete this course" });
    }

    await db.delete(coursesTable).where(eq(coursesTable.id, id));
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete course" });
  }
});

// GET /api/courses/:id/lessons — ordered lessons
router.get("/:id/lessons", async (req, res) => {
  try {
    const courseId = Number(req.params.id);
    if (isNaN(courseId)) return res.status(400).json({ error: "Invalid course id" });

    const course = await db.query.coursesTable.findFirst({ where: eq(coursesTable.id, courseId) });
    if (!course) return res.status(404).json({ error: "Course not found" });

    const lessons = await db.query.courseLessonsTable.findMany({
      where: eq(courseLessonsTable.courseId, courseId),
      orderBy: (t, { asc }) => [asc(t.sortOrder)],
    });

    return res.json(lessons.map((l, i) => mapLesson(l, i)));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load lessons" });
  }
});

// POST /api/courses/:id/lessons — instructor only
router.post("/:id/lessons", async (req, res) => {
  try {
    const courseId = Number(req.params.id);
    if (isNaN(courseId)) return res.status(400).json({ error: "Invalid course id" });

    const { instructorId, title, content, videoUrl, sortOrder } = req.body;
    if (!instructorId) {
      return res.status(400).json({ error: "instructorId is required to add a lesson" });
    }
    if (!title) return res.status(400).json({ error: "title is required" });

    const course = await db.query.coursesTable.findFirst({ where: eq(coursesTable.id, courseId) });
    if (!course) return res.status(404).json({ error: "Course not found" });
    if (course.teacherId !== Number(instructorId)) {
      return res.status(403).json({ error: "Only the course instructor can add lessons" });
    }

    const [lesson] = await db
      .insert(courseLessonsTable)
      .values({
        courseId,
        title: String(title),
        content: content ?? null,
        videoUrl: videoUrl ?? null,
        sortOrder: sortOrder ?? 0,
      })
      .returning();

    const all = await db.query.courseLessonsTable.findMany({
      where: eq(courseLessonsTable.courseId, courseId),
      orderBy: (t, { asc }) => [asc(t.sortOrder)],
    });
    const index = all.findIndex((l) => l.id === lesson.id);

    return res.status(201).json(mapLesson(lesson, index));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to add lesson" });
  }
});

// POST /api/courses/:id/enroll — student enrolls (no double enroll; instructor cannot self-enroll)
router.post("/:id/enroll", async (req, res) => {
  try {
    const courseId = Number(req.params.id);
    if (isNaN(courseId)) return res.status(400).json({ error: "Invalid course id" });

    const { userId, studentId } = req.body;
    const resolvedStudentId = userId ?? studentId;
    if (!resolvedStudentId) return res.status(400).json({ error: "userId is required" });

    const course = await db.query.coursesTable.findFirst({ where: eq(coursesTable.id, courseId) });
    if (!course) return res.status(404).json({ error: "Course not found" });
    if (course.teacherId === Number(resolvedStudentId)) {
      return res.status(400).json({ error: "Instructors cannot enroll in their own course" });
    }

    const existing = await db.query.courseEnrollmentsTable.findFirst({
      where: and(
        eq(courseEnrollmentsTable.courseId, courseId),
        eq(courseEnrollmentsTable.studentId, Number(resolvedStudentId)),
      ),
    });
    if (existing) return res.status(409).json({ error: "Already enrolled in this course" });

    const [enrollment] = await db
      .insert(courseEnrollmentsTable)
      .values({
        courseId,
        studentId: Number(resolvedStudentId),
        status: "active",
      })
      .returning();

    return res.status(201).json(enrollment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to enroll in course" });
  }
});

// GET /api/courses/:id/enrollments — instructor-only; or student checks own enrollment
router.get("/:id/enrollments", async (req, res) => {
  try {
    const courseId = Number(req.params.id);
    if (isNaN(courseId)) return res.status(400).json({ error: "Invalid course id" });

    const { instructorId, studentId } = req.query;

    const course = await db.query.coursesTable.findFirst({ where: eq(coursesTable.id, courseId) });
    if (!course) return res.status(404).json({ error: "Course not found" });

    // Student can check their own enrollment
    if (studentId) {
      const enrollment = await db.query.courseEnrollmentsTable.findMany({
        where: and(
          eq(courseEnrollmentsTable.courseId, courseId),
          eq(courseEnrollmentsTable.studentId, Number(studentId)),
        ),
      });
      return res.json(enrollment);
    }

    // Otherwise require instructor ownership
    if (!instructorId) {
      return res.status(400).json({ error: "instructorId or studentId is required to view enrollments" });
    }
    if (course.teacherId !== Number(instructorId)) {
      return res.status(403).json({ error: "Only the course instructor can view all enrollments" });
    }

    const enrollments = await db.query.courseEnrollmentsTable.findMany({
      where: eq(courseEnrollmentsTable.courseId, courseId),
      orderBy: [desc(courseEnrollmentsTable.enrolledAt)],
    });

    return res.json(enrollments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load enrollments" });
  }
});

// GET /api/courses/:id/progress?enrollmentId=N — fetch student's lesson progress
router.get("/:id/progress", async (req, res) => {
  try {
    const courseId = Number(req.params.id);
    if (isNaN(courseId)) return res.status(400).json({ error: "Invalid course id" });

    const enrollmentId = Number(req.query.enrollmentId);
    if (!enrollmentId) return res.status(400).json({ error: "enrollmentId is required" });

    // Verify the enrollment belongs to this course
    const enrollment = await db.query.courseEnrollmentsTable.findFirst({
      where: and(
        eq(courseEnrollmentsTable.id, enrollmentId),
        eq(courseEnrollmentsTable.courseId, courseId),
      ),
    });
    if (!enrollment) return res.status(404).json({ error: "Enrollment not found for this course" });

    const progress = await db.query.courseProgressTable.findMany({
      where: eq(courseProgressTable.enrollmentId, enrollmentId),
    });

    return res.json(progress);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load progress" });
  }
});

// POST /api/courses/:id/progress — student marks lesson complete
router.post("/:id/progress", async (req, res) => {
  try {
    const courseId = Number(req.params.id);
    if (isNaN(courseId)) return res.status(400).json({ error: "Invalid course id" });

    const { enrollmentId, lessonId, studentId, completed } = req.body;
    if (!enrollmentId || !lessonId) {
      return res.status(400).json({ error: "enrollmentId and lessonId are required" });
    }

    // Verify the enrollment belongs to this course (and optionally this student)
    const enrollmentConditions: ReturnType<typeof eq>[] = [
      eq(courseEnrollmentsTable.id, Number(enrollmentId)),
      eq(courseEnrollmentsTable.courseId, courseId),
    ];
    if (studentId) {
      enrollmentConditions.push(eq(courseEnrollmentsTable.studentId, Number(studentId)));
    }

    const enrollment = await db.query.courseEnrollmentsTable.findFirst({
      where: and(...enrollmentConditions),
    });
    if (!enrollment) {
      return res.status(403).json({ error: "Enrollment not found — you must be enrolled to track progress" });
    }

    // Verify the lesson belongs to this course
    const lesson = await db.query.courseLessonsTable.findFirst({
      where: and(
        eq(courseLessonsTable.id, Number(lessonId)),
        eq(courseLessonsTable.courseId, courseId),
      ),
    });
    if (!lesson) return res.status(404).json({ error: "Lesson not found in this course" });

    const existing = await db.query.courseProgressTable.findFirst({
      where: and(
        eq(courseProgressTable.enrollmentId, Number(enrollmentId)),
        eq(courseProgressTable.lessonId, Number(lessonId)),
      ),
    });

    const isCompleted = completed !== false;

    if (existing) {
      const [updated] = await db
        .update(courseProgressTable)
        .set({
          completed: isCompleted,
          completedAt: isCompleted ? new Date() : null,
        })
        .where(eq(courseProgressTable.id, existing.id))
        .returning();
      return res.json(updated);
    }

    const [progress] = await db
      .insert(courseProgressTable)
      .values({
        enrollmentId: Number(enrollmentId),
        lessonId: Number(lessonId),
        completed: isCompleted,
        completedAt: isCompleted ? new Date() : null,
      })
      .returning();

    return res.status(201).json(progress);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update progress" });
  }
});

export default router;
