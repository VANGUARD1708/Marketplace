import { Router } from "express";
import { analyzeGuardian, analyzeListing, analyzeTransaction } from "../ai/guardian";
import { calculateTrustScore } from "../ai/trustScore";
import { analyzeRisk } from "../ai/riskAnalyzer";
import { FRAUD_RULES, runFraudChecks } from "../ai/fraudRules";

const router = Router();

router.post("/analyze/guardian", (req, res) => {
  try {
    const {
      verified = false,
      companyVerified = false,
      completedEscrows = 0,
      disputes = 0,
      positiveReviews = 0,
      accountAgeDays = 0,
      price = 0,
      transactionAmount = 0,
    } = req.body;
    const result = analyzeGuardian({
      verified,
      companyVerified,
      completedEscrows,
      disputes,
      positiveReviews,
      accountAgeDays,
      price,
      transactionAmount,
    });
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Guardian analysis failed" });
  }
});

router.post("/analyze/listing", (req, res) => {
  try {
    const { title = "Listing", price = 0, sellerVerified = false } = req.body;
    const result = analyzeListing({ title, price, sellerVerified });
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Listing analysis failed" });
  }
});

router.post("/analyze/transaction", (req, res) => {
  try {
    const { amount = 0 } = req.body;
    const result = analyzeTransaction(amount);
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Transaction analysis failed" });
  }
});

router.post("/trust-score", (req, res) => {
  try {
    const {
      verified = false,
      companyVerified = false,
      completedEscrows = 0,
      disputes = 0,
      positiveReviews = 0,
      accountAgeDays = 0,
    } = req.body;
    const result = calculateTrustScore({
      verified,
      companyVerified,
      completedEscrows,
      disputes,
      positiveReviews,
      accountAgeDays,
    });
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Trust score calculation failed" });
  }
});

router.post("/risk", (req, res) => {
  try {
    const {
      verified = false,
      companyVerified = false,
      disputes = 0,
      price = 0,
      completedEscrows = 0,
      accountAgeDays = 0,
    } = req.body;
    const result = analyzeRisk({ verified, companyVerified, disputes, price, completedEscrows, accountAgeDays });
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Risk analysis failed" });
  }
});

router.post("/fraud-check", (req, res) => {
  try {
    const {
      verified = false,
      companyVerified = false,
      disputes = 0,
      transactionAmount = 0,
      accountAgeDays = 0,
      completedEscrows = 0,
    } = req.body;
    const result = runFraudChecks({ verified, companyVerified, disputes, transactionAmount, accountAgeDays, completedEscrows });
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Fraud check failed" });
  }
});

router.get("/rules", (_req, res) => {
  return res.json(FRAUD_RULES);
});

export default router;
