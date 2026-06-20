import { pgTable, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const courseProgressTable = pgTable("course_progress", {
  id: serial("id").primaryKey(),
  enrollmentId: integer("enrollment_id").notNull(),
  lessonId: integer("lesson_id").notNull(),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCourseProgressSchema = createInsertSchema(courseProgressTable).omit({ id: true, createdAt: true });
export type InsertCourseProgress = z.infer<typeof insertCourseProgressSchema>;
export type CourseProgress = typeof courseProgressTable.$inferSelect;
