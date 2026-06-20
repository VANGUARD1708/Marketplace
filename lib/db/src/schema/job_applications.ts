import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const jobApplicationsTable = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(),
  applicantId: integer("applicant_id").notNull(),
  coverLetter: text("cover_letter"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertJobApplicationSchema = createInsertSchema(jobApplicationsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;
export type JobApplication = typeof jobApplicationsTable.$inferSelect;
