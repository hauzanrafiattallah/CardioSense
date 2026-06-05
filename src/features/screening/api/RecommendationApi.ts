import type {
  ScreeningAiRecommendation,
  ScreeningFormValues,
  ScreeningResult,
} from "../types/Screening";

type RecommendationApiResponse = {
  recommendation?: string;
  followUpPrompt?: string;
  error?: string;
};

const RECOMMENDATION_API_PATH = "/api/recommendation";

function normalizeRecommendationApiResponse(
  value: RecommendationApiResponse,
): ScreeningAiRecommendation {
  const recommendation =
    typeof value.recommendation === "string"
      ? value.recommendation.trim()
      : "";
  const followUpPrompt =
    typeof value.followUpPrompt === "string" ? value.followUpPrompt.trim() : "";

  if (!recommendation || !followUpPrompt) {
    throw new Error("Invalid recommendation response");
  }

  return {
    recommendation: recommendation.slice(0, 1_500),
    followUpPrompt: followUpPrompt.slice(0, 240),
  };
}

function getRecommendationApiErrorMessage(value: unknown) {
  if (typeof value === "object" && value !== null && "error" in value) {
    const error = value.error;

    if (typeof error === "string") {
      return error;
    }
  }

  return "Recommendation request failed";
}

export async function requestScreeningRecommendation(
  values: ScreeningFormValues,
  result: ScreeningResult,
  signal?: AbortSignal,
): Promise<ScreeningAiRecommendation> {
  const response = await fetch(RECOMMENDATION_API_PATH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values, result }),
    signal,
  });
  const data = (await response.json()) as RecommendationApiResponse;

  if (!response.ok) {
    throw new Error(getRecommendationApiErrorMessage(data));
  }

  return normalizeRecommendationApiResponse(data);
}
