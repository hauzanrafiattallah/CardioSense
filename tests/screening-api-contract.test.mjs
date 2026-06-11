import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";
import { pathToFileURL } from "node:url";

import {
  createLatestScreeningPayload,
  normalizeLatestScreeningResponse,
} from "../src/features/screening/utils/ApiContract.ts";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (!specifier.startsWith("@/")) {
      return nextResolve(specifier, context);
    }

    return nextResolve(
      pathToFileURL(`./src/${specifier.slice(2)}.ts`).href,
      context,
    );
  },
});

const { createScreeningResult, validateScreeningValues } = await import(
  "../src/features/screening/utils/Risk.ts"
);

const completeValues = {
  age: "45",
  gender: "male",
  weight: "72.5",
  height: "170",
  abdominalCircumference: "91",
  totalCholesterol: "214",
  smokingStatus: "yes",
  diabetesStatus: "yes",
  physicalActivity: "rare",
  familyHistory: "yes",
  systolicPressure: "138",
  diastolicPressure: "86",
};

test("creates the latest FastAPI payload from screening form values", () => {
  assert.deepEqual(createLatestScreeningPayload(completeValues), {
    sex: 0,
    age: 45,
    weight: 72.5,
    height: 170,
    abdominal_circumference: 91,
    total_cholesterol: 214,
    smoking_status: 1,
    diabetes_status: 1,
    physical_activity_level: 1,
    family_history_cvd: 1,
    systolic_bp: 138,
    diastolic_bp: 86,
  });
});

test("sends null total cholesterol when the screening form leaves it empty", () => {
  assert.deepEqual(
    createLatestScreeningPayload({
      ...completeValues,
      totalCholesterol: "",
    }),
    {
      sex: 0,
      age: 45,
      weight: 72.5,
      height: 170,
      abdominal_circumference: 91,
      total_cholesterol: null,
      smoking_status: 1,
      diabetes_status: 1,
      physical_activity_level: 1,
      family_history_cvd: 1,
      systolic_bp: 138,
      diastolic_bp: 86,
    },
  );
});

test("allows total cholesterol to be omitted during local validation", () => {
  assert.equal(
    validateScreeningValues({
      ...completeValues,
      totalCholesterol: "",
    }).totalCholesterol,
    undefined,
  );
});

test("creates the same payload shape as the backend example", () => {
  assert.deepEqual(
    createLatestScreeningPayload({
      age: "52.4",
      gender: "male",
      weight: "90.1",
      height: "183.0",
      abdominalCircumference: "106.7",
      totalCholesterol: "103.0",
      smokingStatus: "no",
      diabetesStatus: "no",
      physicalActivity: "routine",
      familyHistory: "yes",
      systolicPressure: "104",
      diastolicPressure: "77",
    }),
    {
      sex: 0,
      age: 52.4,
      weight: 90.1,
      height: 183,
      abdominal_circumference: 106.7,
      total_cholesterol: 103,
      smoking_status: 0,
      diabetes_status: 0,
      physical_activity_level: 3,
      family_history_cvd: 1,
      systolic_bp: 104,
      diastolic_bp: 77,
    },
  );
});

test("renders missing cholesterol factor with a readable Indonesian label", () => {
  const result = createScreeningResult(
    {
      ...completeValues,
      totalCholesterol: "",
    },
    {
      raw_risk_score: 19,
      normalized_risk_score: 72,
      risk_level: "High",
      top_risk_factors: [
        {
          feature: "Missing Total Cholesterol",
          value: 1,
          impact: 0.314,
        },
      ],
      protective_factors: [],
    },
  );

  assert.equal(
    result.factors[0].text,
    "Total Kolesterol Belum Diisi: Belum diisi (kontribusi +0.314)",
  );
});

test("normalizes the latest FastAPI response shape", () => {
  assert.deepEqual(
    normalizeLatestScreeningResponse({
      raw_risk_score: "18.912",
      normalized_risk_score: "63.4",
      risk_level: "Moderate",
      top_risk_factors: [
        {
          feature: "Systolic Blood Pressure",
          value: "138",
          impact: "0.456",
        },
      ],
      protective_factors: [
        {
          feature: "Physical Activity",
          value: 2,
          impact: -0.12,
        },
      ],
    }),
    {
      raw_risk_score: 18.912,
      normalized_risk_score: 63.4,
      risk_level: "Moderate",
      top_risk_factors: [
        {
          feature: "Systolic Blood Pressure",
          value: 138,
          impact: 0.456,
        },
      ],
      protective_factors: [
        {
          feature: "Physical Activity",
          value: 2,
          impact: -0.12,
        },
      ],
    },
  );
});

test("rejects unknown risk levels from the screening API", () => {
  assert.throws(
    () =>
      normalizeLatestScreeningResponse({
        raw_risk_score: 18,
        normalized_risk_score: 63,
        risk_level: "Medium",
        top_risk_factors: [],
        protective_factors: [],
      }),
    /Invalid screening response/,
  );
});
