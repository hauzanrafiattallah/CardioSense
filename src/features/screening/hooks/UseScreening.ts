"use client";

import { useState } from "react";

import type {
  ScreeningErrors,
  ScreeningFieldName,
  ScreeningFormValues,
  ScreeningResult,
} from "@/features/screening/types/Screening";
import {
  calculateScreeningRisk,
  validateScreeningValues,
} from "@/features/screening/utils/Risk";

const initialValues: ScreeningFormValues = {
  age: "",
  gender: "",
  systolicPressure: "",
  diastolicPressure: "",
  cholesterol: "",
  smokingStatus: "",
  physicalActivity: "",
  familyHistory: "",
};

export function useScreening() {
  const [values, setValues] = useState<ScreeningFormValues>(initialValues);
  const [errors, setErrors] = useState<ScreeningErrors>({});
  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const updateValue = (name: ScreeningFieldName, value: string) => {
    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };
        delete nextErrors[name];
        return nextErrors;
      });
    }
  };

  const submitScreening = () => {
    const nextErrors = validateScreeningValues(values);
    setHasSubmitted(true);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setResult(null);
      return;
    }

    setResult(calculateScreeningRisk(values));
  };

  const resetScreening = () => {
    setValues(initialValues);
    setErrors({});
    setResult(null);
    setHasSubmitted(false);
  };

  return {
    values,
    errors,
    result,
    hasSubmitted,
    updateValue,
    submitScreening,
    resetScreening,
  };
}
