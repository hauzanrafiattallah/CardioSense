import type { LucideIcon } from "lucide-react";

export type RiskLevel = "low" | "medium" | "high";

export type ScreeningFormValues = {
  age: string;
  gender: string;
  systolicPressure: string;
  diastolicPressure: string;
  cholesterol: string;
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
  inputMode?: "numeric";
};

export type ScreeningFactor = {
  icon: LucideIcon;
  text: string;
};

export type ScreeningErrors = Partial<Record<ScreeningFieldName, string>>;

export type ScreeningResult = {
  eyebrow: string;
  title: string;
  level: RiskLevel;
  percentage: number;
  overviewLabel: string;
  factors: ScreeningFactor[];
  summary: string;
  recommendation: string;
};
