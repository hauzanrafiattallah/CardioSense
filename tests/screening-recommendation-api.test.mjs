import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import { requestScreeningRecommendation } from "../src/features/screening/api/RecommendationApi.ts";

const originalFetch = globalThis.fetch;

const values = {
  age: "45",
  gender: "female",
  weight: "68",
  height: "162",
  abdominalCircumference: "82",
  totalCholesterol: "205",
  smokingStatus: "no",
  diabetesStatus: "no",
  physicalActivity: "moderate",
  familyHistory: "yes",
  systolicPressure: "132",
  diastolicPressure: "82",
};

const result = {
  eyebrow: "Hasil Skrining",
  title: "Risiko Sedang",
  level: "medium",
  percentage: 58,
  rawRiskScore: 12.4,
  overviewLabel: "Skor risiko ternormalisasi",
  factors: [],
  summary: "Model memperkirakan risiko sedang.",
  recommendation: "Pantau tekanan darah dan kebiasaan harian.",
};

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("requests a personalized recommendation from the internal route", async () => {
  globalThis.fetch = async (url, init) => {
    assert.equal(url, "/api/recommendation");
    assert.equal(init?.method, "POST");
    assert.deepEqual(JSON.parse(String(init?.body)), { values, result });

    return new Response(
      JSON.stringify({
        recommendation: "Pantau tekanan darah dan aktivitas fisik.",
        followUpPrompt: "Bantu jelaskan hasil skrining saya.",
      }),
      { status: 200 },
    );
  };

  assert.deepEqual(await requestScreeningRecommendation(values, result), {
    recommendation: "Pantau tekanan darah dan aktivitas fisik.",
    followUpPrompt: "Bantu jelaskan hasil skrining saya.",
  });
});

test("throws the route error message when recommendation request fails", async () => {
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ error: "Rekomendasi AI sedang penuh." }), {
      status: 429,
    });

  await assert.rejects(
    () => requestScreeningRecommendation(values, result),
    /Rekomendasi AI sedang penuh/,
  );
});
