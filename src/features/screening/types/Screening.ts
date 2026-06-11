import type { LucideIcon } from "lucide-react";

// Tipe bersama untuk menjaga bentuk data tetap sama di form, API, util, dan result UI.
export type RiskLevel = "low" | "medium" | "high";
export type ScreeningApiRiskLevel = "Low" | "Moderate" | "High";

export type ScreeningFormValues = {
  age: string;
  gender: string;
  weight: string;
  height: string;
  abdominalCircumference: string;
  totalCholesterol: string;
  diabetesStatus: string;
  systolicPressure: string;
  diastolicPressure: string;
  smokingStatus: string;
  physicalActivity: string;
  familyHistory: string;
};

export type ScreeningFieldName = keyof ScreeningFormValues;

export type ScreeningFieldOption = {
  label: string;
  value: string;
};

export type ScreeningField = {
  name: ScreeningFieldName;
  label: string;
  type: "number" | "select";
  placeholder: string;
  options?: ScreeningFieldOption[];
  min?: number;
  max?: number;
  step?: number | string;
  inputMode?: "numeric" | "decimal";
};

export type ScreeningFactor = {
  icon: LucideIcon;
  text: string;
  tone?: "risk" | "protective" | "education";
};

export type ScreeningErrors = Partial<Record<ScreeningFieldName, string>>;

export type ScreeningApiRequest = {
  sex: number;
  age: number;
  weight: number;
  height: number;
  abdominal_circumference: number;
  total_cholesterol: number | null;
  smoking_status: number;
  diabetes_status: number;
  physical_activity_level: number;
  family_history_cvd: number;
  systolic_bp: number;
  diastolic_bp: number;
};

export type ScreeningApiFactor = {
  feature: string;
  value: number;
  impact: number;
};

export type ScreeningApiResponse = {
  raw_risk_score: number;
  normalized_risk_score: number;
  risk_level: ScreeningApiRiskLevel;
  top_risk_factors: ScreeningApiFactor[];
  protective_factors: ScreeningApiFactor[];
};

export type ScreeningAiRecommendation = {
  recommendation: string;
  followUpPrompt: string;
};

export type ScreeningRecommendationContext = {
  riskLevel: RiskLevel;
  riskLabel: string;
  normalizedRiskScore: number;
  rawRiskScore: number;
  profile: {
    age: number;
    gender: string;
    bmi: number;
    waistToHeightRatio: number;
    abdominalCircumference: number;
    totalCholesterol: number | null;
    bloodPressure: string;
    smokingStatus: string;
    diabetesStatus: string;
    physicalActivity: string;
    familyHistory: string;
  };
  factors: string[];
  baselineRecommendation: string;
};

export type ScreeningChatContext = {
  riskLevel: RiskLevel;
  riskLabel: string;
  normalizedRiskScore: number;
  summary: string;
  recommendation: string;
  factors: string[];
};

export type ScreeningResult = {
  eyebrow: string;
  title: string;
  level: RiskLevel;
  percentage: number;
  rawRiskScore: number;
  overviewLabel: string;
  factors: ScreeningFactor[];
  summary: string;
  recommendation: string;
};
