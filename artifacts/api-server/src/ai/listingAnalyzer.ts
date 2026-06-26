export interface ListingAnalysisInput {
  title: string;
  description?: string;
  category?: string;
  price: number;
  sellerVerified: boolean;
  sellerTrustScore?: number;
}

export interface ListingAnalysisResult {
  score: number;
  riskLevel:
    | "low"
    | "medium"
    | "high";

  recommendation:
    | "allow"
    | "review"
    | "block";

  flags: string[];
}

export function analyzeListing(
  listing: ListingAnalysisInput,
): ListingAnalysisResult {
  let score = 0;

  const flags: string[] = [];

  if (
    !listing.sellerVerified
  ) {
    score += 30;

    flags.push(
      "Seller is not verified",
    );
  }

  if (
    (listing.sellerTrustScore ??
      0) < 40
  ) {
    score += 20;

    flags.push(
      "Low trust score",
    );
  }

  if (
    listing.price >
    1000000
  ) {
    score += 15;

    flags.push(
      "High-value listing",
    );
  }

  if (
    listing.title.length <
    5
  ) {
    score += 10;

    flags.push(
      "Poor title quality",
    );
  }

  if (
    !listing.description ||
    listing.description.length <
      20
  ) {
    score += 10;

    flags.push(
      "Insufficient description",
    );
  }

  let riskLevel:
    | "low"
    | "medium"
    | "high" = "low";

  let recommendation:
    | "allow"
    | "review"
    | "block" = "allow";

  if (score >= 70) {
    riskLevel =
      "high";

    recommendation =
      "block";
  } else if (
    score >= 40
  ) {
    riskLevel =
      "medium";

    recommendation =
      "review";
  }

  return {
    score,
    riskLevel,
    recommendation,
    flags,
  };
}