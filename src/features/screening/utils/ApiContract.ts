import type {
  ScreeningApiFactor,
  ScreeningApiRequest,
  ScreeningApiResponse,
  ScreeningApiRiskLevel,
  ScreeningFormValues,
} from "@/features/screening/types/Screening";

const genderCodes = {
  female: 0,
  male: 1,
} as const;

const smokingStatusCodes = {
  never: 0,
  former: 1,
  current: 2,
} as const;

const diabetesStatusCodes = {
  no: 0,
  yes: 1,
} as const;

const physicalActivityCodes = {
  rare: 0,
  moderate: 1,
  routine: 2,
} as const;

const familyHistoryCodes = {
  no: 0,
  yes: 1,
} as const;

const apiRiskLevels = new Set<ScreeningApiRiskLevel>([
  "Low",
  "Moderate",
  "High",
]);

function toFiniteNumber(value: unknown) {
  const parsedValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseFloat(value)
        : Number.NaN;

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toCode<T extends Record<string, number>>(value: string, codes: T) {
  return value in codes ? codes[value as keyof T] : Number.NaN;
}

function normalizeFactor(value: unknown): ScreeningApiFactor | null {
  if (!isRecord(value) || typeof value.feature !== "string") {
    return null;
  }

  const factorValue = toFiniteNumber(value.value);
  const impact = toFiniteNumber(value.impact);

  if (factorValue === null || impact === null) {
    return null;
  }

  return {
    feature: value.feature,
    value: factorValue,
    impact,
  };
}

function normalizeFactors(value: unknown): ScreeningApiFactor[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const factors = value.map(normalizeFactor);

  if (factors.some((factor) => factor === null)) {
    return null;
  }

  return factors as ScreeningApiFactor[];
}

export function createLatestScreeningPayload(
  values: ScreeningFormValues,
): ScreeningApiRequest {
  return {
    sex: toCode(values.gender, genderCodes),
    age: Number.parseFloat(values.age),
    weight: Number.parseFloat(values.weight),
    height: Number.parseFloat(values.height),
    abdominal_circumference: Number.parseFloat(values.abdominalCircumference),
    total_cholesterol: Number.parseFloat(values.totalCholesterol),
    smoking_status: toCode(values.smokingStatus, smokingStatusCodes),
    diabetes_status: toCode(values.diabetesStatus, diabetesStatusCodes),
    physical_activity_level: toCode(
      values.physicalActivity,
      physicalActivityCodes,
    ),
    family_history_cvd: toCode(values.familyHistory, familyHistoryCodes),
    systolic_bp: Number.parseFloat(values.systolicPressure),
    diastolic_bp: Number.parseFloat(values.diastolicPressure),
  };
}

export function normalizeLatestScreeningResponse(
  value: unknown,
): ScreeningApiResponse {
  if (!isRecord(value)) {
    throw new Error("Invalid screening response");
  }

  const rawRiskScore = toFiniteNumber(value.raw_risk_score);
  const normalizedRiskScore = toFiniteNumber(value.normalized_risk_score);
  const riskLevel = value.risk_level;
  const topRiskFactors = normalizeFactors(value.top_risk_factors);
  const protectiveFactors = normalizeFactors(value.protective_factors);

  if (
    rawRiskScore === null ||
    normalizedRiskScore === null ||
    normalizedRiskScore < 0 ||
    normalizedRiskScore > 100 ||
    typeof riskLevel !== "string" ||
    !apiRiskLevels.has(riskLevel as ScreeningApiRiskLevel) ||
    topRiskFactors === null ||
    protectiveFactors === null
  ) {
    throw new Error("Invalid screening response");
  }

  return {
    raw_risk_score: rawRiskScore,
    normalized_risk_score: normalizedRiskScore,
    risk_level: riskLevel as ScreeningApiRiskLevel,
    top_risk_factors: topRiskFactors,
    protective_factors: protectiveFactors,
  };
}
