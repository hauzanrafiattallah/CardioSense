"use client";

import { useEffect, useRef, useState } from "react";

import {
  isScreeningApiCanceled,
  isScreeningApiUrlMissing,
  requestScreeningPrediction,
} from "@/features/screening/api/ScreeningApi";
import type {
  ScreeningErrors,
  ScreeningFieldName,
  ScreeningFormValues,
  ScreeningResult,
} from "@/features/screening/types/Screening";
import {
  createScreeningPayload,
  createScreeningResult,
  validateScreeningValues,
} from "@/features/screening/utils/Risk";

const SCREENING_ERROR_MESSAGE =
  "Skrining belum tersedia. Coba lagi beberapa saat.";
const SCREENING_CONFIG_ERROR_MESSAGE =
  "Endpoint screening belum dikonfigurasi.";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const updateValue = (name: ScreeningFieldName, value: string) => {
    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    setSubmitError(null);
    setErrors((currentErrors) => {
      if (!currentErrors[name]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  const submitScreening = async () => {
    if (isSubmitting) {
      return;
    }

    const nextErrors = validateScreeningValues(values);
    setHasSubmitted(true);
    setErrors(nextErrors);
    setSubmitError(null);

    if (Object.keys(nextErrors).length > 0) {
      setResult(null);
      return;
    }

    abortControllerRef.current?.abort();

    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    setIsSubmitting(true);
    setResult(null);

    try {
      const apiResult = await requestScreeningPrediction(
        createScreeningPayload(values),
        abortController.signal,
      );

      setResult(createScreeningResult(values, apiResult));
    } catch (error) {
      if (isScreeningApiCanceled(error)) {
        return;
      }

      setSubmitError(
        isScreeningApiUrlMissing(error)
          ? SCREENING_CONFIG_ERROR_MESSAGE
          : SCREENING_ERROR_MESSAGE,
      );
      setResult(null);
    } finally {
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
        setIsSubmitting(false);
      }
    }
  };

  const resetScreening = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setValues(initialValues);
    setErrors({});
    setResult(null);
    setHasSubmitted(false);
    setIsSubmitting(false);
    setSubmitError(null);
  };

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    values,
    errors,
    result,
    hasSubmitted,
    isSubmitting,
    submitError,
    updateValue,
    submitScreening,
    resetScreening,
  };
}
