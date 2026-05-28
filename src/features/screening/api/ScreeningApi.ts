import axios from "axios";

import type {
  ScreeningApiRequest,
  ScreeningApiResponse,
} from "@/features/screening/types/Screening";
import { normalizeLatestScreeningResponse } from "@/features/screening/utils/ApiContract";

const SCREENING_API_TIMEOUT_MS = 15_000;
const SCREENING_API_URL_MISSING = "SCREENING_API_URL_MISSING";
const SCREENING_PREDICT_PATH = "/predict";

// Client HTTP untuk consume API prediksi eksternal yang URL-nya dari env public.
const screeningApi = axios.create({
  timeout: SCREENING_API_TIMEOUT_MS,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

function getScreeningPredictUrl() {
  // Frontend mengambil base URL dari NEXT_PUBLIC_SCREENING_API_URL.
  const baseUrl = process.env.NEXT_PUBLIC_SCREENING_API_URL?.trim();

  if (!baseUrl) {
    throw new Error(SCREENING_API_URL_MISSING);
  }

  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");

  return normalizedBaseUrl.endsWith(SCREENING_PREDICT_PATH)
    ? normalizedBaseUrl
    : `${normalizedBaseUrl}${SCREENING_PREDICT_PATH}`;
}

function getApiErrorMessage(value: unknown) {
  if (typeof value === "object" && value !== null && "error" in value) {
    const error = value.error;

    if (typeof error === "string") {
      return error;
    }
  }

  if (typeof value === "object" && value !== null && "message" in value) {
    const message = value.message;

    if (typeof message === "string") {
      return message;
    }
  }

  if (typeof value === "object" && value !== null && "detail" in value) {
    const detail = value.detail;

    if (typeof detail === "string") {
      return detail;
    }
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "detail" in value &&
    Array.isArray(value.detail)
  ) {
    return "Data screening tidak sesuai format API.";
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
  // Payload dari hook dikirim ke endpoint /predict milik API screening.
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

  // Data response yang sudah valid dikembalikan ke hook useScreening.
  return normalizeLatestScreeningResponse(response.data);
}
