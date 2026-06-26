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

router.post("/assistant", (req, res) => {
  try {
    const { message = "" } = req.body;
    const msg = String(message).toLowerCase();

    let reply = "I'm the Vanguard AI Assistant. I can help you with marketplace questions, trust scores, Guardian protection, escrow, and more.";

    if (msg.includes("escrow")) {
      reply = "Escrow on Vanguard works like a digital lock: your payment is held securely until you confirm you've received your item. Once you confirm, funds are released to the seller. If there's a problem, you can open a dispute and our team will mediate.";
    } else if (msg.includes("trust") || msg.includes("score")) {
      reply = "Your Trust Score (0–100) reflects your reputation on Vanguard. It increases when you verify your identity (+20), complete successful escrow transactions (+2 each), earn positive reviews (+1 each), and verify your company (+15). Disputes reduce it by 8 points.";
    } else if (msg.includes("guardian")) {
      reply = "Guardian AI is Vanguard's fraud detection system. It monitors all transactions and listings for suspicious patterns, verifies seller credentials, and blocks high-risk activity. Guardian-protected listings show a shield badge.";
    } else if (msg.includes("fee") || msg.includes("commission") || msg.includes("cost")) {
      reply = "Vanguard charges a 2% escrow fee on protected transactions, capped at ₦50,000. Listing products is free. Premium verification services have a one-time fee. Wallet withdrawals are free for amounts above ₦10,000.";
    } else if (msg.includes("verify") || msg.includes("verification")) {
      reply = "To get verified on Vanguard, go to Verification Center and choose your type: Identity (government ID), Business (CAC certificate), or Professional (certificates). Verification takes 24–48 hours and grants you a trust badge.";
    } else if (msg.includes("wallet") || msg.includes("payment") || msg.includes("money")) {
      reply = "Your Vanguard Wallet stores your funds securely. You can top up via bank transfer, use escrow for protected transactions, and withdraw to your bank account. All transactions are logged and Guardian-monitored.";
    } else if (msg.includes("report") || msg.includes("fraud") || msg.includes("scam")) {
      reply = "To report a suspicious listing or user, click the 'Report' button on their profile or listing. Guardian AI will immediately flag the account for review. Our admin team reviews all reports within 24 hours.";
    } else if (msg.includes("seller") || msg.includes("trustworthy")) {
      reply = "To assess a seller's trustworthiness: check their Trust Score (80+ is excellent), look for verified badges (blue shield), review their transaction history, read customer reviews, and ensure they're Guardian-protected. Sellers with 10+ completed escrows are generally reliable.";
    }

    return res.json({ reply });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Assistant unavailable" });
  }
});

export default router;
