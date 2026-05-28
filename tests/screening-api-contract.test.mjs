import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createLatestScreeningPayload,
  normalizeLatestScreeningResponse,
} from "../src/features/screening/utils/ApiContract.ts";

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
