import { Activity, ShieldAlert, ShieldCheck, Stethoscope } from "lucide-react";

import type {
  RiskLevel,
  ScreeningErrors,
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
  return Number.parseInt(value, 10);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getAgeScore(age: number) {
  if (age >= 65) return 36;
  if (age >= 55) return 28;
  if (age >= 45) return 20;
  if (age >= 35) return 12;
  return 5;
}

function getBloodPressureScore(systolic: number, diastolic: number) {
  if (systolic >= 180 || diastolic >= 120) return 30;
  if (systolic >= 140 || diastolic >= 90) return 22;
  if (systolic >= 130 || diastolic >= 80) return 14;
  return 4;
}

function getRiskLevel(percentage: number): RiskLevel {
  if (percentage >= 65) return "high";
  if (percentage >= 35) return "medium";
  return "low";
}

export function validateScreeningValues(values: ScreeningFormValues) {
  const errors: ScreeningErrors = {};
  const age = toNumber(values.age);
  const systolicPressure = toNumber(values.systolicPressure);
  const diastolicPressure = toNumber(values.diastolicPressure);

  if (!values.age) {
    errors.age = "Usia wajib diisi.";
  } else if (Number.isNaN(age) || age < 18 || age > 100) {
    errors.age = "Masukkan usia 18-100 tahun.";
  }

  if (!values.gender) {
    errors.gender = "Pilih jenis kelamin.";
  }

  if (!values.systolicPressure) {
    errors.systolicPressure = "Tekanan sistolik wajib diisi.";
  } else if (
    Number.isNaN(systolicPressure) ||
    systolicPressure < 80 ||
    systolicPressure > 240
  ) {
    errors.systolicPressure = "Masukkan sistolik 80-240 mmHg.";
  }

  if (!values.diastolicPressure) {
    errors.diastolicPressure = "Tekanan diastolik wajib diisi.";
  } else if (
    Number.isNaN(diastolicPressure) ||
    diastolicPressure < 50 ||
    diastolicPressure > 140
  ) {
    errors.diastolicPressure = "Masukkan diastolik 50-140 mmHg.";
  }

  if (!values.cholesterol) {
    errors.cholesterol = "Pilih status kolesterol.";
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

export function calculateScreeningRisk(
  values: ScreeningFormValues,
): ScreeningResult {
  const age = toNumber(values.age);
  const systolicPressure = toNumber(values.systolicPressure);
  const diastolicPressure = toNumber(values.diastolicPressure);

  const score =
    getAgeScore(age) +
    getBloodPressureScore(systolicPressure, diastolicPressure) +
    (values.gender === "male" ? 5 : 0) +
    (values.cholesterol === "high"
      ? 18
      : values.cholesterol === "borderline"
        ? 9
        : values.cholesterol === "unknown"
          ? 4
          : 0) +
    (values.smokingStatus === "current"
      ? 18
      : values.smokingStatus === "former"
        ? 8
        : 0) +
    (values.physicalActivity === "rare"
      ? 12
      : values.physicalActivity === "moderate"
        ? 6
        : 0) +
    (values.familyHistory === "yes"
      ? 12
      : values.familyHistory === "unknown"
        ? 4
        : 0);

  const percentage = clamp(score, 8, 95);
  const level = getRiskLevel(percentage);
  const riskMeta = getRiskLevelMeta(level);
  const factors = [];

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

  return {
    eyebrow: "Hasil Skrining",
    title: riskMeta.label,
    level,
    percentage,
    overviewLabel: "Estimasi risiko",
    factors: factors.slice(0, 4),
    summary:
      "Hasil ini adalah estimasi risiko awal berdasarkan data yang kamu isi, bukan diagnosis medis atau hasil pasti.",
    recommendation:
      level === "high"
        ? "Sebaiknya konsultasikan hasil ini dengan tenaga kesehatan profesional dan pertimbangkan pemeriksaan tekanan darah, kolesterol, serta gula darah."
        : "Gunakan hasil ini sebagai bahan edukasi dan lanjutkan kebiasaan sehat. Konsultasikan dengan tenaga kesehatan bila memiliki keluhan atau faktor risiko tambahan.",
  };
}
