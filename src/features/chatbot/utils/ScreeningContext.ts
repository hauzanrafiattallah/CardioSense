import type {
  RiskLevel,
  ScreeningChatContext,
} from "../../screening/types/Screening";

export const SCREENING_CHAT_CONTEXT_EVENT =
  "cardiosense:screening-chat-context";

export type ScreeningChatContextEventDetail = {
  prompt: string;
  context: ScreeningChatContext;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isRiskLevel(value: unknown): value is RiskLevel {
  return value === "low" || value === "medium" || value === "high";
}

export function normalizeScreeningChatContext(
  value: unknown,
): ScreeningChatContext | null {
  if (!isRecord(value) || !isRiskLevel(value.riskLevel)) {
    return null;
  }

  if (
    typeof value.riskLabel !== "string" ||
    typeof value.normalizedRiskScore !== "number" ||
    value.normalizedRiskScore < 0 ||
    value.normalizedRiskScore > 100 ||
    typeof value.summary !== "string" ||
    typeof value.recommendation !== "string" ||
    !Array.isArray(value.factors) ||
    value.factors.some((factor) => typeof factor !== "string")
  ) {
    return null;
  }

  return {
    riskLevel: value.riskLevel,
    riskLabel: value.riskLabel.slice(0, 80),
    normalizedRiskScore: value.normalizedRiskScore,
    summary: value.summary.slice(0, 500),
    recommendation: value.recommendation.slice(0, 1_500),
    factors: value.factors.slice(0, 5).map((factor) => factor.slice(0, 240)),
  };
}

export function buildScreeningContextPrompt(context: ScreeningChatContext) {
  const factors = context.factors.length > 0 ? context.factors.join("; ") : "-";

  return [
    "Konteks hasil skrining terbaru pengguna:",
    `- Kategori: ${context.riskLabel}`,
    `- Skor risiko ternormalisasi: ${context.normalizedRiskScore}%`,
    `- Ringkasan: ${context.summary}`,
    `- Rekomendasi saat ini: ${context.recommendation}`,
    `- Faktor yang ditampilkan: ${factors}`,
    "Gunakan konteks ini hanya untuk menjawab pertanyaan lanjutan pengguna secara edukatif. Jangan tampilkan data mentah yang tidak diminta.",
  ].join("\n");
}

export function getScreeningChatContextEventDetail(
  event: Event,
): ScreeningChatContextEventDetail | null {
  if (!(event instanceof CustomEvent) || !isRecord(event.detail)) {
    return null;
  }

  const context = normalizeScreeningChatContext(event.detail.context);
  const prompt =
    typeof event.detail.prompt === "string" ? event.detail.prompt.trim() : "";

  if (!context || !prompt) {
    return null;
  }

  return {
    prompt: prompt.slice(0, 240),
    context,
  };
}
