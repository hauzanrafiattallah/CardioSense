import { Activity, ShieldAlert, ShieldCheck, Stethoscope } from "lucide-react";

import type {
  RiskLevel,
  ScreeningApiRequest,
  ScreeningApiResponse,
  ScreeningErrors,
  ScreeningFactor,
  ScreeningFormValues,
  ScreeningResult,
} from "@/features/screening/types/Screening";

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
  if (level === "Medium") return "medium";
  return "low";
}

function getCholesterolApiValue(value: string) {
  if (value === "normal") return 1;
  if (value === "borderline") return 2;
  if (value === "high") return 3;
  return Number.NaN;
}

export function validateScreeningValues(values: ScreeningFormValues) {
  const errors: ScreeningErrors = {};
  const age = toNumber(values.age);
  const systolicPressure = toNumber(values.systolicPressure);
  const diastolicPressure = toNumber(values.diastolicPressure);

  if (!values.age) {
    errors.age = "Usia wajib diisi.";
  } else if (!Number.isFinite(age) || age < 18 || age > 100) {
    errors.age = "Masukkan usia 18-100 tahun.";
  }

  if (!values.gender) {
    errors.gender = "Pilih jenis kelamin.";
  }

  if (!values.systolicPressure) {
    errors.systolicPressure = "Tekanan sistolik wajib diisi.";
  } else if (
    !Number.isFinite(systolicPressure) ||
    systolicPressure < 80 ||
    systolicPressure > 240
  ) {
    errors.systolicPressure = "Masukkan sistolik 80-240 mmHg.";
  }

  if (!values.diastolicPressure) {
    errors.diastolicPressure = "Tekanan diastolik wajib diisi.";
  } else if (
    !Number.isFinite(diastolicPressure) ||
    diastolicPressure < 50 ||
    diastolicPressure > 140
  ) {
    errors.diastolicPressure = "Masukkan diastolik 50-140 mmHg.";
  }

  if (
    !errors.systolicPressure &&
    !errors.diastolicPressure &&
    diastolicPressure >= systolicPressure
  ) {
    errors.diastolicPressure =
      "Tekanan diastolik harus lebih rendah dari sistolik.";
  }

  if (!values.cholesterol) {
    errors.cholesterol = "Pilih status kolesterol.";
  } else if (values.cholesterol === "unknown") {
    errors.cholesterol =
      "Model membutuhkan status kolesterol: normal, ambang batas, atau tinggi.";
  }

  if (!values.smokingStatus) {
    errors.smokingStatus = "Pilih status merokok.";
  }

  if (!values.physicalActivity) {
    errors.physicalActivity = "Pilih tingkat aktivitas fisik.";
  }

  if (!values.familyHistory) {
    errors.familyHistory = "Pilih riwayat keluarga.";
  }

  return errors;
}

export function createScreeningPayload(
  values: ScreeningFormValues,
): ScreeningApiRequest {
  return {
    age_year: toNumber(values.age),
    ap_hi: toNumber(values.systolicPressure),
    ap_lo: toNumber(values.diastolicPressure),
    cholesterol: getCholesterolApiValue(values.cholesterol),
  };
}

function getScreeningFactors(values: ScreeningFormValues) {
  const factors: ScreeningFactor[] = [];
  const age = toNumber(values.age);
  const systolicPressure = toNumber(values.systolicPressure);
  const diastolicPressure = toNumber(values.diastolicPressure);

  if (age >= 45) {
    factors.push({
      icon: ShieldAlert,
      text: "Usia yang lebih tinggi dapat berkaitan dengan peningkatan risiko kardiovaskular.",
    });
  }

  if (systolicPressure >= 130 || diastolicPressure >= 80) {
    factors.push({
      icon: Stethoscope,
      text: "Tekanan darah perlu dipantau dan dikonsultasikan bila berulang tinggi.",
    });
  }

  if (values.cholesterol === "high" || values.cholesterol === "borderline") {
    factors.push({
      icon: ShieldAlert,
      text: "Status kolesterol dapat memengaruhi estimasi risiko.",
    });
  }

  if (values.smokingStatus === "current") {
    factors.push({
      icon: ShieldAlert,
      text: "Kebiasaan merokok termasuk faktor risiko yang dapat dikendalikan.",
    });
  }

  if (values.physicalActivity !== "routine") {
    factors.push({
      icon: Activity,
      text: "Aktivitas fisik yang belum rutin dapat meningkatkan risiko.",
    });
  }

  if (values.familyHistory === "yes") {
    factors.push({
      icon: ShieldCheck,
      text: "Riwayat keluarga membuat pemantauan kesehatan lebih penting.",
    });
  }

  return factors;
}

export function createScreeningResult(
  values: ScreeningFormValues,
  apiResult: ScreeningApiResponse,
): ScreeningResult {
  const level = getAppRiskLevel(apiResult.risk_level);
  const riskMeta = getRiskLevelMeta(level);
  const percentage = clamp(
    Math.round(apiResult.probability * 1000) / 10,
    0,
    100,
  );
  const factors = getScreeningFactors(values);
  const predictionSummary =
    apiResult.prediction === 1
      ? "Model mendeteksi indikasi risiko penyakit kardiovaskular dari data utama yang dikirim."
      : "Model tidak mendeteksi indikasi penyakit kardiovaskular dari data utama yang dikirim.";

  return {
    eyebrow: "Hasil Skrining",
    title: riskMeta.label,
    level,
    percentage,
    overviewLabel: "Probabilitas model",
    factors: factors.slice(0, 4),
    summary:
      `${predictionSummary} Faktor gaya hidup di bawah dipakai sebagai edukasi tambahan, bukan input model.`,
    recommendation:
      level === "high"
        ? "Sebaiknya konsultasikan hasil ini dengan tenaga kesehatan profesional dan pertimbangkan pemeriksaan tekanan darah, kolesterol, serta gula darah."
        : level === "medium"
          ? "Pantau tekanan darah dan kebiasaan harian secara berkala. Pertimbangkan konsultasi bila ada keluhan atau faktor risiko tambahan."
        : "Gunakan hasil ini sebagai bahan edukasi dan lanjutkan kebiasaan sehat. Konsultasikan dengan tenaga kesehatan bila memiliki keluhan atau faktor risiko tambahan.",
  };
}
