import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const courseEnrollmentsTable = pgTable("course_enrollments", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  studentId: integer("student_id").notNull(),
  status: text("status").notNull().default("active"),
  enrolledAt: timestamp("enrolled_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertCourseEnrollmentSchema = createInsertSchema(courseEnrollmentsTable).omit({ id: true, enrolledAt: true });
export type InsertCourseEnrollment = z.infer<typeof insertCourseEnrollmentSchema>;
export type CourseEnrollment = typeof courseEnrollmentsTable.$inferSelect;
