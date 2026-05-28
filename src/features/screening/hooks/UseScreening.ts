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

// Nilai awal form sebelum user mengisi data screening.
const initialValues: ScreeningFormValues = {
  age: "",
  gender: "",
  weight: "",
  height: "",
  abdominalCircumference: "",
  totalCholesterol: "",
  diabetesStatus: "",
  systolicPressure: "",
  diastolicPressure: "",
  smokingStatus: "",
  physicalActivity: "",
  familyHistory: "",
};

export function useScreening() {
  // Hook ini menjadi pusat alur screening: state input, validasi, request API, dan hasil.
  const [values, setValues] = useState<ScreeningFormValues>(initialValues);
  const [errors, setErrors] = useState<ScreeningErrors>({});
  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const updateValue = (name: ScreeningFieldName, value: string) => {
    // Form mengirim nama field + value ke sini setiap user mengubah input.
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
    // Tombol submit Form memulai validasi sebelum data dikirim ke API prediksi.
    if (isSubmitting) {
      return;
    }

    const nextErrors = validateScreeningValues(values);
    // Error validasi dikirim balik ke Form agar tampil di bawah field terkait.
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
      // Values form diubah menjadi payload API terbaru, lalu dikirim ke endpoint screening.
      const apiResult = await requestScreeningPrediction(
        createScreeningPayload(values),
        abortController.signal,
      );

      // Response API digabung dengan values form menjadi data siap-render untuk Result.
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
    // Reset membatalkan request aktif dan mengembalikan UI ke kondisi awal.
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
