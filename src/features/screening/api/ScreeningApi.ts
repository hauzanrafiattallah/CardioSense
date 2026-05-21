import axios from "axios";

import type {
  ScreeningApiRequest,
  ScreeningApiResponse,
  ScreeningApiRiskLevel,
} from "@/features/screening/types/Screening";

const SCREENING_API_TIMEOUT_MS = 15_000;
const SCREENING_API_URL_MISSING = "SCREENING_API_URL_MISSING";
const SCREENING_PREDICT_PATH = "/predict";

const screeningApi = axios.create({
  timeout: SCREENING_API_TIMEOUT_MS,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

function getScreeningPredictUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_SCREENING_API_URL?.trim();

  if (!baseUrl) {
    throw new Error(SCREENING_API_URL_MISSING);
  }

  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");

  return normalizedBaseUrl.endsWith(SCREENING_PREDICT_PATH)
    ? normalizedBaseUrl
    : `${normalizedBaseUrl}${SCREENING_PREDICT_PATH}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toFiniteNumber(value: unknown) {
  const parsedValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseFloat(value)
        : Number.NaN;

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function toPrediction(value: unknown): 0 | 1 | null {
  if (value === 0 || value === "0") return 0;
  if (value === 1 || value === "1") return 1;
  return null;
}

function toRiskLevel(value: unknown): ScreeningApiRiskLevel | null {
  if (value === "Low" || value === "Medium" || value === "High") {
    return value;
  }

  return null;
}

function normalizeScreeningResponse(value: unknown): ScreeningApiResponse {
  if (!isRecord(value)) {
    throw new Error("Invalid screening response");
  }

  const prediction = toPrediction(value.prediction);
  const probability = toFiniteNumber(value.probability);
  const riskLevel = toRiskLevel(value.risk_level);

  if (
    prediction === null ||
    probability === null ||
    probability < 0 ||
    probability > 1 ||
    riskLevel === null
  ) {
    throw new Error("Invalid screening response");
  }

  return {
    prediction,
    probability,
    risk_level: riskLevel,
  };
}

function getApiErrorMessage(value: unknown) {
  if (isRecord(value) && typeof value.error === "string") {
    return value.error;
  }

  if (isRecord(value) && typeof value.message === "string") {
    return value.message;
  }

  return "Screening request failed";
}

export function isScreeningApiCanceled(error: unknown) {
  return (
    axios.isCancel(error) ||
    (axios.isAxiosError(error) && error.code === "ERR_CANCELED")
  );
}

export function isScreeningApiUrlMissing(error: unknown) {
  return error instanceof Error && error.message === SCREENING_API_URL_MISSING;
}

export async function requestScreeningPrediction(
  payload: ScreeningApiRequest,
  signal?: AbortSignal,
): Promise<ScreeningApiResponse> {
  const response = await screeningApi.post<unknown>(
    getScreeningPredictUrl(),
    payload,
    {
      signal,
      validateStatus: () => true,
    },
  );

  if (response.status < 200 || response.status >= 300) {
    throw new Error(getApiErrorMessage(response.data));
  }

  return normalizeScreeningResponse(response.data);
}
