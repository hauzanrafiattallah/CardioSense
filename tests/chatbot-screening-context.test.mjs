import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildScreeningContextPrompt,
  normalizeScreeningChatContext,
} from "../src/features/chatbot/utils/ScreeningContext.ts";

const context = {
  riskLevel: "medium",
  riskLabel: "Risiko Sedang",
  normalizedRiskScore: 63.4,
  summary: "Model memperkirakan risiko sedang.",
  recommendation: "Fokus pada tekanan darah dan aktivitas fisik.",
  factors: [
    "Tekanan Darah Sistolik: 142 (kontribusi +0.456)",
    "Aktivitas Fisik: Jarang (kontribusi +0.223)",
  ],
};

test("normalizes screening context for hidden chatbot use", () => {
  assert.deepEqual(normalizeScreeningChatContext(context), context);
});

test("rejects malformed screening context", () => {
  assert.equal(
    normalizeScreeningChatContext({
      ...context,
      normalizedRiskScore: 101,
    }),
    null,
  );
});

test("builds a compact hidden prompt for chatbot follow-up", () => {
  assert.equal(
    buildScreeningContextPrompt(context),
    [
      "Konteks hasil skrining terbaru pengguna:",
      "- Kategori: Risiko Sedang",
      "- Skor risiko ternormalisasi: 63.4%",
      "- Ringkasan: Model memperkirakan risiko sedang.",
      "- Rekomendasi saat ini: Fokus pada tekanan darah dan aktivitas fisik.",
      "- Faktor yang ditampilkan: Tekanan Darah Sistolik: 142 (kontribusi +0.456); Aktivitas Fisik: Jarang (kontribusi +0.223)",
      "Gunakan konteks ini hanya untuk menjawab pertanyaan lanjutan pengguna secara edukatif. Jangan tampilkan data mentah yang tidak diminta.",
    ].join("\n"),
  );
});
