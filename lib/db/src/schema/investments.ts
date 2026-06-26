import { pgTable, serial, integer, text, numeric, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const investmentsTable = pgTable("investments", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").notNull(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  sector: text("sector").notNull().default("General"),
  description: text("description"),
  fundingGoal: numeric("funding_goal", { precision: 14, scale: 2 }).notNull().default("0"),
  amountRaised: numeric("amount_raised", { precision: 14, scale: 2 }).notNull().default("0"),
  minInvestment: numeric("min_investment", { precision: 14, scale: 2 }).notNull().default("0"),
  returnRate: numeric("return_rate", { precision: 6, scale: 2 }).notNull().default("0"),
  durationMonths: integer("duration_months").notNull().default(12),
  investorCount: integer("investor_count").notNull().default(0),
  risk: text("risk").notNull().default("medium"),
  verified: boolean("verified").notNull().default(false),
  status: text("status").notNull().default("active"),
  closingDate: timestamp("closing_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const investmentCommitmentsTable = pgTable("investment_commitments", {
  id: serial("id").primaryKey(),
  investmentId: integer("investment_id").notNull(),
  investorId: integer("investor_id").notNull(),
  amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
  status: text("status").notNull().default("held"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertInvestmentSchema = createInsertSchema(investmentsTable).omit({ id: true, createdAt: true, updatedAt: true, investorCount: true, amountRaised: true });
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;
export type Investment = typeof investmentsTable.$inferSelect;

export const insertInvestmentCommitmentSchema = createInsertSchema(investmentCommitmentsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertInvestmentCommitment = z.infer<typeof insertInvestmentCommitmentSchema>;
export type InvestmentCommitment = typeof investmentCommitmentsTable.$inferSelect;
