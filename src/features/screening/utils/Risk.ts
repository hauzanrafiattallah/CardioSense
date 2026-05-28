import { Activity, ShieldAlert, ShieldCheck, Stethoscope } from "lucide-react";

import type {
  RiskLevel,
  ScreeningApiFactor,
  ScreeningApiRequest,
  ScreeningApiResponse,
  ScreeningErrors,
  ScreeningFactor,
  ScreeningFieldName,
  ScreeningFormValues,
  ScreeningResult,
} from "@/features/screening/types/Screening";
import { createLatestScreeningPayload } from "@/features/screening/utils/ApiContract";

export const riskLevelMeta = {
  low: {
    label: "Risiko Rendah",
    tone: "green",
    iconClassName: "bg-[#22C55E]/12 text-[#22C55E]",
    progressClassName: "bg-[linear-gradient(90deg,#22C55E,#35B8E5)]",
  },
  medium: {
    label: "Risiko Sedang",
    tone: "amber",
    iconClassName: "bg-[#F59E0B]/12 text-[#F59E0B]",
    progressClassName: "bg-[linear-gradient(90deg,#F59E0B,#F43F4E)]",
  },
  high: {
    label: "Risiko Tinggi",
    tone: "red",
    iconClassName: "bg-[#C51624]/12 text-[#C51624]",
    progressClassName: "bg-[linear-gradient(90deg,#F43F4E,#C51624)]",
  },
} as const satisfies Record<
  RiskLevel,
  {
    label: string;
    tone: "green" | "amber" | "red";
    iconClassName: string;
    progressClassName: string;
  }
>;

const modelFactorLabels: Record<string, string> = {
  "Body Mass Index": "Indeks Massa Tubuh",
  "Total Cholesterol": "Total Kolesterol",
  "Smoking Status": "Status Merokok",
  Diabetes: "Diabetes",
  "Physical Activity": "Aktivitas Fisik",
  "Family History of Cardiovascular Disease": "Riwayat Keluarga CVD",
  "Waist-to-Height Ratio": "Rasio Pinggang terhadap Tinggi",
  "Systolic Blood Pressure": "Tekanan Darah Sistolik",
  "Diastolic Blood Pressure": "Tekanan Darah Diastolik",
  Age: "Usia",
  Sex: "Jenis Kelamin",
};

export function getRiskLevelMeta(level: RiskLevel) {
  return riskLevelMeta[level];
}

function toNumber(value: string) {
  return Number.parseFloat(value);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getAppRiskLevel(level: ScreeningApiResponse["risk_level"]): RiskLevel {
  if (level === "High") return "high";
  if (level === "Moderate") return "medium";
  return "low";
}

function requireSelectField(
  values: ScreeningFormValues,
  errors: ScreeningErrors,
  name: ScreeningFieldName,
  message: string,
) {
  if (!values[name]) {
    errors[name] = message;
  }
}

function validateNumericField(
  values: ScreeningFormValues,
  errors: ScreeningErrors,
  name: ScreeningFieldName,
  min: number,
  max: number,
  emptyMessage: string,
  rangeMessage: string,
) {
  const value = toNumber(values[name]);

  if (!values[name]) {
    errors[name] = emptyMessage;
  } else if (!Number.isFinite(value) || value < min || value > max) {
    errors[name] = rangeMessage;
  }
}

export function validateScreeningValues(values: ScreeningFormValues) {
  // Validasi lokal mencegah request API saat input belum lengkap atau tidak masuk akal.
  const errors: ScreeningErrors = {};

  validateNumericField(
    values,
    errors,
    "age",
    18,
    100,
    "Usia wajib diisi.",
    "Masukkan usia 18-100 tahun.",
  );
  requireSelectField(values, errors, "gender", "Pilih jenis kelamin.");
  validateNumericField(
    values,
    errors,
    "weight",
    30,
    250,
    "Berat badan wajib diisi.",
    "Masukkan berat badan 30-250 kg.",
  );
  validateNumericField(
    values,
    errors,
    "height",
    120,
    220,
    "Tinggi badan wajib diisi.",
    "Masukkan tinggi badan 120-220 cm.",
  );
  validateNumericField(
    values,
    errors,
    "abdominalCircumference",
    40,
    180,
    "Lingkar perut wajib diisi.",
    "Masukkan lingkar perut 40-180 cm.",
  );
  validateNumericField(
    values,
    errors,
    "totalCholesterol",
    100,
    400,
    "Total kolesterol wajib diisi.",
    "Masukkan total kolesterol 100-400 mg/dL.",
  );
  requireSelectField(values, errors, "smokingStatus", "Pilih status merokok.");
  requireSelectField(values, errors, "diabetesStatus", "Pilih status diabetes.");
  requireSelectField(
    values,
    errors,
    "physicalActivity",
    "Pilih tingkat aktivitas fisik.",
  );
  requireSelectField(
    values,
    errors,
    "familyHistory",
    "Pilih riwayat keluarga.",
  );
  validateNumericField(
    values,
    errors,
    "systolicPressure",
    80,
    240,
    "Tekanan sistolik wajib diisi.",
    "Masukkan sistolik 80-240 mmHg.",
  );
  validateNumericField(
    values,
    errors,
    "diastolicPressure",
    50,
    140,
    "Tekanan diastolik wajib diisi.",
    "Masukkan diastolik 50-140 mmHg.",
  );

  const systolicPressure = toNumber(values.systolicPressure);
  const diastolicPressure = toNumber(values.diastolicPressure);

  if (
    !errors.systolicPressure &&
    !errors.diastolicPressure &&
    diastolicPressure >= systolicPressure
  ) {
    errors.diastolicPressure =
      "Tekanan diastolik harus lebih rendah dari sistolik.";
  }

  return errors;
}

export function createScreeningPayload(
  values: ScreeningFormValues,
): ScreeningApiRequest {
  return createLatestScreeningPayload(values);
}

function getScreeningFactors(values: ScreeningFormValues) {
  // Cadangan edukatif saat API tidak mengembalikan faktor model.
  const factors: ScreeningFactor[] = [];
  const age = toNumber(values.age);
  const systolicPressure = toNumber(values.systolicPressure);
  const diastolicPressure = toNumber(values.diastolicPressure);
  const totalCholesterol = toNumber(values.totalCholesterol);
  const abdominalCircumference = toNumber(values.abdominalCircumference);
  const height = toNumber(values.height);
  const waistToHeightRatio = abdominalCircumference / height;

  if (age >= 45) {
    factors.push({
      icon: ShieldAlert,
      tone: "education",
      text: "Usia yang lebih tinggi dapat berkaitan dengan peningkatan risiko kardiovaskular.",
    });
  }

  if (systolicPressure >= 130 || diastolicPressure >= 80) {
    factors.push({
      icon: Stethoscope,
      tone: "education",
      text: "Tekanan darah perlu dipantau dan dikonsultasikan bila berulang tinggi.",
    });
  }

  if (totalCholesterol >= 200) {
    factors.push({
      icon: ShieldAlert,
      tone: "education",
      text: "Total kolesterol berada pada area yang perlu diperhatikan.",
    });
  }

  if (waistToHeightRatio >= 0.5) {
    factors.push({
      icon: ShieldAlert,
      tone: "education",
      text: "Rasio lingkar perut terhadap tinggi badan dapat berkaitan dengan risiko metabolik.",
    });
  }

  if (values.smokingStatus === "yes") {
    factors.push({
      icon: ShieldAlert,
      tone: "education",
      text: "Kebiasaan merokok termasuk faktor risiko yang dapat dikendalikan.",
    });
  }

  if (values.diabetesStatus === "yes") {
    factors.push({
      icon: Stethoscope,
      tone: "education",
      text: "Riwayat diabetes membuat pemantauan kardiovaskular lebih penting.",
    });
  }

  if (values.physicalActivity !== "routine") {
    factors.push({
      icon: Activity,
      tone: "education",
      text: "Aktivitas fisik yang belum rutin dapat meningkatkan risiko.",
    });
  }

  if (values.familyHistory === "yes") {
    factors.push({
      icon: ShieldCheck,
      tone: "education",
      text: "Riwayat keluarga membuat pemantauan kesehatan lebih penting.",
    });
  }

  return factors;
}

function getModelFactorLabel(feature: string) {
  return modelFactorLabels[feature] ?? feature;
}

function formatImpact(impact: number) {
  return `${impact > 0 ? "+" : ""}${impact.toFixed(3)}`;
}

function formatModelValue(factor: ScreeningApiFactor) {
  if (factor.feature === "Sex") {
    return factor.value === 0 ? "Laki-laki" : "Perempuan";
  }

  if (factor.feature === "Smoking Status") {
    return factor.value === 1 ? "Ya" : "Tidak";
  }

  if (factor.feature === "Diabetes") {
    return factor.value === 1 ? "Ada" : "Tidak ada";
  }

  if (factor.feature === "Physical Activity") {
    if (factor.value === 3) return "Rutin";
    if (factor.value === 2) return "Kadang-kadang";
    return "Jarang";
  }

  if (factor.feature === "Family History of Cardiovascular Disease") {
    return factor.value === 1 ? "Ada" : "Tidak ada";
  }

  if (factor.feature === "Waist-to-Height Ratio") {
    return factor.value.toFixed(2);
  }

  return Number.isInteger(factor.value)
    ? String(factor.value)
    : factor.value.toFixed(1);
}

function createModelFactor(
  factor: ScreeningApiFactor,
  tone: "risk" | "protective",
): ScreeningFactor {
  const label = getModelFactorLabel(factor.feature);
  const value = formatModelValue(factor);
  const impactLabel = tone === "risk" ? "kontribusi" : "protektif";

  return {
    icon: tone === "risk" ? ShieldAlert : ShieldCheck,
    tone,
    text: `${label}: ${value} (${impactLabel} ${formatImpact(factor.impact)})`,
  };
}

function getModelFactors(apiResult: ScreeningApiResponse) {
  const topRiskFactors = apiResult.top_risk_factors
    .slice(0, 3)
    .map((factor) => createModelFactor(factor, "risk"));
  const protectiveFactors = apiResult.protective_factors
    .slice(0, 2)
    .map((factor) => createModelFactor(factor, "protective"));

  return [...topRiskFactors, ...protectiveFactors];
}

export function createScreeningResult(
  values: ScreeningFormValues,
  apiResult: ScreeningApiResponse,
): ScreeningResult {
  // Response API prediksi terbaru diubah menjadi format result yang mudah dirender UI.
  const level = getAppRiskLevel(apiResult.risk_level);
  const riskMeta = getRiskLevelMeta(level);
  const percentage = clamp(
    Math.round(apiResult.normalized_risk_score * 10) / 10,
    0,
    100,
  );
  const rawRiskScore = Math.round(apiResult.raw_risk_score * 100) / 100;
  const modelFactors = getModelFactors(apiResult);
  const factors =
    modelFactors.length > 0 ? modelFactors : getScreeningFactors(values);
  const levelSummary =
    level === "high"
      ? "Model memperkirakan risiko kardiovaskular tinggi dari data yang dikirim."
      : level === "medium"
        ? "Model memperkirakan risiko kardiovaskular sedang dari data yang dikirim."
        : "Model memperkirakan risiko kardiovaskular rendah dari data yang dikirim.";

  return {
    eyebrow: "Hasil Skrining",
    title: riskMeta.label,
    level,
    percentage,
    rawRiskScore,
    overviewLabel: "Skor risiko ternormalisasi",
    factors: factors.slice(0, 5),
    summary:
      `${levelSummary} Skor mentah model: ${rawRiskScore}. Faktor di bawah berasal dari kontribusi model, lalu dipakai sebagai edukasi awal.`,
    recommendation:
      level === "high"
        ? "Sebaiknya konsultasikan hasil ini dengan tenaga kesehatan profesional dan pertimbangkan pemeriksaan tekanan darah, kolesterol, serta gula darah."
        : level === "medium"
          ? "Pantau tekanan darah dan kebiasaan harian secara berkala. Pertimbangkan konsultasi bila ada keluhan atau faktor risiko tambahan."
          : "Gunakan hasil ini sebagai bahan edukasi dan lanjutkan kebiasaan sehat. Konsultasikan dengan tenaga kesehatan bila memiliki keluhan atau faktor risiko tambahan.",
  };
}
