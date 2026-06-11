import type {
  RiskLevel,
  ScreeningAiRecommendation,
  ScreeningChatContext,
  ScreeningFormValues,
  ScreeningRecommendationContext,
  ScreeningResult,
} from "../types/Screening";

const riskLabels: Record<RiskLevel, string> = {
  low: "Risiko Rendah",
  medium: "Risiko Sedang",
  high: "Risiko Tinggi",
};

const genderLabels: Record<string, string> = {
  male: "Laki-laki",
  female: "Perempuan",
};

const smokingStatusLabels: Record<string, string> = {
  no: "Tidak",
  yes: "Ya",
};

const diabetesStatusLabels: Record<string, string> = {
  no: "Tidak ada",
  yes: "Ada",
};

const physicalActivityLabels: Record<string, string> = {
  rare: "Jarang",
  moderate: "Kadang-kadang",
  routine: "Rutin",
};

const familyHistoryLabels: Record<string, string> = {
  no: "Tidak ada",
  yes: "Ada",
};

const RECOMMENDATION_COMPLETION_TOKEN_BUDGET = 700;
const MAX_RECOMMENDATION_BULLETS = 5;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toNumber(value: string) {
  return Number.parseFloat(value);
}

function toNullableNumber(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const parsedValue = Number.parseFloat(trimmedValue);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function roundTo(value: number, digits: number) {
  const multiplier = 10 ** digits;

  return Math.round(value * multiplier) / multiplier;
}

function getLabel(value: string, labels: Record<string, string>) {
  return labels[value] ?? value;
}

function isRiskLevel(value: unknown): value is RiskLevel {
  return value === "low" || value === "medium" || value === "high";
}

function cleanRecommendationBullet(value: string) {
  return value
    .trim()
    .replace(/^[-*•]\s+/, "")
    .replace(/^\d+[.)]\s+/, "")
    .trim();
}

export function formatRecommendationAsBullets(value: string) {
  const trimmedValue = value.trim();
  const existingBulletLines = trimmedValue
    .split(/\r?\n/)
    .map(cleanRecommendationBullet)
    .filter(Boolean);
  const rawItems =
    existingBulletLines.length > 1
      ? existingBulletLines
      : trimmedValue
          .split(/(?<=[.!?])\s+/)
          .map(cleanRecommendationBullet)
          .filter(Boolean);

  return rawItems
    .slice(0, MAX_RECOMMENDATION_BULLETS)
    .map((item) => `- ${item}`)
    .join("\n");
}

export function getRecommendationBulletItems(value: string) {
  return value
    .split(/\r?\n/)
    .map(cleanRecommendationBullet)
    .filter(Boolean)
    .slice(0, MAX_RECOMMENDATION_BULLETS);
}

function hasScreeningFormShape(value: unknown): value is ScreeningFormValues {
  if (!isRecord(value)) {
    return false;
  }

  return [
    "age",
    "gender",
    "weight",
    "height",
    "abdominalCircumference",
    "totalCholesterol",
    "diabetesStatus",
    "systolicPressure",
    "diastolicPressure",
    "smokingStatus",
    "physicalActivity",
    "familyHistory",
  ].every((key) => typeof value[key] === "string");
}

function hasScreeningResultShape(value: unknown): value is ScreeningResult {
  if (!isRecord(value) || !isRiskLevel(value.level)) {
    return false;
  }

  return (
    typeof value.title === "string" &&
    typeof value.percentage === "number" &&
    typeof value.rawRiskScore === "number" &&
    typeof value.summary === "string" &&
    typeof value.recommendation === "string" &&
    Array.isArray(value.factors) &&
    value.factors.every(
      (factor) => isRecord(factor) && typeof factor.text === "string",
    )
  );
}

export function normalizeRecommendationPayload(value: unknown): {
  values: ScreeningFormValues;
  result: ScreeningResult;
} {
  if (!isRecord(value)) {
    throw new Error("Invalid recommendation request");
  }

  if (!hasScreeningFormShape(value.values)) {
    throw new Error("Invalid recommendation request");
  }

  if (!hasScreeningResultShape(value.result)) {
    throw new Error("Invalid recommendation request");
  }

  return {
    values: value.values,
    result: value.result,
  };
}

export function createRecommendationRequestContext(
  values: ScreeningFormValues,
  result: Pick<
    ScreeningResult,
    | "level"
    | "title"
    | "percentage"
    | "rawRiskScore"
    | "factors"
    | "recommendation"
  >,
): ScreeningRecommendationContext {
  const weight = toNumber(values.weight);
  const height = toNumber(values.height);
  const abdominalCircumference = toNumber(values.abdominalCircumference);
  const systolicPressure = toNumber(values.systolicPressure);
  const diastolicPressure = toNumber(values.diastolicPressure);
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  return {
    riskLevel: result.level,
    riskLabel: riskLabels[result.level] ?? result.title,
    normalizedRiskScore: result.percentage,
    rawRiskScore: result.rawRiskScore,
    profile: {
      age: toNumber(values.age),
      gender: getLabel(values.gender, genderLabels),
      bmi: roundTo(bmi, 1),
      waistToHeightRatio: roundTo(abdominalCircumference / height, 2),
      abdominalCircumference,
      totalCholesterol: toNullableNumber(values.totalCholesterol),
      bloodPressure: `${systolicPressure}/${diastolicPressure} mmHg`,
      smokingStatus: getLabel(values.smokingStatus, smokingStatusLabels),
      diabetesStatus: getLabel(values.diabetesStatus, diabetesStatusLabels),
      physicalActivity: getLabel(
        values.physicalActivity,
        physicalActivityLabels,
      ),
      familyHistory: getLabel(values.familyHistory, familyHistoryLabels),
    },
    factors: result.factors.map((factor) => factor.text).slice(0, 5),
    baselineRecommendation: result.recommendation,
  };
}

export function normalizeRecommendationResponse(
  value: unknown,
): ScreeningAiRecommendation {
  if (!isRecord(value)) {
    throw new Error("Invalid recommendation response");
  }

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
    recommendation: formatRecommendationAsBullets(recommendation).slice(
      0,
      1_500,
    ),
    followUpPrompt: followUpPrompt.slice(0, 240),
  };
}

export function parseRecommendationCompletion(
  content: string,
): ScreeningAiRecommendation {
  const trimmedContent = content.trim();
  const fencedJsonMatch = trimmedContent.match(
    /^```(?:json)?\s*([\s\S]*?)\s*```$/i,
  );
  const jsonCandidate = fencedJsonMatch?.[1] ?? trimmedContent;

  try {
    return normalizeRecommendationResponse(JSON.parse(jsonCandidate));
  } catch {
    const objectStart = jsonCandidate.indexOf("{");
    const objectEnd = jsonCandidate.lastIndexOf("}");

    if (objectStart === -1 || objectEnd === -1 || objectEnd <= objectStart) {
      throw new Error("Invalid recommendation response");
    }

    return normalizeRecommendationResponse(
      JSON.parse(jsonCandidate.slice(objectStart, objectEnd + 1)),
    );
  }
}

export function createRecommendationCompletionOptions(model: string) {
  return {
    model,
    max_completion_tokens: RECOMMENDATION_COMPLETION_TOKEN_BUDGET,
    temperature: 0.2,
    response_format: { type: "json_object" as const },
    ...(model.includes("gpt-oss")
      ? { reasoning_effort: "low" as const }
      : {}),
  };
}

export function createScreeningChatContext(
  result: ScreeningResult,
  aiRecommendation: ScreeningAiRecommendation | null,
): ScreeningChatContext {
  return {
    riskLevel: result.level,
    riskLabel: riskLabels[result.level] ?? result.title,
    normalizedRiskScore: result.percentage,
    summary: result.summary,
    recommendation: aiRecommendation?.recommendation ?? result.recommendation,
    factors: result.factors.map((factor) => factor.text).slice(0, 5),
  };
}
