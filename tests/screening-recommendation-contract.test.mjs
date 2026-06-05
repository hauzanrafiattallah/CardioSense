import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createScreeningChatContext,
  createRecommendationRequestContext,
  createRecommendationCompletionOptions,
  normalizeRecommendationResponse,
  parseRecommendationCompletion,
  formatRecommendationAsBullets,
  getRecommendationBulletItems,
} from "../src/features/screening/utils/Recommendation.ts";

const completeValues = {
  age: "52",
  gender: "male",
  weight: "86",
  height: "171",
  abdominalCircumference: "98",
  totalCholesterol: "236",
  smokingStatus: "yes",
  diabetesStatus: "no",
  physicalActivity: "rare",
  familyHistory: "yes",
  systolicPressure: "142",
  diastolicPressure: "88",
};

const screeningResult = {
  eyebrow: "Hasil Skrining",
  title: "Risiko Sedang",
  level: "medium",
  percentage: 63.4,
  rawRiskScore: 18.91,
  overviewLabel: "Skor risiko ternormalisasi",
  factors: [
    {
      text: "Tekanan Darah Sistolik: 142 (kontribusi +0.456)",
      tone: "risk",
    },
    {
      text: "Aktivitas Fisik: Jarang (kontribusi +0.223)",
      tone: "risk",
    },
    {
      text: "Total Kolesterol: 236 (kontribusi +0.188)",
      tone: "risk",
    },
    {
      text: "Diabetes: Tidak ada (protektif -0.120)",
      tone: "protective",
    },
  ],
  summary:
    "Model memperkirakan risiko kardiovaskular sedang dari data yang dikirim.",
  recommendation: "Pantau tekanan darah dan kebiasaan harian secara berkala.",
};

test("creates a safe recommendation context from screening values and result", () => {
  assert.deepEqual(
    createRecommendationRequestContext(completeValues, screeningResult),
    {
      riskLevel: "medium",
      riskLabel: "Risiko Sedang",
      normalizedRiskScore: 63.4,
      rawRiskScore: 18.91,
      profile: {
        age: 52,
        gender: "Laki-laki",
        bmi: 29.4,
        waistToHeightRatio: 0.57,
        abdominalCircumference: 98,
        totalCholesterol: 236,
        bloodPressure: "142/88 mmHg",
        smokingStatus: "Ya",
        diabetesStatus: "Tidak ada",
        physicalActivity: "Jarang",
        familyHistory: "Ada",
      },
      factors: [
        "Tekanan Darah Sistolik: 142 (kontribusi +0.456)",
        "Aktivitas Fisik: Jarang (kontribusi +0.223)",
        "Total Kolesterol: 236 (kontribusi +0.188)",
        "Diabetes: Tidak ada (protektif -0.120)",
      ],
      baselineRecommendation:
        "Pantau tekanan darah dan kebiasaan harian secara berkala.",
    },
  );
});

test("normalizes the recommendation route response shape", () => {
  assert.deepEqual(
    normalizeRecommendationResponse({
      recommendation: "Fokus pada pemantauan tekanan darah dan aktivitas fisik.",
      followUpPrompt: "Saya ingin memahami hasil skrining saya lebih lanjut.",
    }),
    {
      recommendation:
        "- Fokus pada pemantauan tekanan darah dan aktivitas fisik.",
      followUpPrompt: "Saya ingin memahami hasil skrining saya lebih lanjut.",
    },
  );
});

test("formats paragraph recommendation as bullet points", () => {
  assert.equal(
    formatRecommendationAsBullets(
      "Anda berada pada risiko sedang dengan diabetes. Mulailah memantau tekanan darah, gula darah, dan kolesterol setiap 3-6 bulan. Tingkatkan aktivitas fisik dan berhenti merokok. Hasil ini bersifat edukatif dan bukan pengganti konsultasi medis.",
    ),
    [
      "- Anda berada pada risiko sedang dengan diabetes.",
      "- Mulailah memantau tekanan darah, gula darah, dan kolesterol setiap 3-6 bulan.",
      "- Tingkatkan aktivitas fisik dan berhenti merokok.",
      "- Hasil ini bersifat edukatif dan bukan pengganti konsultasi medis.",
    ].join("\n"),
  );
});

test("normalizes recommendation response into bullet points", () => {
  assert.deepEqual(
    normalizeRecommendationResponse({
      recommendation:
        "Pantau tekanan darah secara berkala. Tingkatkan aktivitas fisik.",
      followUpPrompt: "Saya ingin memahami hasil skrining saya lebih lanjut.",
    }),
    {
      recommendation:
        "- Pantau tekanan darah secara berkala.\n- Tingkatkan aktivitas fisik.",
      followUpPrompt: "Saya ingin memahami hasil skrining saya lebih lanjut.",
    },
  );
});

test("extracts recommendation bullet items for UI rendering", () => {
  assert.deepEqual(
    getRecommendationBulletItems(
      "- Pantau tekanan darah.\n- Tingkatkan aktivitas fisik.\n- Konsultasikan bila ada keluhan.",
    ),
    [
      "Pantau tekanan darah.",
      "Tingkatkan aktivitas fisik.",
      "Konsultasikan bila ada keluhan.",
    ],
  );
});

test("rejects an invalid recommendation route response", () => {
  assert.throws(
    () =>
      normalizeRecommendationResponse({
        recommendation: "",
        followUpPrompt: "lanjut",
      }),
    /Invalid recommendation response/,
  );
});

test("parses JSON recommendation content returned by the model", () => {
  assert.deepEqual(
    parseRecommendationCompletion(
      '```json\n{"recommendation":"Prioritaskan kontrol tekanan darah.","followUpPrompt":"Bantu jelaskan prioritas hasil saya."}\n```',
    ),
    {
      recommendation: "- Prioritaskan kontrol tekanan darah.",
      followUpPrompt: "Bantu jelaskan prioritas hasil saya.",
    },
  );
});

test("creates compact chat context from screening result and AI recommendation", () => {
  assert.deepEqual(
    createScreeningChatContext(screeningResult, {
      recommendation: "AI: Fokus pada tekanan darah dan aktivitas fisik.",
      followUpPrompt: "Bantu jelaskan hasil saya.",
    }),
    {
      riskLevel: "medium",
      riskLabel: "Risiko Sedang",
      normalizedRiskScore: 63.4,
      summary:
        "Model memperkirakan risiko kardiovaskular sedang dari data yang dikirim.",
      recommendation: "AI: Fokus pada tekanan darah dan aktivitas fisik.",
      factors: [
        "Tekanan Darah Sistolik: 142 (kontribusi +0.456)",
        "Aktivitas Fisik: Jarang (kontribusi +0.223)",
        "Total Kolesterol: 236 (kontribusi +0.188)",
        "Diabetes: Tidak ada (protektif -0.120)",
      ],
    },
  );
});

test("uses low reasoning effort and JSON mode for GPT-OSS recommendation generation", () => {
  assert.deepEqual(createRecommendationCompletionOptions("openai/gpt-oss-20b"), {
    model: "openai/gpt-oss-20b",
    max_completion_tokens: 700,
    temperature: 0.2,
    response_format: { type: "json_object" },
    reasoning_effort: "low",
  });
});
