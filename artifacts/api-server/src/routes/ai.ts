import { Router } from "express";
import { analyzeUser, analyzeListing, analyzeTransaction } from "../ai/guardian";
import { calculateTrustScore } from "../ai/trustScore";
import { analyzeRisk } from "../ai/riskAnalyzer";
import { FRAUD_RULES } from "../ai/fraudRules";

const router = Router();

router.post("/analyze/user", (req, res) => {
  try {
    const { verified = false, companyVerified = false, completedEscrows = 0, disputes = 0, listingPrice = 0 } = req.body;
    const result = analyzeUser({ verified, companyVerified, completedEscrows, disputes, listingPrice });
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Analysis failed" });
  }
});

router.post("/analyze/listing", (req, res) => {
  try {
    const { price = 0, sellerVerified = false } = req.body;
    const result = analyzeListing({ price, sellerVerified });
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Analysis failed" });
  }
});

router.post("/analyze/transaction", (req, res) => {
  try {
    const { amount = 0, buyerVerified = false, sellerVerified = false } = req.body;
    const result = analyzeTransaction({ amount, buyerVerified, sellerVerified });
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Analysis failed" });
  }
});

router.post("/trust-score", (req, res) => {
  try {
    const { verified = false, companyVerified = false, completedEscrows = 0, disputes = 0 } = req.body;
    const result = calculateTrustScore({ verified, companyVerified, completedEscrows, disputes });
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Trust score calculation failed" });
  }
});

router.post("/risk", (req, res) => {
  try {
    const { verified = false, disputes = 0, price = 0 } = req.body;
    const result = analyzeRisk({ verified, disputes, price });
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Risk analysis failed" });
  }
});

router.get("/rules", (_req, res) => {
  return res.json(FRAUD_RULES);
});

export default router;
