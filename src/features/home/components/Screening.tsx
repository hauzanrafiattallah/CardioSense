"use client";

import { motion } from "framer-motion";

import { Disclaimer } from "@/components/shared/Disclaimer";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { SCREENING_CHAT_CONTEXT_EVENT } from "@/features/chatbot/utils/ScreeningContext";
import {
  screeningContent,
  screeningFields,
} from "@/features/home/data/HomeData";
import { Form } from "@/features/screening/components/Form";
import { Result } from "@/features/screening/components/Result";
import { useScreening } from "@/features/screening/hooks/UseScreening";
import { createScreeningChatContext } from "@/features/screening/utils/Recommendation";

export function Screening() {
  // Hook ini menyimpan state form, hasil prediksi, loading, error, dan aksi submit/reset.
  const {
    values,
    errors,
    result,
    aiRecommendation,
    hasSubmitted,
    isSubmitting,
    isGeneratingRecommendation,
    submitError,
    recommendationError,
    updateValue,
    submitScreening,
    resetScreening,
  } = useScreening();

  const handleAskAssistant = () => {
    if (!result) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent(SCREENING_CHAT_CONTEXT_EVENT, {
        detail: {
          prompt:
            aiRecommendation?.followUpPrompt ??
            "Bantu jelaskan hasil skrining saya dan langkah yang perlu diprioritaskan.",
          context: createScreeningChatContext(result, aiRecommendation),
        },
      }),
    );
  };

  return (
    <section id="screening" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
        >
          <SectionTitle
            eyebrow={screeningContent.eyebrow}
            title={screeningContent.title}
            subtitle={screeningContent.subtitle}
          />
        </motion.div>

        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Form menerima values/errors dari hook dan mengirim perubahan balik ke hook. */}
          <Form
            eyebrow={screeningContent.formEyebrow}
            title={screeningContent.formTitle}
            description={screeningContent.formDescription}
            submitLabel={screeningContent.submitLabel}
            resetLabel={screeningContent.resetLabel}
            fields={screeningFields}
            values={values}
            errors={errors}
            isSubmitting={isSubmitting}
            onChange={updateValue}
            onSubmit={submitScreening}
            onReset={resetScreening}
          />
          {/* Result menerima hasil olahan hook untuk menampilkan status atau kartu risiko. */}
          <Result
            result={result}
            aiRecommendation={aiRecommendation}
            hasSubmitted={hasSubmitted}
            isSubmitting={isSubmitting}
            isGeneratingRecommendation={isGeneratingRecommendation}
            submitError={submitError}
            recommendationError={recommendationError}
            onAskAssistant={handleAskAssistant}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45 }}
          className="mt-7"
        >
          <Disclaimer>{screeningContent.disclaimer}</Disclaimer>
        </motion.div>
      </div>
    </section>
  );
}
