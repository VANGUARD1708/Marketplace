import { Router } from "express";
import { db } from "@workspace/db";
import {
  jobsTable,
  jobApplicationsTable,
} from "@workspace/db";
import { eq, and, ilike, gte, lte, desc, ne } from "drizzle-orm";

const router = Router();

function mapJob(job: typeof jobsTable.$inferSelect) {
  return {
    id: job.id,
    employerId: job.employerId,
    title: job.title,
    description: job.description,
    requirements: job.requirements,
    jobType: job.jobType,
    location: job.location,
    salaryMin: job.budgetMin,
    salaryMax: job.budgetMax,
    skills: job.skills,
    status: job.status === "open" ? "active" : job.status,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  };
}

// GET /api/jobs — list with optional filters
router.get("/", async (req, res) => {
  try {
    const { search, location, status, type, salaryMin, salaryMax } = req.query;

    const conditions = [];
    if (search) conditions.push(ilike(jobsTable.title, `%${search}%`));
    if (location) conditions.push(ilike(jobsTable.location, `%${location}%`));
    if (type && type !== "All") conditions.push(eq(jobsTable.jobType, String(type)));
    if (salaryMin) conditions.push(gte(jobsTable.budgetMin, String(salaryMin)));
    if (salaryMax) conditions.push(lte(jobsTable.budgetMax, String(salaryMax)));
    if (status && status !== "all") {
      const dbStatus = status === "active" ? "open" : String(status);
      conditions.push(eq(jobsTable.status, dbStatus));
    } else {
      conditions.push(ne(jobsTable.status, "deleted"));
    }

    const jobs = await db.query.jobsTable.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: [desc(jobsTable.createdAt)],
    });

    return res.json(jobs.map(mapJob));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load jobs" });
  }
});

// POST /api/jobs — create a job listing (any authenticated employer)
router.post("/", async (req, res) => {
  try {
    const {
      employerId,
      title,
      description,
      requirements,
      location,
      jobType,
      skills,
      budgetMin,
      budgetMax,
      salaryMin,
      salaryMax,
    } = req.body;

    if (!employerId || !title) {
      return res.status(400).json({ error: "employerId and title are required" });
    }

    const [job] = await db
      .insert(jobsTable)
      .values({
        employerId: Number(employerId),
        title: String(title),
        description: description ?? null,
        requirements: requirements ?? null,
        location: location ?? null,
        jobType: jobType ?? null,
        skills: skills ?? null,
        budgetMin: salaryMin ?? budgetMin ?? null,
        budgetMax: salaryMax ?? budgetMax ?? null,
        status: "open",
      })
      .returning();

    return res.status(201).json(mapJob(job));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create job" });
  }
});

// GET /api/jobs/:id — get single job
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const job = await db.query.jobsTable.findFirst({
      where: eq(jobsTable.id, id),
    });

    if (!job) return res.status(404).json({ error: "Job not found" });

    return res.json(mapJob(job));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load job" });
  }
});

// PATCH /api/jobs/:id — update job (employer who owns it only)
router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const { employerId, title, description, requirements, location, jobType, skills, budgetMin, budgetMax, salaryMin, salaryMax, status } = req.body;

    if (!employerId) {
      return res.status(400).json({ error: "employerId is required to update a job" });
    }

    const existing = await db.query.jobsTable.findFirst({ where: eq(jobsTable.id, id) });
    if (!existing) return res.status(404).json({ error: "Job not found" });
    if (existing.employerId !== Number(employerId)) {
      return res.status(403).json({ error: "Only the employer who posted this job can update it" });
    }

    const dbStatus = status === "active" ? "open" : status;

    const [updated] = await db
      .update(jobsTable)
      .set({
        ...(title !== undefined && { title: String(title) }),
        ...(description !== undefined && { description }),
        ...(requirements !== undefined && { requirements }),
        ...(location !== undefined && { location }),
        ...(jobType !== undefined && { jobType }),
        ...(skills !== undefined && { skills }),
        ...((salaryMin !== undefined || budgetMin !== undefined) && { budgetMin: salaryMin ?? budgetMin }),
        ...((salaryMax !== undefined || budgetMax !== undefined) && { budgetMax: salaryMax ?? budgetMax }),
        ...(status !== undefined && { status: dbStatus }),
        updatedAt: new Date(),
      })
      .where(eq(jobsTable.id, id))
      .returning();

    return res.json(mapJob(updated));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update job" });
  }
});

// DELETE /api/jobs/:id — employer only
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const employerId = Number(req.body.employerId ?? req.query.employerId);
    if (!employerId) {
      return res.status(400).json({ error: "employerId is required to delete a job" });
    }

    const existing = await db.query.jobsTable.findFirst({ where: eq(jobsTable.id, id) });
    if (!existing) return res.status(404).json({ error: "Job not found" });
    if (existing.employerId !== employerId) {
      return res.status(403).json({ error: "Only the employer who posted this job can delete it" });
    }

    await db.delete(jobsTable).where(eq(jobsTable.id, id));
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete job" });
  }
});

// POST /api/jobs/:id/apply — applicant submits application (no duplicate; employer cannot apply to own job)
router.post("/:id/apply", async (req, res) => {
  try {
    const jobId = Number(req.params.id);
    if (isNaN(jobId)) return res.status(400).json({ error: "Invalid job id" });

    const { applicantId, coverLetter } = req.body;
    if (!applicantId) return res.status(400).json({ error: "applicantId is required" });

    const job = await db.query.jobsTable.findFirst({ where: eq(jobsTable.id, jobId) });
    if (!job) return res.status(404).json({ error: "Job not found" });
    if (job.status !== "open") return res.status(400).json({ error: "This job is no longer accepting applications" });
    if (job.employerId === Number(applicantId)) {
      return res.status(400).json({ error: "You cannot apply to your own job posting" });
    }

    const existing = await db.query.jobApplicationsTable.findFirst({
      where: and(
        eq(jobApplicationsTable.jobId, jobId),
        eq(jobApplicationsTable.applicantId, Number(applicantId)),
      ),
    });
    if (existing) return res.status(409).json({ error: "You have already applied to this job" });

    const [application] = await db
      .insert(jobApplicationsTable)
      .values({
        jobId,
        applicantId: Number(applicantId),
        coverLetter: coverLetter ?? null,
        status: "pending",
      })
      .returning();

    return res.status(201).json(application);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to submit application" });
  }
});

// GET /api/jobs/:id/applications — employer-only; or applicant can filter by their own
router.get("/:id/applications", async (req, res) => {
  try {
    const jobId = Number(req.params.id);
    if (isNaN(jobId)) return res.status(400).json({ error: "Invalid job id" });

    const { employerId, applicantId } = req.query;

    const job = await db.query.jobsTable.findFirst({ where: eq(jobsTable.id, jobId) });
    if (!job) return res.status(404).json({ error: "Job not found" });

    // If applicantId supplied, return just that applicant's application (no employer auth needed)
    if (applicantId) {
      const conditions = [
        eq(jobApplicationsTable.jobId, jobId),
        eq(jobApplicationsTable.applicantId, Number(applicantId)),
      ];
      const applications = await db.query.jobApplicationsTable.findMany({
        where: and(...conditions),
        orderBy: [desc(jobApplicationsTable.createdAt)],
      });
      return res.json(applications);
    }

    // Otherwise require employer ownership
    if (!employerId) {
      return res.status(400).json({ error: "employerId or applicantId is required to view applications" });
    }
    if (job.employerId !== Number(employerId)) {
      return res.status(403).json({ error: "Only the employer who posted this job can view all applications" });
    }

    const applications = await db.query.jobApplicationsTable.findMany({
      where: eq(jobApplicationsTable.jobId, jobId),
      orderBy: [desc(jobApplicationsTable.createdAt)],
    });

    return res.json(applications);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load applications" });
  }
});

// PATCH /api/jobs/:id/applications/:appId — employer updates application status
router.patch("/:id/applications/:appId", async (req, res) => {
  try {
    const jobId = Number(req.params.id);
    const appId = Number(req.params.appId);
    if (isNaN(appId)) return res.status(400).json({ error: "Invalid application id" });

    const { status, employerId } = req.body;
    if (!status) return res.status(400).json({ error: "status is required" });
    if (!employerId) return res.status(400).json({ error: "employerId is required to update application status" });

    const job = await db.query.jobsTable.findFirst({ where: eq(jobsTable.id, jobId) });
    if (!job) return res.status(404).json({ error: "Job not found" });
    if (job.employerId !== Number(employerId)) {
      return res.status(403).json({ error: "Only the employer who posted this job can update application status" });
    }

    const existing = await db.query.jobApplicationsTable.findFirst({
      where: and(
        eq(jobApplicationsTable.id, appId),
        eq(jobApplicationsTable.jobId, jobId),
      ),
    });
    if (!existing) return res.status(404).json({ error: "Application not found" });

    const [updated] = await db
      .update(jobApplicationsTable)
      .set({ status, updatedAt: new Date() })
      .where(eq(jobApplicationsTable.id, appId))
      .returning();

    return res.json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update application" });
  }
});

export default router;
